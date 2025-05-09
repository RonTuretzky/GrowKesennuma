"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { getGovernanceContract, getGnosisProvider } from "@/lib/contracts"
import { ethers } from "ethers"

interface Allocations {
  [impactorId: string]: number
}

export function useVoting(totalPoints = 100) {
  const { address, isConnected, isCorrectChain, switchToGnosisChain, signer, provider } = useWallet()
  const [allocations, setAllocations] = useState<Allocations>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [maxPoints, setMaxPoints] = useState(totalPoints)
  const [contractError, setContractError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  // Calculate remaining points
  const usedPoints = Object.values(allocations).reduce((sum, points) => sum + points, 0)
  const remainingPoints = maxPoints - usedPoints

  // Set allocation for a specific impactor
  const setAllocation = (impactorId: string, points: number) => {
    // Calculate how many points are currently allocated to other impactors
    const otherAllocations = Object.entries(allocations)
      .filter(([id]) => id !== impactorId)
      .reduce((sum, [, points]) => sum + points, 0)

    // Ensure we don't exceed total points
    const maxAllowedPoints = maxPoints - otherAllocations
    const newPoints = Math.min(points, maxAllowedPoints)

    setAllocations((prev) => ({
      ...prev,
      [impactorId]: newPoints,
    }))
  }

  // Check transaction status by hash
  const checkTransactionStatus = async (hash: string) => {
    try {
      const gnosisProvider = getGnosisProvider()
      const receipt = await gnosisProvider.getTransactionReceipt(hash)

      if (receipt) {
        console.log("Transaction receipt:", receipt)
        return receipt.status === 1 // 1 = success, 0 = failure
      }

      return null // Still pending
    } catch (error) {
      console.error("Error checking transaction status:", error)
      return null
    }
  }

  // Submit vote to blockchain
  const submitVote = async () => {
    if (remainingPoints > 0) {
      throw new Error("You must allocate all points before submitting")
    }

    if (!address) {
      throw new Error("Wallet not connected")
    }

    if (!isCorrectChain) {
      const switched = await switchToGnosisChain()
      if (!switched) {
        throw new Error("Please switch to Gnosis Chain to vote")
      }
    }

    if (!signer) {
      throw new Error("Signer not available")
    }

    setIsSubmitting(true)
    setContractError(null)
    setTxHash(null)

    try {
      // Prepare the vote data
      const impactorIds = Object.keys(allocations).map((id) => Number.parseInt(id))
      const points = impactorIds.map((id) => allocations[id.toString()])

      console.log("Submitting vote with allocations:", allocations)
      console.log("From address:", address)
      console.log("ImpactorIds:", impactorIds)
      console.log("Points:", points)

      // Get contract instance
      const contract = getGovernanceContract(signer)

      // Log contract address for debugging
      console.log("Contract address:", contract.target)

      // Call the vote function with explicit gas limit
      console.log("Sending transaction...")
      const tx = await contract.vote(impactorIds, points, {
        gasLimit: ethers.parseUnits("300000", "wei"), // Set explicit gas limit
      })

      // Get transaction hash immediately
      const hash = tx.hash
      setTxHash(hash)
      console.log("Transaction sent! Hash:", hash)

      // Save vote to localStorage for persistence
      const votes = JSON.parse(localStorage.getItem("votes") || "[]")
      votes.push({
        address,
        allocations,
        timestamp: new Date().toISOString(),
        txHash: hash,
        status: "pending",
      })
      localStorage.setItem("votes", JSON.stringify(votes))

      // Start polling for transaction status
      let confirmed = false
      let attempts = 0
      const maxAttempts = 30 // Try for about 5 minutes (10 seconds * 30)

      while (!confirmed && attempts < maxAttempts) {
        attempts++
        await new Promise((resolve) => setTimeout(resolve, 10000)) // Wait 10 seconds between checks

        const status = await checkTransactionStatus(hash)
        console.log(`Check ${attempts}: Transaction status:`, status)

        if (status === true) {
          // Transaction confirmed successfully
          confirmed = true

          // Update vote status in localStorage
          const updatedVotes = JSON.parse(localStorage.getItem("votes") || "[]")
          const voteIndex = updatedVotes.findIndex((v: any) => v.txHash === hash)
          if (voteIndex >= 0) {
            updatedVotes[voteIndex].status = "confirmed"
            localStorage.setItem("votes", JSON.stringify(updatedVotes))
          }

          console.log("Transaction confirmed successfully!")
          break
        } else if (status === false) {
          // Transaction failed
          throw new Error("Transaction failed on the blockchain")
        }
        // If status is null, transaction is still pending, continue polling
      }

      if (!confirmed) {
        console.log("Transaction not confirmed after maximum attempts")
      }

      return {
        success: true,
        hash,
        confirmed,
      }
    } catch (error) {
      console.error("Error submitting vote:", error)
      setContractError(error instanceof Error ? error.message : "Unknown error occurred")
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    allocations,
    setAllocation,
    remainingPoints,
    submitVote,
    isSubmitting,
    maxPoints,
    contractError,
    isCorrectChain,
    txHash,
    checkTransactionStatus,
  }
}

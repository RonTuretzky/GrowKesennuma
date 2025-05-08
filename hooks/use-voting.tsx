"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { getGovernanceContract } from "@/lib/contracts"

interface Allocations {
  [impactorId: string]: number
}

export function useVoting(totalPoints = 100) {
  const { address, isConnected, isCorrectChain, switchToGnosisChain, signer, refreshSigner } = useWallet()
  const [allocations, setAllocations] = useState<Allocations>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [maxPoints, setMaxPoints] = useState(totalPoints)
  const [contractError, setContractError] = useState<string | null>(null)

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

    setIsSubmitting(true)
    setContractError(null)

    try {
      // Get a fresh signer
      console.log("Getting fresh signer for transaction...")
      const freshSigner = await refreshSigner()

      if (!freshSigner) {
        throw new Error("Failed to get signer. Please reconnect your wallet.")
      }

      console.log("Using signer with address:", await freshSigner.getAddress())

      // Prepare the vote data
      const impactorIds = Object.keys(allocations).map((id) => Number.parseInt(id))
      const points = impactorIds.map((id) => allocations[id.toString()])

      console.log("Submitting vote with allocations:", allocations)
      console.log("From address:", address)
      console.log("ImpactorIds:", impactorIds)
      console.log("Points:", points)

      // Get contract instance with fresh signer
      const contract = getGovernanceContract(freshSigner)
      console.log("Contract instance created")

      try {
        // First, try to estimate gas to check if the transaction will fail
        console.log("Estimating gas for transaction...")
        const gasEstimate = await contract.vote.estimateGas(impactorIds, points)
        console.log("Gas estimate:", gasEstimate.toString())
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError)
        // If gas estimation fails, it means the transaction would fail
        // This could be due to allowlist restrictions or other contract constraints
        if (gasError instanceof Error && gasError.message.includes("user not allowlisted")) {
          throw new Error("Your address is not allowlisted to vote. Please register first.")
        }
        throw gasError
      }

      // Call the vote function - this should trigger a wallet signature prompt
      console.log("Sending transaction...")
      const tx = await contract.vote(impactorIds, points)
      console.log("Transaction sent:", tx.hash)

      // Wait for transaction to be mined
      console.log("Waiting for transaction confirmation...")
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      // Save vote to localStorage for persistence
      const votes = JSON.parse(localStorage.getItem("votes") || "[]")
      votes.push({
        address,
        allocations,
        timestamp: new Date().toISOString(),
        txHash: tx.hash,
      })
      localStorage.setItem("votes", JSON.stringify(votes))

      return true
    } catch (error: any) {
      console.error("Error submitting vote:", error)

      // Check for specific error messages
      if (error.message && error.message.includes("user not allowlisted")) {
        setContractError("Your address is not allowlisted to vote. Please register first.")
      } else if (error.message && error.message.includes("user rejected transaction")) {
        setContractError("Transaction was rejected in your wallet.")
      } else if (error.message && error.message.includes("transaction underpriced")) {
        setContractError("Transaction underpriced. Please try again with higher gas price.")
      } else {
        setContractError(error.message || "Unknown error occurred")
      }

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
  }
}

"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { getGovernanceContract, getGnosisProvider } from "@/lib/contracts"

interface Allocations {
  [impactorId: string]: number
}

export function useVoting(totalPoints = 100) {
  const { address, isConnected, isCorrectChain, switchToGnosisChain, signer, provider } = useWallet()
  const [allocations, setAllocations] = useState<Allocations>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [maxPoints, setMaxPoints] = useState(totalPoints)
  const [contractError, setContractError] = useState<string | null>(null)
  const [isAllowlisted, setIsAllowlisted] = useState<boolean | null>(null)
  const [isCheckingAllowlist, setIsCheckingAllowlist] = useState(false)

  // Calculate remaining points
  const usedPoints = Object.values(allocations).reduce((sum, points) => sum + points, 0)
  const remainingPoints = maxPoints - usedPoints

  // Check if user is allowlisted
  useEffect(() => {
    const checkAllowlist = async () => {
      if (!address || !isConnected) {
        setIsAllowlisted(null)
        return
      }

      setIsCheckingAllowlist(true)
      setContractError(null)

      try {
        // Use a read-only provider for this check to avoid wallet prompts
        const readProvider = getGnosisProvider()
        const contract = getGovernanceContract(readProvider)

        const allowed = await contract.isAllowlisted(address)
        console.log("Allowlist check for address:", address, "Result:", allowed)
        setIsAllowlisted(allowed)

        if (!allowed) {
          setContractError("Your address is not allowlisted to vote. Please register first.")
        }
      } catch (error) {
        console.error("Error checking allowlist:", error)
        setContractError("Error checking if you're allowlisted. Please try again.")
      } finally {
        setIsCheckingAllowlist(false)
      }
    }

    if (isConnected && address) {
      checkAllowlist()
    }
  }, [address, isConnected])

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

    if (!signer) {
      throw new Error("Signer not available")
    }

    if (isAllowlisted === false) {
      throw new Error("Your address is not allowlisted to vote. Please register first.")
    }

    setIsSubmitting(true)
    setContractError(null)

    try {
      // Prepare the vote data
      const impactorIds = Object.keys(allocations).map((id) => Number.parseInt(id))
      const points = impactorIds.map((id) => allocations[id.toString()])

      console.log("Submitting vote with allocations:", allocations)
      console.log("From address:", address)
      console.log("ImpactorIds:", impactorIds)
      console.log("Points:", points)

      // Get contract instance with signer
      const contract = getGovernanceContract(signer)

      // Call the vote function - this should trigger a wallet signature prompt
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
        setIsAllowlisted(false)
      } else if (error.message && error.message.includes("user rejected transaction")) {
        setContractError("Transaction was rejected in your wallet.")
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
    isAllowlisted,
    isCheckingAllowlist,
  }
}

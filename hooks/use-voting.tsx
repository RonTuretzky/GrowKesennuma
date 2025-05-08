"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { getGovernanceContract } from "@/lib/contracts"

interface Allocations {
  [impactorId: string]: number
}

export function useVoting(totalPoints = 100) {
  const { address, isConnected, isCorrectChain, switchToGnosisChain, signer } = useWallet()
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

    if (!signer) {
      throw new Error("Signer not available")
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

      // Get contract instance
      const contract = getGovernanceContract(signer)

      // Call the vote function
      const tx = await contract.vote(impactorIds, points)

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      console.log("Transaction hash:", receipt.hash)

      // Save vote to localStorage for persistence
      const votes = JSON.parse(localStorage.getItem("votes") || "[]")
      votes.push({
        address,
        allocations,
        timestamp: new Date().toISOString(),
        txHash: receipt.hash,
      })
      localStorage.setItem("votes", JSON.stringify(votes))

      return true
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
  }
}

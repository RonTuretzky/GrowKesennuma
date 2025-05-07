"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"

interface Allocations {
  [impactorId: string]: number
}

export function useVoting(totalPoints = 100) {
  const { address, isConnected, provider, isCorrectChain, switchToGnosisChain } = useWallet()
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
      // Prepare the vote data
      const impactorIds = Object.keys(allocations).map((id) => Number.parseInt(id))
      const points = impactorIds.map((id) => allocations[id.toString()])

      console.log("Submitting vote with allocations:", allocations)
      console.log("From address:", address)
      console.log("ImpactorIds:", impactorIds)
      console.log("Points:", points)

      // In a real implementation, we would call the contract here
      // For our simulation, we'll just simulate a transaction

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate transaction hash
      const txHash = "0x" + Math.random().toString(16).substring(2, 66)
      console.log("Transaction hash:", txHash)

      // Save vote to localStorage for persistence
      const votes = JSON.parse(localStorage.getItem("votes") || "[]")
      votes.push({
        address,
        allocations,
        timestamp: new Date().toISOString(),
        txHash,
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

"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"

interface Allocations {
  [impactorId: string]: number
}

export function useVoting(totalPoints = 100) {
  const [allocations, setAllocations] = useState<Allocations>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { address } = useWallet()

  // Calculate remaining points
  const usedPoints = Object.values(allocations).reduce((sum, points) => sum + points, 0)
  const remainingPoints = totalPoints - usedPoints

  // Set allocation for a specific impactor
  const setAllocation = (impactorId: string, points: number) => {
    // Calculate how many points are currently allocated to other impactors
    const otherAllocations = Object.entries(allocations)
      .filter(([id]) => id !== impactorId)
      .reduce((sum, [, points]) => sum + points, 0)

    // Ensure we don't exceed total points
    const maxAllowedPoints = totalPoints - otherAllocations
    const newPoints = Math.min(points, maxAllowedPoints)

    setAllocations((prev) => ({
      ...prev,
      [impactorId]: newPoints,
    }))
  }

  // Submit vote to blockchain (simulated)
  const submitVote = async () => {
    if (remainingPoints > 0) {
      throw new Error("You must allocate all points before submitting")
    }

    if (!address) {
      throw new Error("Wallet not connected")
    }

    setIsSubmitting(true)

    try {
      // Simulate blockchain transaction
      console.log("Submitting vote with allocations:", allocations)
      console.log("From address:", address)

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
  }
}

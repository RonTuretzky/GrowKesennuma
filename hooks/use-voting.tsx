"use client"

import { useState } from "react"

interface Allocations {
  [impactorId: string]: number
}

export function useVoting(totalPoints = 100) {
  const [allocations, setAllocations] = useState<Allocations>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Submit vote to blockchain
  const submitVote = async () => {
    if (remainingPoints > 0) {
      throw new Error("You must allocate all points before submitting")
    }

    setIsSubmitting(true)

    try {
      // In a real implementation, this would submit the vote to the blockchain
      console.log("Submitting vote with allocations:", allocations)

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

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

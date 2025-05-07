"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/contexts/wallet-context"
import { useVoting } from "@/hooks/use-voting"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { ImpactorCard } from "@/components/impactor-card"

export default function VotePage() {
  const { address, isConnected } = useWallet()
  const { allocations, setAllocation, remainingPoints, submitVote, isSubmitting } = useVoting()
  const [isAllowlisted, setIsAllowlisted] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulating checking if user is allowlisted
  useEffect(() => {
    const checkAllowlist = async () => {
      // In a real app, this would be an API call to check if the user's wallet is allowlisted
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsAllowlisted(true) // For demo purposes, we'll assume the user is allowlisted
      setIsLoading(false)
    }

    if (isConnected && address) {
      checkAllowlist()
    } else {
      setIsLoading(false)
    }
  }, [isConnected, address])

  const handleSubmitVote = async () => {
    try {
      await submitVote()
      toast({
        title: "Vote submitted successfully!",
        description: "Your vote has been recorded on the blockchain.",
      })
    } catch (error) {
      toast({
        title: "Error submitting vote",
        description: "There was an error submitting your vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mb-4" />
        <p className="text-lg text-gray-600">Checking your voting eligibility...</p>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Link href="/" className="flex items-center text-emerald-600 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Connect Your Wallet to Vote</h1>
          <p className="text-gray-600 mb-8">
            To participate in voting for impact projects, you need to connect your wallet first. If you don't have a
            wallet, we'll help you create one.
          </p>
          <ConnectWalletButton />
        </div>
      </div>
    )
  }

  if (isAllowlisted === false) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Link href="/" className="flex items-center text-emerald-600 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Not Allowlisted</CardTitle>
            <CardDescription>Your wallet is not currently allowlisted to participate in voting.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              To participate in the Kesennuma Community Impact Fund voting, you need to be allowlisted. Please apply for
              allowlisting through one of the following methods:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Complete the application form</li>
              <li>Contact a community leader for verification</li>
              <li>Verify your identity with MyNumberCard (coming soon)</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/register">Apply for Allowlisting</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <Link href="/" className="flex items-center text-emerald-600 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vote on Fund Allocation</h1>
        <p className="text-gray-600">
          Allocate your voting power to the impact projects you believe will benefit Kesennuma the most.
        </p>
      </div>

      <div className="bg-emerald-50 p-4 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Remaining Voting Power</span>
          <span className="font-bold">{remainingPoints} points</span>
        </div>
        <Progress value={100 - (remainingPoints / 100) * 100} className="h-2 bg-emerald-100" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {mockImpactors.map((impactor) => (
          <ImpactorCard
            key={impactor.id}
            impactor={impactor}
            allocation={allocations[impactor.id] || 0}
            onAllocationChange={(value) => setAllocation(impactor.id, value[0])}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmitVote}
          disabled={remainingPoints > 0 || isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Vote...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Submit Vote
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Mock data for impactors
const mockImpactors = [
  {
    id: "1",
    name: "Kesennuma Fishery Restoration",
    description:
      "Rebuilding fishing infrastructure and supporting local fishermen to revitalize the traditional industry.",
    image: "/placeholder.svg?key=xayx8",
    category: "Economic Recovery",
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "2",
    name: "Community Health Initiative",
    description: "Providing healthcare services and mental health support to disaster-affected residents.",
    image: "/placeholder.svg?key=armi0",
    category: "Healthcare",
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "3",
    name: "Youth Education Program",
    description: "Supporting educational opportunities for children affected by the disaster.",
    image: "/placeholder.svg?key=ytl7k",
    category: "Education",
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "4",
    name: "Elderly Care Support",
    description: "Providing care and social activities for elderly residents to prevent isolation and frailty.",
    image: "/placeholder.svg?key=2n48k",
    category: "Social Welfare",
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
]

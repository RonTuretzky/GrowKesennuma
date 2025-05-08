"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, Check, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/contexts/wallet-context"
import { useVoting } from "@/hooks/use-voting"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { ImpactorCard } from "@/components/impactor-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

export default function VotePage() {
  const { address, isConnected, chainId, switchToGnosisChain, isCorrectChain } = useWallet()
  const { allocations, setAllocation, remainingPoints, submitVote, isSubmitting, contractError } = useVoting()
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null)

  const handleSubmitVote = async () => {
    if (remainingPoints > 0) {
      toast({
        title: "Incomplete allocation",
        description: "You must allocate all 100 points before submitting your vote.",
        variant: "destructive",
      })
      return
    }

    try {
      setTransactionStatus("Preparing transaction...")

      if (!isCorrectChain) {
        setTransactionStatus("Switching to Gnosis Chain...")
        toast({
          title: "Wrong network",
          description: "Please switch to Gnosis Chain to vote",
          variant: "destructive",
        })
        await switchToGnosisChain()
        return
      }

      setTransactionStatus("Waiting for wallet confirmation...")
      await submitVote()

      setTransactionStatus("Transaction confirmed!")
      toast({
        title: "Vote submitted successfully!",
        description: "Your vote has been recorded on the blockchain.",
      })
    } catch (error: any) {
      console.error("Vote submission error:", error)
      setTransactionStatus(null)

      // Check for user rejected transaction
      if (error.message && error.message.includes("user rejected")) {
        toast({
          title: "Transaction rejected",
          description: "You rejected the transaction in your wallet.",
          variant: "destructive",
        })
      } else if (error.message && error.message.includes("user not allowlisted")) {
        toast({
          title: "Not allowlisted",
          description: "Your address is not allowlisted to vote. Please register first.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error submitting vote",
          description: error.message || "There was an error submitting your vote. Please try again.",
          variant: "destructive",
        })
      }
    }
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

      {!isCorrectChain && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You are not connected to Gnosis Chain. Please switch networks to vote.
            <Button variant="outline" size="sm" onClick={() => switchToGnosisChain()} className="ml-4">
              Switch to Gnosis Chain
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {contractError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{contractError}</AlertDescription>
        </Alert>
      )}

      {transactionStatus && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <AlertDescription className="text-blue-700">{transactionStatus}</AlertDescription>
        </Alert>
      )}

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
        <Button onClick={handleSubmitVote} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
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
    name: "Women's Eye (ウィメンズアイ)",
    description:
      "A nonprofit organization dedicated to empowering women and fostering community resilience in areas affected by the 2011 Great East Japan Earthquake.",
    image: "/women-empowerment-japan.png",
    category: "Social Welfare",
    socialLinks: {
      website: "https://womenseye.jp",
      twitter: "https://x.com/womenseye1",
      instagram: "https://instagram.com/womenseye",
    },
  },
  {
    id: "2",
    name: "Sokoage (底上げ)",
    description:
      "A certified NPO focusing on youth empowerment and community development through educational programs and civic engagement initiatives.",
    image: "/tohoku-youth-empowerment.png",
    category: "Education",
    socialLinks: {
      website: "https://sokoage.com",
      twitter: "https://x.com/sokoage_japan",
      instagram: "https://instagram.com/sokoage",
    },
  },
  {
    id: "3",
    name: "MARU. Architecture (マル・アーキテクチャー)",
    description:
      "A Tokyo-based architectural firm known for its community-centric design approach, emphasizing open, collaborative environments.",
    image: "/modern-japanese-shoji.png",
    category: "Cultural Preservation",
    socialLinks: {
      website: "https://maru-architecture.jp",
      twitter: "https://x.com/maruoffice2015",
      instagram: "https://instagram.com/maru_architecture",
    },
  },
  {
    id: "4",
    name: "Kesennuma Machi Daigaku (気仙沼まち大学)",
    description:
      "A community-driven initiative aimed at revitalizing Kesennuma, serving as a platform for residents to engage in local issues and develop solutions.",
    image: "/kesennuma-community-meeting.png",
    category: "Economic Recovery",
    socialLinks: {
      website: "https://kesennuma-machidaigaku.jp",
      twitter: "",
      instagram: "https://www.instagram.com/square_ship/",
    },
  },
  {
    id: "5",
    name: "PeaceJam Japan",
    description:
      "Part of the global PeaceJam Foundation, connecting Nobel Peace Prize laureates with youth to inspire and mentor the next generation of leaders committed to positive change.",
    image: "/japan-youth-peace-education.png",
    category: "Education",
    socialLinks: {
      website: "https://peacejam.org/japan",
      twitter: "https://x.com/PEACE_JAM",
      instagram: "https://instagram.com/peacejam_japan",
    },
  },
]

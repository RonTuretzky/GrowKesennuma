"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, LogOut, Loader2, AlertCircle, ChevronDown } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ConnectWalletButton({ id }: { id?: string }) {
  const {
    address,
    isConnected,
    connect,
    disconnect,
    isConnecting,
    error,
    chainId,
    switchToGnosisChain,
    isCorrectChain,
  } = useWallet()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleConnect = async () => {
    try {
      await connect()
      setIsDialogOpen(false)
      toast({
        title: "Wallet connected",
        description: "Your wallet has been connected successfully.",
      })
    } catch (error) {
      console.error("Failed to connect:", error)
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getNetworkName = (chainId: number | null) => {
    if (chainId === null) return "Unknown Network"

    switch (chainId) {
      case 1:
        return "Ethereum"
      case 100:
        return "Gnosis Chain"
      default:
        return "Unknown Network"
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={isCorrectChain ? "bg-emerald-50" : "bg-amber-50"}>
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500"></span>
              {getNetworkName(chainId)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => switchToGnosisChain()}>Switch to Gnosis Chain</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-sm text-gray-600 hidden md:inline">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <Button variant="outline" size="sm" onClick={disconnect}>
          <LogOut className="h-4 w-4 mr-2" /> Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button id={id} className="bg-emerald-600 hover:bg-emerald-700">
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Connect your wallet to participate in the Kesennuma Community Impact Fund.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message || "There was an error connecting to your wallet."}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <p className="text-center mb-4">Connect with your Ethereum wallet to vote on fund allocation.</p>
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>

        <DialogFooter className="flex flex-col">
          <p className="text-xs text-gray-500 mb-4">
            By connecting your wallet, you agree to the Terms of Service and Privacy Policy.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

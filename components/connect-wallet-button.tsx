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
import { connectors } from "@/lib/connectors"

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
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null)

  const handleConnect = async (connector: any) => {
    setPendingConnectorId(connector.id)
    try {
      await connect(connector.id)
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
    } finally {
      setPendingConnectorId(null)
    }
  }

  const getNetworkName = (chainId: number) => {
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

        <div className="grid grid-cols-2 gap-4 py-4">
          {connectors.map((connector) => {
            const isLoading = isConnecting && connector.id === pendingConnectorId
            const isReady = connector.ready

            return (
              <Button
                key={connector.id}
                variant="outline"
                className="flex flex-col items-center justify-center h-24 p-4"
                disabled={isLoading || !isReady}
                onClick={() => handleConnect(connector)}
              >
                {isLoading ? (
                  <Loader2 className="h-10 w-10 mb-2 animate-spin" />
                ) : (
                  <img src={connector.logo || "/placeholder.svg"} alt={connector.name} className="h-10 w-10 mb-2" />
                )}
                <span className="text-sm">{connector.name}</span>
                {!isReady && <span className="text-xs text-gray-500">(not installed)</span>}
              </Button>
            )
          })}
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

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
import { Wallet, LogOut, Loader2 } from "lucide-react"
import { useWallet, connectors } from "@/contexts/wallet-context"

export function ConnectWalletButton() {
  const { address, isConnected, connect, disconnect, isConnecting } = useWallet()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null)

  const handleConnect = async (connectorId: string) => {
    setPendingConnectorId(connectorId)
    try {
      await connect(connectorId)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to connect:", error)
    } finally {
      setPendingConnectorId(null)
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
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
        <Button className="bg-emerald-600 hover:bg-emerald-700">
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

        <div className="grid grid-cols-2 gap-4 py-4">
          {connectors.map((connector) => {
            const isLoading = isConnecting && connector.id === pendingConnectorId

            return (
              <Button
                key={connector.id}
                variant="outline"
                className="flex flex-col items-center justify-center h-24 p-4"
                disabled={isLoading || !connector.ready}
                onClick={() => handleConnect(connector.id)}
              >
                {isLoading ? (
                  <Loader2 className="h-10 w-10 mb-2 animate-spin" />
                ) : (
                  <img src={connector.logo || "/placeholder.svg"} alt={connector.name} className="h-10 w-10 mb-2" />
                )}
                <span className="text-sm">{connector.name}</span>
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

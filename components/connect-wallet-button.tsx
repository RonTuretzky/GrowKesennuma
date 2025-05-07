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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Plus, Loader2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

export function ConnectWalletButton() {
  const { connect, isConnecting } = useWallet()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleConnect = async () => {
    await connect()
    setIsDialogOpen(false)
  }

  const handleCreateWallet = async () => {
    // In a real implementation, this would create an account abstracted wallet
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await connect()
    setIsDialogOpen(false)
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
          <DialogTitle>Connect or Create Wallet</DialogTitle>
          <DialogDescription>
            Connect your existing wallet or create a new account abstracted wallet to participate.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect">Connect Existing</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Connect your existing Ethereum wallet to participate in voting.</p>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={handleConnect}
                >
                  <img
                    src="/placeholder.svg?height=40&width=40&query=metamask%20logo"
                    alt="MetaMask"
                    className="h-10 w-10 mb-2"
                  />
                  <span className="text-sm">MetaMask</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={handleConnect}
                >
                  <img
                    src="/placeholder.svg?height=40&width=40&query=wallet%20connect%20logo"
                    alt="WalletConnect"
                    className="h-10 w-10 mb-2"
                  />
                  <span className="text-sm">WalletConnect</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={handleConnect}
                >
                  <img
                    src="/placeholder.svg?height=40&width=40&query=coinbase%20wallet%20logo"
                    alt="Coinbase Wallet"
                    className="h-10 w-10 mb-2"
                  />
                  <span className="text-sm">Coinbase Wallet</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 p-4"
                  onClick={handleConnect}
                >
                  <img
                    src="/placeholder.svg?height=40&width=40&query=rainbow%20wallet%20logo"
                    alt="Rainbow"
                    className="h-10 w-10 mb-2"
                  />
                  <span className="text-sm">Rainbow</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Create a new account abstracted wallet with just a few clicks. No need to manage seed phrases or worry
                about gas fees.
              </p>

              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-medium text-emerald-800 mb-2">Benefits of Account Abstraction</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-emerald-700">
                  <li>No gas fees for voting transactions</li>
                  <li>Simple email-based recovery</li>
                  <li>No complicated seed phrases to remember</li>
                  <li>Enhanced security features</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          {isConnecting ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </Button>
          ) : (
            <Button onClick={handleCreateWallet} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              {Tabs ? "Create New Wallet" : "Connect Wallet"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

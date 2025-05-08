"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers, BrowserProvider, type Signer } from "ethers"
import { GNOSIS_CHAIN } from "@/lib/contracts"

// Types for our wallet context
type WalletContextType = {
  address: string | null
  isConnecting: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number | null
  balance: string
  error: Error | null
  isCorrectChain: boolean
  switchToGnosisChain: () => Promise<boolean>
  signer: Signer | null
  provider: BrowserProvider | null
  refreshSigner: () => Promise<Signer | null>
}

// Default context values
const defaultContext: WalletContextType = {
  address: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: async () => {},
  chainId: null,
  balance: "0",
  error: null,
  isCorrectChain: false,
  switchToGnosisChain: async () => false,
  signer: null,
  provider: null,
  refreshSigner: async () => null,
}

// Create the context
const WalletContext = createContext<WalletContextType>(defaultContext)

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState("0")
  const [error, setError] = useState<Error | null>(null)
  const [signer, setSigner] = useState<Signer | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)

  // Check if on correct chain
  const isCorrectChain = chainId === GNOSIS_CHAIN.id

  // Get a fresh signer
  const refreshSigner = async (): Promise<Signer | null> => {
    if (!provider || !address) return null

    try {
      console.log("Refreshing signer...")
      const freshSigner = await provider.getSigner()
      setSigner(freshSigner)
      console.log("Signer refreshed successfully")
      return freshSigner
    } catch (error) {
      console.error("Error refreshing signer:", error)
      return null
    }
  }

  // Connect wallet function
  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError(new Error("No Ethereum wallet found. Please install MetaMask or another wallet."))
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request account access
      const provider = new BrowserProvider(window.ethereum)
      setProvider(provider)

      // Get accounts
      const accounts = await provider.send("eth_requestAccounts", [])
      const address = accounts[0]
      setAddress(address)

      // Get network
      const network = await provider.getNetwork()
      setChainId(Number(network.chainId))

      // Get signer
      const signer = await provider.getSigner()
      setSigner(signer)
      console.log("Signer initialized:", signer.address)

      // Get balance
      const balance = await provider.getBalance(address)
      setBalance(ethers.formatEther(balance))

      setIsConnected(true)
      console.log("Wallet connected successfully:", address)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError(error instanceof Error ? error : new Error("Failed to connect wallet"))
    } finally {
      setIsConnecting(false)
    }
  }

  // Switch to Gnosis Chain
  const switchToGnosisChain = async (): Promise<boolean> => {
    if (!window.ethereum) return false

    try {
      console.log("Switching to Gnosis Chain...")
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${GNOSIS_CHAIN.id.toString(16)}` }],
      })

      // After switching, we need to update our provider and signer
      if (provider && address) {
        const network = await provider.getNetwork()
        setChainId(Number(network.chainId))

        // Get a fresh signer after chain switch
        await refreshSigner()
      }

      console.log("Switched to Gnosis Chain successfully")
      return true
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          console.log("Adding Gnosis Chain to wallet...")
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${GNOSIS_CHAIN.id.toString(16)}`,
                chainName: GNOSIS_CHAIN.name,
                nativeCurrency: GNOSIS_CHAIN.nativeCurrency,
                rpcUrls: [GNOSIS_CHAIN.rpcUrls.default],
                blockExplorerUrls: [GNOSIS_CHAIN.blockExplorers.default.url],
              },
            ],
          })

          // After adding, we need to update our provider and signer
          if (provider && address) {
            const network = await provider.getNetwork()
            setChainId(Number(network.chainId))

            // Get a fresh signer after chain switch
            await refreshSigner()
          }

          console.log("Added Gnosis Chain successfully")
          return true
        } catch (addError) {
          console.error("Error adding Gnosis Chain:", addError)
          return false
        }
      }
      console.error("Error switching to Gnosis Chain:", switchError)
      return false
    }
  }

  // Disconnect wallet function
  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    setChainId(null)
    setBalance("0")
    setSigner(null)
    setProvider(null)
  }

  // Listen for account changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnect()
      } else if (accounts[0] !== address) {
        // User switched accounts
        setAddress(accounts[0])
        if (provider) {
          provider.getBalance(accounts[0]).then((balance) => {
            setBalance(ethers.formatEther(balance))
          })

          // Get a fresh signer for the new account
          await refreshSigner()
        }
      }
    }

    const handleChainChanged = async (chainIdHex: string) => {
      const newChainId = Number.parseInt(chainIdHex, 16)
      setChainId(newChainId)

      // Get a fresh signer after chain change
      if (provider && address) {
        await refreshSigner()
      }
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    // Check if already connected
    if (window.ethereum.selectedAddress) {
      connect()
    }

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [address, provider])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnecting,
        isConnected,
        connect,
        disconnect,
        chainId,
        balance,
        error,
        isCorrectChain,
        switchToGnosisChain,
        signer,
        provider,
        refreshSigner,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

// Hook for using the wallet context
export function useWallet() {
  return useContext(WalletContext)
}

// Add window.ethereum type
declare global {
  interface Window {
    ethereum?: any
  }
}

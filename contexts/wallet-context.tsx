"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types for our wallet context
type WalletContextType = {
  address: string | null
  isConnecting: boolean
  isConnected: boolean
  connect: (connectorId: string) => Promise<void>
  disconnect: () => void
  chainId: number
  balance: string
  error: Error | null
}

// Default context values
const defaultContext: WalletContextType = {
  address: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  chainId: 1, // Ethereum mainnet
  balance: "0",
  error: null,
}

// Create the context
const WalletContext = createContext<WalletContextType>(defaultContext)

// Available wallet connectors
export const connectors = [
  {
    id: "metaMask",
    name: "MetaMask",
    logo: "/metamask-logo.png",
    ready: true,
  },
  {
    id: "walletConnect",
    name: "WalletConnect",
    logo: "/wallet-connect-logo.png",
    ready: true,
  },
  {
    id: "coinbaseWallet",
    name: "Coinbase Wallet",
    logo: "/coinbase-wallet-logo.png",
    ready: true,
  },
  {
    id: "injected",
    name: "Browser Wallet",
    logo: "/abstract-wallet-logo.png",
    ready: true,
  },
]

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState(1) // Default to Ethereum mainnet
  const [balance, setBalance] = useState("0")
  const [error, setError] = useState<Error | null>(null)

  // Check if wallet is already connected on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet")
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet)
        setAddress(walletData.address)
        setChainId(walletData.chainId || 1)
        setBalance(walletData.balance || "0.5")
        setIsConnected(true)
      } catch (error) {
        console.error("Error parsing saved wallet data:", error)
        localStorage.removeItem("wallet")
      }
    }
  }, [])

  // Connect wallet function
  const connect = async (connectorId: string) => {
    setIsConnecting(true)
    setError(null)

    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate connection errors randomly (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Failed to connect to wallet. Please try again.")
      }

      // Generate a mock wallet address
      const mockWalletAddress = "0x" + Math.random().toString(16).substring(2, 42)

      // Generate random balance between 0.1 and 5 ETH
      const randomBalance = (Math.random() * 4.9 + 0.1).toFixed(4)

      // Set wallet state
      setAddress(mockWalletAddress)
      setChainId(1) // Ethereum mainnet
      setBalance(randomBalance)
      setIsConnected(true)

      // Save to localStorage for persistence
      const walletData = {
        address: mockWalletAddress,
        chainId: 1,
        balance: randomBalance,
        connector: connectorId,
      }
      localStorage.setItem("wallet", JSON.stringify(walletData))

      return mockWalletAddress
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError(error instanceof Error ? error : new Error("Unknown error occurred"))
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet function
  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    setChainId(1)
    setBalance("0")
    setError(null)
    localStorage.removeItem("wallet")
  }

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

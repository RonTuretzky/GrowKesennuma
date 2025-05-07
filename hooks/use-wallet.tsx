"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

interface WalletContextType {
  wallet: string | null
  isConnecting: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Check if wallet is already connected on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet")
    if (savedWallet) {
      setWallet(savedWallet)
      setIsConnected(true)
    }
  }, [])

  const connect = async () => {
    setIsConnecting(true)

    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a mock wallet address
      const mockWalletAddress = "0x" + Math.random().toString(16).substring(2, 42)
      setWallet(mockWalletAddress)
      setIsConnected(true)

      // Save to localStorage for persistence
      localStorage.setItem("wallet", mockWalletAddress)

      return mockWalletAddress
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setWallet(null)
    setIsConnected(false)
    localStorage.removeItem("wallet")
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnecting,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}

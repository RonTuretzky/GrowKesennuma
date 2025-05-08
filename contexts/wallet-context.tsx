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
  const [isCorrectChain, setIsCorrectChain] = useState<boolean>(false)

  // Check if on correct chain
  const isCorrectChainValue = chainId === GNOSIS_CHAIN.id

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

      // Get balance
      const balance = await provider.getBalance(address)
      setBalance(ethers.formatEther(balance))

      setIsConnected(true)
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
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${GNOSIS_CHAIN.id.toString(16)}` }],
      })
      return true
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
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

    const handleAccountsChanged = (accounts: string[]) => {
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
        }
      }
    }

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = Number.parseInt(chainIdHex, 16)
      setChainId(newChainId)
      setIsCorrectChain(newChainId === GNOSIS_CHAIN.id)
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

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
        isCorrectChain: isCorrectChainValue,
        switchToGnosisChain,
        signer,
        provider,
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

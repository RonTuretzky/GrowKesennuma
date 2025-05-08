"use client"

import { createWeb3Modal } from "@web3modal/wagmi"
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi"
import { gnosis } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { useEffect, useState, type ReactNode } from "react"

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet, gnosis], [publicProvider()])

// WalletConnect project ID - this is a demo ID, in production you should use your own
const projectId = "3ccc0d1a9a0d2a0f9a0d2a0f9a0d2a0f"

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        showQrModal: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Kesennuma Aid Distribution",
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

// Create web3modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#10b981", // emerald-600
  },
})

export function WagmiProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // To avoid hydration mismatch, only render the WagmiConfig when the component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <WagmiConfig config={config}>{children}</WagmiConfig>
}

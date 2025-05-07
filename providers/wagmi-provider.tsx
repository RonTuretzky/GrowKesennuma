"use client"

import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import type { ReactNode } from "react"

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet], [publicProvider()])

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "YOUR_WALLET_CONNECT_PROJECT_ID", // You'll need to replace this with a real project ID
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

export function WagmiProvider({ children }: { children: ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}

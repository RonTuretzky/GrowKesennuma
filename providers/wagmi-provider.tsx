"use client"

import { createConfig, configureChains, mainnet, WagmiConfig } from "wagmi"
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
        projectId: "10a5c7292483a1b5e1a229f2c1b9f4b0", // Demo project ID
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

export function WagmiProvider({ children }: { children: ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}

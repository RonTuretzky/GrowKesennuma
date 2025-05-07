import type React from "react"
import { WalletProvider } from "@/contexts/wallet-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import "./globals.css"

export const metadata = {
  title: "Kesennuma Community Impact Fund",
  description: "Blockchain-based governance for community-driven aid distribution in Kesennuma, Japan",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <WalletProvider>
            <Header />
            <main>{children}</main>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

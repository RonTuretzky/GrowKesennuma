"use client"

import Link from "next/link"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useWallet } from "@/contexts/wallet-context"

export function Header() {
  const { isConnected, address, balance } = useWallet()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-emerald-600">
            Kesennuma Impact Fund
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/vote" className="text-gray-600 hover:text-emerald-600">
              Vote
            </Link>
            <Link href="/impactors" className="text-gray-600 hover:text-emerald-600">
              Impactors
            </Link>
            <Link href="/history" className="text-gray-600 hover:text-emerald-600">
              History
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-emerald-600">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isConnected && address && (
              <div className="hidden md:block text-right mr-2">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="font-medium">{Number.parseFloat(balance).toFixed(4)} ETH</p>
              </div>
            )}
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  )
}

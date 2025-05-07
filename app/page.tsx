import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Vote, History, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Kesennuma Community Impact Fund</h1>
            <p className="text-xl md:text-2xl mb-8">
              Empowering citizens to direct recovery funds through transparent blockchain governance
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                <Link href="/vote">
                  Start Voting <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                <Link href="/impactors">View Impactors</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Vote className="h-10 w-10 text-emerald-500" />}
              title="Democratic Allocation"
              description="Vote directly on how funds are distributed to community impact projects"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-emerald-500" />}
              title="Transparent & Secure"
              description="Blockchain technology ensures all transactions are transparent and immutable"
            />
            <FeatureCard
              icon={<History className="h-10 w-10 text-emerald-500" />}
              title="Track Impact"
              description="View historical distribution data and measure community impact over time"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">About Kesennuma Recovery</h2>
            <p className="text-gray-700 mb-6">
              Kesennuma, a coastal city in Miyagi Prefecture, Japan, was devastated by the 2011 Great East Japan
              Earthquake and Tsunami. Since then, various local impact funding initiatives have focused on rebuilding
              and revitalizing the community.
            </p>
            <p className="text-gray-700 mb-6">
              This platform leverages blockchain technology to enhance the efficacy of aid distribution by enabling
              high-bandwidth direct democracy and advanced crypto-governance mechanisms, ensuring funds reflect local
              needs and priorities.
            </p>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/about">Learn More About Our Mission</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Participate?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the community of citizens helping to rebuild Kesennuma through transparent, democratic fund allocation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              <Link href="/register">Register to Vote</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              <Link href="/impactors/apply">Apply as an Impactor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

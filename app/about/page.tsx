import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-emerald-600 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">About the Platform</h1>
        <p className="text-gray-600">
          Learn more about the Kesennuma Community Impact Fund and how blockchain technology is empowering local
          recovery efforts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            The Kesennuma Community Impact Fund aims to revolutionize how government aid is distributed by harnessing
            the power of blockchain technology and community-driven decision making.
          </p>
          <p className="text-gray-700 mb-4">
            Following the devastating 2011 Great East Japan Earthquake and Tsunami, Kesennuma has been the focus of
            various recovery initiatives. Our platform builds upon these efforts by creating a transparent, efficient,
            and democratic system for directing resources to where they're needed most.
          </p>
          <p className="text-gray-700">
            By enabling citizens to directly influence the allocation of funds, we ensure that recovery efforts align
            with the community's actual needs and priorities, rather than being determined solely by bureaucratic
            processes.
          </p>
        </div>
        <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
          <img
            src="/placeholder.svg?height=400&width=600&query=coastal%20city%20of%20Kesennuma%20Japan"
            alt="Kesennuma, Japan"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Allowlisting</CardTitle>
              <CardDescription>Verification of community members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Citizens of Kesennuma are allowlisted through various mechanisms, including community leader vouching,
                email verification, and (coming soon) MyNumberCard integration. This ensures that voting power remains
                within the community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Account Abstraction</CardTitle>
              <CardDescription>Simplified blockchain interaction</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We use account abstraction to create user-friendly smart wallet accounts, eliminating the need for users
                to understand complex blockchain concepts or pay gas fees. This makes the platform accessible to
                everyone, regardless of technical expertise.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Democratic Voting</CardTitle>
              <CardDescription>Community-driven fund allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Citizens allocate their voting power across various impact projects. The distribution of funds is
                determined by the collective decisions of the community, ensuring resources go where they're most valued
                and needed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Blockchain Benefits</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-emerald-800">Transparency</h3>
            <p className="text-emerald-700">
              All fund allocations and distributions are recorded on the blockchain, creating an immutable and publicly
              verifiable record. This ensures complete transparency in how community resources are used.
            </p>
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-emerald-800">Efficiency</h3>
            <p className="text-emerald-700">
              Smart contracts automate the distribution of funds based on community votes, eliminating bureaucratic
              delays and reducing administrative overhead. This means more resources go directly to impact projects.
            </p>
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-emerald-800">Security</h3>
            <p className="text-emerald-700">
              Blockchain technology provides robust security measures that protect against fraud and manipulation. The
              decentralized nature of the system ensures no single entity can control or alter the voting results.
            </p>
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-emerald-800">Accountability</h3>
            <p className="text-emerald-700">
              Impact projects receive funds directly through the blockchain, creating a clear chain of accountability.
              The platform tracks and displays how funds are being used, ensuring recipients fulfill their commitments.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Previous Funding Initiatives</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-emerald-500 pl-4 py-2">
            <h3 className="text-lg font-semibold">Kesennuma Study (2019)</h3>
            <p className="text-gray-700">
              A participatory action research project focused on preventing frailty among older adults by promoting
              social participation through community salons. The study aimed to delay the need for long-term care in
              areas affected by the disaster.
            </p>
          </div>

          <div className="border-l-4 border-emerald-500 pl-4 py-2">
            <h3 className="text-lg font-semibold">Community Impact Fund</h3>
            <p className="text-gray-700">
              Managed by the Central Community Chest of Japan, this fund supported private social welfare enterprises,
              NPOs, and citizen activity groups. Grants of up to 10 million yen per year were awarded to projects
              addressing social issues.
            </p>
          </div>

          <div className="border-l-4 border-emerald-500 pl-4 py-2">
            <h3 className="text-lg font-semibold">World Monuments Fund (WMF)</h3>
            <p className="text-gray-700">
              Through the "Save Our Culture" initiative, WMF raised funds to assist local residents and business owners
              in their recovery efforts. This included the restoration of Kesennuma's historic cityscape.
            </p>
          </div>

          <div className="border-l-4 border-emerald-500 pl-4 py-2">
            <h3 className="text-lg font-semibold">US-Japan Foundation Grants (2021)</h3>
            <p className="text-gray-700">
              The foundation awarded a grant to support earthquake and tsunami-devastated populations in Kesennuma. The
              project involved partnering with an international data company and local government to raise employment
              opportunities.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join the Kesennuma Community Impact Fund and help direct resources to projects making a difference in the
          community's recovery and revitalization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/register">Register to Participate</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/vote">View Current Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

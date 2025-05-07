import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Globe, Twitter, Instagram } from "lucide-react"

export default function ImpactorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-emerald-600 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Impact Projects</h1>
        <p className="text-gray-600">
          Explore the various projects working to rebuild and revitalize Kesennuma after the 2011 disaster.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {impactors.map((impactor) => (
          <Card key={impactor.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative h-48 w-full">
              <Image src={impactor.image || "/placeholder.svg"} alt={impactor.name} fill className="object-cover" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{impactor.name}</CardTitle>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {impactor.category}
                </Badge>
              </div>
              <CardDescription>{impactor.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Impact Metrics</h4>
                <div className="grid grid-cols-2 gap-2">
                  {impactor.metrics.map((metric, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">{metric.label}</p>
                      <p className="font-medium">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="flex space-x-2">
                {impactor.socialLinks.website && (
                  <Link href={impactor.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {impactor.socialLinks.twitter && (
                  <Link href={impactor.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {impactor.socialLinks.instagram && (
                  <Link href={impactor.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/impactors/${impactor.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Are You Making an Impact in Kesennuma?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          If you're working on a project that's helping rebuild and revitalize Kesennuma, apply to become an impactor
          and receive community-directed funding.
        </p>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/impactors/apply">Apply as an Impactor</Link>
        </Button>
      </div>
    </div>
  )
}

// Mock data for impactors
const impactors = [
  {
    id: "1",
    name: "Kesennuma Fishery Restoration",
    description:
      "Rebuilding fishing infrastructure and supporting local fishermen to revitalize the traditional industry.",
    image: "/placeholder.svg?key=qoo79",
    category: "Economic Recovery",
    metrics: [
      { label: "Fishermen Supported", value: "120+" },
      { label: "Boats Restored", value: "45" },
      { label: "Jobs Created", value: "200+" },
      { label: "Funding Received", value: "¥15M" },
    ],
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "2",
    name: "Community Health Initiative",
    description: "Providing healthcare services and mental health support to disaster-affected residents.",
    image: "/placeholder.svg?key=mmwf4",
    category: "Healthcare",
    metrics: [
      { label: "Patients Served", value: "1,500+" },
      { label: "Health Workshops", value: "75" },
      { label: "Volunteers", value: "50" },
      { label: "Funding Received", value: "¥8.5M" },
    ],
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "3",
    name: "Youth Education Program",
    description: "Supporting educational opportunities for children affected by the disaster.",
    image: "/placeholder.svg?key=tl3f8",
    category: "Education",
    metrics: [
      { label: "Students Supported", value: "350+" },
      { label: "Scholarships", value: "120" },
      { label: "Schools Rebuilt", value: "3" },
      { label: "Funding Received", value: "¥12M" },
    ],
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "4",
    name: "Elderly Care Support",
    description: "Providing care and social activities for elderly residents to prevent isolation and frailty.",
    image: "/placeholder.svg?key=xbaid",
    category: "Social Welfare",
    metrics: [
      { label: "Seniors Assisted", value: "500+" },
      { label: "Community Salons", value: "12" },
      { label: "Care Workers", value: "35" },
      { label: "Funding Received", value: "¥7.2M" },
    ],
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "5",
    name: "Cultural Heritage Preservation",
    description: "Restoring and preserving Kesennuma's cultural landmarks and traditional practices.",
    image: "/placeholder.svg?key=3lcpb",
    category: "Cultural Preservation",
    metrics: [
      { label: "Sites Restored", value: "8" },
      { label: "Cultural Events", value: "25" },
      { label: "Artisans Supported", value: "40" },
      { label: "Funding Received", value: "¥9.8M" },
    ],
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
  {
    id: "6",
    name: "Sustainable Rebuilding Initiative",
    description: "Implementing eco-friendly rebuilding practices and renewable energy solutions.",
    image: "/placeholder.svg?height=200&width=400&query=solar%20panels%20on%20Japanese%20buildings",
    category: "Sustainability",
    metrics: [
      { label: "Green Buildings", value: "15" },
      { label: "Solar Installations", value: "120" },
      { label: "CO2 Reduction", value: "250 tons" },
      { label: "Funding Received", value: "¥14.5M" },
    ],
    socialLinks: {
      website: "https://example.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
    },
  },
]

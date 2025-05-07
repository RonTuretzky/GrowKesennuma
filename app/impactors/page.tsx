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
    name: "Women's Eye (ウィメンズアイ)",
    description:
      "A nonprofit organization based in the Tohoku region of Japan, dedicated to empowering women and fostering community resilience in areas affected by the 2011 Great East Japan Earthquake.",
    image: "/women-empowerment-japan.png",
    category: "Social Welfare",
    metrics: [
      { label: "Women Supported", value: "500+" },
      { label: "Programs Conducted", value: "35" },
      { label: "Communities Served", value: "12" },
      { label: "Funding Received", value: "¥12.5M" },
    ],
    socialLinks: {
      website: "https://womenseye.jp",
      twitter: "https://x.com/womenseye1",
      instagram: "https://instagram.com/womenseye",
    },
  },
  {
    id: "2",
    name: "Sokoage (底上げ)",
    description:
      "Founded in 2011, Sokoage is a certified NPO operating primarily in the Tohoku region, focusing on youth empowerment and community development through educational programs and civic engagement initiatives.",
    image: "/tohoku-youth-empowerment.png",
    category: "Education",
    metrics: [
      { label: "Youth Engaged", value: "1,200+" },
      { label: "Camps Organized", value: "45" },
      { label: "Volunteers", value: "80" },
      { label: "Funding Received", value: "¥9.8M" },
    ],
    socialLinks: {
      website: "https://sokoage.com",
      twitter: "https://x.com/sokoage_japan",
      instagram: "https://instagram.com/sokoage",
    },
  },
  {
    id: "3",
    name: "MARU. Architecture (マル・アーキテクチャー)",
    description:
      "A Tokyo-based architectural firm known for its community-centric design approach, emphasizing open, collaborative environments that blur the lines between private and public spaces.",
    image: "/modern-japanese-shoji.png",
    category: "Cultural Preservation",
    metrics: [
      { label: "Projects Completed", value: "28" },
      { label: "Communities Impacted", value: "15" },
      { label: "Jobs Created", value: "45" },
      { label: "Funding Received", value: "¥18.2M" },
    ],
    socialLinks: {
      website: "https://maru-architecture.jp",
      twitter: "https://x.com/maruoffice2015",
      instagram: "https://instagram.com/maru_architecture",
    },
  },
  {
    id: "4",
    name: "Kesennuma Machi Daigaku (気仙沼まち大学)",
    description:
      "A community-driven initiative aimed at revitalizing Kesennuma in Miyagi Prefecture following the 2011 tsunami, serving as a platform for residents to engage in local issues and collaboratively develop solutions.",
    image: "/kesennuma-community-meeting.png",
    category: "Economic Recovery",
    metrics: [
      { label: "Participants", value: "850+" },
      { label: "Initiatives Launched", value: "32" },
      { label: "Local Businesses Supported", value: "65" },
      { label: "Funding Received", value: "¥7.5M" },
    ],
    socialLinks: {
      website: "https://kesennuma-machidaigaku.jp",
      twitter: "",
      instagram: "https://www.instagram.com/square_ship/",
    },
  },
  {
    id: "5",
    name: "PeaceJam Japan",
    description:
      "Part of the global PeaceJam Foundation, connecting Nobel Peace Prize laureates with youth to inspire and mentor the next generation of leaders committed to positive change.",
    image: "/japan-youth-peace-education.png",
    category: "Education",
    metrics: [
      { label: "Youth Participants", value: "650+" },
      { label: "Programs Conducted", value: "25" },
      { label: "Nobel Laureate Visits", value: "8" },
      { label: "Funding Received", value: "¥11.3M" },
    ],
    socialLinks: {
      website: "https://peacejam.org/japan",
      twitter: "https://x.com/PEACE_JAM",
      instagram: "https://instagram.com/peacejam_japan",
    },
  },
]

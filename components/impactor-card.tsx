"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Globe, Twitter, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Impactor {
  id: string
  name: string
  description: string
  image: string
  category: string
  socialLinks: {
    website?: string
    twitter?: string
    instagram?: string
  }
}

interface ImpactorCardProps {
  impactor: Impactor
  allocation: number
  onAllocationChange: (value: number[]) => void
}

export function ImpactorCard({ impactor, allocation, onAllocationChange }: ImpactorCardProps) {
  return (
    <Card className="overflow-hidden">
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
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Allocation</span>
            <span className="font-bold">{allocation} points</span>
          </div>
          <Slider value={[allocation]} max={100} step={1} onValueChange={onAllocationChange} className="my-4" />
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
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/impactors/${impactor.id}`}>
            <ExternalLink className="h-4 w-4 mr-2" /> View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

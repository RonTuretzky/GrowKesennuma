"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationMethod, setRegistrationMethod] = useState("email")
  const [step, setStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    toast({
      title: "Registration submitted successfully!",
      description: "Your application has been received. We'll review it and get back to you soon.",
    })

    setStep(2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <Link href="/" className="flex items-center text-emerald-600 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Register to Participate</h1>
        <p className="text-gray-600">
          Join the Kesennuma Community Impact Fund and help direct resources to projects making a difference.
        </p>
      </div>

      {step === 1 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Allowlist Application</CardTitle>
            <CardDescription>
              To participate in voting, you need to be allowlisted. Please complete the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="citizen" className="w-full">
              <TabsList className="mb-6 grid grid-cols-2">
                <TabsTrigger value="citizen">Register as Citizen</TabsTrigger>
                <TabsTrigger value="impactor">Register as Impactor</TabsTrigger>
              </TabsList>

              <TabsContent value="citizen">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" placeholder="Enter your full name" required />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email address" required />
                    </div>

                    <div>
                      <Label>Verification Method</Label>
                      <RadioGroup defaultValue="email" className="mt-2" onValueChange={setRegistrationMethod}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email-verification" />
                          <Label htmlFor="email-verification">Email Verification</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="community-leader" id="community-leader" />
                          <Label htmlFor="community-leader">Community Leader Vouching</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mynumber" id="mynumber" />
                          <Label htmlFor="mynumber">MyNumberCard Verification (Coming Soon)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {registrationMethod === "community-leader" && (
                      <div>
                        <Label htmlFor="leader-code">Community Leader Code</Label>
                        <Input
                          id="leader-code"
                          placeholder="Enter the code provided by your community leader"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="residence">Residence in Kesennuma</Label>
                      <RadioGroup defaultValue="yes" className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="residence-yes" />
                          <Label htmlFor="residence-yes">I currently reside in Kesennuma</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="past" id="residence-past" />
                          <Label htmlFor="residence-past">I previously resided in Kesennuma</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="residence-no" />
                          <Label htmlFor="residence-no">I have never resided in Kesennuma</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="reason">Why do you want to participate?</Label>
                      <Textarea
                        id="reason"
                        placeholder="Please share why you're interested in participating in the Kesennuma Community Impact Fund"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="impactor">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input id="project-name" placeholder="Enter your project name" required />
                    </div>

                    <div>
                      <Label htmlFor="contact-name">Contact Person</Label>
                      <Input id="contact-name" placeholder="Enter the name of the primary contact" required />
                    </div>

                    <div>
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input id="contact-email" type="email" placeholder="Enter contact email address" required />
                    </div>

                    <div>
                      <Label htmlFor="project-category">Project Category</Label>
                      <RadioGroup defaultValue="economic" className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="economic" id="category-economic" />
                          <Label htmlFor="category-economic">Economic Recovery</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="healthcare" id="category-healthcare" />
                          <Label htmlFor="category-healthcare">Healthcare</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="education" id="category-education" />
                          <Label htmlFor="category-education">Education</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="social" id="category-social" />
                          <Label htmlFor="category-social">Social Welfare</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cultural" id="category-cultural" />
                          <Label htmlFor="category-cultural">Cultural Preservation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sustainability" id="category-sustainability" />
                          <Label htmlFor="category-sustainability">Sustainability</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="project-description">Project Description</Label>
                      <Textarea
                        id="project-description"
                        placeholder="Describe your project and its impact on the Kesennuma community"
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="funding-use">How will you use the funding?</Label>
                      <Textarea
                        id="funding-use"
                        placeholder="Explain how you plan to use the funds received through the platform"
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="wallet-address">Recipient Wallet Address (Optional)</Label>
                      <Input id="wallet-address" placeholder="Enter your Ethereum wallet address if you have one" />
                      <p className="text-xs text-gray-500 mt-1">
                        Don't worry if you don't have one yet. We'll help you set it up if your application is approved.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="h-6 w-6 text-green-500 mr-2" /> Application Submitted
            </CardTitle>
            <CardDescription>Thank you for your interest in the Kesennuma Community Impact Fund.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
              <p className="text-green-800">
                Your application has been received and is being reviewed. We'll notify you by email once your
                application has been processed.
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              The review process typically takes 1-3 business days. Once approved, you'll receive instructions on how
              to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Set up your account abstracted wallet</li>
              <li>Access the voting platform</li>
              <li>Participate in the current funding round</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/about">Learn More About the Platform</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

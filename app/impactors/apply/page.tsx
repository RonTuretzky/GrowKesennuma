"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useWallet } from "@/contexts/wallet-context"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

// Form schema
const formSchema = z.object({
  // Step 1: Basic Information
  projectName: z.string().min(2, { message: "Project name must be at least 2 characters." }),
  organizationType: z.enum(["nonprofit", "business", "individual", "government", "other"]),
  organizationTypeOther: z.string().optional(),
  yearEstablished: z
    .string()
    .regex(/^\d{4}$/, { message: "Please enter a valid year (e.g., 2010)." })
    .optional(),

  // Step 2: Contact Information
  contactName: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  contactEmail: z.string().email({ message: "Please enter a valid email address." }),
  contactPhone: z.string().min(10, { message: "Please enter a valid phone number." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional(),

  // Step 3: Project Details
  category: z.enum(["economic", "healthcare", "education", "social", "cultural", "sustainability", "other"]),
  categoryOther: z.string().optional(),
  projectDescription: z.string().min(50, { message: "Description must be at least 50 characters." }),
  impactDescription: z.string().min(50, { message: "Impact description must be at least 50 characters." }),
  beneficiaries: z.string().min(10, { message: "Please describe who will benefit from your project." }),

  // Step 4: Funding Details
  fundingAmount: z.string().regex(/^\d+$/, { message: "Please enter a valid amount." }),
  fundingUse: z.string().min(50, { message: "Please provide more details on how funds will be used." }),
  hasPreviousFunding: z.enum(["yes", "no"]),
  previousFundingDetails: z.string().optional(),

  // Step 5: Social Media & Wallet
  socialTwitter: z.string().url({ message: "Please enter a valid URL." }).optional(),
  socialInstagram: z.string().url({ message: "Please enter a valid URL." }).optional(),
  socialFacebook: z.string().url({ message: "Please enter a valid URL." }).optional(),
  walletAddress: z.string().optional(),

  // Step 6: Terms & Submission
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions." }),
  }),
  agreeReporting: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the reporting requirements." }),
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function ImpactorApplicationPage() {
  const router = useRouter()
  const { address, isConnected } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const totalSteps = 6

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      organizationType: "nonprofit",
      yearEstablished: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      category: "economic",
      projectDescription: "",
      impactDescription: "",
      beneficiaries: "",
      fundingAmount: "",
      fundingUse: "",
      hasPreviousFunding: "no",
      previousFundingDetails: "",
      socialTwitter: "",
      socialInstagram: "",
      socialFacebook: "",
      walletAddress: address || "",
      agreeTerms: false,
      agreeReporting: false,
    },
  })

  // Update wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      form.setValue("walletAddress", address)
    }
  }, [isConnected, address, form])

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      console.log("Form data submitted:", data)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success toast
      toast({
        title: "Application submitted successfully!",
        description: "We'll review your application and get back to you soon.",
      })

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error submitting application",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Navigate to next step
  const nextStep = () => {
    const fieldsToValidate = getFieldsForStep(currentStep)

    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
        window.scrollTo(0, 0)
      }
    })
  }

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo(0, 0)
  }

  // Get fields for current step for validation
  const getFieldsForStep = (step: number): (keyof FormValues)[] => {
    switch (step) {
      case 1:
        return ["projectName", "organizationType", "yearEstablished"]
      case 2:
        return ["contactName", "contactEmail", "contactPhone", "website"]
      case 3:
        return ["category", "projectDescription", "impactDescription", "beneficiaries"]
      case 4:
        return ["fundingAmount", "fundingUse", "hasPreviousFunding", "previousFundingDetails"]
      case 5:
        return ["socialTwitter", "socialInstagram", "socialFacebook", "walletAddress"]
      case 6:
        return ["agreeTerms", "agreeReporting"]
      default:
        return []
    }
  }

  // If form is submitted, show confirmation
  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/impactors" className="flex items-center text-emerald-600 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Impactors
        </Link>

        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Application Submitted Successfully!</CardTitle>
            <CardDescription>Thank you for applying to the Kesennuma Community Impact Fund</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Your application has been received and is now being reviewed by our team. You will receive an email
              confirmation shortly with more details about the next steps.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Our team will review your application (typically within 5-7 business days)</li>
                <li>You may be contacted for additional information or clarification</li>
                <li>If approved, your project will be added to the voting platform</li>
                <li>Community members will be able to allocate funds to your project</li>
                <li>Funds will be distributed according to the voting results</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/impactors">View Current Impactors</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <Link href="/impactors" className="flex items-center text-emerald-600 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Impactors
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Impactor Application</h1>
        <p className="text-gray-600">
          Apply to become an impactor and receive community-directed funding for your project in Kesennuma.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i + 1 === currentStep
                    ? "bg-emerald-600 text-white"
                    : i + 1 < currentStep
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1 < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs mt-1 hidden sm:block">
                {i === 0
                  ? "Basic Info"
                  : i === 1
                    ? "Contact"
                    : i === 2
                      ? "Project"
                      : i === 3
                        ? "Funding"
                        : i === 4
                          ? "Social"
                          : "Terms"}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            {currentStep === 1
              ? "Basic Information"
              : currentStep === 2
                ? "Contact Information"
                : currentStep === 3
                  ? "Project Details"
                  : currentStep === 4
                    ? "Funding Details"
                    : currentStep === 5
                      ? "Social Media & Wallet"
                      : "Terms & Submission"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1
              ? "Tell us about your organization or project"
              : currentStep === 2
                ? "How can we reach you?"
                : currentStep === 3
                  ? "Describe your project and its impact"
                  : currentStep === 4
                    ? "Tell us about your funding needs"
                    : currentStep === 5
                      ? "Connect your online presence and wallet"
                      : "Review and submit your application"}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project/Organization Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the name of your project or organization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="nonprofit">Non-profit Organization</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="government">Government Agency</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("organizationType") === "other" && (
                    <FormField
                      control={form.control}
                      name="organizationTypeOther"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify organization type*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter organization type" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="yearEstablished"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year Established</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2010" {...field} />
                        </FormControl>
                        <FormDescription>If your project is new, you can leave this blank.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the name of the primary contact person" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email*</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter contact email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.example.com" {...field} />
                        </FormControl>
                        <FormDescription>If you don't have a website, you can leave this blank.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 3: Project Details */}
              {currentStep === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Category*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="economic">Economic Recovery</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="social">Social Welfare</SelectItem>
                            <SelectItem value="cultural">Cultural Preservation</SelectItem>
                            <SelectItem value="sustainability">Sustainability</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("category") === "other" && (
                    <FormField
                      control={form.control}
                      name="categoryOther"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify category*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter project category" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project in detail. What are your goals and objectives?"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impactDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impact Description*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="How will your project impact the Kesennuma community? What specific problems are you addressing?"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="beneficiaries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who will benefit from your project?*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the specific groups or individuals who will benefit from your project"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 4: Funding Details */}
              {currentStep === 4 && (
                <>
                  <FormField
                    control={form.control}
                    name="fundingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requested Funding Amount (¥)*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount in Japanese Yen" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the total amount of funding you are requesting (in JPY, without commas).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fundingUse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How will you use the funding?*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed breakdown of how the funds will be used"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasPreviousFunding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Have you received previous funding for this project?*</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("hasPreviousFunding") === "yes" && (
                    <FormField
                      control={form.control}
                      name="previousFundingDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous Funding Details*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide details about previous funding sources, amounts, and how those funds were used"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}

              {/* Step 5: Social Media & Wallet */}
              {currentStep === 5 && (
                <>
                  <FormField
                    control={form.control}
                    name="socialTwitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter/X</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/yourusername" {...field} />
                        </FormControl>
                        <FormDescription>
                          If you don't have a Twitter/X account, you can leave this blank.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialInstagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/yourusername" {...field} />
                        </FormControl>
                        <FormDescription>
                          If you don't have an Instagram account, you can leave this blank.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialFacebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/yourpage" {...field} />
                        </FormControl>
                        <FormDescription>If you don't have a Facebook page, you can leave this blank.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ethereum Wallet Address</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="0x..."
                              {...field}
                              value={isConnected && address ? address : field.value}
                              className={isConnected && address ? "bg-emerald-50 border-emerald-200" : ""}
                              readOnly={isConnected && address ? true : false}
                            />
                          </FormControl>
                          {!isConnected && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("connect-wallet-trigger")?.click()}
                              className="whitespace-nowrap"
                            >
                              Connect Wallet
                            </Button>
                          )}
                        </div>
                        {isConnected && address && (
                          <p className="text-xs text-emerald-600 mt-1">✓ Wallet connected successfully</p>
                        )}
                        <FormDescription>
                          This is where you'll receive funds if your project is selected.{" "}
                          {!isConnected &&
                            "If you don't have a wallet yet, you can connect one now or leave this blank."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!isConnected && (
                    <div className="hidden">
                      <ConnectWalletButton id="connect-wallet-trigger" />
                    </div>
                  )}

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-medium text-amber-800 mb-2">Important Note About Cryptocurrency</h3>
                    <p className="text-amber-700 text-sm">
                      Funds will be distributed in cryptocurrency. If you're unfamiliar with cryptocurrency, don't
                      worry! Our team will assist you with setting up a wallet and guide you through the process of
                      receiving and converting funds if your project is selected.
                    </p>
                  </div>
                </>
              )}

              {/* Step 6: Terms & Submission */}
              {currentStep === 6 && (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h3 className="font-medium mb-2">Application Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium">Project Name:</span>
                        <span className="col-span-2">{form.watch("projectName")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium">Category:</span>
                        <span className="col-span-2">
                          {form.watch("category") === "economic"
                            ? "Economic Recovery"
                            : form.watch("category") === "healthcare"
                              ? "Healthcare"
                              : form.watch("category") === "education"
                                ? "Education"
                                : form.watch("category") === "social"
                                  ? "Social Welfare"
                                  : form.watch("category") === "cultural"
                                    ? "Cultural Preservation"
                                    : form.watch("category") === "sustainability"
                                      ? "Sustainability"
                                      : form.watch("category") === "other"
                                        ? form.watch("categoryOther")
                                        : ""}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium">Contact:</span>
                        <span className="col-span-2">{form.watch("contactName")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium">Funding Request:</span>
                        <span className="col-span-2">¥{form.watch("fundingAmount")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the terms and conditions of the Kesennuma Community Impact Fund*
                            </FormLabel>
                            <FormDescription>
                              By checking this box, you agree to our{" "}
                              <Link href="#" className="text-emerald-600 hover:underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="#" className="text-emerald-600 hover:underline">
                                Privacy Policy
                              </Link>
                              .
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreeReporting"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I agree to provide regular updates and reports on the use of funds*</FormLabel>
                            <FormDescription>
                              By checking this box, you commit to providing quarterly reports on how the funds are being
                              used and the impact they are having.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">What Happens Next?</h3>
                    <p className="text-blue-700 text-sm mb-2">After submitting your application:</p>
                    <ol className="list-decimal pl-5 text-sm text-blue-700 space-y-1">
                      <li>Our team will review your application (typically within 5-7 business days)</li>
                      <li>You may be contacted for additional information or clarification</li>
                      <li>If approved, your project will be added to the voting platform</li>
                      <li>Community members will be able to allocate funds to your project</li>
                      <li>Funds will be distributed according to the voting results</li>
                    </ol>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              ) : (
                <Button type="button" variant="outline" asChild>
                  <Link href="/impactors">Cancel</Link>
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

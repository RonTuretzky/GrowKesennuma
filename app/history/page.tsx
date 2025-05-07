import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-emerald-600 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Distribution History</h1>
        <p className="text-gray-600">Track the historical allocation of funds to impact projects in Kesennuma.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start">
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Round" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rounds</SelectItem>
              <SelectItem value="round1">Round 1 (Q1 2023)</SelectItem>
              <SelectItem value="round2">Round 2 (Q2 2023)</SelectItem>
              <SelectItem value="round3">Round 3 (Q3 2023)</SelectItem>
              <SelectItem value="round4">Round 4 (Q4 2023)</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="economic">Economic Recovery</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="social">Social Welfare</SelectItem>
              <SelectItem value="cultural">Cultural Preservation</SelectItem>
              <SelectItem value="sustainability">Sustainability</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export Data
        </Button>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="summary">Summary View</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Distribution Records</CardTitle>
              <CardDescription>Complete history of fund distributions to impact projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributionHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.round}</TableCell>
                      <TableCell className="font-medium">{record.project}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`bg-${getCategoryColor(record.category)}-50 text-${getCategoryColor(record.category)}-700 border-${getCategoryColor(record.category)}-200`}
                        >
                          {record.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.amount}</TableCell>
                      <TableCell>{record.votes}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(record.status)}>{record.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={record.txHash}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline text-sm"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding by Category</CardTitle>
                <CardDescription>Total funds distributed by project category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorySummary.map((category) => (
                    <div key={category.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm font-medium">{category.amount}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${getCategoryColor(category.name)}-500`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Round Participation</CardTitle>
                <CardDescription>Citizen participation and voting statistics by round</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Round</TableHead>
                      <TableHead>Voters</TableHead>
                      <TableHead>Total Votes</TableHead>
                      <TableHead>Projects</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roundSummary.map((round) => (
                      <TableRow key={round.id}>
                        <TableCell className="font-medium">{round.name}</TableCell>
                        <TableCell>{round.voters}</TableCell>
                        <TableCell>{round.totalVotes}</TableCell>
                        <TableCell>{round.projects}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Distribution Over Time</CardTitle>
                <CardDescription>Visualization of funding allocation across rounds</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Chart visualization would be displayed here</p>
                  <p className="text-sm">Showing funding trends across multiple rounds</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voter Participation Trends</CardTitle>
                <CardDescription>Tracking community engagement over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Chart visualization would be displayed here</p>
                  <p className="text-sm">Showing voter participation metrics</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions
function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    "Economic Recovery": "emerald",
    Healthcare: "blue",
    Education: "purple",
    "Social Welfare": "pink",
    "Cultural Preservation": "amber",
    Sustainability: "green",
  }

  return categoryColors[category] || "gray"
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "Processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

// Mock data
const distributionHistory = [
  {
    id: "1",
    date: "2023-12-15",
    round: "Round 4 (Q4 2023)",
    project: "Kesennuma Fishery Restoration",
    category: "Economic Recovery",
    amount: "¥3,500,000",
    votes: "1,245",
    status: "Completed",
    txHash: "https://etherscan.io/tx/0x123",
  },
  {
    id: "2",
    date: "2023-12-15",
    round: "Round 4 (Q4 2023)",
    project: "Community Health Initiative",
    category: "Healthcare",
    amount: "¥2,800,000",
    votes: "1,120",
    status: "Completed",
    txHash: "https://etherscan.io/tx/0x124",
  },
  {
    id: "3",
    date: "2023-12-15",
    round: "Round 4 (Q4 2023)",
    project: "Youth Education Program",
    category: "Education",
    amount: "¥3,200,000",
    votes: "1,350",
    status: "Completed",
    txHash: "https://etherscan.io/tx/0x125",
  },
  {
    id: "4",
    date: "2023-09-20",
    round: "Round 3 (Q3 2023)",
    project: "Elderly Care Support",
    category: "Social Welfare",
    amount: "¥2,500,000",
    votes: "980",
    status: "Completed",
    txHash: "https://etherscan.io/tx/0x126",
  },
  {
    id: "5",
    date: "2023-09-20",
    round: "Round 3 (Q3 2023)",
    project: "Cultural Heritage Preservation",
    category: "Cultural Preservation",
    amount: "¥2,200,000",
    votes: "850",
    status: "Completed",
    txHash: "https://etherscan.io/tx/0x127",
  },
  {
    id: "6",
    date: "2023-06-18",
    round: "Round 2 (Q2 2023)",
    project: "Sustainable Rebuilding Initiative",
    category: "Sustainability",
    amount: "¥3,800,000",
    votes: "1,420",
    status: "Completed",
    txHash: "https://etherscan.io/tx/0x128",
  },
]

const categorySummary = [
  { name: "Economic Recovery", amount: "¥8,500,000", percentage: 28 },
  { name: "Healthcare", amount: "¥5,800,000", percentage: 19 },
  { name: "Education", amount: "¥6,200,000", percentage: 20 },
  { name: "Social Welfare", amount: "¥4,500,000", percentage: 15 },
  { name: "Cultural Preservation", amount: "¥2,200,000", percentage: 7 },
  { name: "Sustainability", amount: "¥3,800,000", percentage: 12 },
]

const roundSummary = [
  { id: "1", name: "Round 4 (Q4 2023)", voters: "2,500", totalVotes: "3,715", projects: "3" },
  { id: "2", name: "Round 3 (Q3 2023)", voters: "2,100", totalVotes: "1,830", projects: "2" },
  { id: "3", name: "Round 2 (Q2 2023)", voters: "1,800", totalVotes: "1,420", projects: "1" },
  { id: "4", name: "Round 1 (Q1 2023)", voters: "1,500", totalVotes: "1,200", projects: "2" },
]

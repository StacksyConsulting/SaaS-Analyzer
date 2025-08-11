"use client"

import { useState } from "react"
import { PlusCircle, X, DollarSign, Users, Calendar, TrendingUp, Download, Mail } from "lucide-react"
import { Jockey_One, Montserrat } from "next/font/google"

const jockeyOne = Jockey_One({ subsets: ["latin"], weight: "400" })
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export type SaaSContractAnalyzerProps = {
  backgroundImageUrl?: string
  overlayOpacity?: number // 0..1
  title?: string
}

type Contract = {
  id: number
  category: string
  vendor: string
  contractLength: number
  users: string
  totalValue: string
  features: string[]
  avgPricePerUser: number
  marketPosition: "Premium" | "Standard" | "Budget" | "Unknown"
  actualPricePerUser: number
}

export default function SaaSContractAnalyzer({
  backgroundImageUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Grey%20Brick%20Wall_edited.jpg-bJrS3UIUrGhH3BOaX6OfOF4NbaYATE.jpeg",
  overlayOpacity = 0.4,
  title = "SaaS Stack Analyzer",
}: SaaSContractAnalyzerProps) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [showResults, setShowResults] = useState(false)
  const [currentContract, setCurrentContract] = useState({
    category: "",
    vendor: "",
    contractLength: 12,
    users: "",
    totalValue: "",
  })

  const vendorDatabase: Record<
    string,
    { category: string; features: string[]; avgPricePerUser: number; marketPosition: "Premium" | "Standard" | "Budget" }
  > = {
    // AI & ML
    "Anthropic Claude": {
      category: "AI & ML",
      features: ["Conversational AI", "Text Analysis", "Content Generation"],
      avgPricePerUser: 25,
      marketPosition: "Standard",
    },
    "OpenAI API": {
      category: "AI & ML",
      features: ["Natural Language Processing", "Text Generation", "Code Generation"],
      avgPricePerUser: 20,
      marketPosition: "Standard",
    },
    // Analytics & BI
    Looker: {
      category: "Analytics & BI",
      features: ["Data Platform", "Business Intelligence", "Data Modeling"],
      avgPricePerUser: 125,
      marketPosition: "Premium",
    },
    "Power BI": {
      category: "Analytics & BI",
      features: ["Data Visualization", "Business Intelligence", "Dashboard Creation"],
      avgPricePerUser: 20,
      marketPosition: "Standard",
    },
    "Qlik Sense": {
      category: "Analytics & BI",
      features: ["Data Visualization", "Self-Service BI", "Associative Model"],
      avgPricePerUser: 30,
      marketPosition: "Standard",
    },
    Tableau: {
      category: "Analytics & BI",
      features: ["Data Visualization", "Business Intelligence", "Dashboard Creation"],
      avgPricePerUser: 75,
      marketPosition: "Premium",
    },
    // Cloud Infrastructure
    AWS: {
      category: "Cloud Infrastructure",
      features: ["Computing Services", "Storage", "Database"],
      avgPricePerUser: 100,
      marketPosition: "Premium",
    },
    "Google Cloud Platform": {
      category: "Cloud Infrastructure",
      features: ["Computing Services", "Storage", "Database"],
      avgPricePerUser: 90,
      marketPosition: "Premium",
    },
    "Microsoft Azure": {
      category: "Cloud Infrastructure",
      features: ["Computing Services", "Storage", "Database"],
      avgPricePerUser: 95,
      marketPosition: "Premium",
    },
    // Communication
    Discord: {
      category: "Communication",
      features: ["Voice Chat", "Text Messaging", "Screen Sharing"],
      avgPricePerUser: 8,
      marketPosition: "Budget",
    },
    "Google Meet": {
      category: "Communication",
      features: ["Video Conferencing", "Screen Sharing", "Recording"],
      avgPricePerUser: 8,
      marketPosition: "Budget",
    },
    "Microsoft Teams": {
      category: "Communication",
      features: ["Video Conferencing", "Team Chat", "File Sharing"],
      avgPricePerUser: 10,
      marketPosition: "Standard",
    },
    Slack: {
      category: "Communication",
      features: ["Team Messaging", "File Sharing", "App Integration"],
      avgPricePerUser: 12,
      marketPosition: "Standard",
    },
    Zoom: {
      category: "Communication",
      features: ["Video Conferencing", "Screen Sharing", "Recording"],
      avgPricePerUser: 20,
      marketPosition: "Standard",
    },
    // CRM
    Freshsales: {
      category: "CRM",
      features: ["Contact Management", "Sales Pipeline", "Email Tracking"],
      avgPricePerUser: 29,
      marketPosition: "Standard",
    },
    HubSpot: {
      category: "CRM",
      features: ["Contact Management", "Email Marketing", "Landing Pages"],
      avgPricePerUser: 100,
      marketPosition: "Standard",
    },
    Pipedrive: {
      category: "CRM",
      features: ["Contact Management", "Sales Pipeline", "Email Integration"],
      avgPricePerUser: 25,
      marketPosition: "Standard",
    },
    Salesforce: {
      category: "CRM",
      features: ["Contact Management", "Sales Pipeline", "Email Marketing"],
      avgPricePerUser: 150,
      marketPosition: "Premium",
    },
    "Zoho CRM": {
      category: "CRM",
      features: ["Contact Management", "Sales Pipeline", "Email Marketing"],
      avgPricePerUser: 20,
      marketPosition: "Budget",
    },
    // Customer Support
    Freshdesk: {
      category: "Customer Support",
      features: ["Ticket Management", "Knowledge Base", "Live Chat"],
      avgPricePerUser: 29,
      marketPosition: "Standard",
    },
    ServiceNow: {
      category: "Customer Support",
      features: ["IT Service Management", "Workflow Automation", "Knowledge Management"],
      avgPricePerUser: 150,
      marketPosition: "Premium",
    },
    Zendesk: {
      category: "Customer Support",
      features: ["Ticket Management", "Knowledge Base", "Live Chat"],
      avgPricePerUser: 89,
      marketPosition: "Standard",
    },
    // Design & Creative
    "Adobe Creative Cloud": {
      category: "Design & Creative",
      features: ["Photo Editing", "Video Editing", "Graphic Design"],
      avgPricePerUser: 75,
      marketPosition: "Premium",
    },
    Canva: {
      category: "Design & Creative",
      features: ["Graphic Design", "Templates", "Brand Management"],
      avgPricePerUser: 15,
      marketPosition: "Budget",
    },
    Figma: {
      category: "Design & Creative",
      features: ["UI/UX Design", "Prototyping", "Collaboration"],
      avgPricePerUser: 15,
      marketPosition: "Standard",
    },
    // Development Tools
    GitHub: {
      category: "Development Tools",
      features: ["Version Control", "Code Collaboration", "Issue Tracking"],
      avgPricePerUser: 7,
      marketPosition: "Standard",
    },
    GitLab: {
      category: "Development Tools",
      features: ["Version Control", "CI/CD", "Issue Tracking"],
      avgPricePerUser: 19,
      marketPosition: "Standard",
    },
    // E-commerce
    Shopify: {
      category: "E-commerce",
      features: ["Online Store", "Payment Processing", "Inventory Management"],
      avgPricePerUser: 79,
      marketPosition: "Standard",
    },
    WooCommerce: {
      category: "E-commerce",
      features: ["WordPress E-commerce", "Payment Processing", "Inventory Management"],
      avgPricePerUser: 25,
      marketPosition: "Budget",
    },
    // Email Marketing
    "Campaign Monitor": {
      category: "Email Marketing",
      features: ["Email Design", "Automation", "Segmentation"],
      avgPricePerUser: 29,
      marketPosition: "Standard",
    },
    "Constant Contact": {
      category: "Email Marketing",
      features: ["Email Marketing", "Event Management", "Social Media"],
      avgPricePerUser: 25,
      marketPosition: "Standard",
    },
    Mailchimp: {
      category: "Email Marketing",
      features: ["Email Marketing", "Automation", "Landing Pages"],
      avgPricePerUser: 20,
      marketPosition: "Standard",
    },
    // Finance & Accounting
    FreshBooks: {
      category: "Finance & Accounting",
      features: ["Invoicing", "Time Tracking", "Expense Management"],
      avgPricePerUser: 25,
      marketPosition: "Standard",
    },
    "QuickBooks Online": {
      category: "Finance & Accounting",
      features: ["Accounting", "Invoicing", "Expense Tracking"],
      avgPricePerUser: 30,
      marketPosition: "Standard",
    },
    Wave: {
      category: "Finance & Accounting",
      features: ["Accounting", "Invoicing", "Receipt Scanning"],
      avgPricePerUser: 0,
      marketPosition: "Budget",
    },
    Xero: {
      category: "Finance & Accounting",
      features: ["Accounting", "Invoicing", "Bank Reconciliation"],
      avgPricePerUser: 35,
      marketPosition: "Standard",
    },
    // HR & Recruiting
    ADP: {
      category: "HR & Recruiting",
      features: ["Payroll", "HR Management", "Benefits Administration"],
      avgPricePerUser: 45,
      marketPosition: "Standard",
    },
    BambooHR: {
      category: "HR & Recruiting",
      features: ["Employee Database", "Time Tracking", "Performance Management"],
      avgPricePerUser: 8,
      marketPosition: "Standard",
    },
    Gusto: {
      category: "HR & Recruiting",
      features: ["Payroll", "Benefits Administration", "HR Tools"],
      avgPricePerUser: 12,
      marketPosition: "Budget",
    },
    Workday: {
      category: "HR & Recruiting",
      features: ["Human Capital Management", "Payroll", "Benefits Administration"],
      avgPricePerUser: 125,
      marketPosition: "Premium",
    },
    // Marketing
    ActiveCampaign: {
      category: "Marketing",
      features: ["Email Marketing", "Marketing Automation", "CRM"],
      avgPricePerUser: 45,
      marketPosition: "Standard",
    },
    Marketo: {
      category: "Marketing",
      features: ["Lead Management", "Email Marketing", "Campaign Management"],
      avgPricePerUser: 195,
      marketPosition: "Premium",
    },
    Pardot: {
      category: "Marketing",
      features: ["Lead Management", "Email Marketing", "Lead Scoring"],
      avgPricePerUser: 125,
      marketPosition: "Premium",
    },
    // Project Management
    Asana: {
      category: "Project Management",
      features: ["Task Management", "Team Collaboration", "Timeline View"],
      avgPricePerUser: 24,
      marketPosition: "Standard",
    },
    Basecamp: {
      category: "Project Management",
      features: ["Project Organization", "Message Boards", "To-do Lists"],
      avgPricePerUser: 18,
      marketPosition: "Standard",
    },
    ClickUp: {
      category: "Project Management",
      features: ["Task Management", "Time Tracking", "Goal Setting"],
      avgPricePerUser: 9,
      marketPosition: "Budget",
    },
    Jira: {
      category: "Project Management",
      features: ["Issue Tracking", "Agile Planning", "Reporting"],
      avgPricePerUser: 14,
      marketPosition: "Standard",
    },
    "Monday.com": {
      category: "Project Management",
      features: ["Project Tracking", "Team Collaboration", "Automation"],
      avgPricePerUser: 24,
      marketPosition: "Standard",
    },
    Trello: {
      category: "Project Management",
      features: ["Kanban Boards", "Task Management", "Team Collaboration"],
      avgPricePerUser: 10,
      marketPosition: "Budget",
    },
    // Security & IT
    "1Password": {
      category: "Security & IT",
      features: ["Password Management", "Secure Document Storage", "Team Management"],
      avgPricePerUser: 8,
      marketPosition: "Standard",
    },
    Bitwarden: {
      category: "Security & IT",
      features: ["Password Management", "Secure Notes", "Two-Factor Authentication"],
      avgPricePerUser: 3,
      marketPosition: "Budget",
    },
    LastPass: {
      category: "Security & IT",
      features: ["Password Management", "Secure Sharing", "Multi-Factor Authentication"],
      avgPricePerUser: 6,
      marketPosition: "Budget",
    },
    Okta: {
      category: "Security & IT",
      features: ["Identity Management", "Single Sign-On", "Multi-Factor Authentication"],
      avgPricePerUser: 8,
      marketPosition: "Standard",
    },
  }

  const categories = [...new Set(Object.values(vendorDatabase).map((v) => v.category))].sort()

  // ---------- Discount modeling helpers ----------
  function clamp(n: number, min = 0, max = 60) {
    return Math.min(max, Math.max(min, n))
  }
  function addToRange(range: [number, number], delta: [number, number] | number) {
    if (typeof delta === "number") return [range[0] + delta, range[1] + delta] as [number, number]
    return [range[0] + delta[0], range[1] + delta[1]] as [number, number]
  }
  function sizeBandBySeats(seats: number) {
    if (seats >= 5000) return { range: [25, 35] as [number, number] }
    if (seats >= 500) return { range: [15, 25] as [number, number] }
    if (seats >= 50) return { range: [10, 15] as [number, number] }
    if (seats >= 1) return { range: [5, 10] as [number, number] }
    return { range: [0, 0] as [number, number] }
  }
  function categoryAdjustments(category: string) {
    let adj = 0
    if (category === "Cloud Infrastructure" || category === "Development Tools") adj += 5
    if (["AI & ML", "Security & IT", "Design & Creative"].includes(category)) adj -= 3
    return adj
  }
  function positionAdjustments(position: Contract["marketPosition"]) {
    if (position === "Premium") return -3
    if (position === "Budget") return +2
    return 0
  }
  function expectedFor(contract: Contract) {
    const seats = Number.parseInt(contract.users)
    let { range } = sizeBandBySeats(seats)

    // Multi-year commitment adders (based on your guidance)
    if (contract.contractLength >= 36) range = addToRange(range, [15, 20])
    else if (contract.contractLength >= 24) range = addToRange(range, [10, 15])

    // Volume kicker thresholds
    if (seats >= 500) range = addToRange(range, 10)
    else if (seats >= 100) range = addToRange(range, 5)

    // Product and market position adjustments
    range = addToRange(range, categoryAdjustments(contract.category))
    range = addToRange(range, positionAdjustments(contract.marketPosition))

    // clamp and normalize
    range = [clamp(range[0]), clamp(range[1])] as [number, number]
    if (range[0] > range[1]) range = [range[1], range[0]]

    const yourMonthly = contract.actualPricePerUser
    const sticker = contract.avgPricePerUser > 0 ? contract.avgPricePerUser : yourMonthly

    const minTarget = sticker * (1 - range[1] / 100) // higher discount => lower target price
    const maxTarget = sticker * (1 - range[0] / 100)
    const targetMid = (minTarget + maxTarget) / 2

    return { discountRange: range, sticker, minTarget, maxTarget, targetMid }
  }

  function addContract() {
    if (
      !currentContract.vendor ||
      !currentContract.users ||
      !currentContract.totalValue ||
      Number.parseInt(currentContract.users) <= 0 ||
      Number.parseFloat(currentContract.totalValue) <= 0
    )
      return

    const vendor = vendorDatabase[currentContract.vendor] || {
      category: "Other",
      features: [],
      avgPricePerUser: 0,
      marketPosition: "Standard" as const,
    }

    const newContract: Contract = {
      ...currentContract,
      id: Date.now(),
      category: vendor.category,
      features: vendor.features,
      avgPricePerUser: vendor.avgPricePerUser,
      marketPosition: vendor.marketPosition,
      actualPricePerUser:
        Number.parseFloat(currentContract.totalValue) /
        Number.parseInt(currentContract.users) /
        currentContract.contractLength,
    }

    setContracts((prev) => [...prev, newContract])
    setCurrentContract({ category: "", vendor: "", contractLength: 12, users: "", totalValue: "" })
  }

  function removeContract(id: number) {
    setContracts((cs) => cs.filter((c) => c.id !== id))
  }

  function analyzeContracts() {
    setShowResults(true)
  }

  function getFeatureOverlaps() {
    const overlaps: { vendor1: string; vendor2: string; features: string[]; count: number }[] = []
    for (let i = 0; i < contracts.length; i++) {
      for (let j = i + 1; j < contracts.length; j++) {
        const c1 = contracts[i]
        const c2 = contracts[j]
        const common = c1.features.filter((f) => c2.features.includes(f))
        if (common.length)
          overlaps.push({ vendor1: c1.vendor, vendor2: c2.vendor, features: common, count: common.length })
      }
    }
    return overlaps
  }

  function calculateSavings() {
    let totalSavings = 0
    let totalSpend = 0

    contracts.forEach((c) => {
      const users = Number.parseInt(c.users)
      const yourMonthly = c.actualPricePerUser
      const { targetMid } = expectedFor(c)
      totalSpend += yourMonthly * users * 12
      if (yourMonthly > targetMid) totalSavings += (yourMonthly - targetMid) * users * 12
    })

    return { totalSavings, totalSpend }
  }

  const overlaps = getFeatureOverlaps()
  const { totalSavings, totalSpend } = calculateSavings()
  const savingsPercentage = totalSpend > 0 ? (totalSavings / totalSpend) * 100 : 0

  return (
    <div
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: `url("${backgroundImageUrl}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlayOpacity})` }} aria-hidden="true" />
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <h1 className={`${jockeyOne.className} text-5xl sm:text-6xl font-bold tracking-tight text-[#3A6AFD]`}>
                {title}
              </h1>
            </div>
            <p className={`${montserrat.className} text-xl text-white mb-2`}>
              Discover hidden overlaps and potential savings in your software stack
            </p>
            <p className={`${montserrat.className} text-sm text-gray-300`}>
              Free analysis • No commitment • Get instant insights
            </p>
          </div>

          {!showResults ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Your SaaS Contracts</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={currentContract.category}
                    onChange={(e) => setCurrentContract({ ...currentContract, category: e.target.value, vendor: "" })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All categories...</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                  <select
                    value={currentContract.vendor}
                    onChange={(e) => setCurrentContract({ ...currentContract, vendor: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!currentContract.category}
                  >
                    <option value="">Select vendor...</option>
                    {Object.keys(vendorDatabase)
                      .filter(
                        (vendor) =>
                          !currentContract.category || vendorDatabase[vendor].category === currentContract.category,
                      )
                      .sort()
                      .map((vendor) => (
                        <option key={vendor} value={vendor}>
                          {vendor}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Length</label>
                  <select
                    value={currentContract.contractLength}
                    onChange={(e) =>
                      setCurrentContract({ ...currentContract, contractLength: Number.parseInt(e.target.value) })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={12}>12 months</option>
                    <option value={24}>24 months</option>
                    <option value={36}>36 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Users/Licenses</label>
                  <input
                    type="number"
                    value={currentContract.users}
                    onChange={(e) => setCurrentContract({ ...currentContract, users: e.target.value })}
                    placeholder="50"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Contract Value</label>
                  <input
                    type="number"
                    value={currentContract.totalValue}
                    onChange={(e) => setCurrentContract({ ...currentContract, totalValue: e.target.value })}
                    placeholder="60000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={addContract}
                    disabled={
                      !currentContract.vendor ||
                      !currentContract.users ||
                      !currentContract.totalValue ||
                      Number.parseInt(currentContract.users) <= 0 ||
                      Number.parseFloat(currentContract.totalValue) <= 0
                    }
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={20} />
                    Add Contract
                  </button>
                </div>
              </div>

              {contracts.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-medium text-gray-800">Your SaaS Contracts ({contracts.length})</h3>
                  {contracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="font-medium text-gray-900">{contract.vendor}</span>
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {contract.category}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users size={14} /> {contract.users} users
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} /> ${Number.parseInt(contract.totalValue).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> {contract.contractLength} months
                          </span>
                        </div>
                      </div>
                      <button onClick={() => removeContract(contract.id)} className="text-red-500 hover:text-red-700">
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {contracts.length >= 2 ? (
                <div className="text-center">
                  <button
                    onClick={analyzeContracts}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-700 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <TrendingUp className="inline mr-2" size={24} />
                    Analyze My Stack & Show Savings
                  </button>
                </div>
              ) : contracts.length === 1 ? (
                <div className="text-center text-gray-500 py-4">
                  Add at least 2 contracts to analyze overlaps and potential savings
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">Potential Annual Savings</h2>
                  <div className="text-5xl font-bold mb-2">${Math.round(totalSavings).toLocaleString()}</div>
                  <div className="text-xl opacity-90">
                    {"That's"} {savingsPercentage.toFixed(1)}% of your ${Math.round(totalSpend).toLocaleString()} annual
                    spend
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Contract Analysis</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Vendor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Your Price/User/Month</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Market Average</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Expected Discount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Expected Price/User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Annual Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract) => {
                        const { discountRange, sticker, minTarget, maxTarget, targetMid } = expectedFor(contract)
                        const yourPrice = contract.actualPricePerUser
                        const users = Number.parseInt(contract.users)
                        const annualImpact = Math.round((yourPrice - targetMid) * users * 12)

                        const status =
                          contract.avgPricePerUser === 0
                            ? "Unknown"
                            : yourPrice <= minTarget
                              ? "Good Deal"
                              : yourPrice <= maxTarget
                                ? "Market Rate"
                                : "Above Expected"

                        return (
                          <tr key={contract.id} className="border-b border-gray-100">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{contract.vendor}</div>
                                <div className="text-sm text-gray-500">{users} users</div>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium">${yourPrice.toFixed(0)}</td>
                            <td className="py-4 px-4">${sticker.toFixed(0)}</td>
                            <td className="py-4 px-4">
                              <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {discountRange[0].toFixed(0)}–{discountRange[1].toFixed(0)}%
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              ${Math.max(0, Math.round(minTarget)).toLocaleString()} – $
                              {Math.max(0, Math.round(maxTarget)).toLocaleString()}
                              <div className="text-xs text-gray-500">
                                midpoint: ${Math.round(targetMid).toLocaleString()}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {status === "Unknown" ? (
                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                  Unknown
                                </span>
                              ) : status === "Above Expected" ? (
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                  Above Expected
                                </span>
                              ) : status === "Good Deal" ? (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                  Good Deal
                                </span>
                              ) : (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                  Market Rate
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {annualImpact > 100 ? (
                                <span className="text-red-600 font-medium">-${annualImpact.toLocaleString()}</span>
                              ) : annualImpact < -100 ? (
                                <span className="text-green-600 font-medium">
                                  +${Math.abs(annualImpact).toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-gray-600">~$0</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Actually Save This Money?</h2>
                <p className="text-xl mb-6 opacity-90">
                  Our expert negotiators have saved companies like yours millions on SaaS renewals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="https://calendly.com/bryant-stacksyconsulting/initial-consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <Mail size={20} />
                    Get Free Consultation
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors flex items-center gap-2"
                  >
                    <Download size={20} />
                    Download Report
                  </button>
                </div>
                <div className="mt-6 text-sm opacity-75">
                  <p>✓ Risk-free process ✓ Average client saves 13%</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setShowResults(false)
                    setContracts([])
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {"\u2190"} Analyze Another Stack
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

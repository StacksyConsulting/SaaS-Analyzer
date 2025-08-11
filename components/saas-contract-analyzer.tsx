"use client"

import { useState } from "react"
import { PlusCircle, X, DollarSign, Users, Calendar, TrendingUp, Download, Mail } from "lucide-react"
import { Jockey_One, Montserrat } from "next/font/google"

const jockeyOne = Jockey_One({ subsets: ["latin"], weight: "400" })
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

const OBS_PRODUCTS = {
  "Application security": { unit: "host-hours (8 GiB)" },
  "Real user monitoring": { unit: "sessions" },
  "Infrastructure monitoring": { unit: "host-hours (any size)" },
  "Full-stack monitoring": { unit: "host-hours (8 GiB)" },
} as const
type ObsProduct = keyof typeof OBS_PRODUCTS

export type SaaSContractAnalyzerProps = {
  backgroundImageUrl?: string
  overlayOpacity?: number // 0..1
  title?: string
  darkBackground?: boolean
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
  // Observability-only fields
  obsProduct?: "Application security" | "Real user monitoring" | "Infrastructure monitoring" | "Full-stack monitoring"
  obsUnits?: string
  unitLabel?: string // display label: "user", "sessions", "host-hours (8 GiB)", etc.
}

export default function SaaSContractAnalyzer({
  backgroundImageUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Grey%20Brick%20Wall_edited.jpg-bJrS3UIUrGhH3BOaX6OfOF4NbaYATE.jpeg",
  overlayOpacity = 0.4,
  title = "SaaS Stack Analyzer",
  darkBackground = false,
}: SaaSContractAnalyzerProps) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [showResults, setShowResults] = useState(false)
  const [currentContract, setCurrentContract] = useState({
    category: "",
    vendor: "",
    contractLength: 12,
    users: "",
    totalValue: "",
    obsProduct: "" as "" | ObsProduct,
    obsUnits: "",
  })

  // Updated vendor database
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

    // Finance & Accounting (expanded)
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
    MYOB: {
      category: "Finance & Accounting",
      features: ["Accounting", "Invoicing", "Payroll"],
      avgPricePerUser: 28,
      marketPosition: "Standard",
    },
    "Stripe Billing": {
      category: "Finance & Accounting",
      features: ["Payments", "Subscription Billing", "Invoicing"],
      avgPricePerUser: 25,
      marketPosition: "Standard",
    },
    "Sage Intacct": {
      category: "Finance & Accounting",
      features: ["General Ledger", "AP/AR", "Multi-Entity Consolidation"],
      avgPricePerUser: 60,
      marketPosition: "Premium",
    },
    NetSuite: {
      category: "Finance & Accounting",
      features: ["ERP", "Financials", "Billing"],
      avgPricePerUser: 90,
      marketPosition: "Premium",
    },
    Zuora: {
      category: "Finance & Accounting",
      features: ["Subscription Billing", "CPQ", "Revenue Recognition"],
      avgPricePerUser: 85,
      marketPosition: "Premium",
    },
    Chargebee: {
      category: "Finance & Accounting",
      features: ["Subscription Billing", "Revenue Recognition", "Dunning"],
      avgPricePerUser: 40,
      marketPosition: "Standard",
    },
    "BILL (Bill.com)": {
      category: "Finance & Accounting",
      features: ["AP Automation", "Payments", "Approvals"],
      avgPricePerUser: 20,
      marketPosition: "Standard",
    },
    Expensify: {
      category: "Finance & Accounting",
      features: ["Expense Reports", "Corporate Cards", "Reimbursements"],
      avgPricePerUser: 9,
      marketPosition: "Budget",
    },
    Ramp: {
      category: "Finance & Accounting",
      features: ["Spend Management", "Corporate Cards", "Expense Automation"],
      avgPricePerUser: 10,
      marketPosition: "Budget",
    },
    Brex: {
      category: "Finance & Accounting",
      features: ["Corporate Cards", "Spend Management", "Bill Pay"],
      avgPricePerUser: 12,
      marketPosition: "Standard",
    },
    "SAP Concur": {
      category: "Finance & Accounting",
      features: ["Expense", "Travel", "Invoice"],
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

    // Observability & Monitoring (new)
    Dynatrace: {
      category: "Observability & Monitoring",
      features: ["APM", "Infrastructure Monitoring", "AI-assisted Insights"],
      avgPricePerUser: 70,
      marketPosition: "Premium",
    },
    "New Relic": {
      category: "Observability & Monitoring",
      features: ["APM", "Logs", "Metrics & Traces"],
      avgPricePerUser: 49,
      marketPosition: "Standard",
    },
    AppDynamics: {
      category: "Observability & Monitoring",
      features: ["APM", "Business Transaction Monitoring", "Infrastructure"],
      avgPricePerUser: 65,
      marketPosition: "Premium",
    },
    "Splunk Observability": {
      category: "Observability & Monitoring",
      features: ["Logs", "APM", "Real-time Metrics"],
      avgPricePerUser: 80,
      marketPosition: "Premium",
    },
    Datadog: {
      category: "Observability & Monitoring",
      features: ["APM", "Infrastructure", "Log Management"],
      avgPricePerUser: 45,
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
    // Infrastructure/platform tools often have higher discounts; Development Tools kept as-is.
    if (category === "Development Tools") adj += 5
    // Specialized/niche typically lower flexibility
    if (["AI & ML", "Security & IT", "Design & Creative"].includes(category)) adj -= 3
    return adj
  }
  function positionAdjustments(position: Contract["marketPosition"]) {
    if (position === "Premium") return -3
    if (position === "Budget") return +2
    return 0
  }
  function expectedFor(contract: Contract) {
    const isObs = contract.category === "Observability & Monitoring"
    const seats = isObs ? Number.parseFloat(contract.obsUnits || "0") || 1 : Number.parseInt(contract.users || "0") || 1

    let { range } = sizeBandBySeats(seats)

    if (contract.contractLength >= 36) range = addToRange(range, [15, 20])
    else if (contract.contractLength >= 24) range = addToRange(range, [10, 15])

    if (seats >= 500) range = addToRange(range, 10)
    else if (seats >= 100) range = addToRange(range, 5)

    range = addToRange(range, categoryAdjustments(contract.category))
    range = addToRange(range, positionAdjustments(contract.marketPosition))

    range = [clamp(range[0]), clamp(range[1])] as [number, number]
    if (range[0] > range[1]) range = [range[1], range[0]]

    const yourMonthly = contract.actualPricePerUser
    const sticker = contract.avgPricePerUser > 0 ? contract.avgPricePerUser : yourMonthly

    const minTarget = sticker * (1 - range[1] / 100)
    const maxTarget = sticker * (1 - range[0] / 100)
    const targetMid = (minTarget + maxTarget) / 2

    return { discountRange: range, sticker, minTarget, maxTarget, targetMid }
  }

  function addContract() {
    const isObs = currentContract.category === "Observability & Monitoring"
    const quantity = isObs
      ? Number.parseFloat(currentContract.obsUnits || "0")
      : Number.parseInt(currentContract.users || "0")
    const totalVal = Number.parseFloat(currentContract.totalValue || "0")

    if (
      !currentContract.vendor ||
      !currentContract.totalValue ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(totalVal) ||
      totalVal <= 0
    )
      return

    const vendor = vendorDatabase[currentContract.vendor] || {
      category: "Other",
      features: [],
      avgPricePerUser: 0,
      marketPosition: "Standard" as const,
    }

    const unitLabel = isObs
      ? OBS_PRODUCTS[(currentContract.obsProduct || "Infrastructure monitoring") as ObsProduct].unit
      : "user"

    const newContract: Contract = {
      ...currentContract,
      id: Date.now(),
      category: vendor.category,
      features: vendor.features,
      avgPricePerUser: vendor.avgPricePerUser,
      marketPosition: vendor.marketPosition,
      // treat as price per unit per month (user or obs unit)
      actualPricePerUser: totalVal / quantity / currentContract.contractLength,
      unitLabel,
    }

    setContracts((prev) => [...prev, newContract])
    setCurrentContract({
      category: "",
      vendor: "",
      contractLength: 12,
      users: "",
      totalValue: "",
      obsProduct: "" as "" | ObsProduct,
      obsUnits: "",
    })
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
      const volume =
        c.category === "Observability & Monitoring"
          ? Number.parseFloat(c.obsUnits || "0") || 0
          : Number.parseInt(c.users || "0") || 0
      const yourMonthly = c.actualPricePerUser
      const { targetMid } = expectedFor(c)
      totalSpend += yourMonthly * volume * 12
      if (yourMonthly > targetMid) totalSavings += (yourMonthly - targetMid) * volume * 12
    })

    return { totalSavings, totalSpend }
  }

  const overlaps = getFeatureOverlaps()
  const { totalSavings, totalSpend } = calculateSavings()
  const savingsPercentage = totalSpend > 0 ? (totalSavings / totalSpend) * 100 : 0
  const hasBackground = Boolean(backgroundImageUrl)
  const isDark = hasBackground || darkBackground

  return (
    <div
      className={`min-h-screen p-4 relative ${darkBackground ? "bg-black" : ""}`}
      style={
        hasBackground
          ? {
              backgroundImage: `url("${backgroundImageUrl}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {hasBackground && overlayOpacity > 0 ? (
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlayOpacity})` }} aria-hidden="true" />
      ) : null}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <h1 className={`${jockeyOne.className} text-5xl sm:text-6xl font-bold tracking-tight text-[#3A6AFD]`}>
                {title}
              </h1>
            </div>
            <p className={`${montserrat.className} text-xl ${isDark ? "text-white" : "text-gray-700"} mb-2`}>
              Discover hidden overlaps and potential savings in your software stack
            </p>
            <p className={`${montserrat.className} text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}>
              Free analysis • No commitment • Get instant insights
            </p>
          </div>

          {!showResults ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Your SaaS Contracts</h2>

              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="w-full max-w-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={currentContract.category}
                    onChange={(e) => {
                      const val = e.target.value
                      setCurrentContract((prev) => ({
                        ...prev,
                        category: val,
                        vendor: "",
                        // set sensible default for obs product
                        obsProduct:
                          val === "Observability & Monitoring" ? "Infrastructure monitoring" : ("" as "" | ObsProduct),
                        obsUnits: val === "Observability & Monitoring" ? prev.obsUnits : "",
                      }))
                    }}
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

                <div className="w-full max-w-sm">
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

                <div className="w-full max-w-sm">
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

                {/* Users/Licenses or Observability Units */}
                {currentContract.category !== "Observability & Monitoring" ? (
                  <div className="w-full max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Users/Licenses</label>
                    <input
                      type="number"
                      value={currentContract.users}
                      onChange={(e) => setCurrentContract({ ...currentContract, users: e.target.value })}
                      placeholder="50"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-full max-w-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Observability Product</label>
                      <select
                        value={currentContract.obsProduct || ""}
                        onChange={(e) =>
                          setCurrentContract((prev) => ({ ...prev, obsProduct: e.target.value as ObsProduct }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {Object.keys(OBS_PRODUCTS).map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full max-w-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Units ({currentContract.obsProduct ? OBS_PRODUCTS[currentContract.obsProduct].unit : "units"})
                      </label>
                      <input
                        type="number"
                        value={currentContract.obsUnits}
                        onChange={(e) => setCurrentContract((prev) => ({ ...prev, obsUnits: e.target.value }))}
                        placeholder={currentContract.obsProduct === "Real user monitoring" ? "100000" : "720"}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter total units for the contract term (e.g., sessions or host-hours).
                      </p>
                    </div>
                  </>
                )}

                <div className="w-full max-w-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Contract Value</label>
                  <input
                    type="number"
                    value={currentContract.totalValue}
                    onChange={(e) => setCurrentContract({ ...currentContract, totalValue: e.target.value })}
                    placeholder="60000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="w-full max-w-sm flex items-end">
                  <button
                    onClick={addContract}
                    disabled={
                      !currentContract.vendor ||
                      !currentContract.totalValue ||
                      (currentContract.category === "Observability & Monitoring"
                        ? !currentContract.obsUnits
                        : !currentContract.users) ||
                      (currentContract.category === "Observability & Monitoring"
                        ? Number.parseFloat(currentContract.obsUnits || "0") <= 0
                        : Number.parseInt(currentContract.users || "0") <= 0) ||
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
                            <Users size={14} />{" "}
                            {contract.category === "Observability & Monitoring"
                              ? `${contract.obsUnits || 0} ${contract.unitLabel}`
                              : `${contract.users} users`}
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
                        const volume =
                          contract.category === "Observability & Monitoring"
                            ? Number.parseFloat(contract.obsUnits || "0") || 0
                            : Number.parseInt(contract.users || "0") || 0
                        const annualImpact = Math.round((yourPrice - targetMid) * volume * 12)

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
                                <div className="text-sm text-gray-500">
                                  {volume} {contract.unitLabel}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium">${yourPrice.toFixed(0)}</div>
                              <div className="text-xs text-gray-500">per {contract.unitLabel || "user"} / mo</div>
                            </td>
                            <td className="py-4 px-4">
                              <div>${sticker.toFixed(0)}</div>
                              <div className="text-xs text-gray-500">per {contract.unitLabel || "user"} / mo</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {discountRange[0].toFixed(0)}–{discountRange[1].toFixed(0)}%
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              ${Math.max(0, Math.round(minTarget)).toLocaleString()} – $
                              {Math.max(0, Math.round(maxTarget)).toLocaleString()}
                              <div className="text-xs text-gray-500">per {contract.unitLabel || "user"} / mo</div>
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

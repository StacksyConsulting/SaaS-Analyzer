"use client"
import { Jockey_One, Montserrat } from "next/font/google"
import SaaSContractAnalyzer from "@/components/saas-contract-analyzer"

const jockeyOne = Jockey_One({ subsets: ["latin"], weight: "400" })
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

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

export default function Page() {
  return (
    <main>
      <SaaSContractAnalyzer
        // Props are optional; defaults are provided inside the component
        backgroundImageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Grey%20Brick%20Wall_edited.jpg-bJrS3UIUrGhH3BOaX6OfOF4NbaYATE.jpeg"
        overlayOpacity={0.4}
        title="SaaS Stack Analyzer"
      />
    </main>
  )
}

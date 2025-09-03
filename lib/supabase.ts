import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      contract_analyses: {
        Row: {
          id: string
          contracts: any[]
          total_savings: number
          total_spend: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contracts: any[]
          total_savings?: number
          total_spend?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contracts?: any[]
          total_savings?: number
          total_spend?: number
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          category: string
          features: string[]
          avg_price_per_user: number
          market_position: "Premium" | "Standard" | "Budget"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          features?: string[]
          avg_price_per_user?: number
          market_position?: "Premium" | "Standard" | "Budget"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          features?: string[]
          avg_price_per_user?: number
          market_position?: "Premium" | "Standard" | "Budget"
          created_at?: string
          updated_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          session_token: string
          device_info: any
          created_at: string
          last_active: string
        }
        Insert: {
          id?: string
          session_token: string
          device_info?: any
          created_at?: string
          last_active?: string
        }
        Update: {
          id?: string
          session_token?: string
          device_info?: any
          created_at?: string
          last_active?: string
        }
      }
    }
  }
}

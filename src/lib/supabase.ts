import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'store_owner' | 'store_manager' | 'sales_staff' | 'accountant' | 'system_admin'
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role: 'store_owner' | 'store_manager' | 'sales_staff' | 'accountant' | 'system_admin'
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'store_owner' | 'store_manager' | 'sales_staff' | 'accountant' | 'system_admin'
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          sku: string
          description: string | null
          category_id: string
          price: number
          cost_price: number | null
          stock_quantity: number
          min_stock_level: number
          max_stock_level: number | null
          images: string[]
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          sku: string
          description?: string | null
          category_id: string
          price: number
          cost_price?: number | null
          stock_quantity: number
          min_stock_level: number
          max_stock_level?: number | null
          images?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          description?: string | null
          category_id?: string
          price?: number
          cost_price?: number | null
          stock_quantity?: number
          min_stock_level?: number
          max_stock_level?: number | null
          images?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      // Add more table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'store_owner' | 'store_manager' | 'sales_staff' | 'accountant' | 'system_admin'
      invoice_status: 'draft' | 'completed' | 'cancelled' | 'voided'
      payment_status: 'pending' | 'partial' | 'paid' | 'overdue'
      payment_method: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer' | 'card'
      employee_status: 'active' | 'inactive' | 'terminated'
      attendance_status: 'present' | 'absent' | 'late' | 'half_day'
      stock_movement_type: 'in' | 'out' | 'adjustment'
    }
  }
}
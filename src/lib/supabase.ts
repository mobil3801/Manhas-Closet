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
          role?: 'store_owner' | 'store_manager' | 'sales_staff' | 'accountant' | 'system_admin'
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
          stock_quantity?: number
          min_stock_level?: number
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
      product_variants: {
        Row: {
          id: string
          product_id: string
          size: string | null
          color: string | null
          material: string | null
          price_adjustment: number
          stock_quantity: number
          sku_suffix: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size?: string | null
          color?: string | null
          material?: string | null
          price_adjustment?: number
          stock_quantity?: number
          sku_suffix: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          size?: string | null
          color?: string | null
          material?: string | null
          price_adjustment?: number
          stock_quantity?: number
          sku_suffix?: string
          created_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          product_id: string
          variant_id: string | null
          movement_type: 'in' | 'out' | 'adjustment'
          quantity: number
          reason: string
          reference_id: string | null
          reference_type: string | null
          notes: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          product_id: string
          variant_id?: string | null
          movement_type: 'in' | 'out' | 'adjustment'
          quantity: number
          reason: string
          reference_id?: string | null
          reference_type?: string | null
          notes?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          product_id?: string
          variant_id?: string | null
          movement_type?: 'in' | 'out' | 'adjustment'
          quantity?: number
          reason?: string
          reference_id?: string | null
          reference_type?: string | null
          notes?: string | null
          created_at?: string
          created_by?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          customer_name: string
          customer_phone: string | null
          customer_email: string | null
          customer_address: string | null
          subtotal: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          status: 'draft' | 'completed' | 'cancelled' | 'voided'
          payment_status: 'pending' | 'partial' | 'paid' | 'overdue'
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          invoice_number: string
          customer_name: string
          customer_phone?: string | null
          customer_email?: string | null
          customer_address?: string | null
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total_amount: number
          status?: 'draft' | 'completed' | 'cancelled' | 'voided'
          payment_status?: 'pending' | 'partial' | 'paid' | 'overdue'
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          invoice_number?: string
          customer_name?: string
          customer_phone?: string | null
          customer_email?: string | null
          customer_address?: string | null
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          status?: 'draft' | 'completed' | 'cancelled' | 'voided'
          payment_status?: 'pending' | 'partial' | 'paid' | 'overdue'
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          unit_price: number
          discount_amount: number
          total_amount: number
        }
        Insert: {
          id?: string
          invoice_id: string
          product_id: string
          variant_id?: string | null
          quantity: number
          unit_price: number
          discount_amount?: number
          total_amount: number
        }
        Update: {
          id?: string
          invoice_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          unit_price?: number
          discount_amount?: number
          total_amount?: number
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string | null
          amount: number
          payment_method: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer' | 'card'
          payment_reference: string | null
          status: string
          notes: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          invoice_id?: string | null
          amount: number
          payment_method: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer' | 'card'
          payment_reference?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          invoice_id?: string | null
          amount?: number
          payment_method?: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer' | 'card'
          payment_reference?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          created_by?: string
        }
      }
      cash_registers: {
        Row: {
          id: string
          opening_amount: number
          closing_amount: number | null
          total_sales: number
          total_cash_in: number
          total_cash_out: number
          variance: number | null
          status: string
          opened_at: string
          closed_at: string | null
          opened_by: string
          closed_by: string | null
        }
        Insert: {
          id?: string
          opening_amount?: number
          closing_amount?: number | null
          total_sales?: number
          total_cash_in?: number
          total_cash_out?: number
          variance?: number | null
          status?: string
          opened_at?: string
          closed_at?: string | null
          opened_by: string
          closed_by?: string | null
        }
        Update: {
          id?: string
          opening_amount?: number
          closing_amount?: number | null
          total_sales?: number
          total_cash_in?: number
          total_cash_out?: number
          variance?: number | null
          status?: string
          opened_at?: string
          closed_at?: string | null
          opened_by?: string
          closed_by?: string | null
        }
      }
      employees: {
        Row: {
          id: string
          employee_id: string
          full_name: string
          email: string | null
          phone: string
          nid: string
          address: string
          position: string
          department: string
          hire_date: string
          salary: number
          status: 'active' | 'inactive' | 'terminated'
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          full_name: string
          email?: string | null
          phone: string
          nid: string
          address: string
          position: string
          department: string
          hire_date: string
          salary: number
          status?: 'active' | 'inactive' | 'terminated'
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          full_name?: string
          email?: string | null
          phone?: string
          nid?: string
          address?: string
          position?: string
          department?: string
          hire_date?: string
          salary?: number
          status?: 'active' | 'inactive' | 'terminated'
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employee_documents: {
        Row: {
          id: string
          employee_id: string
          document_type: string
          document_url: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          document_type: string
          document_url: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          document_type?: string
          document_url?: string
          uploaded_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          employee_id: string
          date: string
          check_in: string | null
          check_out: string | null
          break_start: string | null
          break_end: string | null
          total_hours: number | null
          overtime_hours: number | null
          status: 'present' | 'absent' | 'late' | 'half_day'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          date: string
          check_in?: string | null
          check_out?: string | null
          break_start?: string | null
          break_end?: string | null
          total_hours?: number | null
          overtime_hours?: number | null
          status?: 'present' | 'absent' | 'late' | 'half_day'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          date?: string
          check_in?: string | null
          check_out?: string | null
          break_start?: string | null
          break_end?: string | null
          total_hours?: number | null
          overtime_hours?: number | null
          status?: 'present' | 'absent' | 'late' | 'half_day'
          notes?: string | null
          created_at?: string
        }
      }
      salaries: {
        Row: {
          id: string
          employee_id: string
          month: number
          year: number
          base_salary: number
          overtime_amount: number
          bonus_amount: number
          deduction_amount: number
          net_salary: number
          status: 'draft' | 'approved' | 'paid'
          created_at: string
          approved_at: string | null
          paid_at: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          month: number
          year: number
          base_salary: number
          overtime_amount?: number
          bonus_amount?: number
          deduction_amount?: number
          net_salary: number
          status?: 'draft' | 'approved' | 'paid'
          created_at?: string
          approved_at?: string | null
          paid_at?: string | null
        }
        Update: {
          id?: string
          employee_id?: string
          month?: number
          year?: number
          base_salary?: number
          overtime_amount?: number
          bonus_amount?: number
          deduction_amount?: number
          net_salary?: number
          status?: 'draft' | 'approved' | 'paid'
          created_at?: string
          approved_at?: string | null
          paid_at?: string | null
        }
      }
      salary_deductions: {
        Row: {
          id: string
          salary_id: string
          type: 'advance' | 'loan' | 'tax' | 'insurance' | 'other'
          amount: number
          description: string
        }
        Insert: {
          id?: string
          salary_id: string
          type: 'advance' | 'loan' | 'tax' | 'insurance' | 'other'
          amount: number
          description: string
        }
        Update: {
          id?: string
          salary_id?: string
          type?: 'advance' | 'loan' | 'tax' | 'insurance' | 'other'
          amount?: number
          description?: string
        }
      }
      salary_bonuses: {
        Row: {
          id: string
          salary_id: string
          type: 'performance' | 'festival' | 'overtime' | 'other'
          amount: number
          description: string
        }
        Insert: {
          id?: string
          salary_id: string
          type: 'performance' | 'festival' | 'overtime' | 'other'
          amount: number
          description: string
        }
        Update: {
          id?: string
          salary_id?: string
          type?: 'performance' | 'festival' | 'overtime' | 'other'
          amount?: number
          description?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          table_name: string
          record_id: string
          action: string
          old_values: any | null
          new_values: any | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          action: string
          old_values?: any | null
          new_values?: any | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string
          action?: string
          old_values?: any | null
          new_values?: any | null
          user_id?: string | null
          created_at?: string
        }
      }
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
      salary_status: 'draft' | 'approved' | 'paid'
      deduction_type: 'advance' | 'loan' | 'tax' | 'insurance' | 'other'
      bonus_type: 'performance' | 'festival' | 'overtime' | 'other'
    }
  }
}
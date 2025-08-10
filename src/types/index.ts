// User and Authentication Types
export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  phone?: string
  created_at: string
  updated_at: string
  last_login?: string
  is_active: boolean
}

export type UserRole = 'store_owner' | 'store_manager' | 'sales_staff' | 'accountant' | 'system_admin'

export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  error: string | null
}

// Product and Inventory Types
export interface Product {
  id: string
  name: string
  sku: string
  description?: string
  category_id: string
  category?: Category
  price: number
  cost_price?: number
  stock_quantity: number
  min_stock_level: number
  max_stock_level?: number
  images: string[]
  variants: ProductVariant[]
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
}

export interface ProductVariant {
  id: string
  product_id: string
  size?: string
  color?: string
  material?: string
  price_adjustment: number
  stock_quantity: number
  sku_suffix: string
}

export interface Category {
  id: string
  name: string
  description?: string
  parent_id?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export interface StockMovement {
  id: string
  product_id: string
  product?: Product
  variant_id?: string
  movement_type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  reference_id?: string
  reference_type?: 'sale' | 'purchase' | 'adjustment' | 'return'
  notes?: string
  created_at: string
  created_by: string
}

// Invoice and Sales Types
export interface Invoice {
  id: string
  invoice_number: string
  customer_name: string
  customer_phone?: string
  customer_email?: string
  customer_address?: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  status: InvoiceStatus
  payment_status: PaymentStatus
  items: InvoiceItem[]
  payments: Payment[]
  notes?: string
  created_at: string
  created_by: string
  updated_at: string
}

export type InvoiceStatus = 'draft' | 'completed' | 'cancelled' | 'voided'
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue'

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id: string
  product?: Product
  variant_id?: string
  variant?: ProductVariant
  quantity: number
  unit_price: number
  discount_amount: number
  total_amount: number
}

// Payment Types
export interface Payment {
  id: string
  invoice_id?: string
  amount: number
  payment_method: PaymentMethod
  payment_reference?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  notes?: string
  created_at: string
  created_by: string
}

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer' | 'card'

export interface CashRegister {
  id: string
  opening_amount: number
  closing_amount?: number
  total_sales: number
  total_cash_in: number
  total_cash_out: number
  variance?: number
  status: 'open' | 'closed'
  opened_at: string
  closed_at?: string
  opened_by: string
  closed_by?: string
}

// Employee Types
export interface Employee {
  id: string
  employee_id: string
  full_name: string
  email?: string
  phone: string
  nid: string
  address: string
  position: string
  department: string
  hire_date: string
  salary: number
  status: 'active' | 'inactive' | 'terminated'
  emergency_contact_name?: string
  emergency_contact_phone?: string
  photo_url?: string
  documents: EmployeeDocument[]
  created_at: string
  updated_at: string
}

export interface EmployeeDocument {
  id: string
  employee_id: string
  document_type: string
  document_url: string
  uploaded_at: string
}

export interface Attendance {
  id: string
  employee_id: string
  employee?: Employee
  date: string
  check_in: string
  check_out?: string
  break_start?: string
  break_end?: string
  total_hours?: number
  overtime_hours?: number
  status: 'present' | 'absent' | 'late' | 'half_day'
  notes?: string
  created_at: string
}

// Salary and Payroll Types
export interface Salary {
  id: string
  employee_id: string
  employee?: Employee
  month: string
  year: number
  base_salary: number
  overtime_amount: number
  bonus_amount: number
  deduction_amount: number
  net_salary: number
  status: 'draft' | 'approved' | 'paid'
  deductions: SalaryDeduction[]
  bonuses: SalaryBonus[]
  created_at: string
  approved_at?: string
  paid_at?: string
}

export interface SalaryDeduction {
  id: string
  salary_id: string
  type: 'advance' | 'loan' | 'tax' | 'insurance' | 'other'
  amount: number
  description: string
}

export interface SalaryBonus {
  id: string
  salary_id: string
  type: 'performance' | 'festival' | 'overtime' | 'other'
  amount: number
  description: string
}

// Report Types
export interface SalesReport {
  period: string
  total_sales: number
  total_transactions: number
  average_transaction: number
  top_products: ProductSalesData[]
  sales_by_category: CategorySalesData[]
  sales_by_staff: StaffSalesData[]
  daily_sales: DailySalesData[]
}

export interface ProductSalesData {
  product_id: string
  product_name: string
  quantity_sold: number
  total_revenue: number
}

export interface CategorySalesData {
  category_id: string
  category_name: string
  total_revenue: number
  percentage: number
}

export interface StaffSalesData {
  staff_id: string
  staff_name: string
  total_sales: number
  transaction_count: number
}

export interface DailySalesData {
  date: string
  total_sales: number
  transaction_count: number
}

export interface InventoryReport {
  total_products: number
  total_value: number
  low_stock_items: Product[]
  out_of_stock_items: Product[]
  top_selling_products: ProductSalesData[]
  slow_moving_products: Product[]
}

// Common Types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface ProductForm {
  name: string
  description?: string
  category_id: string
  price: number
  cost_price?: number
  stock_quantity: number
  min_stock_level: number
  max_stock_level?: number
  images: File[]
}

export interface InvoiceForm {
  customer_name: string
  customer_phone?: string
  customer_email?: string
  customer_address?: string
  items: InvoiceItemForm[]
  discount_amount?: number
  notes?: string
}

export interface InvoiceItemForm {
  product_id: string
  variant_id?: string
  quantity: number
  unit_price: number
  discount_amount?: number
}

export interface EmployeeForm {
  full_name: string
  email?: string
  phone: string
  nid: string
  address: string
  position: string
  department: string
  hire_date: string
  salary: number
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

// Store State Types
export interface AppState {
  auth: AuthState
  products: ProductState
  invoices: InvoiceState
  employees: EmployeeState
  ui: UIState
}

export interface ProductState {
  products: Product[]
  categories: Category[]
  loading: boolean
  error: string | null
  selectedProduct: Product | null
}

export interface InvoiceState {
  invoices: Invoice[]
  currentInvoice: Invoice | null
  loading: boolean
  error: string | null
}

export interface EmployeeState {
  employees: Employee[]
  attendance: Attendance[]
  salaries: Salary[]
  loading: boolean
  error: string | null
}

export interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
}
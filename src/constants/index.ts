// User Roles
export const USER_ROLES = {
  STORE_OWNER: 'store_owner',
  STORE_MANAGER: 'store_manager',
  SALES_STAFF: 'sales_staff',
  ACCOUNTANT: 'accountant',
  SYSTEM_ADMIN: 'system_admin',
} as const

export const ROLE_LABELS = {
  [USER_ROLES.STORE_OWNER]: 'Store Owner',
  [USER_ROLES.STORE_MANAGER]: 'Store Manager',
  [USER_ROLES.SALES_STAFF]: 'Sales Staff',
  [USER_ROLES.ACCOUNTANT]: 'Accountant',
  [USER_ROLES.SYSTEM_ADMIN]: 'System Admin',
} as const

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  BKASH: 'bkash',
  NAGAD: 'nagad',
  ROCKET: 'rocket',
  BANK_TRANSFER: 'bank_transfer',
  CARD: 'card',
} as const

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Cash',
  [PAYMENT_METHODS.BKASH]: 'bKash',
  [PAYMENT_METHODS.NAGAD]: 'Nagad',
  [PAYMENT_METHODS.ROCKET]: 'Rocket',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHODS.CARD]: 'Card',
} as const

// Invoice Status
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  VOIDED: 'voided',
} as const

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: 'Draft',
  [INVOICE_STATUS.COMPLETED]: 'Completed',
  [INVOICE_STATUS.CANCELLED]: 'Cancelled',
  [INVOICE_STATUS.VOIDED]: 'Voided',
} as const

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
} as const

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.PARTIAL]: 'Partial',
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.OVERDUE]: 'Overdue',
} as const

// Employee Status
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TERMINATED: 'terminated',
} as const

export const EMPLOYEE_STATUS_LABELS = {
  [EMPLOYEE_STATUS.ACTIVE]: 'Active',
  [EMPLOYEE_STATUS.INACTIVE]: 'Inactive',
  [EMPLOYEE_STATUS.TERMINATED]: 'Terminated',
} as const

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
} as const

export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.HALF_DAY]: 'Half Day',
} as const

// Stock Movement Types
export const STOCK_MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
  ADJUSTMENT: 'adjustment',
} as const

export const STOCK_MOVEMENT_LABELS = {
  [STOCK_MOVEMENT_TYPES.IN]: 'Stock In',
  [STOCK_MOVEMENT_TYPES.OUT]: 'Stock Out',
  [STOCK_MOVEMENT_TYPES.ADJUSTMENT]: 'Adjustment',
} as const

// Product Categories (Default)
export const DEFAULT_CATEGORIES = [
  'Sarees',
  'Salwar Kameez',
  'Kurtis',
  'Lehengas',
  'Blouses',
  'Dupattas',
  'Accessories',
  'Jewelry',
  'Bags',
  'Footwear',
] as const

// Departments
export const DEPARTMENTS = [
  'Sales',
  'Inventory',
  'Accounting',
  'Management',
  'Customer Service',
  'Security',
] as const

// Positions
export const POSITIONS = [
  'Store Manager',
  'Assistant Manager',
  'Sales Associate',
  'Cashier',
  'Inventory Clerk',
  'Accountant',
  'Security Guard',
  'Cleaner',
] as const

// Salary Deduction Types
export const DEDUCTION_TYPES = {
  ADVANCE: 'advance',
  LOAN: 'loan',
  TAX: 'tax',
  INSURANCE: 'insurance',
  OTHER: 'other',
} as const

export const DEDUCTION_TYPE_LABELS = {
  [DEDUCTION_TYPES.ADVANCE]: 'Advance Payment',
  [DEDUCTION_TYPES.LOAN]: 'Loan Deduction',
  [DEDUCTION_TYPES.TAX]: 'Tax Deduction',
  [DEDUCTION_TYPES.INSURANCE]: 'Insurance',
  [DEDUCTION_TYPES.OTHER]: 'Other',
} as const

// Salary Bonus Types
export const BONUS_TYPES = {
  PERFORMANCE: 'performance',
  FESTIVAL: 'festival',
  OVERTIME: 'overtime',
  OTHER: 'other',
} as const

export const BONUS_TYPE_LABELS = {
  [BONUS_TYPES.PERFORMANCE]: 'Performance Bonus',
  [BONUS_TYPES.FESTIVAL]: 'Festival Bonus',
  [BONUS_TYPES.OVERTIME]: 'Overtime Payment',
  [BONUS_TYPES.OTHER]: 'Other',
} as const

// Application Settings
export const APP_CONFIG = {
  APP_NAME: 'Manhas Closet',
  COMPANY_NAME: 'Manhas Closet',
  CURRENCY: 'BDT',
  CURRENCY_SYMBOL: '৳',
  TAX_RATE: 0.15, // 15% VAT
  TIMEZONE: 'Asia/Dhaka',
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
  PAGINATION_LIMIT: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
} as const

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  INVENTORY: '/inventory',
  PRODUCTS: '/inventory/products',
  CATEGORIES: '/inventory/categories',
  STOCK_MOVEMENTS: '/inventory/movements',
  INVOICING: '/invoicing',
  INVOICES: '/invoicing/invoices',
  NEW_INVOICE: '/invoicing/new',
  PAYMENTS: '/payments',
  CASH_REGISTER: '/payments/cash-register',
  EMPLOYEES: '/employees',
  EMPLOYEE_LIST: '/employees/list',
  ATTENDANCE: '/employees/attendance',
  PAYROLL: '/payroll',
  SALARY_MANAGEMENT: '/payroll/salaries',
  REPORTS: '/reports',
  SALES_REPORTS: '/reports/sales',
  INVENTORY_REPORTS: '/reports/inventory',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const

// Permissions by Role
export const ROLE_PERMISSIONS = {
  [USER_ROLES.STORE_OWNER]: [
    'view_dashboard',
    'manage_users',
    'manage_inventory',
    'manage_invoices',
    'manage_payments',
    'manage_employees',
    'manage_payroll',
    'view_reports',
    'manage_settings',
  ],
  [USER_ROLES.STORE_MANAGER]: [
    'view_dashboard',
    'manage_inventory',
    'manage_invoices',
    'manage_payments',
    'manage_employees',
    'view_reports',
  ],
  [USER_ROLES.SALES_STAFF]: [
    'view_dashboard',
    'view_inventory',
    'manage_invoices',
    'manage_payments',
  ],
  [USER_ROLES.ACCOUNTANT]: [
    'view_dashboard',
    'view_inventory',
    'view_invoices',
    'view_payments',
    'manage_payroll',
    'view_reports',
  ],
  [USER_ROLES.SYSTEM_ADMIN]: [
    'view_dashboard',
    'manage_users',
    'manage_inventory',
    'manage_invoices',
    'manage_payments',
    'manage_employees',
    'manage_payroll',
    'view_reports',
    'manage_settings',
    'system_admin',
  ],
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'manhas_auth_token',
  USER_PREFERENCES: 'manhas_user_preferences',
  CART_ITEMS: 'manhas_cart_items',
  THEME: 'manhas_theme',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: '/products',
    DELETE: '/products',
    UPLOAD_IMAGE: '/products/upload-image',
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    UPDATE: '/categories',
    DELETE: '/categories',
  },
  INVOICES: {
    LIST: '/invoices',
    CREATE: '/invoices',
    UPDATE: '/invoices',
    DELETE: '/invoices',
    GENERATE_PDF: '/invoices/pdf',
  },
  PAYMENTS: {
    LIST: '/payments',
    CREATE: '/payments',
    UPDATE: '/payments',
  },
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    UPDATE: '/employees',
    DELETE: '/employees',
  },
  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    FINANCIAL: '/reports/financial',
  },
} as const
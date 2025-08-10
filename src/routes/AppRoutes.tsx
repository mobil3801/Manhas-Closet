import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { ROUTES } from '@/constants'

// Layout Components
import AuthLayout from '@/components/layout/AuthLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'

// Dashboard Pages
import DashboardPage from '@/pages/dashboard/DashboardPage'

// Inventory Pages
import InventoryPage from '@/pages/inventory/InventoryPage'
import ProductsPage from '@/pages/inventory/ProductsPage'
import CategoriesPage from '@/pages/inventory/CategoriesPage'
import StockMovementsPage from '@/pages/inventory/StockMovementsPage'

// Invoicing Pages
import InvoicingPage from '@/pages/invoicing/InvoicingPage'
import InvoicesPage from '@/pages/invoicing/InvoicesPage'
import NewInvoicePage from '@/pages/invoicing/NewInvoicePage'
import InvoiceDetailsPage from '@/pages/invoicing/InvoiceDetailsPage'

// Payment Pages
import PaymentsPage from '@/pages/payments/PaymentsPage'
import CashRegisterPage from '@/pages/payments/CashRegisterPage'

// Employee Pages
import EmployeesPage from '@/pages/employees/EmployeesPage'
import EmployeeListPage from '@/pages/employees/EmployeeListPage'
import AttendancePage from '@/pages/employees/AttendancePage'

// Payroll Pages
import PayrollPage from '@/pages/payroll/PayrollPage'
import SalaryManagementPage from '@/pages/payroll/SalaryManagementPage'

// Reports Pages
import ReportsPage from '@/pages/reports/ReportsPage'
import SalesReportsPage from '@/pages/reports/SalesReportsPage'
import InventoryReportsPage from '@/pages/reports/InventoryReportsPage'

// Settings Pages
import SettingsPage from '@/pages/settings/SettingsPage'
import ProfilePage from '@/pages/profile/ProfilePage'

// Protected Route Components
import ProtectedRoute from './ProtectedRoute'
import RoleBasedRoute from './RoleBasedRoute'

// 404 Page
import NotFoundPage from '@/pages/NotFoundPage'

const AppRoutes = () => {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={
        user ? <Navigate to={ROUTES.DASHBOARD} replace /> : 
        <AuthLayout><LoginPage /></AuthLayout>
      } />
      
      <Route path="/register" element={
        user ? <Navigate to={ROUTES.DASHBOARD} replace /> : 
        <AuthLayout><RegisterPage /></AuthLayout>
      } />
      
      <Route path="/forgot-password" element={
        user ? <Navigate to={ROUTES.DASHBOARD} replace /> : 
        <AuthLayout><ForgotPasswordPage /></AuthLayout>
      } />
      
      <Route path="/reset-password" element={
        user ? <Navigate to={ROUTES.DASHBOARD} replace /> : 
        <AuthLayout><ResetPasswordPage /></AuthLayout>
      } />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        } />

        {/* Inventory Management */}
        <Route path="inventory" element={
          <RoleBasedRoute allowedRoles={['store_owner', 'store_manager', 'sales_staff', 'system_admin']}>
            <DashboardLayout>
              <InventoryPage />
            </DashboardLayout>
          </RoleBasedRoute>
        }>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={
            <RoleBasedRoute allowedRoles={['store_owner', 'store_manager', 'system_admin']}>
              <CategoriesPage />
            </RoleBasedRoute>
          } />
          <Route path="movements" element={
            <RoleBasedRoute allowedRoles={['store_owner', 'store_manager', 'system_admin']}>
              <StockMovementsPage />
            </RoleBasedRoute>
          } />
        </Route>

        {/* Invoicing */}
        <Route path="invoicing" element={
          <RoleBasedRoute allowedRoles={['store_owner', 'store_manager', 'sales_staff', 'system_admin']}>
            <DashboardLayout>
              <InvoicingPage />
            </DashboardLayout>
          </RoleBasedRoute>
        }>
          <Route index element={<Navigate to="invoices" replace />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="new" element={<NewInvoicePage />} />
          <Route path="invoices/:id" element={<InvoiceDetailsPage />} />
        </Route>

        {/* Payments */}
        <Route path="payments" element={
          <RoleBasedRoute allowedRoles={['store_owner', 'store_manager', 'sales_staff', 'accountant', 'system_admin']}>
            <DashboardLayout>
              <PaymentsPage />
            </DashboardLayout>
          </RoleBasedRoute>
        } />
        
        <Route path="payments/cash-register" element={
          <RoleBasedRoute allowedRoles={['store_owner', 'store_manager', 'sales_staff', 'system_admin']}>
            <DashboardLayout>
              <CashRegisterPage />
            </DashboardLayout>
          </RoleBasedRoute>
        } />

        {/* Employee Management */}
        <Route path="employees" element={
          <RoleBasedRoute allowedRoles={['store_owner', 'store_manager', 'accountant', 'system_admin']}>
            <DashboardLayout>
              <EmployeesPage />
            </DashboardLayout>
          </RoleBasedRoute>
        }>
          <Route index element={<Navigate to="list" replace />} />
          <Route path="list" element={<EmployeeListPage />} />
          <Route path="attendance" element={<AttendancePage />} />
        </Route>

        {/* Payroll */}
        <Route path="payroll" element={
          <RoleBasedRoute allowedRoles={['store_owner', 'accountant', 'system_admin']}>
            <DashboardLayout>
              <PayrollPage />
            </DashboardLayout>
          </RoleBasedRoute>
        }>
          <Route index element={<Navigate to="salaries" replace />} />
          <Route path="salaries" element={<SalaryManagementPage />} />
        </Route>

        {/* Reports */}
        <Route path="reports" element={
          <RoleBasedRoute allowedRoles={['store_owner', 'store_manager', 'accountant', 'system_admin']}>
            <DashboardLayout>
              <ReportsPage />
            </DashboardLayout>
          </RoleBasedRoute>
        }>
          <Route index element={<Navigate to="sales" replace />} />
          <Route path="sales" element={<SalesReportsPage />} />
          <Route path="inventory" element={<InventoryReportsPage />} />
        </Route>

        {/* Settings */}
        <Route path="settings" element={
          <RoleBasedRoute allowedRoles={['store_owner', 'system_admin']}>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </RoleBasedRoute>
        } />

        {/* Profile */}
        <Route path="profile" element={
          <DashboardLayout>
            <ProfilePage />
          </DashboardLayout>
        } />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
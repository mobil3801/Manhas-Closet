import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

// Layout Components
import AuthLayout from '../components/layout/AuthLayout'
import DashboardLayout from '../components/layout/DashboardLayout'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

// Dashboard Pages
import DashboardPage from '../pages/dashboard/DashboardPage'

// Inventory Pages
import InventoryPage from '../pages/inventory/InventoryPage'
import ProductsPage from '../pages/inventory/ProductsPage'
import CategoriesPage from '../pages/inventory/CategoriesPage'
import StockMovementsPage from '../pages/inventory/StockMovementsPage'

// Invoicing Pages
import InvoicingPage from '../pages/invoicing/InvoicingPage'
import InvoicesPage from '../pages/invoicing/InvoicesPage'
import NewInvoicePage from '../pages/invoicing/NewInvoicePage'
import InvoiceDetailsPage from '../pages/invoicing/InvoiceDetailsPage'

// Payment Pages
import PaymentsPage from '../pages/payments/PaymentsPage'
import CashRegisterPage from '../pages/payments/CashRegisterPage'

// Employee Pages
import EmployeesPage from '../pages/employees/EmployeesPage'
import EmployeeListPage from '../pages/employees/EmployeeListPage'
import AttendancePage from '../pages/employees/AttendancePage'

// Payroll Pages
import PayrollPage from '../pages/payroll/PayrollPage'
import SalaryManagementPage from '../pages/payroll/SalaryManagementPage'

// Reports Pages
import ReportsPage from '../pages/reports/ReportsPage'
import SalesReportsPage from '../pages/reports/SalesReportsPage'
import InventoryReportsPage from '../pages/reports/InventoryReportsPage'

// Settings Pages
import SettingsPage from '../pages/SettingsPage'
import ProfilePage from '../pages/ProfilePage'

// Protected Route Components
import ProtectedRoute from './ProtectedRoute'
import RoleBasedRoute from './RoleBasedRoute'

// 404 Page
import NotFoundPage from '../pages/NotFoundPage'

const AppRoutes = () => {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        user ? <Navigate to="/dashboard" replace /> : 
        <AuthLayout><LoginPage /></AuthLayout>
      } />
      
      <Route path="/register" element={
        user ? <Navigate to="/dashboard" replace /> : 
        <AuthLayout><RegisterPage /></AuthLayout>
      } />
      
      <Route path="/forgot-password" element={
        user ? <Navigate to="/dashboard" replace /> : 
        <AuthLayout><ForgotPasswordPage /></AuthLayout>
      } />
      
      <Route path="/reset-password" element={
        user ? <Navigate to="/dashboard" replace /> : 
        <AuthLayout><ResetPasswordPage /></AuthLayout>
      } />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        } />

        {/* Inventory Management */}
        <Route path="inventory" element={
          <DashboardLayout>
            <InventoryPage />
          </DashboardLayout>
        } />
        <Route path="inventory/products" element={
          <DashboardLayout>
            <ProductsPage />
          </DashboardLayout>
        } />
        <Route path="inventory/categories" element={
          <DashboardLayout>
            <CategoriesPage />
          </DashboardLayout>
        } />
        <Route path="inventory/stock-movements" element={
          <DashboardLayout>
            <StockMovementsPage />
          </DashboardLayout>
        } />

        {/* Invoicing */}
        <Route path="invoicing" element={
          <DashboardLayout>
            <InvoicingPage />
          </DashboardLayout>
        } />
        <Route path="invoicing/invoices" element={
          <DashboardLayout>
            <InvoicesPage />
          </DashboardLayout>
        } />
        <Route path="invoicing/new" element={
          <DashboardLayout>
            <NewInvoicePage />
          </DashboardLayout>
        } />
        <Route path="invoicing/invoices/:id" element={
          <DashboardLayout>
            <InvoiceDetailsPage />
          </DashboardLayout>
        } />

        {/* Payments */}
        <Route path="payments" element={
          <DashboardLayout>
            <PaymentsPage />
          </DashboardLayout>
        } />
        
        <Route path="payments/cash-register" element={
          <DashboardLayout>
            <CashRegisterPage />
          </DashboardLayout>
        } />

        {/* Employee Management */}
        <Route path="employees" element={
          <DashboardLayout>
            <EmployeesPage />
          </DashboardLayout>
        } />
        <Route path="employees/list" element={
          <DashboardLayout>
            <EmployeeListPage />
          </DashboardLayout>
        } />
        <Route path="employees/attendance" element={
          <DashboardLayout>
            <AttendancePage />
          </DashboardLayout>
        } />

        {/* Payroll */}
        <Route path="payroll" element={
          <DashboardLayout>
            <PayrollPage />
          </DashboardLayout>
        } />
        <Route path="payroll/salary" element={
          <DashboardLayout>
            <SalaryManagementPage />
          </DashboardLayout>
        } />

        {/* Reports */}
        <Route path="reports" element={
          <DashboardLayout>
            <ReportsPage />
          </DashboardLayout>
        } />
        <Route path="reports/sales" element={
          <DashboardLayout>
            <SalesReportsPage />
          </DashboardLayout>
        } />
        <Route path="reports/inventory" element={
          <DashboardLayout>
            <InventoryReportsPage />
          </DashboardLayout>
        } />

        {/* Settings */}
        <Route path="settings" element={
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
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

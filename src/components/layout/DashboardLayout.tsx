import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import useRoleBasedAccess from '../../hooks/useRoleBasedAccess'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChartBarIcon,
  CogIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { 
    hasModuleAccess, 
    userRole, 
    isAdmin, 
    isManager,
    canRead 
  } = useRoleBasedAccess()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Navigation items with role-based filtering
  const allNavigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      module: 'dashboard'
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: CubeIcon,
      module: 'inventory',
      children: [
        { name: 'Overview', href: '/inventory' },
        { name: 'Products', href: '/inventory/products' },
        { name: 'Categories', href: '/inventory/categories' },
        { name: 'Stock Movements', href: '/inventory/stock-movements' }
      ]
    },
    {
      name: 'Invoicing',
      href: '/invoicing',
      icon: DocumentTextIcon,
      module: 'invoicing',
      children: [
        { name: 'Overview', href: '/invoicing' },
        { name: 'All Invoices', href: '/invoicing/invoices' },
        { name: 'New Invoice', href: '/invoicing/new' }
      ]
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: CreditCardIcon,
      module: 'payments',
      children: [
        { name: 'All Payments', href: '/payments' },
        { name: 'Cash Register', href: '/payments/cash-register' }
      ]
    },
    {
      name: 'Employees',
      href: '/employees',
      icon: UserGroupIcon,
      module: 'employees',
      adminOnly: true,
      children: [
        { name: 'Overview', href: '/employees' },
        { name: 'Employee List', href: '/employees/list' },
        { name: 'Attendance', href: '/employees/attendance' }
      ]
    },
    {
      name: 'Payroll',
      href: '/payroll',
      icon: BanknotesIcon,
      module: 'payroll',
      adminOnly: true,
      children: [
        { name: 'Overview', href: '/payroll' },
        { name: 'Salary Management', href: '/payroll/salary' }
      ]
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: ChartBarIcon,
      module: 'reports',
      managerOnly: true,
      children: [
        { name: 'Overview', href: '/reports' },
        { name: 'Sales Reports', href: '/reports/sales' },
        { name: 'Inventory Reports', href: '/reports/inventory' }
      ]
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: CogIcon,
      module: 'settings',
      adminOnly: true
    }
  ]

  // Filter navigation items based on user permissions
  const navigationItems = allNavigationItems.filter(item => {
    // Check basic module access
    if (!hasModuleAccess(item.module)) {
      return false
    }

    // Check role-specific restrictions
    if (item.adminOnly && !isAdmin()) {
      return false
    }

    if (item.managerOnly && !isAdmin() && !isManager()) {
      return false
    }

    return true
  })

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrator',
      manager: 'Manager',
      employee: 'Employee',
      cashier: 'Cashier'
    }
    return roleNames[role as keyof typeof roleNames] || 'User'
  }

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      employee: 'bg-green-100 text-green-800',
      cashier: 'bg-yellow-100 text-yellow-800'
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent 
              navigationItems={navigationItems} 
              location={location} 
              user={user}
              userRole={userRole}
              getRoleDisplayName={getRoleDisplayName}
              getRoleBadgeColor={getRoleBadgeColor}
              handleSignOut={handleSignOut}
            />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent 
          navigationItems={navigationItems} 
          location={location} 
          user={user}
          userRole={userRole}
          getRoleDisplayName={getRoleDisplayName}
          getRoleBadgeColor={getRoleBadgeColor}
          handleSignOut={handleSignOut}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow">
          <div className="flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1 items-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  Manhas Closet
                </h1>
              </div>
              
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Role indicator */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(userRole)}`}>
                  <ShieldCheckIcon className="h-3 w-3 mr-1" />
                  {getRoleDisplayName(userRole)}
                </span>

                {/* User menu */}
                <div className="flex items-center gap-x-2">
                  <span className="text-sm text-gray-700">{user?.email}</span>
                  <Link
                    to="/profile"
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

// Sidebar content component
interface SidebarContentProps {
  navigationItems: any[]
  location: any
  user: any
  userRole: string
  getRoleDisplayName: (role: string) => string
  getRoleBadgeColor: (role: string) => string
  handleSignOut: () => void
}

const SidebarContent = ({ 
  navigationItems, 
  location, 
  user, 
  userRole,
  getRoleDisplayName,
  getRoleBadgeColor,
  handleSignOut 
}: SidebarContentProps) => (
  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
    {/* Logo */}
    <div className="flex h-16 shrink-0 items-center">
      <h1 className="text-xl font-bold text-gray-900">Manhas Closet</h1>
    </div>

    {/* User info */}
    <div className="border-b border-gray-200 pb-4">
      <div className="flex items-center">
        <UserCircleIcon className="h-8 w-8 text-gray-400" />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(userRole)}`}>
            {getRoleDisplayName(userRole)}
          </span>
        </div>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.children && item.children.some((child: any) => location.pathname === child.href))
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </Link>
                  
                  {/* Sub-navigation */}
                  {item.children && isActive && (
                    <ul className="mt-2 ml-8 space-y-1">
                      {item.children.map((child: any) => (
                        <li key={child.name}>
                          <Link
                            to={child.href}
                            className={`block py-1 text-sm ${
                              location.pathname === child.href
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-600 hover:text-blue-600'
                            }`}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </li>

        {/* Bottom section */}
        <li className="-mx-6 mt-auto">
          <div className="border-t border-gray-200 px-6 pt-4">
            <Link
              to="/profile"
              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              <UserCircleIcon className="h-6 w-6 shrink-0" />
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-600"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0" />
              Sign Out
            </button>
          </div>
        </li>
      </ul>
    </nav>
  </div>
)

export default DashboardLayout
import { ReactNode, useState, Fragment } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES, ROLE_PERMISSIONS } from '@/constants'
import { 
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UsersIcon,
  BanknotesIcon,
  ChartBarIcon,
  CogIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: location.pathname === '/dashboard' },
    { 
      name: 'Inventory', 
      icon: ShoppingBagIcon, 
      current: location.pathname.startsWith('/inventory'),
      children: [
        { name: 'Overview', href: '/inventory', current: location.pathname === '/inventory' },
        { name: 'Products', href: '/inventory/products', current: location.pathname === '/inventory/products' },
        { name: 'Categories', href: '/inventory/categories', current: location.pathname === '/inventory/categories' },
        { name: 'Stock Movements', href: '/inventory/movements', current: location.pathname === '/inventory/movements' },
      ]
    },
    { 
      name: 'Invoicing', 
      icon: DocumentTextIcon, 
      current: location.pathname.startsWith('/invoicing'),
      children: [
        { name: 'Overview', href: '/invoicing', current: location.pathname === '/invoicing' },
        { name: 'All Invoices', href: '/invoicing/invoices', current: location.pathname === '/invoicing/invoices' },
        { name: 'New Invoice', href: '/invoicing/new', current: location.pathname === '/invoicing/new' },
      ]
    },
    { 
      name: 'Payments', 
      icon: CreditCardIcon, 
      current: location.pathname.startsWith('/payments'),
      children: [
        { name: 'All Payments', href: '/payments', current: location.pathname === '/payments' },
        { name: 'Cash Register', href: '/payments/cash-register', current: location.pathname === '/payments/cash-register' },
      ]
    },
    { 
      name: 'Employees', 
      icon: UsersIcon, 
      current: location.pathname.startsWith('/employees'),
      children: [
        { name: 'Overview', href: '/employees', current: location.pathname === '/employees' },
        { name: 'Employee List', href: '/employees/list', current: location.pathname === '/employees/list' },
        { name: 'Attendance', href: '/employees/attendance', current: location.pathname === '/employees/attendance' },
      ]
    },
    { 
      name: 'Payroll', 
      icon: BanknotesIcon, 
      current: location.pathname.startsWith('/payroll'),
      children: [
        { name: 'Overview', href: '/payroll', current: location.pathname === '/payroll' },
        { name: 'Salary Management', href: '/payroll/salaries', current: location.pathname === '/payroll/salaries' },
      ]
    },
    { 
      name: 'Reports', 
      icon: ChartBarIcon, 
      current: location.pathname.startsWith('/reports'),
      children: [
        { name: 'Overview', href: '/reports', current: location.pathname === '/reports' },
        { name: 'Sales Reports', href: '/reports/sales', current: location.pathname === '/reports/sales' },
        { name: 'Inventory Reports', href: '/reports/inventory', current: location.pathname === '/reports/inventory' },
      ]
    },
    { name: 'Settings', href: '/settings', icon: CogIcon, current: location.pathname === '/settings' },
  ]

  const hasPermission = (permission: string) => {
    if (!user?.role) return false
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false
  }

  const NavigationItem = ({ item }: { item: any }) => {
    const [isOpen, setIsOpen] = useState(item.current)

    if (item.children) {
      return (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              item.current
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`mr-3 flex-shrink-0 h-6 w-6 ${
                item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}
              aria-hidden="true"
            />
            <span className="flex-1">{item.name}</span>
            <svg
              className={`ml-3 flex-shrink-0 h-5 w-5 transform transition-colors duration-150 ease-in-out ${
                isOpen ? 'rotate-90 text-gray-400' : 'text-gray-300'
              }`}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
            </svg>
          </button>
          {isOpen && (
            <div className="mt-1 space-y-1">
              {item.children.map((subItem: any) => (
                <Link
                  key={subItem.name}
                  to={subItem.href}
                  className={`group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium rounded-md ${
                    subItem.current
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        to={item.href}
        className={`group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md ${
          item.current
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <item.icon
          className={`mr-3 flex-shrink-0 h-6 w-6 ${
            item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
          }`}
          aria-hidden="true"
        />
        {item.name}
      </Link>
    )
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <h1 className="text-xl font-bold text-gray-900">Manhas Closet</h1>
      </div>
      <div className="mt-5 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavigationItem key={item.name} item={item} />
          ))}
        </nav>
      </div>
      
      {/* User menu */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
            <p className="text-xs text-gray-500">{user?.role?.replace('_', ' ').toUpperCase()}</p>
          </div>
          <div className="flex space-x-2">
            <Link
              to="/profile"
              className="text-gray-400 hover:text-gray-600"
              title="Profile"
            >
              <CogIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={signOut}
              className="text-gray-400 hover:text-gray-600"
              title="Sign out"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
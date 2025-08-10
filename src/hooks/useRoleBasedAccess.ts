import { useAuth } from '../contexts/AuthContext'

export type UserRole = 'admin' | 'manager' | 'employee' | 'cashier'

export interface Permission {
  module: string
  actions: string[]
}

// Define role permissions
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'inventory', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'invoicing', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'payments', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'employees', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'payroll', actions: ['create', 'read', 'update', 'delete'] },
    { module: 'reports', actions: ['read', 'export'] },
    { module: 'settings', actions: ['read', 'update'] },
    { module: 'profile', actions: ['read', 'update'] }
  ],
  manager: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'inventory', actions: ['create', 'read', 'update'] },
    { module: 'invoicing', actions: ['create', 'read', 'update'] },
    { module: 'payments', actions: ['read', 'update'] },
    { module: 'employees', actions: ['read', 'update'] },
    { module: 'payroll', actions: ['read', 'update'] },
    { module: 'reports', actions: ['read', 'export'] },
    { module: 'settings', actions: ['read'] },
    { module: 'profile', actions: ['read', 'update'] }
  ],
  employee: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'inventory', actions: ['read'] },
    { module: 'invoicing', actions: ['create', 'read'] },
    { module: 'payments', actions: ['read'] },
    { module: 'profile', actions: ['read', 'update'] }
  ],
  cashier: [
    { module: 'dashboard', actions: ['read'] },
    { module: 'inventory', actions: ['read'] },
    { module: 'invoicing', actions: ['create', 'read'] },
    { module: 'payments', actions: ['create', 'read'] },
    { module: 'profile', actions: ['read', 'update'] }
  ]
}

export const useRoleBasedAccess = () => {
  const { user } = useAuth()
  
  const userRole = (user?.role as UserRole) || 'employee'
  const userPermissions = ROLE_PERMISSIONS[userRole] || []

  const hasPermission = (module: string, action: string): boolean => {
    const modulePermission = userPermissions.find(p => p.module === module)
    return modulePermission ? modulePermission.actions.includes(action) : false
  }

  const hasAnyPermission = (module: string, actions: string[]): boolean => {
    return actions.some(action => hasPermission(module, action))
  }

  const hasModuleAccess = (module: string): boolean => {
    return userPermissions.some(p => p.module === module)
  }

  const canCreate = (module: string): boolean => hasPermission(module, 'create')
  const canRead = (module: string): boolean => hasPermission(module, 'read')
  const canUpdate = (module: string): boolean => hasPermission(module, 'update')
  const canDelete = (module: string): boolean => hasPermission(module, 'delete')
  const canExport = (module: string): boolean => hasPermission(module, 'export')

  const isAdmin = (): boolean => userRole === 'admin'
  const isManager = (): boolean => userRole === 'manager'
  const isEmployee = (): boolean => userRole === 'employee'
  const isCashier = (): boolean => userRole === 'cashier'

  const getAccessibleModules = (): string[] => {
    return userPermissions.map(p => p.module)
  }

  return {
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasModuleAccess,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canExport,
    isAdmin,
    isManager,
    isEmployee,
    isCashier,
    getAccessibleModules
  }
}

export default useRoleBasedAccess
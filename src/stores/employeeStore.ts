import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Employee, Attendance, Salary, EmployeeState } from '@/types'

interface EmployeeStore extends EmployeeState {
  // Actions
  fetchEmployees: (params?: { search?: string; status?: string; department?: string }) => Promise<void>
  createEmployee: (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => Promise<Employee>
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  fetchAttendance: (params?: { employeeId?: string; startDate?: string; endDate?: string }) => Promise<void>
  markAttendance: (attendance: Omit<Attendance, 'id' | 'created_at'>) => Promise<void>
  updateAttendance: (id: string, updates: Partial<Attendance>) => Promise<void>
  fetchSalaries: (params?: { employeeId?: string; month?: number; year?: number }) => Promise<void>
  processSalary: (salary: Omit<Salary, 'id' | 'created_at'>) => Promise<Salary>
  approveSalary: (id: string) => Promise<void>
  paySalary: (id: string) => Promise<void>
  generatePayslip: (salaryId: string) => Promise<Blob>
  getEmployeeAttendanceReport: (employeeId: string, month: number, year: number) => Promise<any>
  clearError: () => void
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  // Initial state
  employees: [],
  attendance: [],
  salaries: [],
  loading: false,
  error: null,

  // Actions
  fetchEmployees: async (params = {}) => {
    try {
      set({ loading: true, error: null })
      
      let query = supabase
        .from('employees')
        .select(`
          *,
          documents:employee_documents(*)
        `)
        .order('created_at', { ascending: false })

      // Apply search filter
      if (params.search) {
        query = query.or(`full_name.ilike.%${params.search}%,employee_id.ilike.%${params.search}%,email.ilike.%${params.search}%`)
      }

      // Apply status filter
      if (params.status) {
        query = query.eq('status', params.status)
      }

      // Apply department filter
      if (params.department) {
        query = query.eq('department', params.department)
      }

      const { data, error } = await query

      if (error) throw error

      set({
        employees: data || [],
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch employees',
      })
      throw error
    }
  },

  createEmployee: async (employeeData) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select(`
          *,
          documents:employee_documents(*)
        `)
        .single()

      if (error) throw error

      const { employees } = get()
      set({
        employees: [data, ...employees],
        loading: false,
        error: null,
      })

      return data
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to create employee',
      })
      throw error
    }
  },

  updateEmployee: async (id: string, updates: Partial<Employee>) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          documents:employee_documents(*)
        `)
        .single()

      if (error) throw error

      const { employees } = get()
      set({
        employees: employees.map(emp => emp.id === id ? data : emp),
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to update employee',
      })
      throw error
    }
  },

  deleteEmployee: async (id: string) => {
    try {
      set({ loading: true, error: null })

      const { error } = await supabase
        .from('employees')
        .update({ status: 'terminated' })
        .eq('id', id)

      if (error) throw error

      const { employees } = get()
      set({
        employees: employees.map(emp => emp.id === id ? { ...emp, status: 'terminated' } : emp),
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to delete employee',
      })
      throw error
    }
  },

  fetchAttendance: async (params = {}) => {
    try {
      set({ loading: true, error: null })
      
      let query = supabase
        .from('attendance')
        .select(`
          *,
          employee:employees(full_name, employee_id)
        `)
        .order('date', { ascending: false })

      // Apply employee filter
      if (params.employeeId) {
        query = query.eq('employee_id', params.employeeId)
      }

      // Apply date range filter
      if (params.startDate) {
        query = query.gte('date', params.startDate)
      }
      if (params.endDate) {
        query = query.lte('date', params.endDate)
      }

      const { data, error } = await query

      if (error) throw error

      set({
        attendance: data || [],
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch attendance',
      })
      throw error
    }
  },

  markAttendance: async (attendanceData) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('attendance')
        .insert([attendanceData])
        .select(`
          *,
          employee:employees(full_name, employee_id)
        `)
        .single()

      if (error) throw error

      const { attendance } = get()
      set({
        attendance: [data, ...attendance],
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to mark attendance',
      })
      throw error
    }
  },

  updateAttendance: async (id: string, updates: Partial<Attendance>) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          employee:employees(full_name, employee_id)
        `)
        .single()

      if (error) throw error

      const { attendance } = get()
      set({
        attendance: attendance.map(att => att.id === id ? data : att),
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to update attendance',
      })
      throw error
    }
  },

  fetchSalaries: async (params = {}) => {
    try {
      set({ loading: true, error: null })
      
      let query = supabase
        .from('salaries')
        .select(`
          *,
          employee:employees(full_name, employee_id),
          deductions:salary_deductions(*),
          bonuses:salary_bonuses(*)
        `)
        .order('created_at', { ascending: false })

      // Apply employee filter
      if (params.employeeId) {
        query = query.eq('employee_id', params.employeeId)
      }

      // Apply month filter
      if (params.month) {
        query = query.eq('month', params.month)
      }

      // Apply year filter
      if (params.year) {
        query = query.eq('year', params.year)
      }

      const { data, error } = await query

      if (error) throw error

      set({
        salaries: data || [],
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to fetch salaries',
      })
      throw error
    }
  },

  processSalary: async (salaryData) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('salaries')
        .insert([salaryData])
        .select(`
          *,
          employee:employees(full_name, employee_id),
          deductions:salary_deductions(*),
          bonuses:salary_bonuses(*)
        `)
        .single()

      if (error) throw error

      const { salaries } = get()
      set({
        salaries: [data, ...salaries],
        loading: false,
        error: null,
      })

      return data
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to process salary',
      })
      throw error
    }
  },

  approveSalary: async (id: string) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('salaries')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          employee:employees(full_name, employee_id),
          deductions:salary_deductions(*),
          bonuses:salary_bonuses(*)
        `)
        .single()

      if (error) throw error

      const { salaries } = get()
      set({
        salaries: salaries.map(sal => sal.id === id ? data : sal),
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to approve salary',
      })
      throw error
    }
  },

  paySalary: async (id: string) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('salaries')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          employee:employees(full_name, employee_id),
          deductions:salary_deductions(*),
          bonuses:salary_bonuses(*)
        `)
        .single()

      if (error) throw error

      const { salaries } = get()
      set({
        salaries: salaries.map(sal => sal.id === id ? data : sal),
        loading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to pay salary',
      })
      throw error
    }
  },

  generatePayslip: async (salaryId: string) => {
    try {
      set({ loading: true, error: null })

      // This would integrate with a PDF generation service
      const response = await fetch(`/api/salaries/${salaryId}/payslip`)
      
      if (!response.ok) throw new Error('Failed to generate payslip')

      const blob = await response.blob()
      
      set({
        loading: false,
        error: null,
      })

      return blob
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || 'Failed to generate payslip',
      })
      throw error
    }
  },

  getEmployeeAttendanceReport: async (employeeId: string, month: number, year: number) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
        .lt('date', `${year}-${(month + 1).toString().padStart(2, '0')}-01`)
        .order('date')

      if (error) throw error

      // Calculate attendance statistics
      const totalDays = data?.length || 0
      const presentDays = data?.filter(att => att.status === 'present').length || 0
      const lateDays = data?.filter(att => att.status === 'late').length || 0
      const absentDays = data?.filter(att => att.status === 'absent').length || 0
      const totalHours = data?.reduce((sum, att) => sum + (att.total_hours || 0), 0) || 0
      const overtimeHours = data?.reduce((sum, att) => sum + (att.overtime_hours || 0), 0) || 0

      return {
        attendance: data || [],
        statistics: {
          totalDays,
          presentDays,
          lateDays,
          absentDays,
          totalHours,
          overtimeHours,
          attendanceRate: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
        },
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to get attendance report',
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
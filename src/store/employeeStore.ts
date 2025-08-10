import { create } from 'zustand'
import { supabase } from '../config/supabase'

export interface Employee {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  position: string
  department: string
  salary: number
  hireDate: string
  status: 'active' | 'inactive' | 'terminated'
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  photoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn?: string
  checkOut?: string
  hoursWorked: number
  status: 'present' | 'absent' | 'late' | 'half-day'
  notes?: string
  createdAt: string
}

interface EmployeeStore {
  employees: Employee[]
  attendance: AttendanceRecord[]
  currentEmployee: Employee | null
  isLoading: boolean
  error: string | null

  // Employee Actions
  fetchEmployees: () => Promise<void>
  createEmployee: (employee: Omit<Employee, 'id' | 'fullName' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  getEmployeeById: (id: string) => Promise<void>

  // Attendance Actions
  fetchAttendance: (date?: string) => Promise<void>
  recordAttendance: (attendance: Omit<AttendanceRecord, 'id' | 'createdAt'>) => Promise<void>
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => Promise<void>
  calculateHoursWorked: (checkIn: string, checkOut: string) => number

  // Utility Actions
  clearError: () => void
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  attendance: [],
  currentEmployee: null,
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('firstName', { ascending: true })

      if (error) throw error

      const employeesWithFullName = (data || []).map(emp => ({
        ...emp,
        fullName: `${emp.firstName} ${emp.lastName}`
      }))

      set({ employees: employeesWithFullName, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch employees',
        isLoading: false 
      })
    }
  },

  createEmployee: async (employeeData) => {
    set({ isLoading: true, error: null })
    try {
      const newEmployee = {
        ...employeeData,
        id: crypto.randomUUID(),
        fullName: `${employeeData.firstName} ${employeeData.lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('employees')
        .insert([newEmployee])

      if (error) throw error

      const { employees } = get()
      set({ 
        employees: [...employees, newEmployee].sort((a, b) => a.firstName.localeCompare(b.firstName)),
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create employee',
        isLoading: false 
      })
    }
  },

  updateEmployee: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      }

      // Update fullName if firstName or lastName changed
      if (updates.firstName || updates.lastName) {
        const { employees } = get()
        const employee = employees.find(emp => emp.id === id)
        if (employee) {
          updatedData.fullName = `${updates.firstName || employee.firstName} ${updates.lastName || employee.lastName}`
        }
      }

      const { error } = await supabase
        .from('employees')
        .update(updatedData)
        .eq('id', id)

      if (error) throw error

      const { employees } = get()
      set({ 
        employees: employees.map(employee => 
          employee.id === id ? { ...employee, ...updatedData } : employee
        ),
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update employee',
        isLoading: false 
      })
    }
  },

  deleteEmployee: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)

      if (error) throw error

      const { employees } = get()
      set({ 
        employees: employees.filter(employee => employee.id !== id),
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete employee',
        isLoading: false 
      })
    }
  },

  getEmployeeById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const employeeWithFullName = {
        ...data,
        fullName: `${data.firstName} ${data.lastName}`
      }

      set({ currentEmployee: employeeWithFullName, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch employee',
        isLoading: false 
      })
    }
  },

  fetchAttendance: async (date) => {
    set({ isLoading: true, error: null })
    try {
      let query = supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false })

      if (date) {
        query = query.eq('date', date)
      }

      const { data, error } = await query

      if (error) throw error

      set({ attendance: data || [], isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch attendance',
        isLoading: false 
      })
    }
  },

  recordAttendance: async (attendanceData) => {
    set({ isLoading: true, error: null })
    try {
      const newAttendance = {
        ...attendanceData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('attendance')
        .insert([newAttendance])

      if (error) throw error

      const { attendance } = get()
      set({ 
        attendance: [newAttendance, ...attendance],
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to record attendance',
        isLoading: false 
      })
    }
  },

  updateAttendance: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      const { attendance } = get()
      set({ 
        attendance: attendance.map(record => 
          record.id === id ? { ...record, ...updates } : record
        ),
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update attendance',
        isLoading: false 
      })
    }
  },

  calculateHoursWorked: (checkIn, checkOut) => {
    const checkInTime = new Date(`1970-01-01T${checkIn}:00`)
    const checkOutTime = new Date(`1970-01-01T${checkOut}:00`)
    
    const diffMs = checkOutTime.getTime() - checkInTime.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    
    return Math.round(diffHours * 100) / 100 // Round to 2 decimal places
  },

  clearError: () => set({ error: null })
}))
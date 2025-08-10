import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'BDT'): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function generateSKU(category: string, name: string): string {
  const categoryCode = category.substring(0, 3).toUpperCase()
  const nameCode = name.replace(/\s+/g, '').substring(0, 3).toUpperCase()
  const timestamp = Date.now().toString().slice(-4)
  return `${categoryCode}-${nameCode}-${timestamp}`
}

export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const timestamp = Date.now().toString().slice(-4)
  return `INV-${year}${month}${day}-${timestamp}`
}

export function calculateTax(amount: number, taxRate = 0.15): number {
  return amount * taxRate
}

export function calculateDiscount(amount: number, discount: number, isPercentage = true): number {
  if (isPercentage) {
    return amount * (discount / 100)
  }
  return discount
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
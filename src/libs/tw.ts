import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function that combines clsx and tailwind-merge
 * - clsx handles conditional classes and complex logic
 * - twMerge resolves Tailwind CSS class conflicts
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

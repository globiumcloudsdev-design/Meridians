import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentAcademicSession() {
  const year = new Date().getFullYear()
  const nextYear = year + 1
  return `${year}-${String(nextYear).slice(-2)}`
}

export function getCurrentYear() {
  return new Date().getFullYear()
}

export function getImageSrc(src: string | { src: string }) {
  return typeof src === "string" ? src : src.src
}

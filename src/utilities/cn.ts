/**
 * @description Class name utility for merging Tailwind CSS classes
 * @dependencies clsx, tailwind-merge
 * @performance Optimized for conditional class application
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
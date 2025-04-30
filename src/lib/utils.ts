
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

export function getStatusColor(status: string) {
  const statusLower = status.toLowerCase();
  if (statusLower === 'success') return 'success';
  if (statusLower === 'failed' || statusLower === 'failure') return 'danger';
  if (statusLower === 'pending') return 'warning';
  return 'default';
}

export function formatDate(date: string | Date) {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function truncateText(text: string, maxLength: number = 20) {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function capitalizeFirst(text: string) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

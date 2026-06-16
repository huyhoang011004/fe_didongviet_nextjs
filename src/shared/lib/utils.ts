import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve URL ảnh từ backend.
 * Nếu path bắt đầu bằng /uploads/ hoặc /uploads, prepend backend base URL.
 * Nếu đã là URL đầy đủ (http/https) thì giữ nguyên.
 */
export function resolveImageUrl(path?: string | null): string {
  if (!path) return '';
  // Nếu đã là URL đầy đủ
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Nếu là path tương đối, prepend backend base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

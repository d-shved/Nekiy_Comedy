import type { VercelRequest } from '@vercel/node'

export const STORE_KEY = 'comedy-events'

export function checkAuth(req: VercelRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'nekiy2024'
  return req.headers['x-admin-password'] === adminPassword
}

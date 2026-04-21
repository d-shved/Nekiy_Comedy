import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
import type { ComedyEvent } from '../src/types'

const STORE_KEY = 'comedy-events'

function checkAuth(req: VercelRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'nekiy2024'
  return req.headers['x-admin-password'] === adminPassword
}

async function getAllEvents(): Promise<ComedyEvent[]> {
  const keys = await kv.keys(`${STORE_KEY}:*`)
  if (!keys.length) return []
  const results = await Promise.all(keys.map((key) => kv.get<ComedyEvent>(key)))
  return results.filter((e): e is ComedyEvent => e !== null)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const events = await getAllEvents()
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      return res.status(200).json(events)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch events' })
    }
  }

  if (req.method === 'POST') {
    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
      const body = req.body as Omit<ComedyEvent, 'id' | 'createdAt'>
      const id = crypto.randomUUID()
      const event: ComedyEvent = {
        ...body,
        id,
        createdAt: new Date().toISOString(),
      }
      await kv.set(`${STORE_KEY}:${id}`, event)
      return res.status(201).json(event)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create event' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

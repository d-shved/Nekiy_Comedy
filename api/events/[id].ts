import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
import type { ComedyEvent } from '../../src/types'
import { STORE_KEY, checkAuth } from '../_lib'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }

  if (req.method === 'PUT') {
    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
      const body = req.body as Partial<ComedyEvent>
      const existing = await kv.get<ComedyEvent>(`${STORE_KEY}:${id}`)
      if (!existing) {
        return res.status(404).json({ error: 'Not found' })
      }
      const updated: ComedyEvent = { ...existing, ...body, id }
      await kv.set(`${STORE_KEY}:${id}`, updated)
      return res.status(200).json(updated)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update event' })
    }
  }

  if (req.method === 'DELETE') {
    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
      await kv.del(`${STORE_KEY}:${id}`)
      return res.status(204).end()
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete event' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

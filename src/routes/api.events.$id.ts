import { createFileRoute } from '@tanstack/react-router'
import { kv } from '@vercel/kv'
import type { ComedyEvent } from './api.events'

const STORE_KEY = 'comedy-events'

function checkAuth(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'nekiy2024'
  return request.headers.get('X-Admin-Password') === adminPassword
}

export const Route = createFileRoute('/api/events/$id')({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        if (!checkAuth(request)) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        try {
          const body = (await request.json()) as Partial<ComedyEvent>
          const existing = await kv.get<ComedyEvent>(`${STORE_KEY}:${params.id}`)
          if (!existing) {
            return Response.json({ error: 'Not found' }, { status: 404 })
          }
          const updated: ComedyEvent = { ...existing, ...body, id: params.id }
          await kv.set(`${STORE_KEY}:${params.id}`, updated)
          return Response.json(updated)
        } catch (err) {
          console.error('Error updating event:', err)
          return Response.json({ error: 'Failed to update event' }, { status: 500 })
        }
      },

      DELETE: async ({ request, params }) => {
        if (!checkAuth(request)) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        try {
          await kv.del(`${STORE_KEY}:${params.id}`)
          return new Response(null, { status: 204 })
        } catch (err) {
          console.error('Error deleting event:', err)
          return Response.json({ error: 'Failed to delete event' }, { status: 500 })
        }
      },
    },
  },
})

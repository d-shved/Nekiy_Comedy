import { createFileRoute } from '@tanstack/react-router'
import { getStore } from '@netlify/blobs'
import type { ComedyEvent } from './api.events'

async function getEventsStore() {
  return getStore({ name: 'comedy-events', consistency: 'strong' })
}

export const Route = createFileRoute('/api/events/$id')({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        const authHeader = request.headers.get('X-Admin-Password')
        const adminPassword = process.env.ADMIN_PASSWORD || 'nekiy2024'
        if (authHeader !== adminPassword) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        try {
          const body = (await request.json()) as Partial<ComedyEvent>
          const store = await getEventsStore()
          const existing = await store.get(params.id, { type: 'json' }) as ComedyEvent | null
          if (!existing) {
            return Response.json({ error: 'Not found' }, { status: 404 })
          }
          const updated: ComedyEvent = { ...existing, ...body, id: params.id }
          await store.setJSON(params.id, updated)
          return Response.json(updated)
        } catch (err) {
          console.error('Error updating event:', err)
          return Response.json({ error: 'Failed to update event' }, { status: 500 })
        }
      },

      DELETE: async ({ request, params }) => {
        const authHeader = request.headers.get('X-Admin-Password')
        const adminPassword = process.env.ADMIN_PASSWORD || 'nekiy2024'
        if (authHeader !== adminPassword) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        try {
          const store = await getEventsStore()
          await store.delete(params.id)
          return new Response(null, { status: 204 })
        } catch (err) {
          console.error('Error deleting event:', err)
          return Response.json({ error: 'Failed to delete event' }, { status: 500 })
        }
      },
    },
  },
})

import { createFileRoute } from '@tanstack/react-router'
import { getStore } from '@netlify/blobs'

export interface ComedyEvent {
  id: string
  type: 'show' | 'open-mic'
  title: string
  date: string
  time: string
  venue: string
  description: string
  createdAt: string
}

async function getEventsStore() {
  return getStore({ name: 'comedy-events', consistency: 'strong' })
}

export const Route = createFileRoute('/api/events')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const store = await getEventsStore()
          const { blobs } = await store.list()
          const events: ComedyEvent[] = []
          for (const blob of blobs) {
            const event = await store.get(blob.key, { type: 'json' })
            if (event) events.push(event as ComedyEvent)
          }
          events.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          return Response.json(events)
        } catch (err) {
          console.error('Error fetching events:', err)
          return Response.json([], { status: 200 })
        }
      },

      POST: async ({ request }) => {
        const authHeader = request.headers.get('X-Admin-Password')
        const adminPassword = process.env.ADMIN_PASSWORD || 'nekiy2024'
        if (authHeader !== adminPassword) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        try {
          const body = (await request.json()) as Omit<
            ComedyEvent,
            'id' | 'createdAt'
          >
          const event: ComedyEvent = {
            ...body,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            createdAt: new Date().toISOString(),
          }
          const store = await getEventsStore()
          await store.setJSON(event.id, event)
          return Response.json(event, { status: 201 })
        } catch (err) {
          console.error('Error creating event:', err)
          return Response.json({ error: 'Failed to create event' }, { status: 500 })
        }
      },
    },
  },
})

import { createFileRoute } from '@tanstack/react-router'
import { kv } from '@vercel/kv'

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

const STORE_KEY = 'comedy-events'

function checkAuth(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'nekiy2024'
  return request.headers.get('X-Admin-Password') === adminPassword
}

async function getAllEvents(): Promise<ComedyEvent[]> {
  const keys = await kv.keys(`${STORE_KEY}:*`)
  if (!keys.length) return []

  const results = await Promise.all(keys.map((key) => kv.get<ComedyEvent>(key)))
  return results.filter((e): e is ComedyEvent => e !== null)
}

export const Route = createFileRoute('/api/events')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const events = await getAllEvents()
          events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          return Response.json(events)
        } catch (err) {
          console.error('Error fetching events:', err)
          return Response.json([], { status: 200 })
        }
      },

      POST: async ({ request }) => {
        if (!checkAuth(request)) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        try {
          const body = (await request.json()) as Omit<ComedyEvent, 'id' | 'createdAt'>
          const event: ComedyEvent = {
            ...body,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            createdAt: new Date().toISOString(),
          }
          await kv.set(`${STORE_KEY}:${event.id}`, event)
          return Response.json(event, { status: 201 })
        } catch (err) {
          console.error('Error creating event:', err)
          return Response.json({ error: 'Failed to create event' }, { status: 500 })
        }
      },
    },
  },
})

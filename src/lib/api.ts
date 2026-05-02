import type { ComedyEvent } from '../types'

export type EventInput = Omit<ComedyEvent, 'id' | 'createdAt'>

const PASSWORD_HEADER = 'X-Admin-Password'

export async function listEvents(): Promise<ComedyEvent[]> {
  try {
    const res = await fetch('/api/events')
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function createEvent(input: EventInput, password: string): Promise<Response> {
  return fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [PASSWORD_HEADER]: password,
    },
    body: JSON.stringify(input),
  })
}

export function updateEvent(id: string, input: EventInput, password: string): Promise<Response> {
  return fetch(`/api/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      [PASSWORD_HEADER]: password,
    },
    body: JSON.stringify(input),
  })
}

export function deleteEvent(id: string, password: string): Promise<Response> {
  return fetch(`/api/events/${id}`, {
    method: 'DELETE',
    headers: { [PASSWORD_HEADER]: password },
  })
}

export async function probeAuth(password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/events/__probe__', {
      method: 'DELETE',
      headers: { [PASSWORD_HEADER]: password },
    })
    return res.status !== 401
  } catch {
    return true
  }
}


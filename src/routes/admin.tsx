import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { Mic, Plus, Trash2, Edit2, Save, X, LogIn, LogOut } from 'lucide-react'
import type { ComedyEvent } from './api.events'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

const SESSION_KEY = 'nekiy_admin_pw'

const emptyForm = (): Omit<ComedyEvent, 'id' | 'createdAt'> => ({
  type: 'show',
  title: '',
  date: '',
  time: '',
  venue: '',
  description: '',
})

function AdminPage() {
  const [password, setPassword] = useState<string | null>(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [events, setEvents] = useState<ComedyEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (saved) setPassword(saved)
  }, [])

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(data)
    } catch (err) {
      setError('Не удалось загрузить события')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (password) fetchEvents()
  }, [password, fetchEvents])

  const verifyAndLogin = async (pw: string) => {
    // Probe auth by attempting a harmless DELETE on a nonexistent id.
    // 401 => wrong password; anything else (404/204/5xx) => password accepted.
    try {
      const res = await fetch('/api/events/__probe__', {
        method: 'DELETE',
        headers: { 'X-Admin-Password': pw },
      })
      if (res.status === 401) return false
      return true
    } catch {
      return true // network error — let user proceed; real errors will surface later
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const ok = await verifyAndLogin(passwordInput)
    if (!ok) {
      setLoginError('Неверный пароль')
      return
    }
    sessionStorage.setItem(SESSION_KEY, passwordInput)
    setPassword(passwordInput)
    setPasswordInput('')
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setPassword(null)
    setEvents([])
    setForm(emptyForm())
    setEditingId(null)
    setShowForm(false)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!password) return
    try {
      const url = editingId ? `/api/events/${editingId}` : '/api/events'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify(form),
      })
      if (res.status === 401) {
        handleLogout()
        setError('Неверный пароль — войдите заново')
        return
      }
      if (!res.ok) throw new Error('Save failed')
      await fetchEvents()
      setForm(emptyForm())
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      setError('Не удалось сохранить событие')
    }
  }

  const handleEdit = (event: ComedyEvent) => {
    setForm({
      type: event.type,
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      description: event.description,
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!password) return
    if (!confirm('Удалить это событие?')) return
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Password': password },
      })
      if (res.status === 401) {
        handleLogout()
        return
      }
      if (!res.ok) throw new Error('Delete failed')
      await fetchEvents()
    } catch (err) {
      setError('Не удалось удалить событие')
    }
  }

  const handleCancel = () => {
    setForm(emptyForm())
    setEditingId(null)
    setShowForm(false)
  }

  if (!password) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-5 h-5" />
            <h1 className="text-xl font-bold">Nekiy Comedy — Admin</h1>
          </div>
          <label className="block text-sm text-gray-400">Пароль</label>
          <input
            type="password"
            autoFocus
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-gray-800 rounded focus:border-gray-600 outline-none"
          />
          {loginError && <p className="text-sm text-red-400">{loginError}</p>}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-2 rounded hover:bg-gray-200 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Войти
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-900 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          <h1 className="text-lg font-bold">Admin · Nekiy Comedy</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-950 border border-red-900 text-red-300 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">События ({events.length})</h2>
          {!showForm && (
            <button
              onClick={() => {
                setForm(emptyForm())
                setEditingId(null)
                setShowForm(true)
              }}
              className="flex items-center gap-1 bg-white text-black px-3 py-1.5 rounded font-medium hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSave}
            className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-gray-400">Тип</span>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as 'show' | 'open-mic' })
                  }
                  className="mt-1 w-full px-3 py-2 bg-black border border-gray-800 rounded"
                >
                  <option value="show">Stand-up show</option>
                  <option value="open-mic">Open mic</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-gray-400">Название</span>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-black border border-gray-800 rounded"
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-400">Дата</span>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-black border border-gray-800 rounded"
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-400">Время</span>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-black border border-gray-800 rounded"
                />
              </label>
              <label className="block text-sm md:col-span-2">
                <span className="text-gray-400">Место</span>
                <input
                  required
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-black border border-gray-800 rounded"
                  placeholder="Название бара / адрес"
                />
              </label>
              <label className="block text-sm md:col-span-2">
                <span className="text-gray-400">Описание</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 bg-black border border-gray-800 rounded"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-1 bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Сохранить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1 border border-gray-700 px-4 py-2 rounded hover:bg-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
                Отмена
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {loading && <p className="text-gray-500">Загрузка…</p>}
          {!loading && events.length === 0 && (
            <p className="text-gray-500">Пока нет событий</p>
          )}
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-950 border border-gray-800 rounded p-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span className="uppercase">
                    {event.type === 'show' ? 'Stand-up show' : 'Open mic'}
                  </span>
                  <span>·</span>
                  <span>{event.date}</span>
                  <span>·</span>
                  <span>{event.time}</span>
                </div>
                <div className="font-medium truncate">{event.title}</div>
                <div className="text-sm text-gray-400 truncate">{event.venue}</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(event)}
                  aria-label="Редактировать"
                  className="p-2 hover:bg-gray-800 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  aria-label="Удалить"
                  className="p-2 hover:bg-gray-800 rounded transition-colors text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

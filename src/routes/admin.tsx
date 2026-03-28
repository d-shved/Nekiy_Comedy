import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
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
  const [password, setPassword] = useState('')
  const [savedPw, setSavedPw] = useState<string | null>(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) : null,
  )
  const [authError, setAuthError] = useState('')
  const [events, setEvents] = useState<ComedyEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events')
      const data: ComedyEvent[] = await res.json()
      setEvents(data)
    } catch {
      setError('Не удалось загрузить ивенты')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (savedPw) fetchEvents()
  }, [savedPw, fetchEvents])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return
    sessionStorage.setItem(SESSION_KEY, password)
    setSavedPw(password)
    setAuthError('')
    setPassword('')
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    setSavedPw(null)
    setEvents([])
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!savedPw) return
    setSaving(true)
    setError('')
    try {
      const url = editingId ? `/api/events/${editingId}` : '/api/events'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': savedPw,
        },
        body: JSON.stringify(form),
      })
      if (res.status === 401) {
        setError('Неверный пароль')
        handleLogout()
        return
      }
      if (!res.ok) throw new Error('Save failed')
      await fetchEvents()
      setFormOpen(false)
      setEditingId(null)
      setForm(emptyForm())
    } catch {
      setError('Не удалось сохранить ивент')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!savedPw) return
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Password': savedPw },
      })
      if (res.status === 401) {
        setError('Неверный пароль')
        handleLogout()
        return
      }
      setDeleteConfirm(null)
      await fetchEvents()
    } catch {
      setError('Не удалось удалить ивент')
    }
  }

  function startEdit(event: ComedyEvent) {
    setEditingId(event.id)
    setForm({
      type: event.type,
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      description: event.description,
    })
    setFormOpen(true)
    setError('')
  }

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm())
    setFormOpen(true)
    setError('')
  }

  function cancelForm() {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm())
    setError('')
  }

  if (!savedPw) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Mic className="w-10 h-10 mx-auto mb-4" style={{ color: '#CC2222' }} />
            <h1
              className="text-2xl font-black uppercase tracking-widest"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              Nekiy Comedy
            </h1>
            <p className="text-gray-500 text-sm mt-1">Панель администратора</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-lg p-6 border border-gray-800"
            style={{ background: '#0a0a0a' }}
          >
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white text-sm mb-4 outline-none focus:border-red-700 transition-colors"
              placeholder="••••••••"
              autoFocus
            />
            {authError && (
              <p className="text-red-500 text-xs mb-3">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded font-bold text-sm uppercase tracking-wider transition-opacity hover:opacity-90"
              style={{ background: '#CC2222', color: '#fff' }}
            >
              <LogIn className="w-4 h-4" />
              Войти
            </button>
          </form>
          <div className="text-center mt-4">
            <a href="/" className="text-gray-700 text-xs hover:text-gray-500 transition-colors">
              ← На сайт
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <header className="border-b border-gray-900 sticky top-0 bg-black/95 backdrop-blur-sm z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5" style={{ color: '#CC2222' }} />
            <span
              className="font-black uppercase tracking-widest text-sm"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              Nekiy Comedy · <span className="text-gray-500">Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              На сайт
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-500 hover:text-white text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Title + Add button */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-black uppercase tracking-wider"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            Мероприятия
          </h1>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded font-bold text-sm uppercase tracking-wider transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: '#CC2222', color: '#fff' }}
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded px-4 py-3 text-sm border border-red-900 text-red-400 bg-red-950/20">
            {error}
          </div>
        )}

        {/* Event Form Modal */}
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div
              className="w-full max-w-lg rounded-lg border border-gray-800 overflow-auto max-h-[90vh]"
              style={{ background: '#0a0a0a' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <h2
                  className="font-black uppercase tracking-wider text-base"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  {editingId ? 'Редактировать' : 'Новое мероприятие'}
                </h2>
                <button
                  onClick={cancelForm}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">
                {/* Type */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Тип
                  </label>
                  <div className="flex gap-3">
                    {(['show', 'open-mic'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                        className="px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all"
                        style={
                          form.type === t
                            ? { background: '#CC2222', color: '#fff' }
                            : {
                                background: '#111',
                                color: '#888',
                                border: '1px solid #333',
                              }
                        }
                      >
                        {t === 'show' ? 'Stand-up Show' : 'Open Mic'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Название *
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2.5 text-white text-sm outline-none focus:border-red-700 transition-colors"
                    placeholder="Некий Stand-up Night #1"
                  />
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Дата *
                    </label>
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full bg-black border border-gray-700 rounded px-3 py-2.5 text-white text-sm outline-none focus:border-red-700 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Время *
                    </label>
                    <input
                      required
                      value={form.time}
                      onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                      className="w-full bg-black border border-gray-700 rounded px-3 py-2.5 text-white text-sm outline-none focus:border-red-700 transition-colors"
                      placeholder="20:00"
                    />
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Место *
                  </label>
                  <input
                    required
                    value={form.venue}
                    onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2.5 text-white text-sm outline-none focus:border-red-700 transition-colors"
                    placeholder="Bar Name, Frankfurt am Main"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Описание
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2.5 text-white text-sm outline-none focus:border-red-700 transition-colors resize-none"
                    placeholder="Краткое описание вечера..."
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs">{error}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded font-bold text-sm uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: '#CC2222', color: '#fff' }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Сохраняем...' : 'Сохранить'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="px-4 py-3 rounded text-sm text-gray-400 hover:text-white border border-gray-800 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div
              className="w-full max-w-sm rounded-lg border border-gray-800 p-6"
              style={{ background: '#0a0a0a' }}
            >
              <h3
                className="font-black uppercase tracking-wider text-base mb-2"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                Удалить ивент?
              </h3>
              <p className="text-gray-400 text-sm mb-5">
                Это действие нельзя отменить.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded font-bold text-sm uppercase tracking-wider transition-opacity hover:opacity-90"
                  style={{ background: '#8B1A1A', color: '#fff' }}
                >
                  Удалить
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded text-sm text-gray-400 hover:text-white border border-gray-800 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-lg animate-pulse"
                style={{ background: '#0d0d0d' }}
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-700">
            <Mic className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm uppercase tracking-widest">Мероприятий пока нет</p>
            <p className="text-xs text-gray-800 mt-1">Нажмите «Добавить», чтобы создать первый</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-gray-800 p-4 flex items-start justify-between gap-4"
                style={{ background: '#0a0a0a' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                      style={
                        event.type === 'show'
                          ? { background: '#8B1A1A', color: '#fff' }
                          : { border: '1px solid #CC2222', color: '#CC2222' }
                      }
                    >
                      {event.type === 'show' ? 'Stand-up Show' : 'Open Mic'}
                    </span>
                  </div>
                  <p className="font-bold text-sm truncate">{event.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {event.date} · {event.time} · {event.venue}
                  </p>
                  {event.description && (
                    <p className="text-gray-600 text-xs mt-1 line-clamp-1">
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(event)}
                    className="p-2 text-gray-500 hover:text-white transition-colors rounded hover:bg-gray-800"
                    aria-label="Редактировать"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(event.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors rounded hover:bg-gray-800"
                    aria-label="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

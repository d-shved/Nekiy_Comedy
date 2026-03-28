import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Mic, MapPin, Clock, Calendar, Instagram, Send } from 'lucide-react'
import type { ComedyEvent } from './api.events'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function MicrophoneHero() {
  return (
    <svg
      viewBox="0 0 100 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-24 md:w-20 md:h-32 opacity-90"
      aria-hidden="true"
    >
      <rect x="32" y="4" width="36" height="70" rx="18" fill="#CC2222" />
      <rect x="38" y="10" width="24" height="58" rx="12" fill="#8B1A1A" />
      <path
        d="M18 62 C18 92 82 92 82 62"
        stroke="#CC2222"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="50" y1="92" x2="50" y2="120" stroke="#CC2222" strokeWidth="5" strokeLinecap="round" />
      <line x1="30" y1="120" x2="70" y2="120" stroke="#CC2222" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function EventCard({ event }: { event: ComedyEvent }) {
  return (
    <div className="event-card rounded-lg p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold text-white leading-tight">{event.title}</h3>
        <span
          className="shrink-0 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider"
          style={{
            background: event.type === 'show' ? '#8B1A1A' : '#1a1a1a',
            color: event.type === 'show' ? '#fff' : '#CC2222',
            border: event.type === 'open-mic' ? '1px solid #CC2222' : 'none',
          }}
        >
          {event.type === 'show' ? 'Stand-up Show' : 'Open Mic'}
        </span>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>

      <div className="mt-auto pt-3 border-t border-gray-800 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar className="w-4 h-4 text-red-600 shrink-0" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Clock className="w-4 h-4 text-red-600 shrink-0" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
          <span>{event.venue}</span>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-12 text-gray-600">
      <Mic className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm uppercase tracking-widest">{label}</p>
    </div>
  )
}

function HomePage() {
  const [events, setEvents] = useState<ComedyEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data: ComedyEvent[]) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const shows = events.filter((e) => e.type === 'show')
  const openMics = events.filter((e) => e.type === 'open-mic')

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grain-overlay" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-lg tracking-widest uppercase text-white">
            Nekiy <span style={{ color: '#CC2222' }}>Comedy</span>
          </span>
          <nav className="flex items-center gap-4">
            <a
              href="https://t.me/nekiy_comedy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/nekiy_comedy_ffm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, #CC2222 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 text-center flex flex-col items-center gap-8">
          <MicrophoneHero />
          <div>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6"
              style={{ fontFamily: 'Oswald, Inter, sans-serif' }}
            >
              Nekiy{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #8B1A1A, #CC2222)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Comedy
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Русскоязычный стендап во Франкфурте-на-Майне.
              <br className="hidden md:block" />
              Stand-up shows и open mic на русском языке.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a
              href="https://t.me/nekiy_comedy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider rounded transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: '#CC2222', color: '#fff' }}
            >
              <Send className="w-4 h-4" />
              Telegram
            </a>
            <a
              href="https://www.instagram.com/nekiy_comedy_ffm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider rounded border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all duration-200 active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Stand-up Shows */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-8">
          <Mic className="w-6 h-6 shrink-0" style={{ color: '#CC2222' }} />
          <h2
            className="text-3xl md:text-4xl font-black"
            style={{ fontFamily: 'Oswald, Inter, sans-serif' }}
          >
            Stand-up Shows
          </h2>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
        <p className="text-gray-400 mb-8 -mt-4">
          Выступления профессиональных стендап-комиков
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="event-card rounded-lg p-6 h-48 animate-pulse bg-gray-900"
              />
            ))}
          </div>
        ) : shows.length === 0 ? (
          <EmptyState label="Ближайшие шоу появятся совсем скоро" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shows.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </div>

      {/* Open Mic */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-4 mb-8">
          <Mic className="w-6 h-6 shrink-0" style={{ color: '#CC2222' }} />
          <h2
            className="text-3xl md:text-4xl font-black"
            style={{ fontFamily: 'Oswald, Inter, sans-serif' }}
          >
            Open Mic
          </h2>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
        <p className="text-gray-400 mb-8 -mt-4">
          Открытая сцена — для всех желающих попробовать стендап
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="event-card rounded-lg p-6 h-48 animate-pulse bg-gray-900"
              />
            ))}
          </div>
        ) : openMics.length === 0 ? (
          <EmptyState label="Open mic ивенты скоро будут объявлены" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openMics.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* About Strip */}
      <section
        className="py-16 mt-4"
        style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #110000 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Mic className="w-10 h-10 mx-auto mb-6" style={{ color: '#CC2222' }} />
          <h2
            className="text-2xl md:text-3xl font-black mb-4"
            style={{ fontFamily: 'Oswald, Inter, sans-serif' }}
          >
            Что такое Nekiy Comedy?
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Мы — русскоязычное стендап-комьюнити во Франкфурте. Организуем
            stand-up shows с приглашёнными комиками и регулярные open mic вечера,
            где любой может выйти на сцену и попробовать себя в стендапе.
            Следите за анонсами в Telegram и Instagram.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-gray-600 text-sm uppercase tracking-widest">
            Nekiy Comedy · Frankfurt am Main
          </span>
          <div className="flex items-center gap-5">
            <a
              href="https://t.me/nekiy_comedy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <Send className="w-4 h-4" />
              Telegram
            </a>
            <a
              href="https://www.instagram.com/nekiy_comedy_ffm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
            <a
              href="/admin"
              className="text-gray-800 hover:text-gray-600 transition-colors text-xs"
            >
              Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

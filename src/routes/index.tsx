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
    return new Date(dateStr).toLocaleDateString('ru-RU', {
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

      <div className="flex flex-col gap-1.5 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 shrink-0" style={{ color: '#CC2222' }} />
          <span>{formatDate(event.date)}</span>
          {event.time && (
            <>
              <Clock className="w-4 h-4 shrink-0 ml-1" style={{ color: '#CC2222' }} />
              <span>{event.time}</span>
            </>
          )}
        </div>
        {event.venue && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" style={{ color: '#CC2222' }} />
            <span>{event.venue}</span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{event.description}</p>
      )}
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

interface EventsSectionProps {
  title: string
  subtitle: string
  events: ComedyEvent[]
  loading: boolean
  emptyLabel: string
  skeletonCount?: number
}

function EventsSection({ title, subtitle, events, loading, emptyLabel, skeletonCount = 3 }: EventsSectionProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="flex items-center gap-4 mb-8">
        <Mic className="w-6 h-6 shrink-0" style={{ color: '#CC2222' }} />
        <h2
          className="text-3xl md:text-4xl font-black"
          style={{ fontFamily: 'Oswald, Inter, sans-serif' }}
        >
          {title}
        </h2>
        <div className="flex-1 h-px bg-gray-800" />
      </div>
      <p className="text-gray-400 mb-8 -mt-4">{subtitle}</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="event-card rounded-lg p-6 h-48 animate-pulse bg-gray-900" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState label={emptyLabel} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
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
          <a href="/" className="text-xl font-black tracking-wider" style={{ fontFamily: 'Oswald, Inter, sans-serif' }}>
            NEKIY <span style={{ color: '#CC2222' }}>COMEDY</span>
          </a>
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
            background: 'radial-gradient(ellipse at 50% 0%, #CC2222 0%, transparent 70%)',
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
              className="flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider rounded transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ border: '1px solid #CC2222', color: '#CC2222' }}
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Stand-up Shows */}
      <EventsSection
        title="Stand-up Shows"
        subtitle="Профессиональные стендап-шоу с приглашёнными комиками"
        events={shows}
        loading={loading}
        emptyLabel="Скоро анонсы — следите за нами"
        skeletonCount={3}
      />

      {/* Open Mic */}
      <EventsSection
        title="Open Mic"
        subtitle="Открытая сцена — для всех желающих попробовать стендап"
        events={openMics}
        loading={loading}
        emptyLabel="Open mic ивенты скоро будут"
        skeletonCount={2}
      />

      {/* About */}
      <section
        className="py-16 md:py-20 mt-4"
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
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>© {new Date().getFullYear()} Nekiy Comedy</span>
          <div className="flex items-center gap-6">
            <a
              href="https://t.me/nekiy_comedy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              Telegram
            </a>
            <a
              href="https://www.instagram.com/nekiy_comedy_ffm"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

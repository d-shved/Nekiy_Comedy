import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import '../styles.css'

const SITE_URL = 'https://nekiy-comedy.vercel.app/'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Nekiy Comedy — стендап на русском во Франкфурте | Русский стендап Германия' },
      {
        name: 'description',
        content:
          'Nekiy Comedy — русскоязычный стендап-клуб во Франкфурте-на-Майне. Stand-up shows и open mic на русском языке для русскоязычных эмигрантов в Германии. Стендап на русском во Франкфурте, Висбадене, Майнце, Дармштадте, Гессене.',
      },
      {
        name: 'keywords',
        content:
          'стендап на русском Франкфурт, стендап на русском Висбаден, стендап на русском Дармштадт, стендап на русском Майнц, стендап на русском Оффенбах, стендап на русском Мангейм, стендап на русском Гейдельберг, стендап на русском Гиссен, стендап на русском Кассель, стендап на русском Марбург, стендап на русском Гессен, стендап на русском Рейнланд-Пфальц, стендап на русском Баден-Вюртемберг, стендап на русском Тюрингия, русский стендап в Германии, стендап по-русски Германия, русскоязычный стендап Германия, русскоязычный стендап 2026, русскоязычный комик Германия, русскоязычный юмор Германия, русскоязычный концерт Германия 2026, стендап на русском языке 2026, стендап для русскоязычных эмигрантов, русский стендап для диаспоры, комедия на русском Германия, стендап для русских в Германии, билеты на русский стендап Германия, стендап шоу на русском Германия 2026, куда сходить русскоязычному в Германии, развлечения для русских в Германии, open mic Frankfurt, stand-up Frankfurt, Nekiy Comedy',
      },
      { property: 'og:title', content: 'Nekiy Comedy — стендап на русском во Франкфурте' },
      {
        property: 'og:description',
        content: 'Русскоязычный стендап-клуб во Франкфурте. Stand-up shows и open mic для русскоязычных в Германии.',
      },
      { property: 'og:locale', content: 'ru_RU' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE_URL },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: SITE_URL }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

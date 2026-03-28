import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Nekiy Comedy — стендап Франкфурт | Русский стендап во Франкфурте' },
      {
        name: 'description',
        content:
          'Nekiy Comedy — русскоязычный стендап-клуб во Франкфурте. Stand-up shows и open mic на русском языке. стендап Франкфурт, open mic Frankfurt, русский стендап Франкфурт, stand-up Frankfurt.',
      },
      {
        name: 'keywords',
        content:
          'стендап Франкфурт, open mic Frankfurt, русский стендап Франкфурт, stand-up Frankfurt, некий comedy, стендап на русском, Некий Комеди',
      },
      { property: 'og:title', content: 'Nekiy Comedy — стендап Франкфурт' },
      {
        property: 'og:description',
        content: 'Русскоязычный стендап-клуб во Франкфурте. Stand-up shows и open mic.',
      },
      { property: 'og:locale', content: 'ru_RU' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'canonical', href: 'https://glittery-biscotti-0e22d6.netlify.app/' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
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

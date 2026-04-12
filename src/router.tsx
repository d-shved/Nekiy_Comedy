import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
    const router = createTanStackRouter({
          routeTree,
          scrollRestoration: true,
          defaultPreloadStaleTime: 0,
    })

  return router
}

export type AppRouter = ReturnType<typeof createRouter>

import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
          viteTsConfigPaths({
                  projects: ['./tsconfig.json'],
          }),
          tailwindcss(),
        ],
})

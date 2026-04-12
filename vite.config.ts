import { defineConfig } from '@tanstack/react-start/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
            tsr: {
                          autoCodeSplitting: true,
            },
            vite: {
                          plugins: [
                                          viteTsConfigPaths({
                                                            projects: ['./tsconfig.json'],
                                          }),
                                          tailwindcss(),
                                        ],
            },
})

export default config

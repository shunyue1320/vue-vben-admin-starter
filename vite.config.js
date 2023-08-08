import { defineApplicationConfig } from '@vben/vite-config'

export default defineApplicationConfig({
  overrides: {
    server: {
      port: 6600,
    },
  },
})

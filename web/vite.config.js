import dns from 'dns'

import { defineConfig } from 'vite'

import redwood from '@redwoodjs/vite'
// See: https://vitejs.dev/config/server-options.html#server-host
// So that Vite will load on local instead of 127.0.0.1
dns.setDefaultResultOrder('verbatim')


const viteConfig = {
  plugins: [redwood()],
}

export default defineConfig(viteConfig)

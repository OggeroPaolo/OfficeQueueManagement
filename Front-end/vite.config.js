import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,             // allows using "test", "expect", etc. globally
    environment: 'jsdom',      // use jsdom to simulate browser
    setupFiles: './src/setupTests.js', // file to load before each test
  },
})

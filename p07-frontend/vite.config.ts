import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Base path and React plugin follow the CInCoders ReactJS starter kit.
export default defineConfig(({ mode }) => ({
  base: loadEnv(mode, process.cwd(), 'VITE_').VITE_BASE_URL || '/',
  plugins: [react()],
}))

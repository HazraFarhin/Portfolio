import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // @gsap/react ships both a CJS dist build (package.json "main") and an
      // ESM src build (package.json "module"). Under Vitest's Node/SSR-style
      // resolution the CJS dist build is picked, whose `require('gsap')`
      // resolves via Node's "require" export condition to gsap/dist/gsap.js
      // -- a fully separate bundled copy of gsap-core.js from the one our
      // own `import gsap from 'gsap'` resolves to (the "import" condition,
      // gsap/index.js). Two separate module instances means two separate
      // private `_context` variables inside gsap-core, so useGSAP's
      // gsap.context() tracking (used to auto-revert ScrollTrigger/tweens
      // on unmount) never sees animations created via our own gsap import --
      // a classic dual-package hazard. Aliasing straight to the ESM src
      // build forces both to resolve gsap identically, fixing it.
      { find: '@gsap/react', replacement: path.resolve(__dirname, 'node_modules/@gsap/react/src/index.js') },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    passWithNoTests: true,
  },
})

import { join } from "path"
import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(process.cwd(), './src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'),
    join(process.cwd(), 'public/styles/global.css'),

  ],
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      'display': ['Lovechild'],
    }
  },
  plugins: [
    typography,
    daisyui
  ],
}

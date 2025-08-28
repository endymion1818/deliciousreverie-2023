import { join } from "path"
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(process.cwd(), 'src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'),
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
  ],
}

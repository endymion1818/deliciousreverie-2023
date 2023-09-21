const { join } = require("path")

module.exports = {
  content: [
    join(__dirname, 'src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'),
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
    require("daisyui"),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#333",
          secondary: "#f7ebc1",
          accent: "#331f33",
        },
      },
      "luxury",
    ],
  },
}

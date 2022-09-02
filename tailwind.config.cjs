/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        base: ["GT-Walsheim"],
      },
      colors: {
        pure: "#171717",
        accent: "#171717",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'success-green': '#10B981',
        'error-red': '#EF4444',
        'neutral-gray': '#9CA3AF',
        'light-blue': '#BFDBFE',
        'dark-blue': '#1E40AF'
      }
    },
  },
  plugins: [],
  corePlugins: {
    // 保留自定义的类名，不让Tailwind移除
    preflight: true,
  }
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        emergency: {
          red: '#FF3B30',
          blue: '#007AFF',
          purple: '#5856D6',
          green: '#34C759',
        },
        gray: {
          light: '#F2F2F7',
          medium: '#8E8E93',
          dark: '#3A3A3C',
        }
      },
      fontFamily: {
        'system': ['System'],
      },
    },
  },
  plugins: [],
}
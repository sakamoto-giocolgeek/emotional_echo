/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // src以下のファイルを監視対象にする
  ],
  theme: {
    extend: {}, // ここでカスタムテーマを拡張できる
  },
  plugins: [],
} 
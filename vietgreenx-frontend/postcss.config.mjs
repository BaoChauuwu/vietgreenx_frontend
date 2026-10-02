// postcss.config.mjs
// Bắt buộc để Next.js biên dịch các directive @tailwind trong globals.css.
// Thiếu file này -> Tailwind không sinh class -> UI hiển thị HTML thô.
/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

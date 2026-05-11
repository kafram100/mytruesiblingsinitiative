/**
 * CommonJS PostCSS config (reliable on Windows / paths with spaces).
 * Use `{}` plugin entries so Next.js can merge options (postcss-shape).
 */module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

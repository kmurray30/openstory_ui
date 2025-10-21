/**
 * PostCSS Configuration
 * 
 * PostCSS processes CSS files.
 * We use it with Tailwind and Autoprefixer.
 */

export default {
  plugins: {
    tailwindcss: {},      // Process Tailwind utilities
    autoprefixer: {},     // Add vendor prefixes for browser compatibility
  },
};


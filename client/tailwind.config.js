/**
 * Tailwind CSS Configuration
 * 
 * Tailwind is a utility-first CSS framework.
 * This configuration customizes the design system.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Which files to scan for Tailwind classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // Custom colors for the OpenStory theme - Blue Scale
      colors: {
        // Custom header color
        header: '#13181d',
        
        // Navy to light blue palette
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',   // Sky blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',   // Deep blue
          900: '#0c4a6e',   // Navy
          950: '#082f49',   // Darkest navy
        },
        // Accent cyan/teal
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',   // Cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Grey-blue background palette
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',   // Mid grey-blue
          600: '#475569',
          700: '#334155',
          800: '#1e293b',   // Dark grey-blue
          900: '#0f172a',   // Darkest grey-blue
          950: '#020617',
        },
      },
      
      // Custom animations with mystical effects
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)',
          },
        },
      },
    },
  },
  
  plugins: [],
};


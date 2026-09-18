/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Indigo Depth Theme (matching ARTIUI v01)
        primary: {
          50: '#F0F1FF',
          100: '#DDE0FF',
          150: '#C0C6FF',
          200: '#9AA5FF',
          250: '#6674F4',
          300: '#4455E8',
          350: '#2D3DC4',
          400: '#1D2A9F',
          450: '#0E1870',
        },
        // Node type colors
        node: {
          form: {
            light: '#DDE0FF',
            DEFAULT: '#4455E8',
            dark: '#1D2A9F',
          },
          system: {
            light: '#E3D3FF',
            DEFAULT: '#7C45F8',
            dark: '#4A15C4',
          },
          wait: {
            light: '#FFF0C2',
            DEFAULT: '#F5A800',
            dark: '#A86800',
          },
          terminal: {
            approved: {
              light: '#C6F5DC',
              DEFAULT: '#00BA6E',
              dark: '#007542',
            },
            rejected: {
              light: '#FFDAD6',
              DEFAULT: '#F5381E',
              dark: '#A80E00',
            }
          }
        },
        // Surface colors for dark/light mode
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0F172A',
        },
        background: {
          DEFAULT: '#F8FAFC',
          dark: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'node': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'node-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

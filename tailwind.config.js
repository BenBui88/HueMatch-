/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rose:    { DEFAULT: '#C4546A', light: '#FDF0F2', mid: '#F4C0D1' },
        navy:    { DEFAULT: '#2C2B4B', light: '#EEEDF8' },
        gold:    { DEFAULT: '#C4934A', light: '#FDF3E8', mid: '#FAC775' },
        emerald: { DEFAULT: '#1D9E75', light: '#E1F5EE' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans:    ['"Outfit"', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
      animation: {
        'scan-line': 'scanline 1.5s ease-in-out infinite',
        'blink':     'blink 1s ease-in-out infinite',
        'pin-drop':  'pinDrop 0.3s ease forwards',
        'confetti':  'confettiFall 0.7s ease forwards',
      },
      keyframes: {
        scanline:    { '0%,100%': { top: '10%' }, '50%': { top: '85%' } },
        blink:       { '0%,100%': { opacity: '0.2' }, '50%': { opacity: '1' } },
        pinDrop:     { '0%': { opacity: '0', transform: 'translate(-50%,-80%)' }, '100%': { opacity: '1', transform: 'translate(-50%,-100%)' } },
        confettiFall:{ '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' }, '100%': { transform: 'translateY(180px) rotate(360deg)', opacity: '0' } },
      },
    },
  },
  plugins: [],
}

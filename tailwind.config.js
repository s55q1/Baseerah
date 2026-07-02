module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3B82F6',
          700: '#0A3D91',
          900: '#082B63',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(10, 61, 145, 0.3)',
      },
    },
  },
  plugins: [],
};

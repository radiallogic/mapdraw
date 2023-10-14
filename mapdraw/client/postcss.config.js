const tailwindcss = require('tailwindcss');
module.exports = {
  plugins: {
    'postcss-preset-env': {},
    tailwindcss: { config: './tailwind.js' }, 
  },
};
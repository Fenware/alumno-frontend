module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      scale: ["group-hover"],
      rotate: ['group-hover'],
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1F5132",
          greenDark: "#153d28",
          military: "#68825B",
          sand: "#DDC49A",
          sandLight: "#d8c79a",
          beige: "#EFE6D2",
          dark: "#171A16",
        },
        theme: {
          bg: "rgb(var(--theme-bg-rgb) / <alpha-value>)",
          sec: "rgb(var(--theme-sec-rgb) / <alpha-value>)",
          card: "rgb(var(--theme-card-rgb) / <alpha-value>)",
          border: "rgb(var(--theme-border-rgb) / <alpha-value>)",
          text: "rgb(var(--theme-text-rgb) / <alpha-value>)",
          muted: "rgb(var(--theme-muted-rgb) / <alpha-value>)",
          accent: "rgb(var(--theme-accent-rgb) / <alpha-value>)",
          heading: "rgb(var(--theme-heading-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        heading: ["Mission_X-Regular", "Mission X-Regular", "Impact", "sans-serif"],
        clofie: ["Clofie-Regular", "sans-serif"],
        clofieBold: ["Clofie-Bold", "sans-serif"],
        clofieBlack: ["Clofie-Black", "sans-serif"],
        glonimove: ["Glonimove-Regular", "sans-serif"],
        glonimoveLight: ["Glonimove-Light", "sans-serif"],
        glonimoveBold: ["Glonimove-Bold", "sans-serif"],
        googleSans: ["Google Sans Flex", "sans-serif"],
        readex: ["Readex Pro", "sans-serif"],
        saira: ["Saira", "sans-serif"],
        
        // Backward compatibility for anima-generated code
        "www-ferrari-com-inter-medium": "var(--www-ferrari-com-inter-medium-font-family)",
        "www-ferrari-com-inter-regular": "var(--www-ferrari-com-inter-regular-font-family)",
        "www-ferrari-com-inter-regular-upper": "var(--www-ferrari-com-inter-regular-upper-font-family)",
        "www-lamborghini-com-roboto-condensed-light-upper": "var(--www-lamborghini-com-roboto-condensed-light-upper-font-family)",
        "www-lamborghini-com-roboto-light": "var(--www-lamborghini-com-roboto-light-font-family)",
        "www-lamborghini-com-roboto-light-upper": "var(--www-lamborghini-com-roboto-light-upper-font-family)",
        "www-lamborghini-com-www-boleous-com-inter-light": "var(--www-lamborghini-com-www-boleous-com-inter-light-font-family)",
        "www-lamborghini-com-www-boleous-com-inter-regular": "var(--www-lamborghini-com-www-boleous-com-inter-regular-font-family)",
        "www-lamborghini-com-www-boleous-com-poppins-extralight": "var(--www-lamborghini-com-www-boleous-com-poppins-extralight-font-family)",
        "www-lamborghini-com-www-boleous-com-poppins-light": "var(--www-lamborghini-com-www-boleous-com-poppins-light-font-family)",
        "www-lamborghini-com-www-boleous-com-poppins-light-upper": "var(--www-lamborghini-com-www-boleous-com-poppins-light-upper-font-family)",
        "www-lamborghini-com-www-boleous-com-poppins-medium": "var(--www-lamborghini-com-www-boleous-com-poppins-medium-font-family)",
        "www-lamborghini-com-www-boleous-com-poppins-medium-title": "var(--www-lamborghini-com-www-boleous-com-poppins-medium-title-font-family)",
        "www-lamborghini-com-www-boleous-com-poppins-regular": "var(--www-lamborghini-com-www-boleous-com-poppins-regular-font-family)",
        "www-lamborghini-com-www-boleous-com-poppins-semibold": "var(--www-lamborghini-com-www-boleous-com-poppins-semibold-font-family)",
      },
    },
  },
  plugins: [],
};


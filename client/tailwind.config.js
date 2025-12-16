/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2F855A', // Green-700
                secondary: '#C6F6D5', // Green-100
                accent: '#F6E05E', // Yellow-400
            }
        },
    },
    plugins: [],
}

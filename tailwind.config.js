/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: {
        enabled: true,
        content: ["./src/**/*.{js,jsx,ts,tsx}"],
    },
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
}

tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                'primary-blue': '#1D4ED8',
                'primary-hover': '#1E40AF',
                'text-dark': '#1F2937',
                'background-light': '#F9FAFB',
                'accent-green': '#059669',
                'accent-green-light': '#ecfdf5',
                'footer-dark': '#0f172a',
                'warning': '#f59e0b',
                'success': '#059669',
                'accent-light': '#ecfdf5',
            },
            boxShadow: {
                'soft': '0 4px 14px 0 rgb(0 0 0 / 0.06)',
                'soft-lg': '0 10px 40px -10px rgb(0 0 0 / 0.1)',
            },
        }
    }
}
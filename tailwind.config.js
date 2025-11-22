/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts}",
    "./templates/**/*.{html,js,ts}",
    "./posts/**/*.{md,markdown}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            a: {
              color: '#3b82f6',
              textDecoration: 'none',
              '&:hover': {
                color: '#2563eb',
                textDecoration: 'underline',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
              fontWeight: '400',
            },
            'code.hljs': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            pre: {
              backgroundColor: '#1f2937',
              color: '#f9fafb',
              overflow: 'auto',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              borderRadius: '0.375rem',
              paddingTop: '0.8571429em',
              paddingRight: '1.1428571em',
              paddingBottom: '0.8571429em',
              paddingLeft: '1.1428571em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            'pre code::before': {
              content: '""',
            },
            'pre code::after': {
              content: '""',
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: '#111827',
              borderLeftWidth: '0.25rem',
              borderLeftColor: '#e5e7eb',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              paddingLeft: '1em',
            },
            'blockquote p:first-of-type::before': {
              content: 'open-quote',
            },
            'blockquote p:last-of-type::after': {
              content: 'close-quote',
            },
            'ol > li::before': {
              color: '#6b7280',
            },
            'ul > li::before': {
              backgroundColor: '#6b7280',
            },
            'ul > li > :first-child': {
              marginTop: '1.25em',
            },
            'ul > li > :last-child': {
              marginBottom: '1.25em',
            },
            'ol > li > :first-child': {
              marginTop: '1.25em',
            },
            'ol > li > :last-child': {
              marginBottom: '1.25em',
            },
            'ul ul, ul ol, ol ul, ol ol': {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
            'hr + *': {
              marginTop: '0',
            },
            'h2 + *': {
              marginTop: '0',
            },
            'h3 + *': {
              marginTop: '0',
            },
            'h4 + *': {
              marginTop: '0',
            },
            table: {
              fontSize: '0.875em',
              lineHeight: '1.7142857',
            },
            'thead th': {
              color: '#111827',
              fontWeight: '600',
              borderBottomWidth: '1px',
              borderBottomColor: '#d1d5db',
            },
            'thead th:not(:first-child)': {
              paddingLeft: '0.5714286em',
            },
            'thead th:not(:last-child)': {
              paddingRight: '0.5714286em',
            },
            'tbody td': {
              borderBottomWidth: '1px',
              borderBottomColor: '#e5e7eb',
            },
            'tbody tr:last-child td': {
              borderBottomWidth: '0',
            },
            'tbody td:not(:first-child)': {
              paddingLeft: '0.5714286em',
            },
            'tbody td:not(:last-child)': {
              paddingRight: '0.5714286em',
            },
          },
        },
        dark: {
          css: {
            color: '#d1d5db',
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
              },
            },
            blockquote: {
              color: '#f3f4f6',
              borderLeftColor: '#374151',
            },
            'ol > li::before': {
              color: '#9ca3af',
            },
            'ul > li::before': {
              backgroundColor: '#9ca3af',
            },
            hr: {
              borderColor: '#374151',
            },
            thead: {
              color: '#f3f4f6',
              borderBottomColor: '#4b5563',
            },
            'tbody tr': {
              borderBottomColor: '#374151',
            },
            code: {
              backgroundColor: '#1f2937',
              color: '#f9fafb',
            },
            pre: {
              backgroundColor: '#111827',
              color: '#f3f4f6',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Cyberpunk colors
        'electric-cyan': 'hsl(180, 100%, 50%)',
        'fuchsia': 'hsl(310, 100%, 50%)',
        'titanium': 'hsl(214, 15%, 66%)',
        'black-glass': 'hsla(225, 15%, 6%, 0.85)',
        'vibrant-purple': 'hsl(262, 83%, 58%)',
        'deep-indigo': 'hsl(236, 61%, 16%)',
        'neon-magenta': 'hsl(327, 100%, 62%)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'pulse-neon': {
          '0%': { boxShadow: '0 0 20px hsla(180, 100%, 50%, 0.25), 0 0 36px hsla(310, 100%, 50%, 0.31)' },
          '100%': { boxShadow: '0 0 40px hsla(180, 100%, 50%, 0.67), 0 0 60px hsla(310, 100%, 50%, 0.67)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { textShadow: '0 0 16px hsl(180, 100%, 50%), 0 0 32px hsla(310, 100%, 50%, 0.63)' },
          '100%': { textShadow: '0 0 24px hsl(180, 100%, 50%), 0 0 48px hsl(310, 100%, 50%)' }
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      backgroundImage: {
        'grid': 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

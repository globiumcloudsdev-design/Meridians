export const THEME = {
    colors: {
        primary: "oklch(0.48 0.13 170)", // Main brand color (Emerald/Teal)
        secondary: "oklch(0.75 0.12 80)", // Premium Gold
        accent: "oklch(0.55 0.12 170)",    // Accent color
        background: "oklch(0.98 0 0)",
        white: "#F7E7CE", // Premium Cream
        foreground: "oklch(0.15 0 0)",
        card: "oklch(1 0 0)",
        muted: "oklch(0.92 0 0)",
        destructive: "oklch(0.577 0.245 27.325)",

        // Additional UI Colors
        success: "oklch(0.65 0.15 150)",   // Emerald/Green
        warning: "oklch(0.75 0.15 60)",    // Amber/Gold
        info: "oklch(0.6 0.15 250)",       // Blue/Sky

        // Darker variant for Stats bar etc
        dark: "#1a1c1e",
    },
    animations: {
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        float: {
            y: [0, -10, 0],
            transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
    },
    radius: {
        full: "9999px",
        "3xl": "1.5rem",
        "4xl": "2.5rem",
    }
} as const;

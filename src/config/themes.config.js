/**
 * Theme Configuration
 * تكوين السمات والألوان
 */

export const themes = {
    light: {
        name: "النور",
        colors: {
            primary: "#1B5E20",
            primaryLight: "#4CAF50",
            secondary: "#FFD54F",
            background: "#FAFAFA",
            surface: "#FFFFFF",
            text: "#212121",
            textSecondary: "#757575",
            border: "#E0E0E0",
            success: "#66BB6A",
            error: "#EF5350",
            warning: "#FFA726",
        },
    },
    dark: {
        name: "الظلام",
        colors: {
            primary: "#81C784",
            primaryLight: "#A5D6A7",
            secondary: "#FFD54F",
            background: "#0D1117",
            surface: "#161B22",
            text: "#F0F6FC",
            textSecondary: "#8B949E",
            border: "#30363D",
            success: "#238636",
            error: "#F85149",
            warning: "#D29922",
        },
    },
};

// Tailwind CSS class mappings for easy reference
export const tailwindTheme = {
    light: {
        bg: "bg-gray-50",
        surface: "bg-white",
        text: "text-gray-900",
        textSecondary: "text-gray-500",
        border: "border-gray-200",
        primary: "text-green-800",
        primaryBg: "bg-green-800",
    },
    dark: {
        bg: "dark:bg-gray-950",
        surface: "dark:bg-gray-900",
        text: "dark:text-gray-50",
        textSecondary: "dark:text-gray-400",
        border: "dark:border-gray-700",
        primary: "dark:text-green-400",
        primaryBg: "dark:bg-green-600",
    },
};

export default themes;

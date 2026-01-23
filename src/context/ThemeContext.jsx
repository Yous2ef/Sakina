import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem("sakina-theme");
        if (saved) return saved;
        // Check system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
        return "light";
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "system") {
            const systemDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
            root.classList.toggle("dark", systemDark);
        } else {
            root.classList.toggle("dark", theme === "dark");
        }

        localStorage.setItem("sakina-theme", theme);
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e) => {
            document.documentElement.classList.toggle("dark", e.matches);
        };

        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [theme]);

    const value = {
        theme,
        setTheme,
        isDark:
            theme === "dark" ||
            (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches),
        toggleTheme: () =>
            setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
}

export default ThemeContext;

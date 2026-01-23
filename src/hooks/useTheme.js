import { useThemeContext } from "../context/ThemeContext";

/**
 * useTheme - Hook for theme management
 * هوك لإدارة السمة (الفاتح/الداكن)
 */
export function useTheme() {
    const { theme, setTheme, isDark, toggleTheme } = useThemeContext();

    return {
        theme,
        setTheme,
        isDark,
        toggleTheme,
        isLight: !isDark,
        isSystem: theme === "system",
    };
}

export default useTheme;

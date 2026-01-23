import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext(null);

const defaultSettings = {
    theme: "system",
    language: "ar",
    notifications: {
        enabled: true,
        morning: { enabled: true, time: "06:00" },
        evening: { enabled: true, time: "17:00" },
        tasbih: { enabled: false, time: null },
        relief: { enabled: false, time: null },
    },
    hapticFeedback: true,
    fontSize: "medium", // small, medium, large
    showTranslation: false,
    autoReset: true, // Reset progress daily
};

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem("sakina-settings");
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch {
                return defaultSettings;
            }
        }
        return defaultSettings;
    });

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem("sakina-settings", JSON.stringify(settings));
    }, [settings]);

    // Apply font size to document root
    useEffect(() => {
        const root = document.documentElement;
        // Remove all font size classes
        root.classList.remove("font-small", "font-medium", "font-large");
        // Add current font size class
        root.classList.add(`font-${settings.fontSize}`);
    }, [settings.fontSize]);

    const updateSettings = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateNotification = (section, updates) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [section]: {
                    ...prev.notifications[section],
                    ...updates,
                },
            },
        }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem("sakina-settings");
    };

    const value = {
        settings,
        updateSettings,
        updateNotification,
        resetSettings,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettingsContext() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error(
            "useSettingsContext must be used within a SettingsProvider",
        );
    }
    return context;
}

export default SettingsContext;

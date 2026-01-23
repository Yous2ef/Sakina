import { useState, useEffect, useCallback } from "react";
import { useSettingsContext } from "../context/SettingsContext";

/**
 * useNotification - Hook for managing notifications
 * هوك لإدارة الإشعارات
 */
export function useNotification() {
    const { settings, updateNotification } = useSettingsContext();
    const [permission, setPermission] = useState("default");

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!("Notification" in window)) {
            return { granted: false, error: "المتصفح لا يدعم الإشعارات" };
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return { granted: result === "granted", permission: result };
        } catch (error) {
            return { granted: false, error: error.message };
        }
    }, []);

    const sendNotification = useCallback(
        (title, options = {}) => {
            if (permission !== "granted") return null;

            const defaultOptions = {
                icon: "/icons/icon-192.png",
                badge: "/icons/icon-96.png",
                dir: "rtl",
                lang: "ar",
                vibrate: [200, 100, 200],
                ...options,
            };

            try {
                return new Notification(title, defaultOptions);
            } catch (error) {
                console.warn("Error sending notification:", error);
                return null;
            }
        },
        [permission],
    );

    const scheduleNotification = useCallback(
        (section, time) => {
            updateNotification(section, { time, enabled: true });
            // Note: Actual scheduling requires Service Worker
            // This saves the preference for the SW to use
        },
        [updateNotification],
    );

    const cancelNotification = useCallback(
        (section) => {
            updateNotification(section, { enabled: false });
        },
        [updateNotification],
    );

    return {
        permission,
        isSupported: "Notification" in window,
        isGranted: permission === "granted",
        isDenied: permission === "denied",
        requestPermission,
        sendNotification,
        scheduleNotification,
        cancelNotification,
        settings: settings.notifications,
    };
}

export default useNotification;

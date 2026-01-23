import { useEffect } from "react";
import { useSettingsContext } from "../context/SettingsContext";
import {
    initializeScheduledNotifications,
    getPermissionStatus,
} from "../services/notificationService";

/**
 * NotificationInitializer - Initializes scheduled notifications on app load
 * مكون تهيئة الإشعارات عند تحميل التطبيق
 */
export function NotificationInitializer() {
    const { settings } = useSettingsContext();

    useEffect(() => {
        // Only initialize if permission is already granted
        if (getPermissionStatus() === "granted" && settings.notifications) {
            // Small delay to ensure app is fully loaded
            const timer = setTimeout(() => {
                initializeScheduledNotifications(settings.notifications);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []); // Only run once on mount

    // This component doesn't render anything
    return null;
}

export default NotificationInitializer;

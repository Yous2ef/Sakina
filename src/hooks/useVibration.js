import { useCallback } from "react";
import { useSettingsContext } from "../context/SettingsContext";

/**
 * useVibration - Hook for haptic feedback
 * هوك للاهتزاز عند الضغط
 */
export function useVibration() {
    const { settings } = useSettingsContext();

    const vibrate = useCallback(
        (pattern = 10) => {
            if (!settings.hapticFeedback) return false;

            if ("vibrate" in navigator) {
                try {
                    navigator.vibrate(pattern);
                    return true;
                } catch {
                    return false;
                }
            }
            return false;
        },
        [settings.hapticFeedback],
    );

    // Predefined patterns
    const patterns = {
        light: 10, // Light tap
        medium: 25, // Medium tap
        heavy: 50, // Heavy tap
        success: [50, 30, 50], // Success feedback
        error: [100, 50, 100], // Error feedback
        double: [20, 50, 20], // Double tap
    };

    const lightTap = useCallback(() => vibrate(patterns.light), [vibrate]);
    const mediumTap = useCallback(() => vibrate(patterns.medium), [vibrate]);
    const heavyTap = useCallback(() => vibrate(patterns.heavy), [vibrate]);
    const successVibrate = useCallback(
        () => vibrate(patterns.success),
        [vibrate],
    );
    const errorVibrate = useCallback(() => vibrate(patterns.error), [vibrate]);

    return {
        vibrate,
        lightTap,
        mediumTap,
        heavyTap,
        successVibrate,
        errorVibrate,
        isSupported: "vibrate" in navigator,
        isEnabled: settings.hapticFeedback,
    };
}

export default useVibration;

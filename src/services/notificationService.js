/**
 * Notification Service - Push and local notifications
 * خدمة الإشعارات
 */

// Store active timers for scheduled notifications
const activeTimers = new Map();

/**
 * Check if notifications are supported
 */
export function isNotificationSupported() {
    return "Notification" in window;
}

/**
 * Get current notification permission
 */
export function getPermissionStatus() {
    if (!isNotificationSupported()) return "unsupported";
    return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestPermission() {
    if (!isNotificationSupported()) {
        return { granted: false, error: "المتصفح لا يدعم الإشعارات" };
    }

    try {
        const permission = await Notification.requestPermission();
        return {
            granted: permission === "granted",
            permission,
        };
    } catch (error) {
        return { granted: false, error: error.message };
    }
}

/**
 * Show a local notification
 */
export function showNotification(title, options = {}) {
    if (getPermissionStatus() !== "granted") {
        console.warn("Notification permission not granted");
        return null;
    }

    const defaultOptions = {
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-96.png",
        dir: "rtl",
        lang: "ar",
        vibrate: [200, 100, 200],
        tag: "sakina-notification",
        renotify: true,
        ...options,
    };

    try {
        const notification = new Notification(title, defaultOptions);

        notification.onclick = () => {
            window.focus();
            notification.close();
            options.onClick?.();
        };

        return notification;
    } catch (error) {
        console.error("Error showing notification:", error);
        return null;
    }
}

/**
 * Get notification content for a section
 */
export function getNotificationContent(section) {
    const content = {
        morning: {
            title: "ذكر الصباح 🌅",
            body: "حان وقت ذكر الصباح، ابدأ يومك بذكر الله",
        },
        evening: {
            title: "ذكر المساء 🌙",
            body: "حان وقت ذكر المساء، اختم يومك بالسكينة",
        },
        tasbih: {
            title: "صلاة التسبيح 🤲",
            body: "تذكير بصلاة التسبيح، صلاة الغفران",
        },
        relief: {
            title: "مفاتيح الفرج ❤️",
            body: "استعن بالله في تفريج همومك",
        },
    };

    return content[section] || { title: "سَكِينَة", body: "وقت الذكر" };
}

/**
 * Calculate milliseconds until next occurrence of a time
 * Uses user's local timezone automatically
 * @param {string} time - Time in HH:MM format
 * @returns {number} Milliseconds until next occurrence
 */
function getMillisecondsUntilTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date();

    // Set to the specified time in user's local timezone
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    return scheduledTime.getTime() - now.getTime();
}

/**
 * Schedule a notification for a specific section
 * Uses setTimeout for in-app scheduling (works in user's local timezone)
 * @param {string} section - Section identifier (morning, evening, tasbih, relief)
 * @param {string} time - Time in HH:MM format
 * @param {boolean} repeat - Whether to repeat daily
 */
export function scheduleNotification(section, time, repeat = true) {
    // Cancel any existing timer for this section
    cancelScheduledNotification(section);

    if (!time) return false;

    const delay = getMillisecondsUntilTime(time);
    const content = getNotificationContent(section);

    console.log(
        `📅 Scheduling ${section} notification for ${time} (in ${Math.round(delay / 60000)} minutes)`,
    );

    const timerId = setTimeout(() => {
        // Show the notification
        showNotification(content.title, {
            body: content.body,
            tag: `sakina-${section}`,
        });

        // If repeat is enabled, schedule the next occurrence (24 hours later)
        if (repeat) {
            scheduleNotification(section, time, true);
        }
    }, delay);

    // Store the timer ID and schedule info
    activeTimers.set(section, {
        timerId,
        time,
        nextOccurrence: new Date(Date.now() + delay).toISOString(),
    });

    // Persist schedule info for page reloads
    localStorage.setItem(
        `sakina-schedule-${section}`,
        JSON.stringify({
            time,
            enabled: true,
            nextOccurrence: new Date(Date.now() + delay).toISOString(),
        }),
    );

    return true;
}

/**
 * Cancel a scheduled notification
 * @param {string} section - Section identifier
 */
export function cancelScheduledNotification(section) {
    const timerInfo = activeTimers.get(section);
    if (timerInfo) {
        clearTimeout(timerInfo.timerId);
        activeTimers.delete(section);
    }

    localStorage.removeItem(`sakina-schedule-${section}`);
    console.log(`🚫 Cancelled ${section} notification`);
}

/**
 * Initialize notifications from saved schedules
 * Call this when the app starts
 */
export function initializeScheduledNotifications(notificationSettings) {
    if (getPermissionStatus() !== "granted") {
        console.log(
            "Notification permission not granted, skipping initialization",
        );
        return;
    }

    const sections = ["morning", "evening", "tasbih", "relief"];

    sections.forEach((section) => {
        const settings = notificationSettings?.[section];
        if (settings?.enabled && settings?.time) {
            scheduleNotification(section, settings.time, true);
        }
    });

    console.log("✅ Notification schedules initialized");
}

/**
 * Get schedule info for a section
 * @param {string} section - Section identifier
 * @returns {Object|null} Schedule info or null
 */
export function getScheduleInfo(section) {
    const timerInfo = activeTimers.get(section);
    if (timerInfo) {
        return {
            time: timerInfo.time,
            nextOccurrence: timerInfo.nextOccurrence,
            isActive: true,
        };
    }

    // Check localStorage for persisted info
    const saved = localStorage.getItem(`sakina-schedule-${section}`);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            return { ...parsed, isActive: false };
        } catch {
            return null;
        }
    }

    return null;
}

/**
 * Show completion notification
 */
export function showCompletionNotification(section) {
    const messages = {
        morning: "ما شاء الله! أتممت ذكر الصباح 🌟",
        evening: "بارك الله فيك! أتممت ذكر المساء 🌙",
        tasbih: "تقبّل الله صلاتك! 🤲",
        relief: "استجاب الله دعاءك! ❤️",
    };

    return showNotification("سَكِينَة", {
        body: messages[section] || "أتممت الذكر",
        tag: `sakina-complete-${section}`,
    });
}

/**
 * Test notification - sends a notification immediately
 * @param {string} section - Section to test
 */
export function testNotification(section = "morning") {
    const content = getNotificationContent(section);
    return showNotification(content.title, {
        body: `${content.body} (اختبار)`,
        tag: `sakina-test-${section}`,
    });
}

export default {
    isNotificationSupported,
    getPermissionStatus,
    requestPermission,
    showNotification,
    getNotificationContent,
    scheduleNotification,
    cancelScheduledNotification,
    initializeScheduledNotifications,
    getScheduleInfo,
    showCompletionNotification,
    testNotification,
};

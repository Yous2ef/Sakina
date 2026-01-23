/**
 * Notifications Configuration
 * تكوين الإشعارات
 */

export const notificationDefaults = {
    // Global settings
    enabled: true,
    sound: true,
    vibrate: true,

    // Per-section notification settings
    sections: {
        morning: {
            id: "morning-dhkar",
            title: "ذكر الصباح",
            body: "☀️ حان وقت ذكر الصباح",
            enabled: true,
            defaultTime: "06:00",
            icon: "icons/icon-192.png",
            tag: "morning-reminder",
        },
        evening: {
            id: "evening-dhkar",
            title: "ذكر المساء",
            body: "🌙 حان وقت ذكر المساء",
            enabled: true,
            defaultTime: "17:00",
            icon: "icons/icon-192.png",
            tag: "evening-reminder",
        },
        tasbih: {
            id: "tasbih-prayer",
            title: "صلاة التسبيح",
            body: "📿 تذكير بصلاة التسبيح",
            enabled: false,
            defaultTime: null,
            icon: "icons/icon-192.png",
            tag: "tasbih-reminder",
        },
        relief: {
            id: "keys-relief",
            title: "مفاتيح الفرج",
            body: "🔑 تذكير بأدعية الفرج",
            enabled: false,
            defaultTime: null,
            icon: "icons/icon-192.png",
            tag: "relief-reminder",
        },
    },
};

export const notificationPermissionMessages = {
    default: "اسمح بالإشعارات لتذكيرك بذكر الصباح والمساء",
    denied: "تم رفض الإشعارات. يمكنك تفعيلها من إعدادات المتصفح",
    granted: "تم تفعيل الإشعارات بنجاح",
};

export default notificationDefaults;

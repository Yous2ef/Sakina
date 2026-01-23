/**
 * App Configuration
 * التكوين العام للتطبيق
 */

export default {
    // App Info
    appName: "سَكِينَة",
    appNameEn: "Sakina",
    appSubtitle: "ذكر المسلم",
    version: "1.0.0",

    // Developer & Links
    developer: {
        name: "Youssef Mahmoud",
        nameAr: "يوسف محمود",
    },

    // Dedication - إهداء
    dedication: {
        enabled: true,
        title: "إهداء",
        recipient: "محمود عبدالقادر",
        recipientEn: "Mahmoud Abdelqader",
        message: "رحمةً ونوراً على والدي محمود عبدالقادر • كان نعم الوالد",
        note: "هذا التطبيق صدقة جارية له ولجميع أموات المسلمين",
        openSource: "التطبيق مفتوح المصدر ليكون صدقة جارية مستمرة",
        doaa: "اللهم اجعل هذا العمل صدقة جارية له ولجميع أموات المسلمين",
    },

    links: {
        github: "https://github.com/Yous2ef/SalatAltasbih",
        repository: "https://github.com/Yous2ef/SalatAltasbih",
        issues: "https://github.com/Yous2ef/SalatAltasbih/issues",
        discussions: "https://github.com/Yous2ef/SalatAltasbih/discussions",
    },

    // Localization
    defaultLanguage: "ar",
    rtl: true,

    // Themes
    supportedThemes: ["light", "dark", "system"],
    defaultTheme: "system",

    // Features
    features: {
        audio: true,
        haptics: true,
        notifications: true,
        share: true,
        references: true,
    },

    // Storage Keys
    storageKeys: {
        theme: "sakina-theme",
        settings: "sakina-settings",
        progress: "sakina-progress",
        favorites: "sakina-favorites",
    },

    // IndexedDB
    db: {
        name: "sakina-db",
        version: 1,
        stores: {
            progress: "user-progress",
            settings: "user-settings",
            favorites: "user-favorites",
        },
    },

    // Routes
    routes: {
        home: "/",
        morning: "/morning",
        evening: "/evening",
        tasbih: "/tasbih",
        relief: "/relief",
        settings: "/settings",
        dhikrDetail: "/dhikr/:category/:id",
    },
};

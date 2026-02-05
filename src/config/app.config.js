/**
 * App Configuration
 * التكوين العام للتطبيق
 */

export default {
    // App Info
    appName: "سَكِينَة",
    appNameEn: "Sakina",
    appSubtitle: "ذكر المسلم",
    version: "1.0.1",

    // Developer & Links
    developer: {
        name: "Youssef Mahmoud",
        nameAr: "يوسف محمود",
    },

    // Dedication - إهداء
    dedication: {
        enabled: true,
        title: "إهداء",
        recipient: "محمود عبدالقادر و مختار عطيه",
        recipientEn: "Mahmoud Abdelqader and Mokhtar Atiya",
        message:
            "صدقة جارية على والدي 'محمود عبدالقادر' وعلي 'مختار عطيه' والد صديقي • كانوا نعم الاباء والأصدقاء • رحمهم الله وجعل مثواهم الجنة",
        note: "هذا التطبيق صدقة جارية لهم ولجميع أموات المسلمين",
        openSource: "التطبيق مفتوح المصدر ليكون صدقة جارية مستمرة",
        doaa: "اللهم اجعل هذا العمل صدقة جارية لهم ولجميع أموات المسلمين",
    },

    links: {
        github: "https://github.com/Yous2ef/Sakina",
        repository: "https://github.com/Yous2ef/Sakina",
        issues: "https://github.com/Yous2ef/Sakina/issues",
        discussions: "https://github.com/Yous2ef/Sakina/discussions",
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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    base: "/Sakina/",
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "fonts/*.woff2",
                "icons/*.png",
                "icons/*.svg",
                "favicon.ico",
            ],
            manifest: {
                name: "سَكِينَة - تطبيق الأذكار والأدعية",
                short_name: "سَكِينَة",
                description:
                    "تطبيق إسلامي للأذكار والأدعية - أذكار الصباح والمساء، صلاة التسبيح، مفاتيح الفرج. يساعدك على المحافظة على أذكارك اليومية",
                theme_color: "#1B5E20",
                background_color: "#0D1117",
                display: "standalone",
                orientation: "portrait",
                start_url: "/Sakina/",
                scope: "/Sakina/",
                lang: "ar",
                dir: "rtl",
                categories: ["lifestyle", "utilities", "education"],
                icons: [
                    {
                        src: "icons/icon-192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
                shortcuts: [
                    {
                        name: "أذكار الصباح",
                        short_name: "الصباح",
                        description: "30 ذكر كامل مع الفضائل والمصادر",
                        url: "/Sakina/morning",
                        icons: [
                            { src: "icons/icon-192.png", sizes: "192x192" },
                        ],
                    },
                    {
                        name: "أذكار المساء",
                        short_name: "المساء",
                        description: "27 ذكر كامل مع الفضائل والمصادر",
                        url: "/Sakina/evening",
                        icons: [
                            { src: "icons/icon-192.png", sizes: "192x192" },
                        ],
                    },
                    {
                        name: "صلاة التسبيح",
                        short_name: "التسبيح",
                        description: "دليل كامل لصلاة التسبيح",
                        url: "/Sakina/tasbih-prayer",
                        icons: [
                            { src: "icons/icon-192.png", sizes: "192x192" },
                        ],
                    },
                    {
                        name: "مفاتيح الفرج",
                        short_name: "الفرج",
                        description: "وصفات روحانية من كتاب مفاتيح الفرج",
                        url: "/Sakina/keys-to-relief",
                        icons: [
                            { src: "icons/icon-192.png", sizes: "192x192" },
                        ],
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,json}"],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-webfonts",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                        },
                    },
                ],
            },
        }),
    ],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: "dist",
        sourcemap: false,
    },
});

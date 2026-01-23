/**
 * Router Configuration
 * تكوين التوجيه والمسارات
 */

export const routes = {
    home: "/",
    morning: "/morning",
    evening: "/evening",
    tasbih: "/tasbih",
    relief: "/relief",
    settings: "/settings",
    dhikrDetail: "/dhikr/:category/:id",
};

export const navItems = [
    {
        id: "home",
        path: "/",
        label: "الرئيسية",
        icon: "RiHome5Line",
        activeIcon: "RiHome5Fill",
    },
    {
        id: "morning",
        path: "/morning",
        label: "الصباح",
        icon: "RiSunLine",
        activeIcon: "RiSunFill",
    },
    {
        id: "evening",
        path: "/evening",
        label: "المساء",
        icon: "RiMoonLine",
        activeIcon: "RiMoonFill",
    },
    {
        id: "tasbih",
        path: "/tasbih",
        label: "التسبيح",
        icon: "HiOutlineSparkles",
        activeIcon: "HiSparkles",
    },
    {
        id: "relief",
        path: "/relief",
        label: "الفرج",
        icon: "HiOutlineKey",
        activeIcon: "HiKey",
    },
];

export default routes;

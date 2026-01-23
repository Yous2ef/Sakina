import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
    RiHome5Fill,
    RiHome5Line,
    RiSunFill,
    RiSunLine,
    RiMoonFill,
    RiMoonLine,
    RiHeart3Fill,
    RiHeart3Line,
    RiSettings4Fill,
    RiSettings4Line,
} from "react-icons/ri";
import { useVibration } from "../hooks/useVibration";

const navItems = [
    {
        path: "/settings",
        label: "الإعدادات",
        IconActive: RiSettings4Fill,
        IconInactive: RiSettings4Line,
    },
    {
        path: "/relief",
        label: "مفاتيح",
        IconActive: RiHeart3Fill,
        IconInactive: RiHeart3Line,
    },
    {
        path: "/",
        label: "الرئيسية",
        IconActive: RiHome5Fill,
        IconInactive: RiHome5Line,
        isCenter: true,
    },
    {
        path: "/evening",
        label: "المساء",
        IconActive: RiMoonFill,
        IconInactive: RiMoonLine,
    },
    {
        path: "/morning",
        label: "الصباح",
        IconActive: RiSunFill,
        IconInactive: RiSunLine,
    },
];

/**
 * BottomNav - Bottom navigation bar
 * شريط التنقل السفلي
 */
export function BottomNav() {
    const location = useLocation();
    const { lightTap } = useVibration();

    // Hide on detail pages
    if (location.pathname.includes("/dhikr/")) return null;

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-t border-gray-200/50 dark:border-gray-700/50 pb-safe">
            <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
                {navItems.map(
                    ({ path, label, IconActive, IconInactive, isCenter }) => {
                        const isActive = location.pathname === path;

                        return (
                            <NavLink
                                key={path}
                                to={path}
                                onClick={lightTap}
                                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                                    isCenter ? "relative -mt-6" : ""
                                }`}>
                                {isCenter ? (
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                                            isActive
                                                ? "bg-linear-to-br from-emerald-500 to-teal-600 text-white"
                                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                                        }`}>
                                        {isActive ? (
                                            <IconActive className="w-6 h-6" />
                                        ) : (
                                            <IconInactive className="w-6 h-6" />
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                            isActive
                                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                                : "text-gray-500 dark:text-gray-400"
                                        }`}>
                                        {isActive ? (
                                            <IconActive className="w-5 h-5" />
                                        ) : (
                                            <IconInactive className="w-5 h-5" />
                                        )}
                                    </motion.div>
                                )}

                                {!isCenter && (
                                    <span
                                        className={`text-xs font-medium transition-colors ${
                                            isActive
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-gray-500 dark:text-gray-400"
                                        }`}>
                                        {label}
                                    </span>
                                )}
                            </NavLink>
                        );
                    },
                )}
            </div>
        </motion.nav>
    );
}

export default BottomNav;

import { motion } from "framer-motion";
import { RiMoonClearFill, RiSunFill, RiArrowRightSLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import pageInfo from "../data/page-info.json";

/**
 * Header - Main navigation header
 * الهيدر الرئيسي للتطبيق
 */
export function Header({
    title,
    showBack = false,
    showThemeToggle = true,
    rightAction = null,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();

    // Get page info for current route
    const currentPage = pageInfo.pages?.find(
        (p) => p.route === location.pathname,
    );
    const displayTitle = title || currentPage?.title || "سَكِينَة";

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
                {/* Right side - Back or Theme Toggle */}
                <div className="w-10 h-10 flex items-center justify-center">
                    {showBack ? (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="رجوع">
                            <RiArrowRightSLine className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </motion.button>
                    ) : showThemeToggle ? (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label={
                                isDark ? "الوضع النهاري" : "الوضع الليلي"
                            }>
                            {isDark ? (
                                <RiSunFill className="w-5 h-5 text-amber-500" />
                            ) : (
                                <RiMoonClearFill className="w-5 h-5 text-indigo-600" />
                            )}
                        </motion.button>
                    ) : null}
                </div>

                {/* Center - Title */}
                <h1 className="text-lg font-bold text-gray-900 dark:text-white font-amiri">
                    {displayTitle}
                </h1>

                {/* Left side - Custom action or placeholder */}
                <div className="w-10 h-10 flex items-center justify-center">
                    {rightAction}
                </div>
            </div>
        </motion.header>
    );
}

export default Header;

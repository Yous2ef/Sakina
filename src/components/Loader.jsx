import { motion } from "framer-motion";

/**
 * Loader - Loading spinner component
 * مكون التحميل
 */
export function Loader({
    size = "md",
    color = "emerald",
    fullScreen = false,
    text = "",
    className = "",
}) {
    const sizes = {
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    const colors = {
        emerald: "border-emerald-500",
        white: "border-white",
        gray: "border-gray-500",
    };

    const spinner = (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`
        ${sizes[size]}
        border-4 border-gray-200 dark:border-gray-700
        rounded-full
        ${className}
      `}
            style={{ borderTopColor: "currentColor" }}>
            <span className={`sr-only`}>جارٍ التحميل...</span>
        </motion.div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <div className={`${colors[color]}`}>{spinner}</div>
                {text && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
                        {text}
                    </motion.p>
                )}
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col items-center justify-center gap-3 ${colors[color]}`}>
            {spinner}
            {text && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {text}
                </p>
            )}
        </div>
    );
}

/**
 * PageLoader - Full page loading state
 * حالة تحميل الصفحة الكاملة
 */
export function PageLoader({ text = "جارٍ التحميل..." }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4">
                {/* Animated Logo */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl font-amiri text-emerald-600 dark:text-emerald-400">
                    سَكِينَة
                </motion.div>

                <Loader size="lg" />

                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {text}
                </p>
            </motion.div>
        </div>
    );
}

export default Loader;

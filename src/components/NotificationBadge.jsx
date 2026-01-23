import { motion, AnimatePresence } from "framer-motion";
import { RiBellFill } from "react-icons/ri";

/**
 * NotificationBadge - Badge showing notification status
 * شارة حالة الإشعارات
 */
export function NotificationBadge({
    enabled = false,
    time = "",
    size = "sm",
    showTime = true,
    className = "",
}) {
    const sizes = {
        xs: "w-4 h-4 text-[8px]",
        sm: "w-5 h-5 text-[10px]",
        md: "w-6 h-6 text-xs",
    };

    if (!enabled) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`flex items-center gap-1 ${className}`}>
                <div
                    className={`
            ${sizes[size]}
            rounded-full bg-amber-500 text-white
            flex items-center justify-center
          `}>
                    <RiBellFill className="w-2.5 h-2.5" />
                </div>

                {showTime && time && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {time}
                    </span>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * NotificationDot - Simple dot indicator
 * نقطة مؤشر بسيطة
 */
export function NotificationDot({
    color = "emerald",
    pulse = false,
    size = "sm",
    className = "",
}) {
    const sizes = {
        xs: "w-1.5 h-1.5",
        sm: "w-2 h-2",
        md: "w-2.5 h-2.5",
        lg: "w-3 h-3",
    };

    const colors = {
        emerald: "bg-emerald-500",
        blue: "bg-blue-500",
        amber: "bg-amber-500",
        red: "bg-red-500",
    };

    return (
        <span className={`relative ${className}`}>
            <span
                className={`
          ${sizes[size]} ${colors[color]}
          rounded-full inline-block
        `}
            />
            {pulse && (
                <span
                    className={`
            ${sizes[size]} ${colors[color]}
            rounded-full absolute top-2.5 left-0 scale-125
            animate-ping opacity-75
          `}
                />
            )}
        </span>
    );
}

export default NotificationBadge;

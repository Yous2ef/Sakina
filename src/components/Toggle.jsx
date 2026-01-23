import { motion } from "framer-motion";
import { useVibration } from "../hooks/useVibration";

/**
 * Toggle - Switch toggle component
 * مفتاح التبديل
 */
export function Toggle({
    checked,
    onChange,
    disabled = false,
    size = "md",
    label = "",
    description = "",
    className = "",
}) {
    const { lightTap } = useVibration();

    const sizes = {
        sm: { track: "w-9 h-5", thumb: "w-4 h-4", translate: "translate-x-4" },
        md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
        lg: { track: "w-14 h-8", thumb: "w-7 h-7", translate: "translate-x-6" },
    };

    const currentSize = sizes[size];

    const handleToggle = () => {
        if (!disabled) {
            lightTap();
            onChange(!checked);
        }
    };

    return (
        <div className={`flex items-center justify-between gap-4 ${className}`}>
            {(label || description) && (
                <div className="flex-1">
                    {label && (
                        <span className="block text-gray-900 dark:text-white font-medium">
                            {label}
                        </span>
                    )}
                    {description && (
                        <span className="block text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {description}
                        </span>
                    )}
                </div>
            )}

            <motion.button
                dir="ltr"
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={handleToggle}
                whileTap={{ scale: 0.95 }}
                className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full 
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${currentSize.track}
          ${checked ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}
        `}>
                <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`
            pointer-events-none inline-block rounded-full bg-white shadow-lg
            ring-0 transform
            ${currentSize.thumb}
            ${checked ? currentSize.translate : "translate-x-0.5"}
            mt-0.5
          `}
                />
            </motion.button>
        </div>
    );
}

export default Toggle;

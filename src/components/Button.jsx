import { motion } from "framer-motion";
import { useVibration } from "../hooks/useVibration";
import { scaleOnTap } from "../utils/animations";

/**
 * Button - Reusable button component
 * زر قابل لإعادة الاستخدام
 */
export function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    loading = false,
    icon = null,
    iconPosition = "start",
    onClick,
    className = "",
    ...props
}) {
    const { lightTap } = useVibration();

    const baseStyles =
        "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-linear-to-br from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-500 shadow-lg shadow-emerald-500/25",
        secondary:
            "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-400",
        outline:
            "border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 focus:ring-emerald-500",
        ghost: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
    };

    const handleClick = (e) => {
        if (!disabled && !loading) {
            lightTap();
            onClick?.(e);
        }
    };

    return (
        <motion.button
            {...scaleOnTap}
            disabled={disabled || loading}
            onClick={handleClick}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            {...props}>
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>جارٍ التحميل...</span>
                </>
            ) : (
                <>
                    {icon && iconPosition === "start" && icon}
                    {children}
                    {icon && iconPosition === "end" && icon}
                </>
            )}
        </motion.button>
    );
}

export default Button;

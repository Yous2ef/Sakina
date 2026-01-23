import { motion } from "framer-motion";
import { RiQuestionLine } from "react-icons/ri";
import { useVibration } from "../hooks/useVibration";
import { scaleOnTap } from "../utils/animations";

/**
 * ReferenceButton - Button to show hadith/reference info
 * زر عرض مصدر الحديث (؟)
 */
export function ReferenceButton({
    onClick,
    size = "md",
    variant = "default",
    className = "",
}) {
    const { lightTap } = useVibration();

    const sizes = {
        sm: "w-6 h-6 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
    };

    const variants = {
        default:
            "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50",
        subtle: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
        outline:
            "border-2 border-amber-400 dark:border-amber-600 text-amber-600 dark:text-amber-400",
    };

    const handleClick = (e) => {
        e.stopPropagation();
        lightTap();
        onClick?.(e);
    };

    return (
        <motion.button
            {...scaleOnTap}
            onClick={handleClick}
            className={`
        ${sizes[size]}
        ${variants[variant]}
        rounded-full flex items-center justify-center
        transition-colors font-bold font-amiri
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
        ${className}
      `}
            aria-label="عرض المصدر"
            title="عرض المصدر والتخريج">
            <RiQuestionLine className="w-4 h-4" />
        </motion.button>
    );
}

export default ReferenceButton;

import { motion } from "framer-motion";
import { useVibration } from "../hooks/useVibration";
import { scaleOnTap } from "../utils/animations";

/**
 * Counter - Tap counter for tasbih/dhikr
 * عداد التسبيح
 */
export function Counter({
    count,
    target,
    onTap,
    onReset,
    size = "lg",
    showTarget = true,
    label = "",
}) {
    const { mediumTap, successVibrate, heavyTap } = useVibration();

    const isComplete = target && count >= target;
    const progress = target ? (count / target) * 100 : 0;

    const sizes = {
        sm: { container: "w-24 h-24", text: "text-3xl", ring: 80, stroke: 6 },
        md: { container: "w-32 h-32", text: "text-4xl", ring: 112, stroke: 8 },
        lg: { container: "w-40 h-40", text: "text-5xl", ring: 140, stroke: 10 },
        xl: { container: "w-48 h-48", text: "text-6xl", ring: 168, stroke: 12 },
    };

    const currentSize = sizes[size];
    const radius = (currentSize.ring - currentSize.stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    const handleTap = () => {
        if (isComplete) {
            heavyTap();
            return;
        }

        mediumTap();
        onTap?.();

        if (target && count + 1 >= target) {
            successVibrate();
        }
    };

    const handleReset = (e) => {
        e.stopPropagation();
        heavyTap();
        onReset?.();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Label */}
            {label && (
                <p className="text-gray-600 dark:text-gray-300 font-amiri text-lg">
                    {label}
                </p>
            )}

            {/* Counter Circle */}
            <motion.div
                {...scaleOnTap}
                onClick={handleTap}
                className={`
          relative ${currentSize.container} 
          flex items-center justify-center 
          cursor-pointer select-none
        `}>
                {/* Background Ring */}
                <svg
                    className="absolute inset-0 -rotate-90"
                    viewBox={`0 0 ${currentSize.ring} ${currentSize.ring}`}>
                    {/* Track */}
                    <circle
                        cx={currentSize.ring / 2}
                        cy={currentSize.ring / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={currentSize.stroke}
                        className="text-gray-200 dark:text-gray-700"
                    />
                    {/* Progress */}
                    {showTarget && target && (
                        <motion.circle
                            cx={currentSize.ring / 2}
                            cy={currentSize.ring / 2}
                            r={radius}
                            fill="none"
                            stroke="url(#counterGradient)"
                            strokeWidth={currentSize.stroke}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    )}
                    <defs>
                        <linearGradient
                            id="counterGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#14B8A6" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Count Display */}
                <motion.div
                    key={count}
                    initial={{ scale: 1.2, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`
            counter-number font-bold
            ${
                isComplete
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-900 dark:text-white"
            }
          `}>
                    {count}
                </motion.div>
            </motion.div>

            {/* Target indicator */}
            {showTarget && target && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                        الهدف: {target}
                    </span>
                    {isComplete && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-emerald-600 dark:text-emerald-400 font-medium">
                            ✓ مكتمل
                        </motion.span>
                    )}
                </div>
            )}

            {/* Reset Button */}
            {count > 0 && onReset && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    إعادة تعيين
                </motion.button>
            )}
        </div>
    );
}

export default Counter;

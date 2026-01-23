import { motion } from "framer-motion";

/**
 * ProgressRing - Circular progress indicator
 * حلقة التقدم الدائرية
 */
export function ProgressRing({
    progress = 0,
    size = "md",
    showLabel = true,
    label = "",
    color = "emerald",
    className = "",
}) {
    const sizes = {
        sm: { container: "w-12 h-12", text: "text-xs", ring: 48, stroke: 4 },
        md: { container: "w-16 h-16", text: "text-sm", ring: 64, stroke: 5 },
        lg: { container: "w-20 h-20", text: "text-base", ring: 80, stroke: 6 },
        xl: { container: "w-24 h-24", text: "text-lg", ring: 96, stroke: 7 },
    };

    const colors = {
        emerald: { start: "#10B981", end: "#14B8A6" },
        blue: { start: "#3B82F6", end: "#0EA5E9" },
        amber: { start: "#F59E0B", end: "#EAB308" },
        purple: { start: "#8B5CF6", end: "#A855F7" },
        rose: { start: "#F43F5E", end: "#FB7185" },
        green: { start: "#22C55E", end: "#10B981" },
    };

    const currentSize = sizes[size];
    const currentColor = colors[color];
    const radius = (currentSize.ring - currentSize.stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset =
        circumference - (Math.min(progress, 100) / 100) * circumference;
    const gradientId = `progressGradient-${color}-${size}`;

    const isComplete = progress >= 100;

    return (
        <div className={`flex flex-col items-center gap-1 ${className}`}>
            <div className={`relative ${currentSize.container}`}>
                <svg
                    className="transform -rotate-90"
                    viewBox={`0 0 ${currentSize.ring} ${currentSize.ring}`}>
                    {/* Background track */}
                    <circle
                        cx={currentSize.ring / 2}
                        cy={currentSize.ring / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={currentSize.stroke}
                        className="text-gray-200 dark:text-gray-700"
                    />

                    {/* Progress arc */}
                    <motion.circle
                        cx={currentSize.ring / 2}
                        cy={currentSize.ring / 2}
                        r={radius}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth={currentSize.stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />

                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%">
                            <stop offset="0%" stopColor={currentColor.start} />
                            <stop offset="100%" stopColor={currentColor.end} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {isComplete ? (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-emerald-600 dark:text-emerald-400">
                            ✓
                        </motion.span>
                    ) : (
                        <span
                            className={`${currentSize.text} font-bold text-gray-900 dark:text-white`}>
                            {Math.round(progress)}%
                        </span>
                    )}
                </div>
            </div>

            {/* Label */}
            {showLabel && label && (
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {label}
                </span>
            )}
        </div>
    );
}

export default ProgressRing;

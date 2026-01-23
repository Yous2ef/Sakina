import references from "../data/references.json";

/**
 * GradeBadge - Badge showing hadith authenticity grade
 * شارة درجة صحة الحديث
 */
export function GradeBadge({ grade, size = "md", className = "" }) {
    // Get grade info from references.json
    const gradeInfo = references.grades?.find((g) => g.id === grade) || {
        id: grade,
        name: grade,
        color: "gray",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
    };

    const colors = {
        green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
        red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        gray: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    };

    return (
        <span
            className={`
        inline-flex items-center font-medium rounded-full border
        ${sizes[size]}
        ${colors[gradeInfo.color] || colors.gray}
        ${className}
      `}>
            {gradeInfo.name}
        </span>
    );
}

export default GradeBadge;

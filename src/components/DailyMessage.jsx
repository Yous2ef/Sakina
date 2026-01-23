import { useState } from "react";
import { motion } from "framer-motion";
import {
    RiRefreshLine,
    RiBookOpenLine,
    RiMoonLine,
    RiSparkling2Line,
} from "react-icons/ri";
import { getTimeBasedMessage } from "../data/motivationalMessages";

/**
 * مكون عرض الرسالة اليومية التحفيزية
 */
function DailyMessage() {
    // تهيئة الرسالة مباشرة عند التحميل الأول
    const [messageData, setMessageData] = useState(() => getTimeBasedMessage());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setMessageData(getTimeBasedMessage());
            setIsRefreshing(false);
        }, 300);
    };

    // أيقونة النوع
    const getTypeIcon = (type) => {
        switch (type) {
            case "quran":
                return <RiBookOpenLine className="w-4 h-4" />;
            case "hadith":
                return <RiMoonLine className="w-4 h-4" />;
            case "wisdom":
                return <RiSparkling2Line className="w-4 h-4" />;
            default:
                return null;
        }
    };

    // لون الخلفية بناءً على الفئة
    const getGradient = (category) => {
        switch (category) {
            case "morning":
                return "from-amber-500/10 via-orange-500/10 to-yellow-500/10";
            case "evening":
                return "from-purple-500/10 via-pink-500/10 to-rose-500/10";
            case "night":
                return "from-indigo-500/10 via-blue-500/10 to-cyan-500/10";
            default:
                return "from-emerald-500/10 via-teal-500/10 to-green-500/10";
        }
    };

    // لون الأيقونة بناءً على الفئة
    const getIconColor = (category) => {
        switch (category) {
            case "morning":
                return "text-amber-600 dark:text-amber-400";
            case "evening":
                return "text-purple-600 dark:text-purple-400";
            case "night":
                return "text-indigo-600 dark:text-indigo-400";
            default:
                return "text-emerald-600 dark:text-emerald-400";
        }
    };

    // لون الحدود بناءً على الفئة
    const getBorderColor = (category) => {
        switch (category) {
            case "morning":
                return "border-amber-200/50 dark:border-amber-700/30";
            case "evening":
                return "border-purple-200/50 dark:border-purple-700/30";
            case "night":
                return "border-indigo-200/50 dark:border-indigo-700/30";
            default:
                return "border-emerald-200/50 dark:border-emerald-700/30";
        }
    };

    if (!messageData) return null;

    const { message, greeting, category } = messageData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`
                relative overflow-hidden rounded-2xl p-4
                bg-linear-to-br ${getGradient(category)}
                backdrop-blur-sm
                border ${getBorderColor(category)}
            `}>
            {/* رأس البطاقة */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{message.icon}</span>
                    <span
                        className={`text-sm font-medium ${getIconColor(category)}`}>
                        {greeting}
                    </span>
                </div>

                {/* زر التحديث */}
                <motion.button
                    onClick={handleRefresh}
                    whileTap={{ scale: 0.9 }}
                    disabled={isRefreshing}
                    className={`
                        p-2 rounded-full
                        bg-white/50 dark:bg-gray-800/50
                        hover:bg-white/80 dark:hover:bg-gray-800/80
                        transition-colors
                        ${getIconColor(category)}
                    `}
                    title="رسالة جديدة">
                    <motion.div
                        animate={{ rotate: isRefreshing ? 360 : 0 }}
                        transition={{ duration: 0.3 }}>
                        <RiRefreshLine className="w-4 h-4" />
                    </motion.div>
                </motion.button>
            </div>

            {/* نص الرسالة */}
            <motion.div
                key={message.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}>
                <p className="text-gray-800 dark:text-gray-100 font-amiri text-lg leading-relaxed text-center mb-2 dhikr-text">
                    {message.text}
                </p>

                {/* المصدر */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {getTypeIcon(message.type)}
                    <span>{message.source}</span>
                </div>
            </motion.div>

            {/* زخرفة خلفية */}
            <div className="absolute -left-4 -bottom-4 w-24 h-24 opacity-5 pointer-events-none">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full fill-current text-gray-900 dark:text-white">
                    <text
                        x="50"
                        y="70"
                        textAnchor="middle"
                        fontSize="60"
                        fontFamily="Amiri">
                        ﷽
                    </text>
                </svg>
            </div>
        </motion.div>
    );
}

export default DailyMessage;

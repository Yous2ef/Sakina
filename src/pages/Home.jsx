import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    RiSunFill,
    RiMoonFill,
    RiHeart3Fill,
    RiHandHeartLine,
    RiArrowLeftSLine,
} from "react-icons/ri";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { ProgressRing } from "../components/ProgressRing";
import { NotificationDot } from "../components/NotificationBadge";
import DailyMessage from "../components/DailyMessage";
import { useProgress } from "../hooks/useProgress";
import { useSettingsContext } from "../context/SettingsContext";
import {
    pageVariants,
    staggerContainer,
    slideUp,
    scaleOnTap,
} from "../utils/animations";
import morningDhkar from "../data/morning-dhkar.json";
import eveningDhkar from "../data/evening-dhkar.json";
import reliefData from "../data/keys-relief.json";

const sections = [
    {
        id: "morning",
        path: "/morning",
        title: "ذكر الصباح",
        subtitle: "ابدأ يومك بذكر الله",
        icon: RiSunFill,
        gradient: "from-amber-400 to-orange-500",
        bgLight: "bg-amber-50",
        bgDark: "dark:bg-amber-900/20",
    },
    {
        id: "evening",
        path: "/evening",
        title: "ذكر المساء",
        subtitle: "اختم يومك بالسكينة",
        icon: RiMoonFill,
        gradient: "from-indigo-400 to-purple-500",
        bgLight: "bg-indigo-50",
        bgDark: "dark:bg-indigo-900/20",
    },
    {
        id: "relief",
        path: "/relief",
        title: "مفاتيح الفرج",
        subtitle: "أدعية تفريج الهموم",
        icon: RiHeart3Fill,
        gradient: "from-rose-400 to-pink-500",
        bgLight: "bg-rose-50",
        bgDark: "dark:bg-rose-900/20",
    },
    {
        id: "tasbih",
        path: "/tasbih",
        title: "صلاة التسبيح",
        subtitle: "صلاة الغفران والأجر العظيم",
        icon: RiHandHeartLine,
        gradient: "from-emerald-400 to-teal-500",
        bgLight: "bg-emerald-50",
        bgDark: "dark:bg-emerald-900/20",
    },
];

/**
 * Home - Main landing page
 * الصفحة الرئيسية
 */
export function Home() {
    const { tasbihProgress, calculateProgress } = useProgress();
    const { settings } = useSettingsContext();

    // حساب التقدم بناءً على كل الأذكار
    const morningProgress = calculateProgress("morning", morningDhkar.dhkar);
    const eveningProgress = calculateProgress("evening", eveningDhkar.dhkar);
    const reliefProgress = calculateProgress("relief", reliefData.dus);

    const getProgress = (id) => {
        switch (id) {
            case "morning":
                return morningProgress;
            case "evening":
                return eveningProgress;
            case "tasbih":
                return tasbihProgress;
            case "relief":
                return reliefProgress;
            default:
                return 0;
        }
    };

    const isNotificationEnabled = (id) => {
        return settings.notifications?.[id]?.enabled;
    };

    // Check if notification dot should show (time has passed and not completed)
    const shouldShowNotificationDot = (id) => {
        const notification = settings.notifications?.[id];
        if (!notification?.enabled) return false;

        const progress = getProgress(id);
        // Don't show if already completed
        if (progress >= 100) return false;

        // Check if current time is past the notification time
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        const [notifHour, notifMinute] = (notification.time || "00:00")
            .split(":")
            .map(Number);
        const notifTimeInMinutes = notifHour * 60 + notifMinute;

        // Show dot if current time is past notification time
        return currentTimeInMinutes >= notifTimeInMinutes;
    };

    return (
        <motion.div
            {...pageVariants}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
            <Header title="سَكِينَة" showThemeToggle />

            {/* Hero Section */}
            <div className="px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6">
                    <h1 className="text-4xl font-bold font-amiri text-gray-900 dark:text-white mb-2">
                        سَكِينَة
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        اطمئن بذكر الله
                    </p>
                </motion.div>

                {/* Daily Motivational Message */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-lg mx-auto mb-6">
                    <DailyMessage />
                </motion.div>

                {/* Sections Grid */}
                <motion.div
                    {...staggerContainer}
                    className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        const progress = getProgress(section.id);
                        const hasNotification = shouldShowNotificationDot(
                            section.id,
                        );

                        return (
                            <motion.div
                                key={section.id}
                                {...slideUp}
                                transition={{ delay: index * 0.1 }}>
                                <Link to={section.path}>
                                    <motion.div
                                        {...scaleOnTap}
                                        className={`
                      relative overflow-hidden rounded-2xl p-5
                      ${section.bgLight} ${section.bgDark}
                      border border-gray-200/50 dark:border-gray-700/50
                      hover:shadow-lg transition-shadow
                    `}>
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div
                                                className={`
                        w-14 h-14 rounded-xl
                        bg-linear-to-br ${section.gradient}
                        flex items-center justify-center shadow-lg
                      `}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-amiri">
                                                        {section.title}
                                                    </h3>
                                                    {hasNotification && (
                                                        <NotificationDot
                                                            color="amber"
                                                            pulse
                                                            size="sm"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {section.subtitle}
                                                </p>
                                            </div>

                                            {/* Progress & Arrow */}
                                            <div className="flex items-center gap-3">
                                                {progress > 0 && (
                                                    <ProgressRing
                                                        progress={progress}
                                                        size="sm"
                                                        showLabel={false}
                                                    />
                                                )}
                                                <RiArrowLeftSLine className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            <BottomNav />
        </motion.div>
    );
}

export default Home;

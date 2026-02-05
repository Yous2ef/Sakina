import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    RiUserLine,
    RiDownloadLine,
    RiEyeLine,
    RiExternalLinkLine,
    RiRefreshLine,
    RiPulseLine,
    RiCalendarLine,
    RiTimeLine,
} from "react-icons/ri";
import {
    fetchAnalytics,
    fetchActiveVisitors,
    fetchInstallations,
    isAnalyticsConfigured,
    getUmamiDashboardUrl,
} from "../services/analyticsService";

/**
 * AnalyticsDashboard - Modern analytics display component
 * لوحة الإحصائيات - عرض إحصائيات التطبيق
 */
export function AnalyticsDashboard() {
    const [stats, setStats] = useState(null);
    const [activeUsers, setActiveUsers] = useState(0);
    const [installations, setInstallations] = useState(0);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("day");
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isConfigured] = useState(isAnalyticsConfigured());
    const [isBlocked, setIsBlocked] = useState(false);

    const periods = [
        { key: "day", label: "اليوم", icon: RiTimeLine },
        { key: "week", label: "الأسبوع", icon: RiCalendarLine },
        { key: "month", label: "الشهر", icon: RiCalendarLine },
    ];

    const loadStats = useCallback(async () => {
        setLoading(true);
        setIsBlocked(false);
        try {
            const [analyticsResult, activeResult, installResult] =
                await Promise.all([
                    fetchAnalytics(period),
                    fetchActiveVisitors(),
                    fetchInstallations(period),
                ]);

            if (analyticsResult.success) {
                setStats(analyticsResult.data);
                setIsBlocked(false);
            } else if (analyticsResult.error === "fetch_failed") {
                setIsBlocked(true);
            }
            setActiveUsers(activeResult.activeVisitors || 0);
            setInstallations(installResult.installations || 0);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to load analytics:", error);
            setIsBlocked(true);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        if (isConfigured) {
            loadStats();
            // Refresh active users every 30 seconds
            const interval = setInterval(async () => {
                const result = await fetchActiveVisitors();
                setActiveUsers(result.activeVisitors || 0);
            }, 30000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [isConfigured, loadStats]);

    // Stat card component
    const StatCard = ({
        icon: IconComponent,
        label,
        value,
        color,
        pulse = false,
        delay = 0,
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1, duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-xl
                       border border-gray-200/50 dark:border-gray-700/50 p-4 group
                       hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-gray-900/30
                       transition-all duration-300">
            {/* Background gradient */}
            <div
                className={`absolute inset-0 opacity-5 dark:opacity-10 bg-linear-to-br ${color}`}
            />

            {/* Content */}
            <div className="relative flex items-center gap-3">
                <div
                    className={`p-2.5 rounded-xl bg-linear-to-br ${color} shadow-lg`}>
                    <IconComponent className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                        {label}
                    </p>
                    <div className="flex items-center gap-2">
                        {loading ? (
                            <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        ) : (
                            <motion.p
                                key={value}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                                {value?.toLocaleString("ar-EG") || "٠"}
                            </motion.p>
                        )}
                        {pulse && activeUsers > 0 && (
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4">
            {/* Header with period selector and refresh */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-amiri flex items-center gap-2">
                    <RiPulseLine className="text-emerald-500" />
                    إحصائيات التطبيق
                </h2>

                <button
                    onClick={loadStats}
                    disabled={loading}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                              hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200
                              disabled:opacity-50">
                    <RiRefreshLine
                        className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    />
                </button>
            </div>

            {/* Period selector */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                {periods.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setPeriod(key)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                            ${
                                period === key
                                    ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Blocked warning */}
            {isBlocked && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                    <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
                        الإحصائيات محجوبة - قد يكون لديك مانع إعلانات
                    </p>
                </motion.div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Active Users - Real-time */}
                <StatCard
                    icon={RiUserLine}
                    label="متصل الآن"
                    value={activeUsers}
                    color="from-emerald-500 to-teal-500"
                    pulse={true}
                    delay={0}
                />

                {/* Page Views */}
                <StatCard
                    icon={RiEyeLine}
                    label="المشاهدات"
                    value={stats?.pageViews}
                    color="from-blue-500 to-indigo-500"
                    delay={1}
                />

                {/* Unique Visitors */}
                <StatCard
                    icon={RiUserLine}
                    label="الزوار"
                    value={stats?.visitors}
                    color="from-violet-500 to-purple-500"
                    delay={2}
                />

                {/* Number of visits/sessions */}
                <StatCard
                    icon={RiDownloadLine}
                    label="التثبيتات"
                    value={installations}
                    color="from-rose-500 to-pink-500"
                    delay={3}
                />
            </div>

            {/* Last updated */}
            <AnimatePresence>
                {lastUpdated && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-center text-gray-400 dark:text-gray-500">
                        آخر تحديث: {lastUpdated.toLocaleTimeString("ar-EG")}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default AnalyticsDashboard;

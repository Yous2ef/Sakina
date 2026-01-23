import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    RiMoonClearFill,
    RiSunFill,
    RiSmartphoneLine,
    RiBellLine,
    RiPhoneLine,
    RiFontSize,
    RiInformationLine,
    RiDeleteBinLine,
    RiDownload2Line,
    RiTimeLine,
    RiTestTubeLine,
    RiCheckLine,
    RiCloseLine,
    RiGithubFill,
    RiHeartFill,
    RiCodeSSlashLine,
    RiExternalLinkLine,
} from "react-icons/ri";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { Toggle } from "../components/Toggle";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { useTheme } from "../hooks/useTheme";
import { useSettingsContext } from "../context/SettingsContext";
import { useNotification } from "../hooks/useNotification";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useProgress } from "../hooks/useProgress";
import { useVibration } from "../hooks/useVibration";
import { pageVariants, slideUp } from "../utils/animations";
import {
    scheduleNotification,
    cancelScheduledNotification,
    initializeScheduledNotifications,
    testNotification,
} from "../services/notificationService";
import appConfig from "../config/app.config";

/**
 * Settings - App settings page
 * صفحة الإعدادات
 */
export function Settings() {
    const { theme, setTheme, isDark } = useTheme();
    const { settings, updateSettings, updateNotification } =
        useSettingsContext();
    const { isGranted, requestPermission } = useNotification();
    const { canInstall, install, isInstalled } = useInstallPrompt();
    const { resetAllProgress } = useProgress();
    const { heavyTap } = useVibration();

    // Track test notification feedback
    const [testFeedback, setTestFeedback] = useState(null);
    const [resetFeedback, setResetFeedback] = useState(null);
    const [showAbout, setShowAbout] = useState(false);

    // Initialize notifications when permission is granted
    useEffect(() => {
        if (isGranted && settings.notifications) {
            initializeScheduledNotifications(settings.notifications);
        }
    }, [isGranted, settings.notifications]);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const handleNotificationToggle = async (section, enabled) => {
        if (enabled && !isGranted) {
            const result = await requestPermission();
            if (!result.granted) return;
        }

        updateNotification(section, { enabled });

        // Schedule or cancel notification
        if (enabled && settings.notifications?.[section]?.time) {
            scheduleNotification(section, settings.notifications[section].time);
        } else {
            cancelScheduledNotification(section);
        }
    };

    const handleTimeChange = (section, time) => {
        updateNotification(section, { time });

        // Reschedule if enabled
        if (settings.notifications?.[section]?.enabled && time) {
            scheduleNotification(section, time);
        }
    };

    const handleTestNotification = async (section) => {
        heavyTap();

        // Check if permission is granted
        if (!isGranted) {
            setTestFeedback({
                section,
                type: "error",
                message: "يرجى السماح بالإشعارات أولاً",
            });

            // Try to request permission
            const result = await requestPermission();
            if (!result.granted) {
                setTimeout(() => setTestFeedback(null), 3000);
                return;
            }
        }

        // Show loading state
        setTestFeedback({
            section,
            type: "loading",
            message: "جاري إرسال الإشعار...",
        });

        // Send test notification
        const notification = testNotification(section);

        if (notification) {
            setTestFeedback({
                section,
                type: "success",
                message: "تم إرسال الإشعار! تحقق من إشعارات جهازك",
            });
        } else {
            setTestFeedback({
                section,
                type: "error",
                message: "فشل إرسال الإشعار. تحقق من الأذونات",
            });
        }

        // Clear feedback after 4 seconds
        setTimeout(() => setTestFeedback(null), 4000);
    };

    const handleResetProgress = () => {
        heavyTap();

        // Show confirmation dialog with better message
        const confirmed = confirm(
            "⚠️ تحذير!\n\nهل أنت متأكد من حذف جميع بيانات التقدم؟\n\n" +
                "سيتم حذف:\n" +
                "• تقدم ذكر الصباح\n" +
                "• تقدم ذكر المساء\n" +
                "• تقدم صلاة التسبيح\n" +
                "• تقدم مفاتيح الفرج\n\n" +
                "لا يمكن التراجع عن هذا الإجراء!",
        );

        if (confirmed) {
            try {
                resetAllProgress();

                // Show success feedback
                setResetFeedback({
                    type: "success",
                    message: "✓ تم حذف جميع بيانات التقدم بنجاح",
                });

                // Clear feedback after 4 seconds
                setTimeout(() => setResetFeedback(null), 4000);
            } catch {
                // Show error feedback
                setResetFeedback({
                    type: "error",
                    message: "✗ حدث خطأ أثناء الحذف. حاول مرة أخرى",
                });

                setTimeout(() => setResetFeedback(null), 4000);
            }
        }
    };

    const handleInstall = async () => {
        await install();
    };

    return (
        <motion.div
            {...pageVariants}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
            <Header title="الإعدادات" showBack />

            <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
                {/* Theme Section */}
                <motion.section
                    {...slideUp}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-amiri flex items-center gap-2">
                        {isDark ? (
                            <RiMoonClearFill className="text-indigo-500" />
                        ) : (
                            <RiSunFill className="text-amber-500" />
                        )}
                        المظهر
                    </h2>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: "light", label: "فاتح", icon: RiSunFill },
                            {
                                value: "dark",
                                label: "داكن",
                                icon: RiMoonClearFill,
                            },
                            {
                                value: "system",
                                label: "النظام",
                                icon: RiSmartphoneLine,
                            },
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => handleThemeChange(value)}
                                className={`
                  flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                  ${
                      theme === value
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}>
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* Notifications Section */}
                <motion.section
                    {...slideUp}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-amiri flex items-center gap-2">
                        <RiBellLine className="text-amber-500" />
                        الإشعارات
                    </h2>

                    {!isGranted && (
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                            <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
                                يرجى السماح بالإشعارات لتفعيل التذكيرات
                            </p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Morning Notification */}
                        <div className="space-y-3">
                            <Toggle
                                checked={
                                    settings.notifications?.morning?.enabled
                                }
                                onChange={(enabled) =>
                                    handleNotificationToggle("morning", enabled)
                                }
                                label="تذكير ذكر الصباح"
                                description="إشعار يومي بعد الفجر"
                            />
                            {settings.notifications?.morning?.enabled && (
                                <div className="flex items-center gap-2 mr-2">
                                    <RiTimeLine className="text-gray-400" />
                                    <input
                                        type="time"
                                        value={
                                            settings.notifications?.morning
                                                ?.time || "06:00"
                                        }
                                        onChange={(e) =>
                                            handleTimeChange(
                                                "morning",
                                                e.target.value,
                                            )
                                        }
                                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white text-sm border-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button
                                        onClick={() =>
                                            handleTestNotification("morning")
                                        }
                                        className="p-2 text-gray-500 hover:text-emerald-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative group"
                                        title="اختبار الإشعار">
                                        <RiTestTubeLine className="w-4 h-4" />
                                        {/* Tooltip */}
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            اختبار الإشعار الآن
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* Feedback message for morning */}
                            <AnimatePresence>
                                {testFeedback?.section === "morning" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`mr-2 p-2 rounded-lg text-xs flex items-center gap-2 ${
                                            testFeedback.type === "success"
                                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                                                : testFeedback.type === "error"
                                                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                                                  : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                        }`}>
                                        {testFeedback.type === "success" && (
                                            <RiCheckLine className="w-4 h-4" />
                                        )}
                                        {testFeedback.type === "error" && (
                                            <RiCloseLine className="w-4 h-4" />
                                        )}
                                        <span>{testFeedback.message}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Evening Notification */}
                        <div className="space-y-3">
                            <Toggle
                                checked={
                                    settings.notifications?.evening?.enabled
                                }
                                onChange={(enabled) =>
                                    handleNotificationToggle("evening", enabled)
                                }
                                label="تذكير ذكر المساء"
                                description="إشعار يومي بعد العصر"
                            />
                            {settings.notifications?.evening?.enabled && (
                                <div className="flex items-center gap-2 mr-2">
                                    <RiTimeLine className="text-gray-400" />
                                    <input
                                        type="time"
                                        value={
                                            settings.notifications?.evening
                                                ?.time || "17:00"
                                        }
                                        onChange={(e) =>
                                            handleTimeChange(
                                                "evening",
                                                e.target.value,
                                            )
                                        }
                                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white text-sm border-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button
                                        onClick={() =>
                                            handleTestNotification("evening")
                                        }
                                        className="p-2 text-gray-500 hover:text-emerald-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative group"
                                        title="اختبار الإشعار">
                                        <RiTestTubeLine className="w-4 h-4" />
                                        {/* Tooltip */}
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            اختبار الإشعار الآن
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* Feedback message for evening */}
                            <AnimatePresence>
                                {testFeedback?.section === "evening" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`mr-2 p-2 rounded-lg text-xs flex items-center gap-2 ${
                                            testFeedback.type === "success"
                                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                                                : testFeedback.type === "error"
                                                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                                                  : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                        }`}>
                                        {testFeedback.type === "success" && (
                                            <RiCheckLine className="w-4 h-4" />
                                        )}
                                        {testFeedback.type === "error" && (
                                            <RiCloseLine className="w-4 h-4" />
                                        )}
                                        <span>{testFeedback.message}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Tasbih Notification */}
                        <div className="space-y-3">
                            <Toggle
                                checked={
                                    settings.notifications?.tasbih?.enabled
                                }
                                onChange={(enabled) =>
                                    handleNotificationToggle("tasbih", enabled)
                                }
                                label="تذكير صلاة التسبيح"
                                description="تذكير يومي"
                            />
                            {settings.notifications?.tasbih?.enabled && (
                                <div className="flex items-center gap-2 mr-2">
                                    <RiTimeLine className="text-gray-400" />
                                    <input
                                        type="time"
                                        value={
                                            settings.notifications?.tasbih
                                                ?.time || "20:00"
                                        }
                                        onChange={(e) =>
                                            handleTimeChange(
                                                "tasbih",
                                                e.target.value,
                                            )
                                        }
                                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white text-sm border-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button
                                        onClick={() =>
                                            handleTestNotification("tasbih")
                                        }
                                        className="p-2 text-gray-500 hover:text-emerald-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative group"
                                        title="اختبار الإشعار">
                                        <RiTestTubeLine className="w-4 h-4" />
                                        {/* Tooltip */}
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            اختبار الإشعار الآن
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* Feedback message for tasbih */}
                            <AnimatePresence>
                                {testFeedback?.section === "tasbih" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`mr-2 p-2 rounded-lg text-xs flex items-center gap-2 ${
                                            testFeedback.type === "success"
                                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                                                : testFeedback.type === "error"
                                                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                                                  : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                        }`}>
                                        {testFeedback.type === "success" && (
                                            <RiCheckLine className="w-4 h-4" />
                                        )}
                                        {testFeedback.type === "error" && (
                                            <RiCloseLine className="w-4 h-4" />
                                        )}
                                        <span>{testFeedback.message}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Help text */}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300 text-center leading-relaxed">
                            💡 <strong>نصيحة:</strong> اضغط على أيقونة الاختبار
                            (<RiTestTubeLine className="w-4 h-4 inline" />)
                            لتجربة الإشعار فوراً والتأكد من عمله بشكل صحيح
                        </p>
                    </div>

                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                        الإشعارات تعمل بالتوقيت المحلي لجهازك
                    </p>
                </motion.section>

                {/* General Settings */}
                <motion.section
                    {...slideUp}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-amiri">
                        إعدادات عامة
                    </h2>

                    <div className="space-y-4">
                        <Toggle
                            checked={settings.hapticFeedback}
                            onChange={(enabled) =>
                                updateSettings("hapticFeedback", enabled)
                            }
                            label="الاهتزاز"
                            description="اهتزاز عند الضغط على العداد"
                        />

                        {/* Font Size */}
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                                    <RiFontSize className="text-gray-500" />
                                    حجم الخط
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {["small", "medium", "large"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() =>
                                            updateSettings("fontSize", size)
                                        }
                                        className={`
                      px-3 py-1 rounded-lg text-sm transition-all
                      ${
                          settings.fontSize === size
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }
                    `}>
                                        {size === "small"
                                            ? "صغير"
                                            : size === "medium"
                                              ? "متوسط"
                                              : "كبير"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Install PWA */}
                {canInstall && (
                    <motion.section
                        {...slideUp}
                        transition={{ delay: 0.3 }}
                        className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
                        <div className="flex items-center gap-4">
                            <RiDownload2Line className="w-10 h-10" />
                            <div className="flex-1">
                                <h3 className="font-bold">ثبّت التطبيق</h3>
                                <p className="text-sm text-emerald-100">
                                    أضف سَكِينَة للشاشة الرئيسية
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleInstall}>
                                تثبيت
                            </Button>
                        </div>
                    </motion.section>
                )}

                {isInstalled && (
                    <motion.div
                        {...slideUp}
                        className="text-center text-sm text-emerald-600 dark:text-emerald-400">
                        ✓ التطبيق مثبت
                    </motion.div>
                )}

                {/* Data Management */}
                <motion.section
                    {...slideUp}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-amiri">
                        إدارة البيانات
                    </h2>

                    <Button
                        variant="danger"
                        fullWidth
                        onClick={handleResetProgress}
                        icon={<RiDeleteBinLine />}>
                        حذف بيانات التقدم
                    </Button>

                    {/* Feedback message for reset */}
                    <AnimatePresence>
                        {resetFeedback && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`mt-3 p-3 rounded-lg text-sm flex items-center gap-2 ${
                                    resetFeedback.type === "success"
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                                }`}>
                                {resetFeedback.type === "success" ? (
                                    <RiCheckLine className="w-5 h-5 shrink-0" />
                                ) : (
                                    <RiCloseLine className="w-5 h-5 shrink-0" />
                                )}
                                <span>{resetFeedback.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                        تحذير: لا يمكن التراجع عن حذف البيانات
                    </p>
                </motion.section>

                {/* About Section */}
                <motion.section
                    {...slideUp}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-center space-y-3">
                        <p className="text-3xl font-amiri text-gray-900 dark:text-white">
                            سَكِينَة
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            الإصدار {appConfig.version}
                        </p>
                        <p className="text-base text-gray-600 dark:text-gray-300 font-amiri leading-relaxed">
                            ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
                        </p>

                        <div className="flex flex-col gap-2 mt-4">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setShowAbout(true)}
                                icon={<RiInformationLine />}>
                                عن التطبيق
                            </Button>

                            <a
                                href={appConfig.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full">
                                <Button
                                    variant="ghost"
                                    fullWidth
                                    icon={<RiGithubFill />}>
                                    <span className="flex items-center gap-2">
                                        المصدر على GitHub
                                        <RiExternalLinkLine className="w-4 h-4" />
                                    </span>
                                </Button>
                            </a>
                        </div>

                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 flex items-center justify-center gap-1">
                            صُنع بـ <RiHeartFill className="text-red-500" />
                            {appConfig.developer.nameAr}
                        </p>
                    </div>
                </motion.section>
            </div>

            <BottomNav />

            {/* About Modal */}
            <Modal
                isOpen={showAbout}
                onClose={() => setShowAbout(false)}
                title="عن التطبيق">
                <div className="space-y-6 text-right">
                    {/* App Name & Description */}
                    <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-3xl font-amiri text-gray-900 dark:text-white mb-2">
                            سَكِينَة
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            تطبيق الذكر والأدعية
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                            📖 الوصف
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            تطبيق سَكِينَة هو تطبيق ويب تقدمي (PWA) مصمم لمساعدة
                            المسلمين على المواظبة على الذكر اليومية. يتضمن
                            التطبيق ذكر الصباح والمساء، صلاة التسبيح، ومفاتيح
                            الفرج. يعمل التطبيق بدون إنترنت ويدعم الإشعارات
                            التذكيرية.
                        </p>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                            ✨ المميزات
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span>
                                    ذكر الصباح والمساء مع التتبع التلقائي للتقدم
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span>صلاة التسبيح الكاملة مع عداد تفاعلي</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span>
                                    مفاتيح الفرج - أدعية مأثورة لتفريج الهموم
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span>إشعارات تذكيرية بالتوقيت المحلي</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span>يعمل بدون إنترنت (وضع الطائرة)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span>وضع فاتح وداكن تلقائي</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-500">•</span>
                                <span>مراجع الأحاديث مع درجاتها</span>
                            </li>
                        </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <RiCodeSSlashLine /> التقنيات المستخدمة
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {[
                                "React 19",
                                "Vite 7",
                                "Tailwind CSS 4",
                                "Framer Motion",
                                "PWA",
                                "IndexedDB",
                            ].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Version & Links */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                الإصدار
                            </span>
                            <span className="text-sm font-mono text-gray-900 dark:text-white">
                                v{appConfig.version}
                            </span>
                        </div>

                        <a
                            href={appConfig.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block">
                            <Button
                                variant="primary"
                                fullWidth
                                icon={<RiGithubFill />}>
                                <span className="flex items-center justify-center gap-2">
                                    عرض على GitHub
                                    <RiExternalLinkLine className="w-4 h-4" />
                                </span>
                            </Button>
                        </a>
                    </div>

                    {/* Developer & Credits */}
                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                            👨‍💻 المطور
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {appConfig.developer.nameAr}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-3">
                            صُنع بـ{" "}
                            <RiHeartFill className="text-red-500 w-4 h-4" />
                        </p>
                    </div>

                    {/* Dedication Section - قسم الإهداء */}
                    {appConfig.dedication?.enabled && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-3 text-center font-amiri text-lg">
                                    {appConfig.dedication.title}
                                </h4>

                                <div className="space-y-3">
                                    <p className="text-base text-gray-700 dark:text-gray-200 text-center font-amiri leading-relaxed">
                                        {appConfig.dedication.message}{" "}
                                        <RiHeartFill className="text-red-500 w-4 h-4 inline" />
                                    </p>

                                    <div className="flex items-center justify-center gap-1 text-base text-gray-500 dark:text-gray-400">
                                        <p className="block text-center text-sm italic">
                                            {appConfig.dedication.doaa}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-emerald-200 dark:border-emerald-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                                            {appConfig.dedication.note}
                                        </p>
                                        <p className="text-base text-emerald-700 dark:text-emerald-400 text-center mt-2 font-medium">
                                            {appConfig.dedication.openSource}
                                        </p>
                                    </div>

                                    <div className="text-center pt-2">
                                        <p className="text-base text-gray-600 dark:text-gray-100 font-amiri">
                                            ﴿وَالَّذِينَ آمَنُوا
                                            وَاتَّبَعَتْهُمْ ذُرِّيَّتُهُم
                                            بِإِيمَانٍ أَلْحَقْنَا بِهِمْ
                                            ذُرِّيَّتَهُمْ﴾
                                        </p>
                                        <p className="text-base text-gray-400 dark:text-gray-400 mt-1">
                                            الطور: 21
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quran Verse */}
                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-base text-gray-600 dark:text-gray-100 font-amiri">
                            ﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾
                        </p>
                        <p className="text-base text-gray-400 dark:text-gray-400 mt-1">
                            الرعد: 28
                        </p>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}

export default Settings;

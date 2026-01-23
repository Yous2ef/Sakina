import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiInformationLine, RiRefreshLine } from "react-icons/ri";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { TasbihInfoModal } from "../components/TasbihInfoModal";
import { useProgress } from "../hooks/useProgress";
import { useVibration } from "../hooks/useVibration";
import { pageVariants } from "../utils/animations";
import tasbihData from "../data/tasbih-prayer.json";

const TASBIH_COUNT = 15;

/**
 * TasbihPrayer - Salat al-Tasbih page
 * صفحة صلاة التسبيح
 */
export function TasbihPrayer() {
    const [showInfo, setShowInfo] = useState(false);
    const { progress, updateTasbihCount, resetSection } = useProgress();
    const { heavyTap, successVibrate } = useVibration();

    const tasbihCount = progress.tasbih?.count || 0;
    const totalProgress = (tasbihCount / TASBIH_COUNT) * 100;

    const handleTap = () => {
        if (tasbihCount >= TASBIH_COUNT) return;

        const newCount = tasbihCount + 1;
        updateTasbihCount(newCount);

        // Check for rakah completion
        successVibrate();
    };

    const handleReset = () => {
        heavyTap();
        resetSection("tasbih");
    };

    const infoButton = (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfo(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="معلومات">
            <RiInformationLine className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </motion.button>
    );

    return (
        <motion.div
            {...pageVariants}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header
                title="صلاة التسبيح"
                showBack
                showThemeToggle={false}
                rightAction={infoButton}
            />

            {/* Main Tappable Area */}
            <motion.div
                onClick={handleTap}
                className="flex-1 flex flex-col items-center justify-center px-4 pb-24 cursor-pointer select-none"
                whileTap={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}>
                {/* Tasbih Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-sm text-center mb-6">
                    <p className="dhikr-text  leading-relaxed text-gray-700 dark:text-gray-200 font-amiri">
                        سبحان الله والحمد لله
                    </p>
                    <p className="dhikr-text  leading-relaxed text-gray-700 dark:text-gray-200 font-amiri">
                        ولا إله إلا الله والله أكبر
                    </p>
                    <p className="dhikr-text  leading-relaxed text-gray-700 dark:text-gray-200 font-amiri">
                        ولاحول ولاقوة إلا بالله العلي العظيم
                    </p>
                </motion.div>

                {/* Progress Ring with Counter */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative mb-8">
                    {/* Large Progress Ring */}
                    <div className="relative w-56 h-56 flex items-center justify-center">
                        <svg
                            className="absolute inset-0 -rotate-90"
                            viewBox="0 0 200 200">
                            {/* Track */}
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-gray-200 dark:text-gray-700"
                            />
                            {/* Progress */}
                            <motion.circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="url(#tasbihGradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={565.48}
                                initial={{ strokeDashoffset: 565.48 }}
                                animate={{
                                    strokeDashoffset:
                                        565.48 - (totalProgress / 100) * 565.48,
                                }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                            <defs>
                                <linearGradient
                                    id="tasbihGradient"
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
                            key={tasbihCount}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                            }}
                            className="flex flex-col items-center">
                            <span className="counter-number text-6xl font-bold text-emerald-600 dark:text-emerald-400">
                                {tasbihCount}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500 text-lg">
                                / {TASBIH_COUNT}
                            </span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Tap Hint */}
                {tasbihCount < TASBIH_COUNT && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        className="text-sm text-gray-400 dark:text-gray-500">
                        اضغط في أي مكان للعد
                    </motion.p>
                )}

                {/* Completion Message */}
                <AnimatePresence>
                    {totalProgress >= 100 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-6 p-5 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl text-white text-center max-w-sm">
                            <p className="text-xl font-amiri mb-1">
                                تقبّل الله صلاتك! ❤️
                            </p>
                            <p className="text-emerald-100 text-sm">
                                غفر الله لك ذنبك كله
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Reset Button - Fixed at bottom */}
            {tasbihCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-28 left-1/2 -translate-x-1/2 z-10">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                        }}
                        className="px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <RiRefreshLine className="w-4 h-4" />
                        <span className="text-sm font-medium">إعادة</span>
                    </motion.button>
                </motion.div>
            )}

            <TasbihInfoModal
                isOpen={showInfo}
                onClose={() => setShowInfo(false)}
            />

            <BottomNav />
        </motion.div>
    );
}

export default TasbihPrayer;

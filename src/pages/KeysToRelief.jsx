import { useState } from "react";
import { motion } from "framer-motion";
import { RiInformationLine, RiRefreshLine } from "react-icons/ri";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { DhikrCard } from "../components/DhikrCard";
import { ProgressRing } from "../components/ProgressRing";
import { PageInfoModal } from "../components/PageInfoModal";
import { Button } from "../components/Button";
import { useProgress } from "../hooks/useProgress";
import { useVibration } from "../hooks/useVibration";
import { pageVariants, staggerContainer } from "../utils/animations";
import reliefData from "../data/keys-relief.json";

/**
 * KeysToRelief - Keys to relief/duas page
 * صفحة مفاتيح الفرج
 */
export function KeysToRelief() {
    const [showInfo, setShowInfo] = useState(false);
    const { resetSection, getItemProgress, calculateProgress } = useProgress();
    const { heavyTap } = useVibration();

    // ترتيب الأدعية: المكتملة في النهاية
    const duasList = [...(reliefData.duas || [])].sort((a, b) => {
        const aProgress = getItemProgress("relief", a.id);
        const bProgress = getItemProgress("relief", b.id);
        const aCompleted = (aProgress?.current || 0) >= (a.count || 1);
        const bCompleted = (bProgress?.current || 0) >= (b.count || 1);

        if (aCompleted === bCompleted) return 0;
        return aCompleted ? 1 : -1;
    });

    // حساب التقدم بناءً على كل الأدعية
    const reliefProgress = calculateProgress("relief", reliefData.duas);

    const handleReset = () => {
        heavyTap();
        resetSection("relief");
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
            className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
            <Header
                title="مفاتيح الفرج"
                showBack
                showThemeToggle={false}
                rightAction={infoButton}
            />

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Progress Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6 p-4 bg-linear-to-l from-green-100 to-green-100 dark:from-green-900/30 dark:to-green-900/30 rounded-2xl">
                    <div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                            أدعية مقروءة
                        </p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100 font-amiri">
                            {Math.round(reliefProgress)}%
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ProgressRing
                            progress={reliefProgress}
                            size="lg"
                            color="green"
                            showLabel={false}
                        />
                        {reliefProgress > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleReset}
                                icon={<RiRefreshLine className="w-4 h-4" />}>
                                إعادة
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Intro Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 text-center font-amiri leading-relaxed">
                        أدعية مأثورة لتفريج الهموم وكشف الكربات
                    </p>
                </motion.div>

                {/* Duas List */}
                <motion.div {...staggerContainer} className="space-y-4">
                    {duasList.map((dua, index) => (
                        <DhikrCard
                            key={dua.id}
                            id={dua.id}
                            sectionId="relief"
                            text={dua.arabicText}
                            translation={dua.benefit}
                            count={dua.count || 1}
                            reference={dua.reference}
                            title={dua.title}
                            virtue={dua.virtue}
                            occasion={dua.occasion}
                            index={index}
                        />
                    ))}
                </motion.div>
            </div>

            <PageInfoModal
                isOpen={showInfo}
                onClose={() => setShowInfo(false)}
                sectionId="keys-relief"
            />

            <BottomNav />
        </motion.div>
    );
}

export default KeysToRelief;

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
import eveningDhkar from "../data/evening-dhkar.json";

/**
 * EveningDhkar - Evening remembrance page
 * صفحة ذكر المساء
 */
export function EveningDhkar() {
    const [showInfo, setShowInfo] = useState(false);
    const { resetSection, getItemProgress, calculateProgress } = useProgress();
    const { heavyTap } = useVibration();

    // ترتيب الأذكار: المكتملة في النهاية
    const dhkarList = [...(eveningDhkar.dhkar || [])].sort((a, b) => {
        const aProgress = getItemProgress("evening", a.id);
        const bProgress = getItemProgress("evening", b.id);
        const aCompleted = (aProgress?.current || 0) >= a.count;
        const bCompleted = (bProgress?.current || 0) >= b.count;

        if (aCompleted === bCompleted) return 0;
        return aCompleted ? 1 : -1;
    });

    // حساب التقدم بناءً على كل الأذكار
    const eveningProgress = calculateProgress("evening", eveningDhkar.dhkar);

    const handleReset = () => {
        heavyTap();
        resetSection("evening");
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
                title="ذكر المساء"
                showBack
                showThemeToggle={false}
                rightAction={infoButton}
            />

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Progress Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6 p-4 bg-linear-to-l from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl">
                    <div>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            تقدمك اليوم
                        </p>
                        <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 font-amiri">
                            {Math.round(eveningProgress)}%
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ProgressRing
                            progress={eveningProgress}
                            size="lg"
                            color="purple"
                            showLabel={false}
                        />
                        {eveningProgress > 0 && (
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

                {/* Dhkar List */}
                <motion.div {...staggerContainer} className="space-y-4">
                    {dhkarList.map((dhikr, index) => (
                        <DhikrCard
                            key={dhikr.id}
                            id={dhikr.id}
                            sectionId="evening"
                            text={dhikr.arabicText}
                            translation={dhikr.translation}
                            count={dhikr.count}
                            reference={dhikr.reference}
                            type={dhikr.type}
                            virtue={dhikr.virtue}
                            title={dhikr.reference?.name}
                            audio={dhikr.audio}
                            index={index}
                        />
                    ))}
                </motion.div>
            </div>

            <PageInfoModal
                isOpen={showInfo}
                onClose={() => setShowInfo(false)}
                sectionId="evening-dhkar"
            />

            <BottomNav />
        </motion.div>
    );
}

export default EveningDhkar;

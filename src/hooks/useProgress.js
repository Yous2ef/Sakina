import { useProgressContext } from "../context/ProgressContext";

/**
 * useProgress - Hook for tracking dhikr progress
 * هوك لتتبع تقدم الذكر
 */
export function useProgress() {
    const {
        progress,
        updateItemProgress,
        incrementItem,
        updateTasbihCount,
        resetSection,
        resetAllProgress,
        getItemProgress,
        getSectionProgress,
    } = useProgressContext();

    // حساب التقدم بناءً على عدد الكروت المكتملة
    const calculateProgress = (section, dhkarList) => {
        if (!dhkarList || dhkarList.length === 0) return 0;

        let completedCards = 0;
        const totalCards = dhkarList.length;

        dhkarList.forEach((dhikr) => {
            const itemProgress = getItemProgress(section, dhikr.id);
            const current = itemProgress?.current || 0;
            const target = dhikr.count || 1;

            // إذا اكتمل الذكر، نحسبه كبطاقة مكتملة
            if (current >= target) {
                completedCards++;
            }
        });

        return totalCards > 0
            ? Math.round((completedCards / totalCards) * 100)
            : 0;
    };

    return {
        progress,
        updateItemProgress,
        incrementItem,
        updateTasbihCount,
        resetSection,
        resetAllProgress,
        getItemProgress,
        getSectionProgress,
        calculateProgress,

        // Convenience getters - return percentage directly
        morningProgress: getSectionProgress("morning").percentage || 0,
        eveningProgress: getSectionProgress("evening").percentage || 0,
        tasbihProgress: getSectionProgress("tasbih").percentage || 0,
        reliefProgress: getSectionProgress("relief").percentage || 0,

        // Check completion
        isMorningComplete: progress.morning?.completed || false,
        isEveningComplete: progress.evening?.completed || false,
        isTasbihComplete: progress.tasbih?.completed || false,
        isReliefComplete: progress.relief?.completed || false,
    };
}

export default useProgress;

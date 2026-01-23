import { createContext, useContext, useState, useEffect } from "react";

const ProgressContext = createContext(null);

const getToday = () => new Date().toISOString().split("T")[0];

const defaultProgress = {
    date: getToday(),
    morning: { completed: false, items: {} },
    evening: { completed: false, items: {} },
    tasbih: { completed: false, count: 0, target: 300 },
    relief: { completed: false, items: {} },
};

export function ProgressProvider({ children }) {
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem("sakina-progress");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Reset if it's a new day
                if (parsed.date !== getToday()) {
                    return { ...defaultProgress, date: getToday() };
                }
                return parsed;
            } catch {
                return defaultProgress;
            }
        }
        return defaultProgress;
    });

    useEffect(() => {
        localStorage.setItem("sakina-progress", JSON.stringify(progress));
    }, [progress]);

    // Check for new day and reset
    useEffect(() => {
        const checkNewDay = () => {
            const today = getToday();
            if (progress.date !== today) {
                setProgress({ ...defaultProgress, date: today });
            }
        };

        // Check every minute
        const interval = setInterval(checkNewDay, 60000);
        return () => clearInterval(interval);
    }, [progress.date]);

    const updateItemProgress = (section, itemId, currentCount, targetCount) => {
        setProgress((prev) => {
            const newItems = {
                ...prev[section].items,
                [itemId]: { current: currentCount, target: targetCount },
            };

            // Check if section is completed
            const isCompleted = Object.values(newItems).every(
                (item) => item.current >= item.target,
            );

            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    items: newItems,
                    completed: isCompleted,
                    completedAt: isCompleted ? new Date().toISOString() : null,
                },
            };
        });
    };

    const incrementItem = (section, itemId, targetCount) => {
        setProgress((prev) => {
            // التأكد من وجود القسم
            if (!prev[section]) {
                prev[section] = { completed: false, items: {} };
            }

            const currentItem = prev[section].items?.[itemId] || {
                current: 0,
                target: targetCount,
            };
            const newCount = Math.min(currentItem.current + 1, targetCount);

            const newItems = {
                ...prev[section].items,
                [itemId]: { current: newCount, target: targetCount },
            };

            const isCompleted = Object.values(newItems).every(
                (item) => item.current >= item.target,
            );

            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    items: newItems,
                    completed: isCompleted,
                    completedAt:
                        isCompleted && !prev[section].completed
                            ? new Date().toISOString()
                            : prev[section].completedAt,
                },
            };
        });
    };

    const updateTasbihCount = (count) => {
        setProgress((prev) => ({
            ...prev,
            tasbih: {
                ...prev.tasbih,
                count,
                completed: count >= prev.tasbih.target,
                completedAt:
                    count >= prev.tasbih.target
                        ? new Date().toISOString()
                        : null,
            },
        }));
    };

    const resetSection = (section) => {
        setProgress((prev) => ({
            ...prev,
            [section]:
                section === "tasbih"
                    ? { completed: false, count: 0, target: 300 }
                    : { completed: false, items: {} },
        }));
    };

    const resetAllProgress = () => {
        setProgress({ ...defaultProgress, date: getToday() });
    };

    const getItemProgress = (section, itemId) => {
        return progress[section]?.items?.[itemId] || { current: 0, target: 1 };
    };

    const getSectionProgress = (section) => {
        if (section === "tasbih") {
            return {
                current: progress.tasbih.count,
                target: progress.tasbih.target,
                percentage: Math.round(
                    (progress.tasbih.count / progress.tasbih.target) * 100,
                ),
                completed: progress.tasbih.completed,
            };
        }

        const items = Object.values(progress[section]?.items || {});
        if (items.length === 0)
            return { current: 0, target: 0, percentage: 0, completed: false };

        // حساب إجمالي العد من كل الأذكار
        const totalCurrent = items.reduce(
            (sum, item) => sum + (item.current || 0),
            0,
        );
        const totalTarget = items.reduce(
            (sum, item) => sum + (item.target || 0),
            0,
        );

        return {
            current: totalCurrent,
            target: totalTarget,
            percentage:
                totalTarget > 0
                    ? Math.round((totalCurrent / totalTarget) * 100)
                    : 0,
            completed: progress[section]?.completed || false,
        };
    };

    const value = {
        progress,
        updateItemProgress,
        incrementItem,
        updateTasbihCount,
        resetSection,
        resetAllProgress,
        getItemProgress,
        getSectionProgress,
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgressContext() {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error(
            "useProgressContext must be used within a ProgressProvider",
        );
    }
    return context;
}

export default ProgressContext;

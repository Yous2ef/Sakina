import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    RiBookOpenLine,
    RiStarLine,
    RiTimeLine,
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiCheckboxCircleLine,
} from "react-icons/ri";
import { Modal } from "./Modal";
import tasbihData from "../data/tasbih-prayer.json";

/**
 * TasbihInfoModal - Modal showing detailed information about Salat al-Tasbih
 * نافذة معلومات صلاة التسبيح
 */
export function TasbihInfoModal({ isOpen, onClose }) {
    const [showDetails, setShowDetails] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (sectionId) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const AccordionSection = ({ id, title, icon: Icon, children }) => {
        const isExpanded = expandedSections[id];

        return (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <motion.button
                    onClick={() => toggleSection(id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileTap={{ scale: 0.98 }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white font-amiri">
                            {title}
                        </span>
                    </div>
                    {isExpanded ? (
                        <RiArrowUpSLine className="w-5 h-5 text-gray-400" />
                    ) : (
                        <RiArrowDownSLine className="w-5 h-5 text-gray-400" />
                    )}
                </motion.button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden">
                            <div className="p-4 bg-white dark:bg-gray-800/50">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="صلاة التسبيح" size="lg">
            <div className="space-y-5">
                {/* Summary Section - Always Visible */}
                <div className="space-y-4">
                    {/* Description */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                            <RiBookOpenLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                الوصف
                            </p>
                            <p className="text-gray-900 dark:text-white font-amiri leading-relaxed">
                                {tasbihData.description}
                            </p>
                        </div>
                    </div>

                    {/* Main Virtue */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                            <RiStarLine className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                الفضل
                            </p>
                            <p className="text-gray-900 dark:text-white font-amiri leading-relaxed">
                                {tasbihData.hadith?.virtue}
                            </p>
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <RiTimeLine className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                الوقت الموصى به
                            </p>
                            <p className="text-gray-900 dark:text-white font-amiri leading-relaxed text-sm">
                                {tasbihData.frequency?.recommended}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Show Details Button */}
                {!showDetails && (
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDetails(true)}
                        className="w-full p-3 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-medium transition-colors flex items-center justify-center gap-2">
                        <span>عرض التفاصيل الكاملة</span>
                        <RiArrowDownSLine className="w-5 h-5" />
                    </motion.button>
                )}

                {/* Detailed Sections - Accordion */}
                <AnimatePresence>
                    {showDetails && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3">
                            {/* How to Pray Section */}
                            <AccordionSection
                                id="instructions"
                                title="كيفية أداء الصلاة"
                                icon={RiCheckboxCircleLine}>
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                        {tasbihData.instructions?.title}
                                    </p>
                                    <div className="space-y-2">
                                        {tasbihData.instructions?.steps.map(
                                            (step) => (
                                                <div
                                                    key={step.step}
                                                    className="flex gap-3">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center">
                                                        {step.step}
                                                    </span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {step.title}
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 font-amiri">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-amiri">
                                            <strong>المجموع:</strong>{" "}
                                            {
                                                tasbihData.instructions
                                                    ?.totalCount
                                            }
                                        </p>
                                    </div>
                                </div>
                            </AccordionSection>

                            {/* Tasbih Details Section */}
                            <AccordionSection
                                id="tasbih"
                                title="التسبيح"
                                icon={RiBookOpenLine}>
                                <div className="space-y-3">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-gray-900 dark:text-white font-amiri leading-loose text-center">
                                            {tasbihData.tasbih?.arabicText}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            توزيع التسبيحات في الركعة:
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    بعد الافتتاح:
                                                </span>{" "}
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    {
                                                        tasbihData.tasbih
                                                            ?.countsPerRakah
                                                            ?.afterOpening
                                                    }
                                                </span>
                                            </div>
                                            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    بعد القراءة:
                                                </span>{" "}
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    {
                                                        tasbihData.tasbih
                                                            ?.countsPerRakah
                                                            ?.afterRecitation
                                                    }
                                                </span>
                                            </div>
                                            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    في الركوع:
                                                </span>{" "}
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    {
                                                        tasbihData.tasbih
                                                            ?.countsPerRakah
                                                            ?.inRuku
                                                    }
                                                </span>
                                            </div>
                                            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    بعد الركوع:
                                                </span>{" "}
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    {
                                                        tasbihData.tasbih
                                                            ?.countsPerRakah
                                                            ?.afterRuku
                                                    }
                                                </span>
                                            </div>
                                            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    السجود الأول:
                                                </span>{" "}
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    {
                                                        tasbihData.tasbih
                                                            ?.countsPerRakah
                                                            ?.inFirstSujud
                                                    }
                                                </span>
                                            </div>
                                            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    بين السجدتين:
                                                </span>{" "}
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    {
                                                        tasbihData.tasbih
                                                            ?.countsPerRakah
                                                            ?.betweenSujud
                                                    }
                                                </span>
                                            </div>
                                            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    السجود الثاني:
                                                </span>{" "}
                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                    {
                                                        tasbihData.tasbih
                                                            ?.countsPerRakah
                                                            ?.inSecondSujud
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-center">
                                            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                                {
                                                    tasbihData.tasbih
                                                        ?.totalPerRakah
                                                }{" "}
                                                تسبيحة في كل ركعة
                                            </p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                                                المجموع:{" "}
                                                {tasbihData.tasbih?.totalPrayer}{" "}
                                                تسبيحة في الصلاة
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionSection>

                            {/* Hadith Section */}
                            <AccordionSection
                                id="hadith"
                                title="الحديث والفضل"
                                icon={RiStarLine}>
                                <div className="space-y-3">
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                        <p className="text-base text-gray-700 dark:text-gray-300 font-amiri leading-loose">
                                            {tasbihData.hadith?.arabicText}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            المرجع:
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {tasbihData.pageReference?.source}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            الراوي:{" "}
                                            {tasbihData.pageReference?.narrator}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            الدرجة:{" "}
                                            {tasbihData.pageReference?.grade}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-2">
                                            {tasbihData.pageReference?.notes}
                                        </p>
                                    </div>
                                </div>
                            </AccordionSection>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Modal>
    );
}

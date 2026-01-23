import { motion } from "framer-motion";
import {
    RiBookOpenLine,
    RiFileList3Line,
    RiCheckDoubleLine,
    RiStarLine,
    RiTimeLine,
} from "react-icons/ri";
import { Modal } from "./Modal";
import { GradeBadge } from "./GradeBadge";
import references from "../data/references.json";

/**
 * ReferenceModal - Modal showing hadith source and grading
 * نافذة عرض مصدر الحديث وتخريجه
 */
export function ReferenceModal({
    isOpen,
    onClose,
    reference,
    title,
    virtue,
    occasion,
}) {
    if (!reference) return null;

    const { source, hadithNumber, narrator, grade, gradeBy, notes, book } =
        reference;

    // Get book info from references.json
    const bookInfo = references.books?.find((b) => b.id === book);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="المصدر والتخريج"
            size="md">
            <div className="space-y-5">
                {/* Title */}
                {title && (
                    <div className="p-4 bg-linear-to-l from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl">
                        <p className="text-emerald-900 dark:text-emerald-100 font-bold font-amiri text-xl text-center">
                            {title}
                        </p>
                    </div>
                )}

                {/* Source/Book */}
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                        <RiBookOpenLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            المصدر
                        </p>
                        <p className="text-gray-900 dark:text-white font-medium font-amiri text-lg">
                            {source || bookInfo?.name || "غير محدد"}
                        </p>
                        {hadithNumber && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                رقم الحديث: {hadithNumber}
                            </p>
                        )}
                    </div>
                </div>

                {/* Narrator */}
                {narrator && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <RiFileList3Line className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                الراوي
                            </p>
                            <p className="text-gray-900 dark:text-white font-medium font-amiri text-lg">
                                {narrator}
                            </p>
                        </div>
                    </div>
                )}

                {/* Grade */}
                {grade && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                            <RiCheckDoubleLine className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                درجة الحديث
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <GradeBadge grade={grade} />
                                {gradeBy && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        ({gradeBy})
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Virtue */}
                {virtue && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                            <RiStarLine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                الفضل
                            </p>
                            <p className="text-gray-900 dark:text-white font-amiri leading-relaxed mt-1">
                                {virtue}
                            </p>
                        </div>
                    </div>
                )}

                {/* Occasion */}
                {occasion && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <RiTimeLine className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                المناسبة
                            </p>
                            <p className="text-gray-900 dark:text-white font-medium mt-1">
                                {occasion}
                            </p>
                        </div>
                    </div>
                )}

                {/* Notes */}
                {notes && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {notes}
                        </p>
                    </motion.div>
                )}

                {/* Book Description */}
                {bookInfo?.description && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
                        {bookInfo.description}
                    </p>
                )}
            </div>
        </Modal>
    );
}

export default ReferenceModal;

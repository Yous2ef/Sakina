import {
    RiInformationLine,
    RiTimeLine,
    RiStarLine,
    RiBookLine,
    RiCheckLine,
} from "react-icons/ri";
import { Modal } from "./Modal";
import pageInfo from "../data/page-info.json";

/**
 * PageInfoModal - Modal showing information about the current section
 * نافذة معلومات القسم الحالي
 */
export function PageInfoModal({ isOpen, onClose, sectionId }) {
    // Get section info from page-info.json
    const section = pageInfo.pages?.find((p) => p.id === sectionId);

    if (!section) return null;

    const { title, description, timing, sources, mainReference, virtue } =
        section;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`عن ${title}`}
            size="md">
            <div className="space-y-5">
                {/* Description */}
                {description && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                            <RiInformationLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                الوصف
                            </p>
                            <p className="text-gray-900 dark:text-white font-amiri leading-relaxed mt-1">
                                {description}
                            </p>
                        </div>
                    </div>
                )}

                {/* Timing */}
                {timing && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <RiTimeLine className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                التوقيت
                            </p>
                            <div className="space-y-1 text-sm">
                                {timing.start && (
                                    <p className="text-gray-900 dark:text-white">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            البداية:
                                        </span>{" "}
                                        {timing.start}
                                    </p>
                                )}
                                {timing.end && timing.end !== "-" && (
                                    <p className="text-gray-900 dark:text-white">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            النهاية:
                                        </span>{" "}
                                        {timing.end}
                                    </p>
                                )}
                                {timing.bestTime && (
                                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            أفضل وقت:
                                        </span>{" "}
                                        {timing.bestTime}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Virtue */}
                {virtue && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                            <RiStarLine className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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

                {/* Sources */}
                {sources && sources.length > 0 && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                            <RiBookLine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                المصادر
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {sources.map((source, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                                        <RiCheckLine className="w-4 h-4" />
                                        {source}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Reference */}
                {mainReference && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            المرجع الرئيسي
                        </p>
                        <p className="text-gray-900 dark:text-white font-amiri">
                            {mainReference}
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default PageInfoModal;

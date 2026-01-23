import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { RiCheckLine, RiPlayFill, RiPauseFill } from "react-icons/ri";
import { ReferenceButton } from "./ReferenceButton";
import { ReferenceModal } from "./ReferenceModal";
import { GradeBadge } from "./GradeBadge";
import { useVibration } from "../hooks/useVibration";
import { useProgress } from "../hooks/useProgress";
import { slideUp, scaleOnTap } from "../utils/animations";

/**
 * DhikrCard - Card component for displaying a dhikr
 * بطاقة عرض الذكر
 */
export function DhikrCard({
    id,
    sectionId,
    text,
    translation,
    count = 1,
    reference,
    title,
    virtue,
    occasion,
    type,
    audio,
    index = 0,
    onComplete,
}) {
    const [showReference, setShowReference] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const { mediumTap, successVibrate } = useVibration();
    const { getItemProgress, incrementItem } = useProgress();

    // تشغيل/إيقاف الصوت
    const toggleAudio = (e) => {
        e.stopPropagation();
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // عند انتهاء الصوت
    const handleAudioEnd = () => setIsPlaying(false);

    const progress = getItemProgress(sectionId, id);
    const currentCount = progress?.current || 0;
    const isCompleted = currentCount >= count;

    const handleTap = () => {
        if (isCompleted) return;

        mediumTap();
        incrementItem(sectionId, id, count);

        if (currentCount + 1 >= count) {
            successVibrate();
            onComplete?.(id);
        }
    };

    const remaining = Math.max(0, count - currentCount);
    const progressPercent = Math.min(100, (currentCount / count) * 100);

    return (
        <>
            <motion.div
                {...slideUp}
                transition={{ delay: index * 0.05 }}
                className={`
          relative overflow-hidden rounded-2xl
          bg-white dark:bg-gray-800
          border-2 transition-all
          ${
              isCompleted
                  ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 opacity-50"
                  : "border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
          }
        `}>
                {/* Progress bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="absolute top-0 left-0 right-0 h-1 bg-linear-to-l from-emerald-500 to-teal-500"
                />

                {/* Content */}
                <motion.div
                    {...scaleOnTap}
                    onClick={handleTap}
                    className="p-5 cursor-pointer select-none">
                    {/* Title/Name if exists */}
                    {title && (
                        <div className="mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                {title}
                            </span>
                        </div>
                    )}

                    {/* Basmala for Quran */}
                    {type === "quran" && (
                        <p className="text-center text-emerald-600 dark:text-emerald-400 font-amiri text-lg mb-3">
                            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيم
                        </p>
                    )}

                    {/* Arabic Text */}
                    <p className="dhikr-text leading-loose text-gray-900 dark:text-white font-amiri text-right mb-3">
                        {text}
                    </p>

                    {/* Surah Reference for Quran */}
                    {type === "quran" && reference?.source && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
                            [{reference.source}
                            {reference.ayah ? ` - الآية ${reference.ayah}` : ""}
                            ]
                        </p>
                    )}

                    {/* Virtue */}
                    {virtue && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 mb-3">
                            <p className="text-sm text-amber-800 dark:text-amber-200 font-amiri leading-relaxed text-right">
                                ✨ {virtue}
                            </p>
                        </div>
                    )}

                    {/* Translation if exists */}
                    {translation && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-right mb-4 leading-relaxed">
                            {translation}
                        </p>
                    )}

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        {/* Count indicator */}
                        <div className="flex items-center gap-2">
                            {isCompleted ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                    <RiCheckLine className="w-5 h-5" />
                                    <span className="text-sm font-medium">
                                        تم
                                    </span>
                                </motion.div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {remaining}
                                    </span>
                                    {count > 1 && (
                                        <span className="text-xs text-gray-400">
                                            / {count}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Audio, Reference button and grade */}
                        <div className="flex items-center gap-2">
                            {/* Audio Button */}
                            {audio && (
                                <>
                                    <audio
                                        ref={audioRef}
                                        src={audio}
                                        onEnded={handleAudioEnd}
                                        preload="none"
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleAudio}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                            isPlaying
                                                ? "bg-emerald-500 text-white"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                        }`}
                                        aria-label={
                                            isPlaying ? "إيقاف" : "تشغيل"
                                        }>
                                        {isPlaying ? (
                                            <RiPauseFill className="w-4 h-4" />
                                        ) : (
                                            <RiPlayFill className="w-4 h-4" />
                                        )}
                                    </motion.button>
                                </>
                            )}
                            {reference?.grade && (
                                <GradeBadge grade={reference.grade} size="sm" />
                            )}
                            {reference && (
                                <ReferenceButton
                                    onClick={() => setShowReference(true)}
                                    size="lg"
                                />
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Reference Modal */}
            <ReferenceModal
                isOpen={showReference}
                onClose={() => setShowReference(false)}
                reference={reference}
                title={title}
                virtue={virtue}
                occasion={occasion}
            />
        </>
    );
}

export default DhikrCard;

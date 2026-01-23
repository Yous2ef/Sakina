import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";
import { modalVariants, backdropVariants } from "../utils/animations";
import { useVibration } from "../hooks/useVibration";

/**
 * Modal - Reusable modal component
 * مكون النافذة المنبثقة
 */
export function Modal({
    isOpen,
    onClose,
    title,
    children,
    showCloseButton = true,
    closeOnBackdrop = true,
    size = "md",
    className = "",
}) {
    const { lightTap } = useVibration();

    // Close on Escape key
    const handleEscape = useCallback(
        (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose],
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleEscape]);

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-full mx-4",
    };

    const handleBackdropClick = () => {
        if (closeOnBackdrop) {
            lightTap();
            onClose();
        }
    };

    const handleCloseButton = () => {
        lightTap();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        {...backdropVariants}
                        onClick={handleBackdropClick}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        {...modalVariants}
                        className={`
              relative w-full ${sizes[size]} 
              bg-white dark:bg-gray-900 
              rounded-2xl shadow-2xl 
              overflow-hidden
              ${className}
            `}
                        onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                {title && (
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-amiri">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleCloseButton}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        aria-label="إغلاق">
                                        <RiCloseLine className="w-5 h-5 text-gray-500" />
                                    </motion.button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default Modal;

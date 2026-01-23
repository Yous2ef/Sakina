import { motion, AnimatePresence } from "framer-motion";
import { RiDownloadCloud2Line, RiCloseLine } from "react-icons/ri";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { Button } from "./Button";
import { slideUp } from "../utils/animations";

/**
 * InstallPrompt - PWA install prompt component
 * نافذة طلب تثبيت التطبيق
 */
export function InstallPrompt({ variant = "banner" }) {
    const { canInstall, install, dismissPrompt, isInstalled } =
        useInstallPrompt();

    if (!canInstall || isInstalled) return null;

    const handleInstall = async () => {
        await install();
    };

    if (variant === "banner") {
        return (
            <AnimatePresence>
                <motion.div
                    {...slideUp}
                    className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto">
                    <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 shadow-xl text-white">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                <RiDownloadCloud2Line className="w-6 h-6" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold mb-1">
                                    ثبّت سَكِينَة
                                </h3>
                                <p className="text-sm text-emerald-100 mb-3">
                                    أضف التطبيق للشاشة الرئيسية للوصول السريع
                                    والعمل بدون إنترنت
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleInstall}>
                                        تثبيت
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={dismissPrompt}
                                        className="text-white/70 hover:text-white">
                                        لاحقاً
                                    </Button>
                                </div>
                            </div>

                            <button
                                onClick={dismissPrompt}
                                className="text-white/50 hover:text-white p-1"
                                aria-label="إغلاق">
                                <RiCloseLine className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Minimal variant
    return (
        <AnimatePresence>
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstall}
                className="fixed bottom-24 left-4 z-50 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center"
                aria-label="تثبيت التطبيق">
                <RiDownloadCloud2Line className="w-6 h-6" />
            </motion.button>
        </AnimatePresence>
    );
}

export default InstallPrompt;

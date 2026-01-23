import { motion, AnimatePresence } from "framer-motion";
import { RiWifiOffLine } from "react-icons/ri";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { offlineToastVariants } from "../utils/animations";

/**
 * OfflineIndicator - Shows when app is offline
 * مؤشر عدم الاتصال بالإنترنت
 */
export function OfflineIndicator() {
    const { isOffline } = useOnlineStatus();

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    {...offlineToastVariants}
                    className="fixed top-3 left-2 z-50 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full shadow-lg">
                        <RiWifiOffLine className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            وضع بدون إنترنت
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * OfflineBanner - Full width offline banner
 * شريط عدم الاتصال
 */
export function OfflineBanner() {
    const { isOffline } = useOnlineStatus();

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-amber-500 text-white text-center text-sm py-1 px-4">
                    <div className="flex items-center justify-center gap-2">
                        <RiWifiOffLine className="w-4 h-4" />
                        <span>
                            أنت غير متصل بالإنترنت - التطبيق يعمل بشكل كامل
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default OfflineIndicator;

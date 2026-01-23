import { useState, useEffect } from "react";

/**
 * useInstallPrompt - Hook for PWA install prompt
 * هوك لعرض طلب تثبيت التطبيق
 */
export function useInstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
            return;
        }

        // Check if running as TWA
        if (document.referrer.includes("android-app://")) {
            setIsInstalled(true);
            return;
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
            setIsInstallable(true);
        };

        // Listen for successful install
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setInstallPrompt(null);
            setIsInstallable(false);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt,
        );
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt,
            );
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const install = async () => {
        if (!installPrompt) {
            return { success: false, error: "لا يمكن التثبيت الآن" };
        }

        try {
            installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;

            if (outcome === "accepted") {
                setInstallPrompt(null);
                setIsInstallable(false);
                return { success: true, outcome };
            }

            return { success: false, outcome };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const dismissPrompt = () => {
        setInstallPrompt(null);
        setIsInstallable(false);
        // Remember dismissal for this session
        sessionStorage.setItem("sakina-install-dismissed", "true");
    };

    const wasDismissed =
        sessionStorage.getItem("sakina-install-dismissed") === "true";

    return {
        canInstall: isInstallable && !wasDismissed,
        isInstalled,
        isInstallable,
        install,
        dismissPrompt,
    };
}

export default useInstallPrompt;

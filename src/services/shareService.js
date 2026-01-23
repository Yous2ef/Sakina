/**
 * Share Service - Web Share API utilities
 * خدمة المشاركة
 */

/**
 * Check if Web Share API is supported
 */
export function isShareSupported() {
    return "share" in navigator;
}

/**
 * Share text content
 */
export async function shareText(text, title = "سَكِينَة") {
    if (!isShareSupported()) {
        return fallbackShare(text);
    }

    try {
        await navigator.share({
            title,
            text,
        });
        return { success: true };
    } catch (error) {
        if (error.name === "AbortError") {
            return { success: false, cancelled: true };
        }
        return fallbackShare(text);
    }
}

/**
 * Share a dhikr with its source
 */
export async function shareDhikr(dhikr) {
    const text = formatDhikrForShare(dhikr);
    return shareText(text, dhikr.title || "ذكر من سَكِينَة");
}

/**
 * Format dhikr for sharing
 */
function formatDhikrForShare(dhikr) {
    let text = dhikr.text;

    if (dhikr.translation) {
        text += `\n\n${dhikr.translation}`;
    }

    if (dhikr.reference?.source) {
        text += `\n\n📚 المصدر: ${dhikr.reference.source}`;
        if (dhikr.reference.hadithNumber) {
            text += ` (${dhikr.reference.hadithNumber})`;
        }
    }

    if (dhikr.count > 1) {
        text += `\n\n🔢 العدد: ${dhikr.count} مرات`;
    }

    text += "\n\n— من تطبيق سَكِينَة";

    return text;
}

/**
 * Fallback for browsers without Web Share API
 */
async function fallbackShare(text) {
    try {
        await navigator.clipboard.writeText(text);
        return {
            success: true,
            fallback: true,
            message: "تم نسخ النص",
        };
    } catch (error) {
        return {
            success: false,
            error: "فشل في نسخ النص",
        };
    }
}

/**
 * Share the app
 */
export async function shareApp() {
    const text = `سَكِينَة - تطبيق الذكر والأدعية

📿 ذكر الصباح والمساء
🤲 صلاة التسبيح
❤️ مفاتيح الفرج

﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾`;

    if (!isShareSupported()) {
        return fallbackShare(text);
    }

    try {
        await navigator.share({
            title: "سَكِينَة - تطبيق الذكر",
            text,
            url: window.location.origin,
        });
        return { success: true };
    } catch (error) {
        if (error.name === "AbortError") {
            return { success: false, cancelled: true };
        }
        return fallbackShare(text);
    }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return { success: true };
    } catch (error) {
        // Fallback for older browsers
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            return { success: true };
        } catch {
            return { success: false, error: "فشل في نسخ النص" };
        }
    }
}

export default {
    isShareSupported,
    shareText,
    shareDhikr,
    shareApp,
    copyToClipboard,
};

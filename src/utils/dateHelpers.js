/**
 * Date Helpers - Date and time utilities
 * مساعدات التاريخ والوقت
 */

/**
 * Get today's date as string (YYYY-MM-DD)
 */
export function getTodayString() {
    return new Date().toISOString().split("T")[0];
}

/**
 * Check if date is today
 */
export function isToday(dateString) {
    return dateString === getTodayString();
}

/**
 * Get Arabic day name
 */
export function getArabicDayName(date = new Date()) {
    const days = [
        "الأحد",
        "الاثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت",
    ];
    return days[date.getDay()];
}

/**
 * Get Arabic month name
 */
export function getArabicMonthName(date = new Date()) {
    const months = [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
    ];
    return months[date.getMonth()];
}

/**
 * Format date in Arabic
 */
export function formatArabicDate(date = new Date()) {
    const day = date.getDate();
    const month = getArabicMonthName(date);
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

/**
 * Get greeting based on time of day
 */
export function getTimeGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "صباح الخير";
    } else if (hour >= 12 && hour < 17) {
        return "مساء الخير";
    } else if (hour >= 17 && hour < 21) {
        return "مساء النور";
    } else {
        return "طابت ليلتك";
    }
}

/**
 * Check if it's morning time (for dhkar)
 */
export function isMorningTime() {
    const hour = new Date().getHours();
    return hour >= 5 && hour < 12;
}

/**
 * Check if it's evening time (for dhkar)
 */
export function isEveningTime() {
    const hour = new Date().getHours();
    return hour >= 15 && hour < 21;
}

/**
 * Get suggested section based on time
 */
export function getSuggestedSection() {
    if (isMorningTime()) return "morning";
    if (isEveningTime()) return "evening";
    return null;
}

/**
 * Calculate time difference in human readable format
 */
export function getTimeDifference(date) {
    const now = new Date();
    const diff = now - new Date(date);

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days === 1) return "أمس";
    if (days < 7) return `منذ ${days} أيام`;
    if (days < 30) return `منذ ${Math.floor(days / 7)} أسبوع`;
    return formatArabicDate(new Date(date));
}

/**
 * Parse time string (HH:MM) to Date
 */
export function parseTimeToDate(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

/**
 * Format time for display
 */
export function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "م" : "ص";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export default {
    getTodayString,
    isToday,
    getArabicDayName,
    getArabicMonthName,
    formatArabicDate,
    getTimeGreeting,
    isMorningTime,
    isEveningTime,
    getSuggestedSection,
    getTimeDifference,
    parseTimeToDate,
    formatTime,
};

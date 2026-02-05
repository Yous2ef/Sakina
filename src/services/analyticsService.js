/**
 * Analytics Service - Fetches stats from Umami Cloud API
 * خدمة الإحصائيات - جلب البيانات من Umami
 */

// =============================================================================
// CONFIGURATION - أدخل بياناتك هنا
// =============================================================================

const UMAMI_API_KEY = "api_oqf6eoxGu9Vbtm1qRolotmBqOT5OaDfg";
const UMAMI_WEBSITE_ID = "4b7a3877-a0e2-426f-9362-99f4ae9524af";

// =============================================================================

// Umami Cloud API base URL
const UMAMI_API_BASE = "https://api.umami.is/v1";

/**
 * Get the time range parameters for Umami API
 */
function getTimeRange(period = "day") {
    const now = Date.now();
    const ranges = {
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000,
    };

    const startAt = now - (ranges[period] || ranges.day);
    return { startAt, endAt: now };
}

/**
 * Make authenticated API request to Umami
 */
async function umamiRequest(endpoint, params = {}) {
    const url = new URL(`${UMAMI_API_BASE}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
    });

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "x-umami-api-key": UMAMI_API_KEY,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Check if analytics is configured
 */
export function isAnalyticsConfigured() {
    return !!(UMAMI_API_KEY && UMAMI_WEBSITE_ID);
}

/**
 * Fetch analytics stats from Umami API
 */
export async function fetchAnalytics(period = "day") {
    if (!isAnalyticsConfigured()) {
        return {
            success: false,
            error: "not_configured",
            message: "يرجى إضافة API Key و Website ID",
        };
    }

    try {
        const { startAt, endAt } = getTimeRange(period);

        const data = await umamiRequest(`/websites/${UMAMI_WEBSITE_ID}/stats`, {
            startAt,
            endAt,
        });

        return {
            success: true,
            data: {
                visitors: data.visitors ?? 0,
                pageViews: data.pageviews ?? 0,
                visits: data.visits ?? 0,
                bounceRate: data.bounces ?? 0,
                totalTime: data.totaltime ?? 0,
            },
        };
    } catch (error) {
        console.error("Analytics fetch error:", error);
        return {
            success: false,
            error: "fetch_failed",
            message: "فشل في جلب الإحصائيات",
        };
    }
}

/**
 * Fetch real-time active visitors
 */
export async function fetchActiveVisitors() {
    if (!isAnalyticsConfigured()) {
        return { success: false, activeVisitors: 0 };
    }

    try {
        const data = await umamiRequest(`/websites/${UMAMI_WEBSITE_ID}/active`);

        return {
            success: true,
            activeVisitors: data.x ?? data.visitors ?? 0,
        };
    } catch {
        return { success: false, activeVisitors: 0 };
    }
}

/**
 * Fetch app installations (custom events)
 * جلب عدد مرات التثبيت
 */
export async function fetchInstallations(period = "day") {
    if (!isAnalyticsConfigured()) {
        return { success: false, installations: 0 };
    }

    try {
        const { startAt, endAt } = getTimeRange(period);

        const data = await umamiRequest(
            `/websites/${UMAMI_WEBSITE_ID}/events`,
            {
                startAt,
                endAt,
            },
        );

        // Count all app-installed events
        // API returns { data: [...events], count, page, pageSize }
        const events = Array.isArray(data) ? data : data.data || [];
        const installations = events.filter(
            (event) => event.eventName === "app-installed",
        ).length;

        return {
            success: true,
            installations,
        };
    } catch {
        return { success: false, installations: 0 };
    }
}

/**
 * Get the Umami dashboard URL
 */
export function getUmamiDashboardUrl() {
    return "https://cloud.umami.is";
}

export default {
    fetchAnalytics,
    fetchActiveVisitors,
    fetchInstallations,
    isAnalyticsConfigured,
    getUmamiDashboardUrl,
};

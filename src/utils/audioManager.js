/**
 * Audio Manager - Sound effects and audio utilities
 * مدير الأصوات
 */

// Audio context singleton
let audioContext = null;

/**
 * Get or create AudioContext
 */
function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

/**
 * Resume audio context (required after user gesture)
 */
export async function resumeAudioContext() {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
        await ctx.resume();
    }
    return ctx;
}

/**
 * Play a beep/click sound
 */
export function playClickSound(frequency = 800, duration = 50, volume = 0.1) {
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + duration / 1000,
        );

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
        console.warn("Audio not available:", error);
    }
}

/**
 * Play success/completion sound
 */
export function playSuccessSound() {
    try {
        const ctx = getAudioContext();

        // Play a pleasant two-tone success sound
        const notes = [523.25, 659.25]; // C5, E5
        const duration = 0.15;

        notes.forEach((frequency, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = "sine";

            const startTime = ctx.currentTime + index * duration;
            gainNode.gain.setValueAtTime(0.15, startTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                startTime + duration,
            );

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    } catch (error) {
        console.warn("Audio not available:", error);
    }
}

/**
 * Predefined sound effects
 */
export const sounds = {
    tap: () => playClickSound(600, 30, 0.08),
    count: () => playClickSound(800, 40, 0.1),
    complete: () => playSuccessSound(),
    error: () => playClickSound(200, 100, 0.1),
};

/**
 * Check if audio is available
 */
export function isAudioAvailable() {
    return "AudioContext" in window || "webkitAudioContext" in window;
}

export default {
    resumeAudioContext,
    playClickSound,
    playSuccessSound,
    sounds,
    isAudioAvailable,
};

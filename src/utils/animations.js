/**
 * Framer Motion Animation Variants
 * متغيرات الأنيميشن
 */

// Page Transitions
export const pageVariants = {
    initial: {
        opacity: 0,
        x: 20,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: 0.2,
        },
    },
};

// Fade In Animation
export const fadeIn = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.3 },
    },
    exit: { opacity: 0 },
};

// Slide Up Animation (for modals, cards)
export const slideUp = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.2 },
    },
};

// Scale Animation (for buttons, cards on tap)
export const scaleOnTap = {
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
};

// Counter Pulse Animation
export const counterPulse = {
    initial: { scale: 1 },
    pulse: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 0.2,
            ease: "easeInOut",
        },
    },
};

// Progress Ring Animation
export const progressRing = {
    initial: { pathLength: 0 },
    animate: (progress) => ({
        pathLength: progress,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    }),
};

// Stagger Children Animation
export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
        },
    },
};

// Modal/Overlay Animations
export const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const backdropVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.2 },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.15 },
    },
};

export const modalVariants = {
    initial: {
        opacity: 0,
        scale: 0.95,
        y: 10,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: 0.15 },
    },
};

// Bottom Sheet Animation
export const bottomSheetVariants = {
    initial: { y: "100%" },
    animate: {
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        y: "100%",
        transition: { duration: 0.2 },
    },
};

// Offline Toast Animation
export const offlineToastVariants = {
    initial: {
        y: -100,
        opacity: 0,
        scale: 0.9,
    },
    animate: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 30,
        },
    },
    exit: {
        y: -100,
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

// Install Prompt Animation
export const installPromptVariants = {
    initial: {
        y: "100%",
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        y: "100%",
        opacity: 0,
        transition: { duration: 0.3 },
    },
};

// Completion Celebration
export const celebrationVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
        },
    },
};

// Card Hover/Focus
export const cardHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
};

// Checkbox/Toggle Animation
export const checkVariants = {
    initial: { pathLength: 0 },
    checked: {
        pathLength: 1,
        transition: { duration: 0.3, ease: "easeOut" },
    },
    unchecked: { pathLength: 0 },
};

export default {
    pageVariants,
    fadeIn,
    slideUp,
    scaleOnTap,
    counterPulse,
    progressRing,
    staggerContainer,
    staggerItem,
    overlayVariants,
    modalVariants,
    bottomSheetVariants,
    offlineToastVariants,
    installPromptVariants,
    celebrationVariants,
    cardHover,
    checkVariants,
};

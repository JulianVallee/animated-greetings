const clone = require('rfdc')()

/**
 * Options:
 * delay: Can be a number or a callback with signature (el, i) based on DOM nodes found by "targets" selector
 */
export const Animations = {
    default: {
        name: "Default",
        targets: [
            {
                targets: (i: number) => `.animation__canvas-text--${i} .inner`,
                opacity: [0, 1],
                delay: 160,
                duration: 5,
                easing: "linear"
            },
            {
                targets: (i: number) => `.animation__canvas-text--${i} .inner`,
                opacity: 0,
                delay: 80,
                duration: 5,
                easing: "linear"
            }
        ]
    },
    zoom: {
        name: "Zoom",
        targets: [
            {
                targets: (i: number) => `.animation__canvas-text--${i} .inner`,
                opacity: [0, 1],
                scale: [0.2, 1],
                duration: 800
            },
            {
                targets: (i: number) => `.animation__canvas-text--${i} .inner`,
                opacity: 0,
                scale: 3,
                duration: 600,
                easing: "easeInExpo",
                delay: 500
            }
        ]
    },
    drop: {
        name: "Drop",
        splitToCharArray: true,
        targets: [
            {
                targets: (i: number) => `.animation__canvas-text--${i} .letter`,
                scale: [4, 1],
                opacity: [0, 1],
                translateZ: 0,
                easing: "easeOutExpo",
                duration: 950,
                delay: (el: Element, i: number) => 70 * i
            },
            {
                targets: (i: number) => `.animation__canvas-text--${i} .inner`,
                opacity: 0,
                duration: 600,
                easing: "easeInExpo",
                delay: 1000
            }
        ]
    }
};

export const GetAnimation = (animationName: keyof typeof Animations) => {
    return clone(Animations[animationName]);
};
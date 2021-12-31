const decimalsDefault = 1;

/**
 * @param {number} value
 * @param {number} duration
 * @param {number} decimals
 * @returns {string}
 */
export const progressAsMillisecondsFormatter = (value: number, duration: number, decimals = decimalsDefault): string => {
    return `${(value * duration / 100).toFixed(decimals).toLocaleString()}ms`;
}

/**
 * @param {number} value
 * @param {number} duration
 * @param {number} decimals
 * @returns {string}
 */
export const progressAsSecondsFormatter = (value: number, duration: number, decimals = decimalsDefault): string => {
    return `${(value * duration / 100000).toFixed(decimals).toLocaleString()}s`;
}

/**
 * @param {number} value
 * @param {number} duration
 * @param {number} decimals
 * @returns {string}
 */
export const progressAsMinutesFormatter = (value: number, duration: number, decimals = decimalsDefault): string => {
    return `${(value * duration / 100000 / 60).toFixed(decimals).toLocaleString()}m`;
}

export default {
    progressAsMillisecondsFormatter,
    progressAsSecondsFormatter,
    progressAsMinutesFormatter
}
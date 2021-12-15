/**
 * Execute a function only every {delay} ms.
 *
 * Example:
 *  const debouncedFunction = debounce(() => {
 *      console.log("I am only called every 500ms!");
 *  }, 500)
 *
 * @param fn
 * @param delay
 * @returns {(function(): void)|*}
 */
export default (fn, delay) => {
    let timeoutID = null;
    return function() {
        clearTimeout(timeoutID);
        const args = arguments;
        const that = this;
        timeoutID = setTimeout(function () {
            fn.apply(that, args);
        }, delay);
    }
}
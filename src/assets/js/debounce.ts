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
export default (fn: (args: IArguments) => void, delay: number) => {
    let timeoutID: NodeJS.Timeout;

    return function() {
        clearTimeout(timeoutID);
        const args = arguments;
        timeoutID = setTimeout(()=> {
            /* @ts-ignore */
            fn.apply(this, args);
        }, delay);
    }
}
export default {
    data() {
        return {
            log() {
                if(this?.options?.logging === true || this?.options?.logging?.enabled) {
                    let logName = this.$options._componentTag;

                    if(this?.options?.logging?.name) {
                        logName = this?.options?.logging?.name;
                    }

                    const logPrefix = `%c [${logName}]:`;
                    const logPrefixStyles = `color: #bada55`;
                    console.log(...[logPrefix, logPrefixStyles, ...arguments]);
                }
            }
        }
    }
}
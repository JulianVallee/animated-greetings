interface MixinDataInterface {
    $options: {
        _componentTag: string
    }
    name: string,
    options: {
        logging: {
            enabled: boolean,
            name: string
        }
    }
}

export default {
    data() {
        return {
            log(this: MixinDataInterface) {
                if(this?.options?.logging || this?.options?.logging?.enabled) {
                    let logName = this.$options._componentTag;

                    if(this?.options?.logging?.name) {
                        logName = this?.options?.logging?.name;
                    }

                    const logPrefix = `%c[${logName}]:`;
                    const logPrefixStyles = `color: #bada55`;
                    console.log(...[logPrefix, logPrefixStyles, ...arguments]);
                }
            }
        }
    }
}
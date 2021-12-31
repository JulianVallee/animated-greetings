interface LoggerOptions {
    enabled: boolean,
    name: string,
    prefixes: string[],
    color: string
}

interface MixinDataInterface {
    $options: {
        _componentTag: string,
        logger: LoggerOptions
    }
}

function adjust(color: any, amount: any) {
    return '#' + color.replace(/^#/, '').replace(/../g, (color: any) => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default {
    install(Vue: any, options: any) {
        Object.defineProperty(Vue.prototype, "$log", {
            get: function () {
                if(
                    !this?.$options?.logger
                    || !this?.$options?.logger?.enabled
                    || this?.$root.$options?.logger?.enabled === false
                ) {
                    return function(){};
                }

                const prefixes = [];
                const colors = [];

                const logColor = this?.$options?.logger?.color ?? '#bada55';
                const logName = this?.$options?.logger?.name ?? this.$options._componentTag;

                prefixes.push(`%c[${logName}]`);
                colors.push(`color: ${logColor}`);

                // Process additional prefixes
                if(Array.isArray(this?.$options?.logger?.prefixes)) {
                    for(let i = 0; i < this.$options.logger.prefixes.length; i++) {
                        if(typeof this.$options.logger.prefixes[i] === 'string') {
                            prefixes.push(`%c[${this.$options.logger.prefixes[i]}]`);
                            colors.push(`color: ${adjust(logColor, -50 * (i + 1))}`);
                        }
                    }
                }

                // Bind the log statement with our prefixes
                return console.info.bind(Vue.prototype, ...[prefixes.join(''), ...colors]);
            }
        });
    }
}
const core = require('@actions/core');

interface IDictionary<TValue> {
    [id: string]: TValue;
}

class VarParser {
    public outputs: IDictionary<string> = {};

    public set(name: string, valueParserCallback: (parser: this) => string): this {
        this.outputs[name] = valueParserCallback(this);
        core.setOutput(name, this.outputs[name]);
        return this;
    }

}

export default VarParser;
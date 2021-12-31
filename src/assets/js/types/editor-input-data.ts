export default class EditorInputData
{
    /**
     * Input value
     * @type {string}
     */
    value: string = "Beispieltext";

    /**
     * Value between 1 and 99, not an actual size but more a scaling factor
     * @type {number}
     */
    fontSize: number = 1;

    /**
     * Valid hexadecimal color
     * @type {string}
     */
    fontColor: string = '#ffffff';

    /**
     * Animation name
     * @type {string}
     */
    animation: string = 'default';

    delayEnter: number = 0;

    durationEnter: number = 0;

    delayLeave: number = 0;

    durationLeave: number = 0;

    static createInstance(value: string) {
        const instance = new EditorInputData();
        instance.value = value;
        return instance;
    }

    static fillPlaceholderString(value: string , index: number ) {
        const replacements = {
            i: index
        };

        return value.replace(
            /{(\w+)}/g,
            (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
                replacements.hasOwnProperty(placeholderWithoutDelimiters)
                    /* @ts-ignore */
                    ? replacements[placeholderWithoutDelimiters]
                    : placeholderWithDelimiters
        );
    }
}
export default class EditorInputData
{
    /**
     * Input value
     * @type {string}
     */
    value = "Beispieltext";

    /**
     * Value between 1 and 99, not an actual size but more a scaling factor
     * @type {number}
     */
    fontSize = 1;

    /**
     * Valid hexadecimal color
     * @type {string}
     */
    fontColor ='#ffffff';

    /**
     * Animation name
     * @type {string}
     */
    animation = 'default';

    delayEnter = 0;

    durationEnter = 0;

    delayLeave = 0;

    durationLeave = 0;

    static createInstance(value) {
        const instance = new EditorInputData();
        instance.value = value;
        return instance;
    }

    static fillPlaceholderString(value, index) {
        const replacements = {
            i: index
        };

        return value.replace(
            /{(\w+)}/g,
            (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
                replacements.hasOwnProperty(placeholderWithoutDelimiters)
                    ? replacements[placeholderWithoutDelimiters]
                    : placeholderWithDelimiters
        );
    }
}
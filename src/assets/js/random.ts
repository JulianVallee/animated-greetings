export default class Random {
    private seedValue: number;

    /**
     * @see https://stackoverflow.com/a/47593316 -> xmur3
     */
    constructor(seed: string) {
        this.seedValue = 1779033703 ^ seed.length;

        for(let i = 0; i < seed.length; i++) {
            this.seedValue = Math.imul(this.seedValue ^ seed.charCodeAt(i), 3432918353);
        }

        this.seedValue = this.seedValue << 13 | this.seedValue >>> 19;
    }

    integer(value: number = 100): number {
        return Math.floor(this.float() * value) + 1;
    }

    /**
     * @see https://stackoverflow.com/a/47593316 -> mulberry32
     */
    float() {
        let t = this.getNextSeed() + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    range(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(this.float() * (max - min + 1)) + min;
    }

    rangeFloat(min: number, max: number) {
        return this.float() * (max - min) + min;
    }

    /**
     * @see https://stackoverflow.com/a/47593316 -> xmur3
     */
    private getNextSeed() {
        this.seedValue = Math.imul(this.seedValue ^ this.seedValue >>> 16, 2246822507);
        this.seedValue = Math.imul(this.seedValue ^ this.seedValue >>> 13, 3266489909);
        return (this.seedValue ^= this.seedValue >>> 16) >>> 0;
    }
}
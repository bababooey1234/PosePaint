export default class Colour {
    /**
     * Internal structure: Array of 4 bytes (for efficient use in canvas API)
     */
    public RGBA: Uint8ClampedArray = new Uint8ClampedArray(4);
    constructor() {
        this.RGBA[3] = 255; // default alpha is always 255
    }

    /**
     * @returns RGBA string representing colour, e.g. #89ABCDEF
     */
    public toString(): string {
        return '#' + this.formatByte(this.RGBA[0]) + this.formatByte(this.RGBA[1]) + this.formatByte(this.RGBA[2]) + this.formatByte(this.RGBA[3]);
    }
    /**
     * ensures length of two by adding a 0 if one digit (<16)
     * @param byte number from 0-255
     * @returns hex string, length 2
     */
    private formatByte(byte: number) {
        return ((byte < 16) ? '0' : '') + byte.toString(16)
    }
    /**
     * Sets colour given a string e.g. #56789A
     * @param colour MUST be hex string of format #XXXXXX (RGB, not RGBA)
     */
    public setColourString(colour: string): void {
        this.RGBA[0] = parseInt(colour.slice(1,3), 16);
        this.RGBA[1] = parseInt(colour.slice(3,5), 16);
        this.RGBA[2] = parseInt(colour.slice(5,7), 16);
    }
}
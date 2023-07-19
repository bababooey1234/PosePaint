export default class Colour {
    public hexstring: string = "#000000"
    public alpha: number = 255;
    /**
     * @returns RGBA string representing colour, e.g. #89ABCDEF
     */
    public toString(): string {
        // if the alpha value is less than 16, need to append a 0 to make sure there are 8 hex digits
        return this.hexstring + (this.alpha < 16 ? '0' : '') + this.alpha.toString(16)
    }
}
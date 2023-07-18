export default class Colour {
    public hexstring: string = "#000000"
    public alpha: number = 255;
    /**
     * @returns RGBA string representing colour, e.g. #89ABCDEF
     */
    public toString(): string {
        return this.hexstring + (this.alpha < 16 ? '0' : '') + this.alpha.toString(16)
    }
}
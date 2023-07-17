export default class BrushOptions {
    public colour: Uint8ClampedArray;
    public thickness: number;
    constructor() {
        this.colour = new Uint8ClampedArray(4);
        this.thickness = 5;
    }
    public colourAsString(): string {
        return '#' + this.colour[0].toString(16) + this.colour[1].toString(16) + this.colour[2].toString(16) + this.colour[3].toString(16);
    }
}
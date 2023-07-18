import Colour from "./Colour";
import DOM from "./DOM";

export default class BrushOptions {
    public thickness = 5;
    public colours = [new Colour(), new Colour(), new Colour(), new Colour(), new Colour()];
    public selectedColour = 0;
    
    constructor() {
        // update colour pickers in the menu from the default values given in the html
        [...DOM.coloursFlexbox.children].forEach((colourWrapper, index) => {
            this.colours[index].hexstring = (colourWrapper.getElementsByClassName("colour_picker")[0] as HTMLInputElement).value;
        });
    }
}
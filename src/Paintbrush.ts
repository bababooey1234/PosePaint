import ApplicationState from "./ApplicationState";
import Coords from "./Coords";
import DOM from "./DOM";
import Tool from "./Tool";

export default class Paintbrush implements Tool {
    
    public lastApplied: Coords | null = null; // coords where tool was last used 

    public apply(location: Coords | null): void {
        // if no location given, set lastApplied to null
        if(location == null) {
            this.lastApplied = location;
            return;
        }
        // begin drawing
        DOM.paintingCtx.beginPath();
        if(this.lastApplied != null) {
            // if lastApplied exists, draw a straight line between
            DOM.paintingCtx.moveTo(this.lastApplied.x, this.lastApplied.y);
            DOM.paintingCtx.lineTo(location.x, location.y);
            DOM.paintingCtx.strokeStyle = ApplicationState.brushOptions.colourAsString();
            DOM.paintingCtx.stroke();
        } else {
            // else, just draw a circle at location
            DOM.paintingCtx.arc(location.x, location.y, ApplicationState.brushOptions.thickness / 2, 0, 2*Math.PI);
            DOM.paintingCtx.fillStyle = ApplicationState.brushOptions.colourAsString();
            DOM.paintingCtx.fill();
        }
        // update lastApplied property
        this.lastApplied = location;
    }
}
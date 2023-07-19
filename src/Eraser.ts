import Coords from "./Coords";
import Tool from "./Tool";
import DOM from "./DOM";
import ApplicationState from "./ApplicationState";
import UI from "./UI";

/**
 * Tool to erase a given area
 */
export default class Eraser implements Tool {
    
    lastApplied: Coords | null = null;

    constructor() {
        ApplicationState.toolType = 'eraser';
    }

    public apply(location: Coords | null): void {
        if(location == null) { // if applied nowhere, clear the lastApplied value and return
            this.lastApplied = null;
            return;
        }
        
        UI.convertToCanvasSpace(location);

        DOM.paintingCtx.save();
        // Same code as in Paintbrush.ts, but this line will make it so that anything added is removed
        DOM.paintingCtx.globalCompositeOperation = 'destination-out';
        // begin drawing
        DOM.paintingCtx.beginPath();
        if(this.lastApplied != null) {
            // if lastApplied exists, draw a straight line between
            DOM.paintingCtx.lineWidth = ApplicationState.brushOptions.thickness;
            DOM.paintingCtx.moveTo(this.lastApplied.x, this.lastApplied.y);
            DOM.paintingCtx.lineTo(location.x, location.y);
            DOM.paintingCtx.strokeStyle = 'black';
            DOM.paintingCtx.stroke();
        }
        // draw a circle at location
        DOM.paintingCtx.arc(location.x, location.y, ApplicationState.brushOptions.thickness / 2, 0, 2*Math.PI);
        DOM.paintingCtx.fillStyle = 'black';
        DOM.paintingCtx.fill();
        // update lastApplied property
        this.lastApplied = location;
        
        DOM.paintingCtx.restore();
    }
}
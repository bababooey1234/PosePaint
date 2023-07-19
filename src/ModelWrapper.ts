import { Hands, ResultsListener, Results, HAND_CONNECTIONS, Landmark } from "@mediapipe/hands";
import ApplicationState from "./ApplicationState";
import DOM from "./DOM";
import ToolHand from "./ToolHand";
import ActiveHand from "./ActiveHand";
import Coords from "./Coords";

/**
 * Wraps the functionality of the mediapipe hands model in a simple interface
 */
export default class ModelWrapper {
    // actual model
    private model : Hands;
    /**
     * Create a wrapper around the mediapipe hands model
     * @param listener the function to be run after inference completes
     */
    constructor(listener: ResultsListener) {
        this.model = new Hands({locateFile: (file) => `hands/${file}`}); // make a model and load required files from the hands directory
        this.model.setOptions({ // model settings
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        this.model.onResults(listener); // on results, call listener()
    }
    /**
     * send DOM.flipCanvas to the model as input
     */
    public async sendInput() {
        return this.model.send({image: DOM.flipCanvas})
    }
    /**
     * Helper function to draw skeleton over hands given results
     * @param results mediapipe results object
     */
    public drawConnections(results: Results) {
        DOM.outputCtx.save();
        // clear the canvas
        DOM.outputCtx.clearRect(0, 0, DOM.outputImage.width, DOM.outputImage.height);
        // draw on the camera frame
        DOM.outputCtx.drawImage(
            results.image, 0, 0, DOM.outputImage.width, DOM.outputImage.height);
        // if there are any hands
        if (results.multiHandLandmarks) {
            // for each hand's landmarks
            for (const landmarks of results.multiHandLandmarks) {
                // for each connection that should be made (predefined)
                for(const connection of HAND_CONNECTIONS) {
                    // draw the connection in 1px wide black
                    DOM.outputCtx.beginPath();
                    DOM.outputCtx.moveTo(landmarks[connection[0]].x*DOM.outputImage.width, landmarks[connection[0]].y*DOM.outputImage.height);
                    DOM.outputCtx.lineTo(landmarks[connection[1]].x*DOM.outputImage.width, landmarks[connection[1]].y*DOM.outputImage.height);
                    DOM.outputCtx.stroke();
                }
                // if in debug mode (set via ApplicationState.ts), show landmark values
                if(ApplicationState.debug) {
                    DOM.outputCtx.font = "30px sans-serif";
                    DOM.outputCtx.fillStyle = "black";
                    for (const [landmarkIndex, landmark] of landmarks.entries()) {
                        DOM.outputCtx.fillText(String(landmarkIndex), landmark.x*DOM.outputImage.width-15, landmark.y*DOM.outputImage.height+15);
                    }
                }
            }
        }
        // restore whatever canvas settings were in place before this (e.g. stroke colour, font)
        DOM.outputCtx.restore();
    }

    /**
     * Find the tool hand and draw on the number of fingers up, in the corresponding colour
     * @param results mediapipe results object
     * @param nFingersUp number of fingers up
     */
    public drawNumberFingers(results: Results, nFingersUp: number): void {
        for(const [index, handedness] of results.multiHandedness.entries()) {
            if(handedness.label != ApplicationState.handedness) { // find only the tool hands
                // set colour
                DOM.outputCtx.fillStyle = ApplicationState.brushOptions.colours[ApplicationState.brushOptions.selectedColour].toString();
                // set font
                DOM.outputCtx.font = "bold 50px sans-serif";
                // draw number
                DOM.outputCtx.fillText(nFingersUp.toString(), results.multiHandLandmarks[index][0].x*DOM.outputImage.width-25, results.multiHandLandmarks[index][0].y*DOM.outputImage.height)
            }
        }
    }

    /**
     * 
     * @param results mediapipe results object
     * @param position where to draw the pointer
     */
    public drawPointerAt(results: Results, position: Coords) {
        for(const handedness of results.multiHandedness) {
            if(handedness.label == ApplicationState.handedness) { // find only the active hands
                DOM.outputCtx.fillStyle = "red";
                // draw a circle, radius 5px
                DOM.outputCtx.beginPath();
                DOM.outputCtx.arc(position.x*DOM.outputImage.width, position.y*DOM.outputImage.height, 5, 0, 2*Math.PI);
                DOM.outputCtx.fill();
            }
        }
    }  

    /**
     * @returns toolHand, activeHand
     * @param results mediapipe results object
     */
    public interpretResults(results: Results): [ToolHand?, ActiveHand?] {
        // declare the two hands
        let toolHand: ToolHand | undefined = undefined;
        let activeHand: ActiveHand | undefined = undefined;
        let nHandsDetected = results.multiHandLandmarks.length;
        // for each hand detected,
        for(let handIndex = 0; handIndex < nHandsDetected; handIndex++) {
            // find out which hand the model thinks it is
            let handedness = results.multiHandedness[handIndex].label;
            if(handedness == ApplicationState.handedness) // if it's an active hand
                activeHand = new ActiveHand(results.multiHandLandmarks[handIndex]);
            else // if it's a tool hand
                toolHand = new ToolHand(results.multiHandLandmarks[handIndex]);
        }
        // return both hands
        return [toolHand, activeHand];
    }
    
}
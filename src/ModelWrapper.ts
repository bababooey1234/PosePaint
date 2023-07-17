//inputs: onResults function, sendInput call
//outputs: canvas with hands drawn, then calls onResults

import { Hands, ResultsListener, Results, HAND_CONNECTIONS, Landmark } from "@mediapipe/hands";
import ApplicationState from "./ApplicationState";
import DOM from "./DOM";
import ToolHand from "./ToolHand";
import ActiveHand from "./ActiveHand";
import Coords from "./Coords";

export default class ModelWrapper {
    // actual model
    private model : Hands;
    /**
     * Create a wrapper around the mediapipe hands model
     * @param listener the function to be run after inference completes
     */
    constructor(listener: ResultsListener) {
        this.model = new Hands({locateFile: (file) => `hands/${file}`});
        this.model.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        this.model.onResults(listener);
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
        DOM.outputCtx.clearRect(0, 0, DOM.outputImage.width, DOM.outputImage.height);
        DOM.outputCtx.drawImage(
            results.image, 0, 0, DOM.outputImage.width, DOM.outputImage.height);
        if (results.multiHandLandmarks) {
            for (const [handIndex, landmarks] of results.multiHandLandmarks.entries()) {
                for(const connection of HAND_CONNECTIONS) {
                    DOM.outputCtx.beginPath();
                    DOM.outputCtx.moveTo(landmarks[connection[0]].x*DOM.outputImage.width, landmarks[connection[0]].y*DOM.outputImage.height);
                    DOM.outputCtx.lineTo(landmarks[connection[1]].x*DOM.outputImage.width, landmarks[connection[1]].y*DOM.outputImage.height);
                    DOM.outputCtx.stroke();
                }
                // if in debug mode, show landmark values
                if(ApplicationState.debug) {
                    DOM.outputCtx.font = "30px sans-serif";
                    DOM.outputCtx.fillStyle = "black";
                    for (const [landmarkIndex, landmark] of landmarks.entries()) {
                        DOM.outputCtx.fillText(String(landmarkIndex), landmark.x*DOM.outputImage.width-15, landmark.y*DOM.outputImage.height+15);
                    }
                }
            }
            // if in debug mode, show which hand is which
            /*if(ApplicationState.debug) {
                for(const [index, handedness] of results.multiHandedness.entries()) {
                    DOM.outputCtx.fillStyle = "red";
                    DOM.outputCtx.font = "50px sans-serif";
                    DOM.outputCtx.fillText(handedness.label, results.multiHandLandmarks[index][0].x*DOM.outputImage.width-25, results.multiHandLandmarks[index][0].y*DOM.outputImage.height)
                }
            }*/
        }
        DOM.outputCtx.restore();
    }

    public drawNumberFingers(results: Results, nFingersUp: number): void {
        for(const [index, handedness] of results.multiHandedness.entries()) {
            if(handedness.label != ApplicationState.handedness) {
                DOM.outputCtx.fillStyle = "red";
                DOM.outputCtx.font = "50px sans-serif";
                DOM.outputCtx.fillText(nFingersUp.toString(), results.multiHandLandmarks[index][0].x*DOM.outputImage.width-25, results.multiHandLandmarks[index][0].y*DOM.outputImage.height)
            }
        }
    }

    public drawPointerAt(results: Results, position: Coords) {
        for(const handedness of results.multiHandedness) {
            if(handedness.label == ApplicationState.handedness) {
                DOM.outputCtx.fillStyle = "red";
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
        // using multiHandWorldLandmarks - landmarks measured in world coordinates
        // (estimated real-world 3D coordinates in metres from the hand's geometric centre)
        // default: assume no fingers up on either hand 
        //let returnArray: [Hand,Hand] = [{nFingersUp: 0},{nFingersUp: 0}];
        let toolHand: ToolHand | undefined = undefined;
        let activeHand: ActiveHand | undefined = undefined;
        let nHandsDetected = results.multiHandLandmarks.length;
        for(let handIndex = 0; handIndex < nHandsDetected; handIndex++) {
            //if(landmarks[HandLandmarks.INDEX_FINGER_TIP])
            //returnArray[handIndex].nFingersUp;
            //console.log(results.multiHandedness[handIndex].label)
            let handedness = results.multiHandedness[handIndex].label;
            if(handedness == ApplicationState.handedness)
                activeHand = new ActiveHand(results.multiHandLandmarks[handIndex]);
            else
                toolHand = new ToolHand(results.multiHandLandmarks[handIndex]);
        }
        return [toolHand, activeHand];
    }
    
}
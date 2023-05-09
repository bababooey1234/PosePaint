//inputs: onResults function, sendInput call
//outputs: canvas with hands drawn, then calls onResults

import { Hands, ResultsListener, Results, HAND_CONNECTIONS } from "@mediapipe/hands";
import ApplicationState from "./ApplicationState";
import DOM from "./DOM";

export default class {
    // actual model
    private model : Hands;
    /**
     * Create a wrapper around the mediapipe hands model
     * @param listener the function to be run after inference completes
     */
    constructor(listener: ResultsListener) {
        this.model = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
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
                if(ApplicationState.debug) {
                    DOM.outputCtx.font = "30px sans-serif";
                    DOM.outputCtx.fillStyle = "black";
                    for (const [landmarkIndex, landmark] of landmarks.entries()) {
                        DOM.outputCtx.fillText(String(landmarkIndex), landmark.x*DOM.outputImage.width-15, landmark.y*DOM.outputImage.height+15);
                    }
                }
            }
            // if in debug mode, show which hand is which
            if(ApplicationState.debug) {
                for(const [index, handedness] of results.multiHandedness.entries()) {
                    DOM.outputCtx.fillStyle = "red";
                    DOM.outputCtx.font = "50px sans-serif";
                    DOM.outputCtx.fillText(handedness.label, results.multiHandLandmarks[index][0].x*DOM.outputImage.width-25, results.multiHandLandmarks[index][0].y*DOM.outputImage.height)
                }
            }
        }
        DOM.outputCtx.restore();
    }
}
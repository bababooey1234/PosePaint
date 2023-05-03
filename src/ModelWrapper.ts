//inputs: onResults function, sendInput call
//outputs: canvas with hands drawn, then calls onResults

import { Hands, ResultsListener, InputMap, Results, HAND_CONNECTIONS } from "@mediapipe/hands";
import ApplicationState from "./ApplicationState";

const outputimage = document.getElementById("outputimage") as HTMLCanvasElement;

const canvasCtx = outputimage.getContext("2d")!;

export default class {
    private model : Hands;
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
    public async sendInput(input: InputMap) {
        return this.model.send(input)
    }
    public drawConnections(results: Results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, outputimage.width, outputimage.height);
        canvasCtx.drawImage(
            results.image, 0, 0, outputimage.width, outputimage.height);
        if (results.multiHandLandmarks) {
            for (const [handIndex, landmarks] of results.multiHandLandmarks.entries()) {
                for(const connection of HAND_CONNECTIONS) {
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(landmarks[connection[0]].x*outputimage.width, landmarks[connection[0]].y*outputimage.height);
                    canvasCtx.lineTo(landmarks[connection[1]].x*outputimage.width, landmarks[connection[1]].y*outputimage.height);
                    canvasCtx.stroke();
                }
                if(ApplicationState.debug) {
                    canvasCtx.font = "30px sans-serif";
                    canvasCtx.fillStyle = "black";
                    for (const [landmarkIndex, landmark] of landmarks.entries()) {
                        canvasCtx.fillText(String(landmarkIndex), landmark.x*outputimage.width-15, landmark.y*outputimage.height+15);
                    }
                }
            }
            // if in debug mode, show which hand is which
            if(ApplicationState.debug) {
                for(const [index, handedness] of results.multiHandedness.entries()) {
                    canvasCtx.fillStyle = "red";
                    canvasCtx.font = "50px sans-serif";
                    canvasCtx.fillText(handedness.label, results.multiHandLandmarks[index][0].x*outputimage.width-25, results.multiHandLandmarks[index][0].y*outputimage.height)
                }
            }
            //console.log(results.multiHandedness);
        }
        //debugger;
        canvasCtx.restore();
    }
}
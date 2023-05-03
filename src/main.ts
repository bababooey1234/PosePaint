import { Hands, HAND_CONNECTIONS, Results } from "@mediapipe/hands";
import Camera from "./Camera";

const outputimage = document.getElementById("outputimage") as HTMLCanvasElement;

const canvasCtx = outputimage.getContext("2d")!;

async function onFrame(frame: HTMLCanvasElement) {
    await hands.send({image: frame});
}

const camera = new Camera(onFrame);

function onResults(results: Results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, outputimage.width, outputimage.height);
    canvasCtx.drawImage(
        results.image, 0, 0, outputimage.width, outputimage.height);
    if (results.multiHandLandmarks) {
        for (const [handIndex, landmarks] of results.multiHandLandmarks.entries()) {
            //drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                            //{color: '#00FF00', lineWidth: 5});
            //drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
            canvasCtx.font = "30px sans-serif";
            canvasCtx.fillStyle = "black";
            for (const [landmarkIndex, landmark] of landmarks.entries()) {
                canvasCtx.fillText(String(landmarkIndex), landmark.x*outputimage.width-15, landmark.y*outputimage.height+15);
            }
            for(const connection of HAND_CONNECTIONS) {
                canvasCtx.beginPath();
                canvasCtx.moveTo(landmarks[connection[0]].x*outputimage.width, landmarks[connection[0]].y*outputimage.height);
                canvasCtx.lineTo(landmarks[connection[1]].x*outputimage.width, landmarks[connection[1]].y*outputimage.height);
                canvasCtx.stroke();
            }
            //canvasCtx.fillStyle = "red";
            //canvasCtx.font = "50px sans-serif";
            //for(const handedness of results.multiHandedness)
            //    if(handedness.index == handIndex)
            //        canvasCtx.fillText(handedness.label, landmarks[0].x*outputimage.width-25, landmarks[0].y*outputimage.height+25);
        }
        //for(const handedness of results.multiHandedness)
        //    canvasCtx.fillText(handedness.label, results.multiHandLandmarks[handedness.index][0]?.x*outputimage.width-25, results.multiHandLandmarks[handedness.index][0]?.y*outputimage.width+25)
        for(const [index, handedness] of results.multiHandedness.entries()) {
            canvasCtx.fillStyle = "red";
            canvasCtx.font = "50px sans-serif";
            canvasCtx.fillText(handedness.label, results.multiHandLandmarks[index][0].x*outputimage.width-25, results.multiHandLandmarks[index][0].y*outputimage.height)
            //console.log(handedness.label, results.multiHandLandmarks[index][0].x*outputimage.width-25, results.multiHandLandmarks[index][0].y*outputimage.width-25)
        }
        //console.log(results.multiHandedness);
    }
    //debugger;
    canvasCtx.restore();
}
const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);
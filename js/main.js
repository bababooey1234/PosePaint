"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const hands_1 = require("@mediapipe/hands");
const inputvideo = document.getElementById("inputvideo");
const outputimage = document.getElementById("outputimage");
const flipcanvas = document.getElementById("flipcanvas");
var canvasCtx = outputimage.getContext("2d");
var flipCtx = flipcanvas.getContext("2d");
//flipCtx.translate(1280 + 1280 / 2, 720 + 720 / 2);
//took fucking ages to figure this out. Flips flipCtx horizontally
flipCtx.translate(1280 / 2, 720 / 2);
flipCtx.scale(-1, 1);
flipCtx.translate(-1280 / 2, -720 / 2);
var firstFrame = true;
navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
        width: 1280,
        height: 720
    }
}).then((stream) => __awaiter(void 0, void 0, void 0, function* () {
    /* use the stream */
    inputvideo.srcObject = stream;
    yield inputvideo.play();
    function onFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            if (firstFrame) {
                firstFrame = false;
            }
            else {
                //flipCtx.save();
                //flipCtx.translate(1280, 720);
                //flipCtx.scale(-1,0);
                flipCtx.drawImage(inputvideo, 0, 0 /*, 1280, 720*/);
                //flipCtx.restore();
                //console.log("drawn");
            }
            yield hands.send({ image: flipcanvas });
            inputvideo.requestVideoFrameCallback(onFrame);
        });
    }
    inputvideo.requestVideoFrameCallback(onFrame);
}))
    .catch((error) => {
    /* handle the error */
    console.error(error);
});
function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, outputimage.width, outputimage.height);
    canvasCtx.drawImage(results.image, 0, 0, outputimage.width, outputimage.height);
    if (results.multiHandLandmarks) {
        for (const [handIndex, landmarks] of results.multiHandLandmarks.entries()) {
            //drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
            //{color: '#00FF00', lineWidth: 5});
            //drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
            canvasCtx.font = "30px sans-serif";
            canvasCtx.fillStyle = "black";
            for (const [landmarkIndex, landmark] of landmarks.entries()) {
                canvasCtx.fillText(String(landmarkIndex), landmark.x * outputimage.width - 15, landmark.y * outputimage.height + 15);
            }
            for (const connection of hands_1.HAND_CONNECTIONS) {
                canvasCtx.beginPath();
                canvasCtx.moveTo(landmarks[connection[0]].x * outputimage.width, landmarks[connection[0]].y * outputimage.height);
                canvasCtx.lineTo(landmarks[connection[1]].x * outputimage.width, landmarks[connection[1]].y * outputimage.height);
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
        for (const [index, handedness] of results.multiHandedness.entries()) {
            canvasCtx.fillStyle = "red";
            canvasCtx.font = "50px sans-serif";
            canvasCtx.fillText(handedness.label, results.multiHandLandmarks[index][0].x * outputimage.width - 25, results.multiHandLandmarks[index][0].y * outputimage.height);
            //console.log(handedness.label, results.multiHandLandmarks[index][0].x*outputimage.width-25, results.multiHandLandmarks[index][0].y*outputimage.width-25)
        }
        //console.log(results.multiHandedness);
    }
    //debugger;
    canvasCtx.restore();
}
const hands = new hands_1.Hands({ locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    } });
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

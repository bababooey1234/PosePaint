"use strict";
//inputs: onResults function, sendInput call
//outputs: canvas with hands drawn, then calls onResults
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hands_1 = require("@mediapipe/hands");
const ApplicationState_1 = __importDefault(require("./ApplicationState"));
const outputimage = document.getElementById("outputimage");
const canvasCtx = outputimage.getContext("2d");
class default_1 {
    constructor(listener) {
        this.listener = listener;
        this.model = new hands_1.Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        this.model.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        this.model.onResults(this._onResults.bind(this));
    }
    _onResults(results) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(this);
            this.drawConnections(results);
            return this.listener(results);
        });
    }
    sendInput(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.send(input);
        });
    }
    drawConnections(results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, outputimage.width, outputimage.height);
        canvasCtx.drawImage(results.image, 0, 0, outputimage.width, outputimage.height);
        if (results.multiHandLandmarks) {
            for (const [handIndex, landmarks] of results.multiHandLandmarks.entries()) {
                for (const connection of hands_1.HAND_CONNECTIONS) {
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(landmarks[connection[0]].x * outputimage.width, landmarks[connection[0]].y * outputimage.height);
                    canvasCtx.lineTo(landmarks[connection[1]].x * outputimage.width, landmarks[connection[1]].y * outputimage.height);
                    canvasCtx.stroke();
                }
                if (ApplicationState_1.default.debug) {
                    canvasCtx.font = "30px sans-serif";
                    canvasCtx.fillStyle = "black";
                    for (const [landmarkIndex, landmark] of landmarks.entries()) {
                        canvasCtx.fillText(String(landmarkIndex), landmark.x * outputimage.width - 15, landmark.y * outputimage.height + 15);
                    }
                }
            }
            // if in debug mode, show which hand is which
            if (ApplicationState_1.default.debug) {
                for (const [index, handedness] of results.multiHandedness.entries()) {
                    canvasCtx.fillStyle = "red";
                    canvasCtx.font = "50px sans-serif";
                    canvasCtx.fillText(handedness.label, results.multiHandLandmarks[index][0].x * outputimage.width - 25, results.multiHandLandmarks[index][0].y * outputimage.height);
                }
            }
            //console.log(results.multiHandedness);
        }
        //debugger;
        canvasCtx.restore();
    }
}
exports.default = default_1;

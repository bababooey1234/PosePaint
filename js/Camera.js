"use strict";
//inputs: onFrame function
//outputs: calls this function on every frame
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
class default_1 {
    constructor(onFrame) {
        this.videoElement = document.getElementById("inputvideo"); /* exposed to get width and height */
        this.outputCanvas = document.getElementById("flipcanvas");
        this.outputContext = this.outputCanvas.getContext("2d");
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: { ideal: 4096 },
                height: { ideal: 2160 }
            }
        }).then((stream) => __awaiter(this, void 0, void 0, function* () {
            // get actual camera resolution and direction
            let settings = stream.getVideoTracks()[0].getSettings();
            this.videoElement.width = this.outputCanvas.width = settings.width;
            this.videoElement.height = this.outputCanvas.height = settings.height;
            // if camera is a selfie camera, flip the canvas
            if (settings.facingMode != "environment") {
                //took fucking ages to figure this out. Flips outputContext horizontally
                this.outputContext.translate(this.outputCanvas.width / 2, this.outputCanvas.height / 2);
                this.outputContext.scale(-1, 1);
                this.outputContext.translate(-this.outputCanvas.width / 2, -this.outputCanvas.height / 2);
            }
            // play stream through hidden video element
            this.videoElement.srcObject = stream;
            yield this.videoElement.play();
            // every frame of the camera, call the provided function, then request the next frame
            let firstFrame = true;
            const _onFrame = () => __awaiter(this, void 0, void 0, function* () {
                if (firstFrame)
                    firstFrame = false;
                else
                    this.outputContext.drawImage(this.videoElement, 0, 0);
                yield onFrame(this.outputCanvas);
                this.videoElement.requestVideoFrameCallback(_onFrame);
            });
            this.videoElement.requestVideoFrameCallback(_onFrame);
        }))
            .catch((error) => {
            // if any errors occur, log to console
            console.error(error);
        });
    }
}
exports.default = default_1;

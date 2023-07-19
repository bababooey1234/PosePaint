import UI from "./UI";
import DOM from "./DOM";
import ApplicationState from "./ApplicationState";

export default class {
    private currentStream?: MediaStream = undefined;
    /**
     * Construct a Camera object and start processing frames.
     * If mode is painting, send frames to model before requesting next frame.
     * While initializing model, output is a loading screen.
     * @param deviceId the deviceID of the selected Camera. If blank, selects primary camera device.
     */
    constructor(deviceId: string) {
        const constraints: MediaStreamConstraints = {
            audio: false,
            video: {
                width: {ideal: 4096},
                height: {ideal: 2160},
                deviceId: deviceId == "" ? undefined : {exact: deviceId}// if an ID is selected, use it, otherwise leave undefined
            }
        };
        navigator.mediaDevices.getUserMedia(constraints).then(async (stream) => { // obtain camera stream resolution closest to 4K
            // get actual camera resolution and direction
            let settings = stream.getVideoTracks()[0].getSettings();
            DOM.videoElement.width = DOM.flipCanvas.width = DOM.outputImage.width = settings.width!;
            DOM.videoElement.height = DOM.flipCanvas.height = DOM.outputImage.height = settings.height!;
            if(DOM.paintingCanvas.width != settings.width)
                DOM.paintingCanvas.width = settings.width!;
            if(DOM.paintingCanvas.height != settings.height)
                DOM.paintingCanvas.height = settings.height!;
            UI.resizeCanvas();

            // if camera is a selfie camera, flip the canvas
            if(settings.facingMode != "environment") {
                //took fucking ages to figure this out. Flips outputContext horizontally by moving it, scaling it, and moving it back
                DOM.flipCtx.translate(DOM.flipCanvas.width/2, DOM.flipCanvas.height/2);
                DOM.flipCtx.scale(-1,1);
                DOM.flipCtx.translate(-DOM.flipCanvas.width/2,-DOM.flipCanvas.height/2);
            }

            // play stream through hidden video element
            DOM.videoElement.srcObject = this.currentStream = stream;
            await DOM.videoElement.play();

            // every frame of the camera, send frame to model, then request the next frame
            const _onFrame = async () => {
                if(!ApplicationState.modelLoaded) {
                    ApplicationState.modelLoaded = true;
                    // paint loading screen
                    let img = new Image();
                        img.onload = () => DOM.outputCtx.drawImage(img, 0, 0, DOM.outputImage.width, DOM.outputImage.height);
                    img.src = "loading.png";
                } else {
                    DOM.flipCtx.drawImage(DOM.videoElement, 0, 0);
                }
                if(ApplicationState.mode == "painting")
                    await ApplicationState.model.sendInput();
                DOM.videoElement.requestVideoFrameCallback(_onFrame); // request the next frame, ONLY after all processing is done
            }
            // start requesting frames
            DOM.videoElement.requestVideoFrameCallback(_onFrame);
        })
        .catch((error) => {
            // if any errors occur, log to console
            console.error(error);
        });
    }
    /**
     * Destroy Camera object by stopping all tracks
     */
    public destroy(): void {
        this.currentStream?.getTracks().forEach(track => track.stop())
    }
}

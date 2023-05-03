//inputs: onFrame function
//outputs: calls this function on every frame

export default class {
    private videoElement = document.getElementById("inputvideo") as HTMLVideoElement; /* exposed to get width and height */
    private outputCanvas = document.getElementById("flipcanvas") as HTMLCanvasElement;
    private outputContext = this.outputCanvas.getContext("2d")!;

    constructor(onFrame: (frame: HTMLCanvasElement) => Promise<void>) {
        navigator.mediaDevices.getUserMedia({ // obtain camera stream resolution closest to 4K https://stackoverflow.com/a/48546227/13717363
            audio: false,
            video: {
                width: {ideal: 4096},
                height: {ideal: 2160}
            }
        }).then(async (stream) => {
            // get actual camera resolution and direction
            let settings = stream.getVideoTracks()[0].getSettings();
            this.videoElement.width = this.outputCanvas.width = settings.width!;
            this.videoElement.height = this.outputCanvas.height = settings.height!;
            // if camera is a selfie camera, flip the canvas
            if(settings.facingMode != "environment") {
                //took fucking ages to figure this out. Flips outputContext horizontally
                this.outputContext.translate(this.outputCanvas.width/2, this.outputCanvas.height/2);
                this.outputContext.scale(-1,1);
                this.outputContext.translate(-this.outputCanvas.width/2,-this.outputCanvas.height/2);
            }
            // play stream through hidden video element
            this.videoElement.srcObject = stream;
            await this.videoElement.play();
            // every frame of the camera, call the provided function, then request the next frame
            let firstFrame = true;
            const _onFrame = async () => {
                if(firstFrame)
                    firstFrame = false;
                else
                    this.outputContext.drawImage(this.videoElement, 0, 0);
                await onFrame(this.outputCanvas);
                this.videoElement.requestVideoFrameCallback(_onFrame);
            }
            this.videoElement.requestVideoFrameCallback(_onFrame);
        })
        .catch((error) => {
            // if any errors occur, log to console
            console.error(error);
        });
    }
}

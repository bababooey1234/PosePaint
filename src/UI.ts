import ApplicationState from "./ApplicationState";
import Camera from "./Camera";
import Coords from "./Coords";
import DOM from "./DOM";

export default {
    /**
     * Initialise the UI by adding event listeners and finding available cameras
     */
    init: function() {
        DOM.btnOpenMenu.onclick = this.openMenu.bind(this);
        DOM.btnBegin.onclick = this.closeMenu;
        DOM.selectCamera.oninput = this.cameraSelected;
        DOM.brushSizeRange.oninput = DOM.brushSizeBox.oninput = this.onBrushSizeChange;
        DOM.btnDownload.onclick = this.download;
        DOM.imgInput.onchange = this.onFileUploaded;
        DOM.radioRight.onchange = DOM.radioLeft.onchange = this.onHandednessChange;
        DOM.btnResetCanvas.onclick = this.onCanvasReset;
        navigator.mediaDevices.enumerateDevices().then(this.gotDevices.bind(this));
        this.setupColourPickers();
    },
    /**
     * Change CSS properties to preserve aspect ratio while being centered
     */
    resizeCanvas: function() {
        // make camera take up as much space as possible while preserving aspect ratio
        // scaling factor calculated and multiplied by both to ensure same ratio
        DOM.outputImage.style.width = `calc(${DOM.outputImage.width} * min(100vh / ${DOM.outputImage.height}, 100vw / ${DOM.outputImage.width}))`;
        DOM.outputImage.style.height = `calc(${DOM.outputImage.height} * min(100vh / ${DOM.outputImage.height}, 100vw / ${DOM.outputImage.width}))`
        // make painting canvas take up as much space as possible WITHIN THE CAMERA while preserving aspect ratio
        // basically the same but using the above properties instead of 100vh and 100vw to represent the maximum boundaries
        DOM.paintingCanvas.style.width = `calc(${DOM.paintingCanvas.width} * min(${DOM.outputImage.style.height} / ${DOM.paintingCanvas.height}, ${DOM.outputImage.style.width} / ${DOM.paintingCanvas.width}))`;
        DOM.paintingCanvas.style.height = `calc(${DOM.paintingCanvas.height} * min(${DOM.outputImage.style.height} / ${DOM.paintingCanvas.height}, ${DOM.outputImage.style.width} / ${DOM.paintingCanvas.width}))`;
    },
    /**
     * Change the application's mode and show the overlay element, then find available cameras again
     */
    openMenu: function() {
        ApplicationState.mode = "menu";
        DOM.overlay.style.display='inline';
        setTimeout(() => DOM.overlay.style.opacity="1", 10); //delay needed for the animation to run. No idea why, probably a bug.
        if(ApplicationState.camera) {
            ApplicationState.camera.destroy(); // destroy current camera to ensure it is not left running
            ApplicationState.camera = undefined;
        }
        navigator.mediaDevices.enumerateDevices().then(this.gotDevices.bind(this)); // check available cameras again
    },
    /**
     * Change back the application mode and hide the overlay element
     */
    closeMenu: function() {
        ApplicationState.mode = "painting";
        ApplicationState.camera = new Camera(ApplicationState.cameraID); // start new camera
        DOM.overlay.style.opacity="0";
        setTimeout(() => DOM.overlay.style.display='none', 1000); // after transition completed, hide element to allow mouse events to pass through
    },
    /**
     * Populates DOM.selectCamera with an option for each available camera
     * @param mediaDevices information about each available media device
     */
    gotDevices: function(mediaDevices: MediaDeviceInfo[]) { // https://www.twilio.com/blog/choosing-cameras-javascript-mediadevices-api-html
        DOM.selectCamera.innerHTML = '';
        let hasDeviceIDs = false;
        let selectedIndex = 0;

        mediaDevices.filter(device => device.kind == 'videoinput').forEach((mediaDevice, index) => { // for each video input,
            // if any have a device ID, then device ID permission has been granted.
            if(mediaDevice.deviceId != "") hasDeviceIDs = true;
            const option = document.createElement('option');
            option.value = mediaDevice.deviceId;
            // for subsequent runs; if this is already selected
            if(option.value == ApplicationState.cameraID) selectedIndex = index;
            const label = mediaDevice.label || `Camera ${index+1}`;
            const textNode = document.createTextNode(label);
            option.appendChild(textNode);
            DOM.selectCamera.appendChild(option);
        });
        DOM.selectCamera.selectedIndex = selectedIndex; // set index of list to whatever the current value is
        // if there are no IDs, trigger the error function. Otherwise, hide and move on
        if(!hasDeviceIDs) {
            this.noIDs();
        } else {
            DOM.noIDsWarning.style.display = "none";
        }
    },
    /**
     * Un-hide warning that deviceID permission is not given, and add event listener to button.
     */
    noIDs: function() {
        DOM.noIDsWarning.style.display = "block"; //show warning
        DOM.btnAddIDs.onclick = () => {
            navigator.mediaDevices.getUserMedia({audio: false, video: true}).then((stream: MediaStream) => {
                // have to stop tracks because we are discarding the result
                stream.getTracks().forEach(track => track.stop());
                // we now have permission, so reload the page
                location.reload();
            }).catch(() => {
                // error probably means access has been granted, so reload
                location.reload();
            });
        };
    },
    /**
     * Event listener for camera picker
     */
    cameraSelected: function(event: Event) {
        // reset canvas to change size
        DOM.paintingCanvas.width = DOM.paintingCanvas.height = 0;
        ApplicationState.cameraID = (event.target as SelectEventTarget).value;
    },
    /**
     * Event listener for brush size change
     */
    onBrushSizeChange: function(event: Event) {
        DOM.brushSizeBox.value = (event.target as SelectEventTarget).value
        DOM.brushSizeRange.value = (event.target as SelectEventTarget).value
        ApplicationState.brushOptions.thickness = parseInt((event.target as SelectEventTarget).value)
    },
    /**
     * Assigns listeners to each colour picker
     */
    setupColourPickers: function() {
        [...DOM.coloursFlexbox.children].forEach((colourWrapper, index) => { // for each child of the colours flexbox,
            // On alpha slider input, change opacity of colour input and change application state
            (colourWrapper.getElementsByClassName("alpha_slider")[0] as HTMLInputElement).oninput = (event: Event) => {
                let val = (event.target as SelectEventTarget).value;
                (colourWrapper.getElementsByClassName("colour_picker")[0] as HTMLInputElement).style.opacity = (parseInt(val)/255).toString();
                ApplicationState.brushOptions.colours[index].alpha = parseInt(val);
            }
            // On colour input, just change application state
            (colourWrapper.getElementsByClassName("colour_picker")[0] as HTMLInputElement).oninput = (event: Event) => {
                ApplicationState.brushOptions.colours[index].hexstring = (event.target as SelectEventTarget).value;
            }
        });
    },
    /**
     * Downloads image to user device as PosePaintSave.png
     * Adapted from Source: https://stackoverflow.com/a/50300880/13717363
     */
    download: function() {
        let link = document.createElement('a');
        link.download = 'PosePaintSave.png';
        link.href = DOM.paintingCanvas.toDataURL('image/png');
        link.click();
    },
    /**
     * Converts location from 0 to 1 into a location on the scaled painting canvas
     * Moved here to avoid redundancy
     * This is what I spent hours on, documented through the photo of a piece of paper in my logbook
     */
    convertToCanvasSpace: function(location: Coords) {
        if(DOM.outputImage.width / DOM.outputImage.height >= DOM.paintingCanvas.width / DOM.paintingCanvas.height) {
            location.y *= DOM.paintingCanvas.height;
            location.x *= DOM.outputImage.width * (DOM.paintingCanvas.height / DOM.outputImage.height);
            location.x -= (DOM.outputImage.width * (DOM.paintingCanvas.height / DOM.outputImage.height) - DOM.paintingCanvas.width) / 2;
        } else {
            location.x *= DOM.paintingCanvas.width;
            location.y *= DOM.outputImage.height * (DOM.paintingCanvas.width / DOM.outputImage.width);
            location.y -= (DOM.outputImage.height * (DOM.paintingCanvas.width / DOM.outputImage.width) - DOM.paintingCanvas.height) / 2;
        }
    },
    /**
     * Event listener for file picker
     */
    onFileUploaded: function(event: Event) {
        //yoinked from https://stackoverflow.com/questions/10906734/how-to-upload-image-into-html5-canvas
        let reader = new FileReader();
        reader.onload = (event) => { // when image file is read,
            let img = new Image();
            img.onload = () => { // when image is loaded,
                DOM.paintingCanvas.width = img.width;
                DOM.paintingCanvas.height = img.height;
                DOM.paintingCtx.drawImage(img, 0, 0); // draw to canvas
            }
            img.src = event.target!.result as string; //load image
        }
        reader.readAsDataURL((event.target as FileEventTarget).files[0]); // read file
    },
    /**
     * Event handler for radio buttons
     */
    onHandednessChange: function(event: Event) {
        // type-casted to tell typescript the allowable values
        ApplicationState.handedness = (event.target as (EventTarget & {value: "Right" | "Left"})).value;
    },
    /**
     * Event handler for reset button
     */
    onCanvasReset: function(event: Event) {
        // simply reset the width and height to default to clear the whole canvas
        DOM.paintingCanvas.width = DOM.outputImage.width;
        DOM.paintingCanvas.height = DOM.outputImage.height;
    }
}
/** Helper types for event listeners; asserts that they contain the value or files property */
type SelectEventTarget = EventTarget & {value: string}
type FileEventTarget = EventTarget & {files: FileList}
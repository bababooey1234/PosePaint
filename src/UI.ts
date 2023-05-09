import ApplicationState from "./ApplicationState";
import Camera from "./Camera";
import DOM from "./DOM";

export default {
    /**
     * Initialise the UI by resizing appropriately, adding event listeners, and finding available cameras
     */
    init: function() {
        this.resizeCanvas();
        DOM.btnOpenMenu.onclick = this.openMenu.bind(this);
        DOM.btnBegin.onclick = this.closeMenu;
        DOM.selectCamera.oninput = this.cameraSelected;
        navigator.mediaDevices.enumerateDevices().then(this.gotDevices.bind(this));
    },
    /**
     * Change CSS properties to preserve aspect ratio while being centered
     */
    resizeCanvas: function() {
        DOM.outputImage.style.width = `calc(${DOM.outputImage.width} * min(100vh / ${DOM.outputImage.height}, 100vw / ${DOM.outputImage.width}))`;
        DOM.outputImage.style.height = `calc(${DOM.outputImage.height} * min(100vh / ${DOM.outputImage.height}, 100vw / ${DOM.outputImage.width}))`
    },
    /**
     * Change the application's mode and show the overlay element, then find available cameras again
     */
    openMenu: function() {
        ApplicationState.mode = "menu";
        DOM.overlay.style.display='inline';
        setTimeout(() => DOM.overlay.style.opacity="1", 10); //delay needed for the animation to run. No idea why, probably a bug.
        if(ApplicationState.camera) {
            ApplicationState.camera.destroy();
            ApplicationState.camera = undefined;
        }
        navigator.mediaDevices.enumerateDevices().then(this.gotDevices.bind(this)); // check available cameras again
    },
    /**
     * Change back the application mode and hide the overlay element
     */
    closeMenu: function() {
        ApplicationState.mode = "painting";
        ApplicationState.camera = new Camera(ApplicationState.cameraID);
        DOM.overlay.style.opacity="0";
        setTimeout(() => DOM.overlay.style.display='none', 1000);
    },
    /**
     * Populates DOM.selectCamera with an option for each available camera
     * @param mediaDevices information about each available media device
     */
    gotDevices: function(mediaDevices: MediaDeviceInfo[]) { // https://www.twilio.com/blog/choosing-cameras-javascript-mediadevices-api-html
        DOM.selectCamera.innerHTML = '';
        let hasDeviceIDs = false;
        let selectedIndex = 0;
        mediaDevices.filter(device => device.kind == 'videoinput').forEach((mediaDevice, index) => {
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
        DOM.selectCamera.selectedIndex = selectedIndex;
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
                // we now have permission, so re-run the gotDevices function
                DOM.noIDsWarning.style.display = "none"; // hide warning
                navigator.mediaDevices.enumerateDevices().then(this.gotDevices);
            });
        };
    },
    /**
     * Event listener for camera picker
     */
    cameraSelected: function(event: Event) {
        ApplicationState.cameraID = (event.target as SelectEventTarget).value;
    }
}
/** Helper type for cameraSelected function */
type SelectEventTarget = EventTarget & {value: string}
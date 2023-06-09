/**
 * Helper object, grabs all needed elements from the DOM and asserts that they are not null
 */
export default {
    videoElement: document.getElementById("inputvideo") as HTMLVideoElement,
    flipCanvas: document.getElementById("flipcanvas") as HTMLCanvasElement,
    flipCtx: (document.getElementById("flipcanvas") as HTMLCanvasElement).getContext("2d")!,
    outputImage: document.getElementById("outputimage") as HTMLCanvasElement,
    outputCtx: (document.getElementById("outputimage") as HTMLCanvasElement).getContext("2d")!,
    btnOpenMenu: document.getElementById("testopenmenu") as HTMLButtonElement,
    btnBegin: document.getElementById("btnBegin") as HTMLButtonElement,
    overlay: document.getElementById("overlay") as HTMLDivElement,
    selectCamera: document.getElementById("selectCamera") as HTMLSelectElement,
    noIDsWarning: document.getElementById("noidswarning") as HTMLDivElement,
    btnAddIDs: document.getElementById("addIDs") as HTMLButtonElement
}
/**
 * Helper object, grabs all needed elements from the DOM and asserts that they are not null
 */
export default {
    videoElement: document.getElementById("inputvideo") as HTMLVideoElement,
    flipCanvas: document.getElementById("flipcanvas") as HTMLCanvasElement,
    flipCtx: (document.getElementById("flipcanvas") as HTMLCanvasElement).getContext("2d")!,
    outputImage: document.getElementById("outputimage") as HTMLCanvasElement,
    outputCtx: (document.getElementById("outputimage") as HTMLCanvasElement).getContext("2d")!,
    btnOpenMenu: document.getElementById("btnOpenMenu") as HTMLButtonElement,
    btnBegin: document.getElementById("btnBegin") as HTMLButtonElement,
    overlay: document.getElementById("overlay") as HTMLDivElement,
    selectCamera: document.getElementById("selectCamera") as HTMLSelectElement,
    noIDsWarning: document.getElementById("noidswarning") as HTMLDivElement,
    btnAddIDs: document.getElementById("addIDs") as HTMLButtonElement,
    paintingCanvas: document.getElementById("paintingcanvas") as HTMLCanvasElement,
    paintingCtx: (document.getElementById("paintingcanvas") as HTMLCanvasElement).getContext("2d")!,
    brushSizeRange: document.getElementById("brushsizerange") as HTMLInputElement,
    brushSizeBox: document.getElementById("brushsizebox") as HTMLInputElement,
    coloursFlexbox: document.getElementById("colours_flexbox") as HTMLDivElement,
    btnDownload: document.getElementById("btnDownload") as HTMLButtonElement,
    imgInput: document.getElementById("imginput") as HTMLInputElement,
    radioRight: document.getElementById("righthanded") as HTMLInputElement,
    radioLeft: document.getElementById("lefthanded") as HTMLInputElement,
    btnResetCanvas: document.getElementById("btnResetCanvas") as HTMLButtonElement
}
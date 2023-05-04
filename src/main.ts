import ModelWrapper from "./ModelWrapper";
import Camera from "./Camera";
import { Results } from "@mediapipe/hands";

function onResults(results: Results) {
    model.drawConnections(results);
}
const model = new ModelWrapper(onResults);

async function onFrame(frame: HTMLCanvasElement) {
    await model.sendInput(frame);
}
const camera = new Camera(onFrame); //starts the pipeline
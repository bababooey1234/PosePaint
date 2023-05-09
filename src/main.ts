import ModelWrapper from "./ModelWrapper";
import { Results } from "@mediapipe/hands";
import UI from './UI';
import ApplicationState from "./ApplicationState";

// define actions taken when model produces results
function onResults(results: Results) {
    ApplicationState.model.drawConnections(results);
}
// create model (uninitialised)
ApplicationState.model = new ModelWrapper(onResults);

// Initialise the UI
UI.init();
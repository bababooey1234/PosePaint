import ModelWrapper from "./ModelWrapper";
import { Results } from "@mediapipe/hands";
import UI from './UI';
import ApplicationState from "./ApplicationState";

// define actions taken when model produces results
function onResults(results: Results) {
    ApplicationState.model.drawConnections(results);
    let [toolHand, activeHand] = ApplicationState.model.interpretResults(results);
    if(toolHand != undefined) {
        console.log(`Tool hand: ${toolHand.nFingersUp} fingers up`);
        ApplicationState.model.drawNumberFingers(results, toolHand.nFingersUp);
    }
    if(activeHand != undefined) {
        console.log(`Active hand: pointer at (${activeHand.tipPosition.x}, ${activeHand.tipPosition.y})`);
        ApplicationState.model.drawPointerAt(results, activeHand.tipPosition);
    }
}
// create model (uninitialised)
ApplicationState.model = new ModelWrapper(onResults);

// Initialise the UI
UI.init();
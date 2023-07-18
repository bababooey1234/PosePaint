import ModelWrapper from "./ModelWrapper";
import { Results } from "@mediapipe/hands";
import UI from './UI';
import ApplicationState from "./ApplicationState";

// define actions taken when model produces results
function onResults(results: Results) {
    // draw the hand-skeleton
    ApplicationState.model.drawConnections(results);
    // find properties of each hand, if they exist
    let [toolHand, activeHand] = ApplicationState.model.interpretResults(results);

    if(toolHand != undefined) {
        ApplicationState.brushOptions.selectedColour = toolHand.nFingersUp;
        ApplicationState.model.drawNumberFingers(results, toolHand.nFingersUp);
    }
    if(activeHand != undefined) {
        ApplicationState.model.drawPointerAt(results, activeHand.tipPosition);
        if(activeHand.active) {
            ApplicationState.tool.apply(activeHand.tipPosition)
        } else {
            ApplicationState.tool.apply(null);
        }
    } else {
        ApplicationState.tool.apply(null);
    }


}
// create model (won't start until menu closed)
ApplicationState.model = new ModelWrapper(onResults);

// Initialise the UI
UI.init();
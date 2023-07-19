import ModelWrapper from "./ModelWrapper";
import { Results } from "@mediapipe/hands";
import UI from './UI';
import ApplicationState from "./ApplicationState";
import Paintbrush from "./Paintbrush";
import Eraser from "./Eraser"

// Entry point for the entire application

// define actions taken when model produces results
function onResults(results: Results) {
    // draw the hand-skeleton
    ApplicationState.model.drawConnections(results);
    // find properties of each hand, if they exist
    let [toolHand, activeHand] = ApplicationState.model.interpretResults(results);

    // If the tool hand is within the frame
    if(toolHand != undefined) {
        ApplicationState.brushOptions.selectedColour = toolHand.nFingersUp - 1; // shifted to account for 0=eraser
        if(toolHand.nFingersUp == 0) { // if should be using eraser
            if(ApplicationState.toolType == 'paintbrush') { // if not already using eraser, switch
                ApplicationState.tool.apply(null);
                ApplicationState.tool = new Eraser();
            }
        } else { // if should be using paintbrush
            ApplicationState.model.drawNumberFingers(results, toolHand.nFingersUp); // let the user know how many fingers have been detected
            if(ApplicationState.toolType == 'eraser') { // if not already using paintbrush, switch
                ApplicationState.tool.apply(null);
                ApplicationState.tool = new Paintbrush();
            }
        }
    }
    // If the active hand is within the frame
    if(activeHand != undefined) {
        ApplicationState.model.drawPointerAt(results, activeHand.tipPosition);
        if(activeHand.active) { // if should apply tool, do that
            ApplicationState.tool.apply(activeHand.tipPosition)
        } else { // otherwise finger is not extended, so apply tool nowhere
            ApplicationState.tool.apply(null);
        }
    } else {
        ApplicationState.tool.apply(null); // ensures that if active hand disappears and then reappears, line does not jump between
    }


}
// create model (won't start until menu closed)
ApplicationState.model = new ModelWrapper(onResults);

// Initialise the UI
UI.init();
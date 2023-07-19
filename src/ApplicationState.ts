import BrushOptions from "./BrushOptions";
import Camera from "./Camera";
import ModelWrapper from "./ModelWrapper";
import Paintbrush from "./Paintbrush";
import Tool from "./Tool";

/**
 * Types of all the variables kept in the global state object,
 * including whether or not they are optional
 */
type State = {
    debug: boolean;
    mode: "painting" | "menu";
    model: ModelWrapper;
    modelLoaded: boolean;
    cameraID: string;
    camera?: Camera;
    brushOptions: BrushOptions;
    tool: Tool;
    toolType: 'paintbrush' | 'eraser';
    handedness: "Right" | "Left";
    drawing: boolean;
}

/**
 * Defaults
 */
export default {
    debug: false,
    mode: "menu",
    modelLoaded: false,
    cameraID: "",
    brushOptions: new BrushOptions(),
    tool: new Paintbrush(),
    toolType: 'paintbrush',
    handedness: "Right",
    drawing: false
} as State;
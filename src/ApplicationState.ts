import BrushOptions from "./BrushOptions";
import Camera from "./Camera";
import ModelWrapper from "./ModelWrapper";
import Paintbrush from "./Paintbrush";
import Tool from "./Tool";

type State = {
    debug: boolean;
    mode: "painting" | "menu";
    model: ModelWrapper;
    modelLoaded: boolean;
    cameraID: string;
    camera?: Camera;
    brushOptions: BrushOptions;
    tool: Tool;
    handedness: "Right" | "Left";
    drawing: boolean;
}

export default {
    debug: false,
    mode: "menu",
    modelLoaded: false,
    cameraID: "",
    brushOptions: new BrushOptions(),
    tool: new Paintbrush(),
    handedness: "Right",
    drawing: false
} as State;
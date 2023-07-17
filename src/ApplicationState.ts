import BrushOptions from "./BrushOptions";
import Camera from "./Camera";
import ModelWrapper from "./ModelWrapper";

type State = {
    debug: boolean;
    mode: "painting" | "menu";
    model: ModelWrapper;
    modelLoaded: boolean;
    cameraID: string;
    camera?: Camera;
    brushOptions: BrushOptions;
    handedness: "Right" | "Left";
}

export default {
    debug: true,
    mode: "menu",
    modelLoaded: false,
    cameraID: "",
    brushOptions: new BrushOptions(),
    handedness: "Right"
} as State;
import Camera from "./Camera";
import ModelWrapper from "./ModelWrapper";

type State = {
    debug: boolean;
    mode: "painting" | "menu";
    model: ModelWrapper;
    modelLoaded: boolean;
    cameraID: string;
    camera?: Camera;
}

export default {
    debug: true,
    mode: "menu",
    modelLoaded: false,
    cameraID: ""
} as State;
/*import { Landmark, LandmarkList } from "@mediapipe/hands";
import Coords from "./Coords";

export default class Hand {
    handedness: 'Left' | 'Right';
    nFingersUp: number = 0;
    tipPosition: Coords;
    constructor(handedness: 'Left' | 'Right', landmarks: LandmarkList) {
        this.handedness = handedness;
        this.tipPosition = landmarks[HandLandmarks.INDEX_FINGER_TIP];
        // TODO: replace with values from calibration/menu slider
        /*
        if(handedness == 'Left')
            for(const fingertip of [HandLandmarks.THUMB_TIP, HandLandmarks.INDEX_FINGER_TIP, HandLandmarks.MIDDLE_FINGER_TIP, HandLandmarks.RING_FINGER_TIP, HandLandmarks.PINKY_TIP]) {
                if(distance(landmarks[HandLandmarks.WRIST], landmarks[fingertip]) >= 0.10) { //15 cm
                    this.nFingersUp++;
                    //console.log("up: " + fingertip)
                }
            }
        Nvm, Erin gave me a better idea. I wanted to measure the straightness of the hand, but I can just check whether the y-values
        of each fingertip are greater than the value of their correspohnding hand-point.
        Only issue: what do I do for the thumb? Distance? Straightness?
        /*


    }
}

function distance(a: Landmark, b: Landmark) {
    return Math.sqrt((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y) + (b.z-a.z)*(b.z-a.z))
}

const HandLandmarks = {
    WRIST : 0,
    THUMB_CMC : 1,
    THUMB_MCP : 2,
    THUMB_IP : 3,
    THUMB_TIP : 4,
    INDEX_FINGER_MCP : 5,
    INDEX_FINGER_PIP : 6,
    INDEX_FINGER_DIP : 7,
    INDEX_FINGER_TIP : 8,
    MIDDLE_FINGER_MCP : 9,
    MIDDLE_FINGER_PIP : 10,
    MIDDLE_FINGER_DIP : 11,
    MIDDLE_FINGER_TIP : 12,
    RING_FINGER_MCP : 13,
    RING_FINGER_PIP : 14,
    RING_FINGER_DIP : 15,
    RING_FINGER_TIP : 16,
    PINKY_MCP : 17,
    PINKY_PIP : 18,
    PINKY_DIP : 19,
    PINKY_TIP : 20
}*/
import { Landmark, LandmarkList } from "@mediapipe/hands";
import Coords from "./Coords";

export default class ToolHand {
    nFingersUp: number = 0;
    constructor(landmarks: LandmarkList) {
        /*
            Nvm, Erin gave me a better idea. I wanted to measure the straightness of the hand, but I can just check whether the y-values
            of each fingertip are greater than the value of their correspohnding hand-point.
            Only issue: what do I do for the thumb? Distance? Straightness?

            Straightness using distance between approximation of centroid and endpoints 
        */
        if(landmarks[HandLandmarks.INDEX_FINGER_TIP].y < landmarks[HandLandmarks.INDEX_FINGER_MCP].y)
            this.nFingersUp++;
        if(landmarks[HandLandmarks.MIDDLE_FINGER_TIP].y < landmarks[HandLandmarks.MIDDLE_FINGER_MCP].y)
            this.nFingersUp++;
        if(landmarks[HandLandmarks.RING_FINGER_TIP].y < landmarks[HandLandmarks.RING_FINGER_MCP].y)
            this.nFingersUp++;
        if(landmarks[HandLandmarks.PINKY_TIP].y < landmarks[HandLandmarks.PINKY_MCP].y)
            this.nFingersUp++;

        // check if thumtip (4) is within the circumcircle of the triangle 0-5-17
        let circleCentre = {
            x: (landmarks[0].x + landmarks[5].x + landmarks[17].x) / 3,
            y: (landmarks[0].y + landmarks[5].y + landmarks[17].y) / 3
        }
        let circleRadius = distance(circleCentre, landmarks[0]) * 0.9; // was too large, reduced to 90%
        if(distance(landmarks[HandLandmarks.THUMB_TIP], circleCentre) > circleRadius)
            this.nFingersUp++;
    }
}

function distance(a: Coords, b: Coords): number {
    return Math.sqrt((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y))
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
}
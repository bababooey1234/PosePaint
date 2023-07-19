import { LandmarkList } from "@mediapipe/hands";
import Coords from "./Coords";

export default class ActiveHand {
    tipPosition: Coords;
    active: boolean;
    /**
     * Finds the tip position and determine whether we should be painting
     * @param landmarks landmarks for the active hand
     */
    constructor(landmarks: LandmarkList) {
        this.tipPosition = landmarks[HandLandmarks.INDEX_FINGER_TIP];

        //same as in ToolHand.ts, check if fingertip is within range of circle around palm
        let circleCentre = {
            x: (landmarks[0].x + landmarks[5].x + landmarks[17].x) / 3,
            y: (landmarks[0].y + landmarks[5].y + landmarks[17].y) / 3
        }
        let circleRadius = distance(circleCentre, landmarks[0]) * 0.9; // again scaled by 90%
        this.active = (distance(landmarks[HandLandmarks.INDEX_FINGER_TIP], circleCentre) > circleRadius) //only active if outside circle
    }
}

/**
 * Helper function; just pythagoras' formula
 */
function distance(a: Coords, b: Coords): number {
    return Math.sqrt((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y))
}

/**
 * Helper object to reference positions by their names
 */
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
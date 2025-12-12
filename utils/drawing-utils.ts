// import { Pose } from "@tensorflow-models/pose-detection"; 
// Avoid importing from the package due to Next.js build issues with the ESM export.

export interface Keypoint {
    x: number;
    y: number;
    score?: number;
    name?: string;
}

export interface Pose {
    keypoints: Keypoint[];
    score?: number;
}

const COLOR_DEFAULT = "aqua";
const COLOR_UP = "lime";
const LINE_WIDTH = 4;

// MoveNet Lightning keypoint indices
const MOVENET_KEYPOINT_PAIRS = [
    [5, 7], [7, 9],   // Left Arm
    [6, 8], [8, 10],  // Right Arm
    [5, 6],           // Shoulders
    [5, 11], [6, 12], // Torso sides
    [11, 12],         // Hips
    [11, 13], [13, 15], // Left Leg
    [12, 14], [14, 16]  // Right Leg
];

export function drawPose(
    pose: Pose,
    ctx: CanvasRenderingContext2D,
    isUpPhase: boolean = false
) {
    const color = isUpPhase ? COLOR_UP : COLOR_DEFAULT;

    // Draw keypoints
    for (const keypoint of pose.keypoints) {
        if (keypoint.score != null && keypoint.score > 0.3) {
            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    // Draw skeleton lines
    for (const [i, j] of MOVENET_KEYPOINT_PAIRS) {
        const kp1 = pose.keypoints[i];
        const kp2 = pose.keypoints[j];

        // Check if keypoints exist and have good score
        if (kp1 && kp2 && kp1.score != null && kp1.score > 0.3 && kp2.score != null && kp2.score > 0.3) {
            ctx.beginPath();
            ctx.moveTo(kp1.x, kp1.y);
            ctx.lineTo(kp2.x, kp2.y);
            ctx.lineWidth = LINE_WIDTH;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }
}

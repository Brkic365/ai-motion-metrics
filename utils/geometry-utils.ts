export interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

/**
 * Calculates the angle between three points (A, B, C) where B is the vertex.
 * Uses Math.atan2 to determine the angle in degrees.
 * @param pointA The first point (e.g., Shoulder)
 * @param pointB The vertex point (e.g., Elbow)
 * @param pointC The third point (e.g., Wrist)
 * @returns The angle in degrees (0-180)
 */
export function calculateAngle(
  pointA: Keypoint,
  pointB: Keypoint,
  pointC: Keypoint
): number {
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

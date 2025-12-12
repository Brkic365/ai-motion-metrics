"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { usePoseDetection } from "../hooks/usePoseDetection";
import { calculateAngle } from "../utils/geometry-utils";
import { drawPose, Pose } from "../utils/drawing-utils";
import { RepCounter } from "../components/RepCounter";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [feedback, setFeedback] = useState<string>("Get Ready");

  // State machine refs
  const curlStateRef = useRef<"UP" | "DOWN">("DOWN");
  const isUpPhaseRef = useRef<boolean>(false);

  const onPoseDetected = useCallback((poses: Pose[]) => {
    if (!canvasRef.current || !webcamRef.current?.video) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Match canvas size to video
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    if (poses.length > 0) {
      const pose = poses[0];

      // Logic for Bicep Curl (Left side)
      const leftShoulder = pose.keypoints.find((k) => k.name === "left_shoulder");
      const leftElbow = pose.keypoints.find((k) => k.name === "left_elbow");
      const leftWrist = pose.keypoints.find((k) => k.name === "left_wrist");

      if (
        leftShoulder?.score && leftShoulder.score > 0.3 &&
        leftElbow?.score && leftElbow.score > 0.3 &&
        leftWrist?.score && leftWrist.score > 0.3
      ) {
        const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);

        // State Machine
        // UP phase: < 30 degrees (flexed)
        // DOWN phase: > 160 degrees (extended)

        if (angle > 160) {
          if (curlStateRef.current === "UP") {
            setCount((prev) => prev + 1);
            setFeedback("Good Rep!");
          }
          curlStateRef.current = "DOWN";
          isUpPhaseRef.current = false;
        } else if (angle < 45) {
          curlStateRef.current = "UP";
          isUpPhaseRef.current = true;
          setFeedback("Hold...");
        } else {
          if (curlStateRef.current === "DOWN") {
            setFeedback("Squeeze up!");
          } else {
            setFeedback("Lower down...");
          }
        }
      }

      // Draw skeleton
      drawPose(pose, ctx, isUpPhaseRef.current);
    }
  }, []);

  const { isLoading } = usePoseDetection(webcamRef, onPoseDetected);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4 sm:p-8">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 text-white">
          <p className="text-xl sm:text-2xl font-bold animate-pulse">Loading AI Model...</p>
        </div>
      )}

      <div className="relative w-full max-w-4xl aspect-[3/4] sm:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-gray-800 bg-black">
        {/* Webcam Layer */}
        <Webcam
          ref={webcamRef}
          className="absolute inset-0 w-full h-full object-cover"
          mirrored
        />

        {/* Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />

        {/* UI Overlays */}
        <RepCounter count={count} />

        {/* Feedback Component */}
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
          <span className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-lg sm:text-xl font-bold backdrop-blur-md shadow-lg transition-colors duration-300 ${isUpPhaseRef.current
            ? "bg-green-500/80 text-white"
            : "bg-black/50 text-gray-200"
            }`}>
            {feedback}
          </span>
        </div>

        {/* Instructions */}
        <div className="absolute top-4 right-4 z-40 p-3 sm:p-4 bg-black/40 backdrop-blur-md rounded-xl text-white text-[10px] sm:text-xs max-w-[120px] sm:max-w-[150px]">
          <h3 className="font-bold mb-1">How to:</h3>
          <p>Stand back and show your full body.</p>
          <p>Perform a left bicep curl.</p>
        </div>

      </div>
    </main>
  );
}

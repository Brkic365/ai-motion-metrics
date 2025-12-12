import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

// Define local interfaces to match MoveNet output
interface Keypoint {
    x: number;
    y: number;
    score?: number;
    name?: string;
}

interface Pose {
    keypoints: Keypoint[];
    score?: number;
}

export function usePoseDetection(
    webcamRef: React.RefObject<Webcam | null>,
    onPoseDetected: (poses: Pose[]) => void
) {
    const [isLoading, setIsLoading] = useState(true);
    const detectorRef = useRef<any | null>(null);
    const loopRef = useRef<number>(0);

    useEffect(() => {
        let isMounted = true;

        const initTF = async () => {
            try {
                const tf = await import('@tensorflow/tfjs-core');
                await import('@tensorflow/tfjs-backend-webgl');
                const poseDetection = await import('@tensorflow-models/pose-detection');

                await tf.ready();
                const model = poseDetection.SupportedModels.MoveNet;
                const detector = await poseDetection.createDetector(model, {
                    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
                });

                if (isMounted) {
                    detectorRef.current = detector;
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Failed to initialize TensorFlow/MoveNet:", err);
                setIsLoading(false);
            }
        };

        initTF();

        return () => {
            isMounted = false;
            if (loopRef.current) cancelAnimationFrame(loopRef.current);
        };
    }, []);

    useEffect(() => {
        if (isLoading || !detectorRef.current) return;

        const detect = async () => {
            if (
                webcamRef.current &&
                webcamRef.current.video &&
                webcamRef.current.video.readyState === 4
            ) {
                try {
                    const video = webcamRef.current.video;
                    const poses = await detectorRef.current.estimatePoses(video);
                    onPoseDetected(poses as Pose[]);
                } catch (error) {
                    console.error("Detection error:", error);
                }
            }
            loopRef.current = requestAnimationFrame(detect);
        };

        detect();

        return () => {
            if (loopRef.current) cancelAnimationFrame(loopRef.current);
        };
    }, [isLoading, webcamRef, onPoseDetected]);

    return { isLoading };
}

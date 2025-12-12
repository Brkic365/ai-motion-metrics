# AI Motion Metrics 🏋️‍♂️

A real-time, client-side workout tracker built with **Next.js 14** and **TensorFlow.js (MoveNet)**. This application uses computer vision to track your body movements and automatically counts bicep curls.

![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20TensorFlow.js%20%7C%20TailwindCSS-blue)

## 🚀 Features

- **Real-time Pose Detection**: Uses the lightning-fast MoveNet model to track 17 body keypoints directly in the browser.
- **Auto Rep Counting**: Smart state machine logic tracks full range of motion (Extended -> Flexed -> Extended).
- **Zero Latency Feedback**: Skeleton overlay and rep counter update instantly with no server-side processing.
- **Privacy First**: All video processing happens locally on your device. No video is ever sent to a server.
- **Responsive UI**: Optimized for both desktop and mobile use.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **AI Model**: [@tensorflow-models/pose-detection](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection) (MoveNet Lightning)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Webcam**: [react-webcam](https://www.npmjs.com/package/react-webcam)

## 📦 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  **Open the app**:
    Navigate to `http://localhost:3000`. Allow camera access when prompted.

## 🏗️ Building for Production

Due to the complex nature of bundling TensorFlow.js browser binaries with Next.js Server Components, we use a specific build command:

```bash
npm run build
```

This command wraps `next build --webpack` to ensure the correct handling of binary dependencies.

## 📐 How it Works

1.  **Capture**: The webcam feed is captured via `react-webcam`.
2.  **Detect**: The MoveNet model analyzes the video frame-by-frame to find key body points (Shoulders, Elbows, Wrists, etc.).
3.  **Calculate**: We calculate the angle of the elbow joint using vector math (`Math.atan2`).
4.  **Track State**:
    - **DOWN Phase**: Arm extended (> 160° angle).
    - **UP Phase**: Arm flexed (< 45° angle).
    - A rep is counted only when you complete a full cycle: `DOWN` -> `UP` -> `DOWN`.

## 📝 License

MIT

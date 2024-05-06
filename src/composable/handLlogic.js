import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";

export async function createGestureRecognizer() {
  const vision = await FilesetResolver.forVisionTasks("/public");

  return GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
  });
};

export async function getGesturesFromVideo(gestureRecognizer, videoElement) {
  return gestureRecognizer.recognizeForVideo(videoElement, Date.now());
}

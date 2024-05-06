<script setup>
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { onMounted, ref } from "vue";
import { createGestureRecognizer, getGesturesFromVideo } from './composable/handLlogic';
import Homepage from './components/Homepage.vue';
import LevelUp from './components/LevelUp.vue';
import GameOver from './components/GameOver.vue';
import {useGame} from './composable/loop.js'

let detector;
const gameStarted = ref(false);
const videoCam = ref();

// const randomImages = ref([]);
// const visibility = ref([false, false, false, false]);
const game = useGame();

const createDetectionInstance = async () => {
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig = {
    runtime: "mediapipe",
    modelType: "lite",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/",
  };
  detector = await handPoseDetection.createDetector(model, detectorConfig);
};

function openCam() {
  let all_mediaDevices = navigator.mediaDevices;

  if (!all_mediaDevices || !all_mediaDevices.getUserMedia) {
    console.log("getUserMedia() not supported.");
    return;
  }
  all_mediaDevices.getUserMedia({
    audio: true,
    video: true,
  })
    .then(function (vidStream) {
      if ("srcObject" in videoCam.value) {
        videoCam.value.srcObject = vidStream;
      } else {
        videoCam.value.src = window.URL.createObjectURL(vidStream);
      }
      videoCam.value.onloadedmetadata = function () {
        videoCam.value.play();
      };
    })
    .catch(function (e) {
      console.log(e.name + ": " + e.message);
    });
}

const handleSignDetection = async () => {
  // if (!videoCam.value || !detector) return;
  // setInterval(async () => {
  //   const hands = await detector.estimateHands(videoCam.value);
  //   if (hands.length > 0) {
  //     console.log(hands)
  //   }
  // }, 2000);
  
  console.log('handleSignDetection:', videoCam.value);

  const gestureRecognizer = await createGestureRecognizer();

  setInterval(async () => {
    const results = await getGesturesFromVideo(gestureRecognizer, videoCam.value);

    if (results.gestures.length > 0) {
      console.log('GESTURE CATEGORY:', results.gestures.map(gesture => gesture[0].categoryName));
      // console.log('LANDMARKS:', results.landmarks);

      const aggregate = results.landmarks[0].reduce((previous, current) => ({
        x: previous.x + current.x,
        y: previous.y + current.y,
        z: previous.z + current.z,
      }), { x: 0, y: 0, z: 0 });

      // console.log('AGG:', aggregate);

      console.log('LOCATION:', {
        x: aggregate.x / results.landmarks[0].length,
        y: aggregate.y / results.landmarks[0].length,
        z: aggregate.z / results.landmarks[0].length,
      });
    }
  }, 1000);
};

// function toggleVisibility(index) {
//   visibility.value[index] = !visibility.value[index];
//   setTimeout(() => toggleVisibility(index), Math.random() * 5000 + 1000); // Random interval between 1s and 6s
// }

// function shuffleArray(array) {
//   let shuffledArray = [...array];
//   for (let i = shuffledArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//   }
//   return shuffledArray;
// }

// NOT USED: WIP
// function displayImagesInSequence() {
//   let currentIndex = 0;
//   const displayNextImage = () => {
//     // Clear visibility for all images
//     visibility.value = [false, false, false, false];
//     // Set visibility for the current image
//     visibility.value[currentIndex] = true;
//     setTimeout(() => {
//       // Move to the next image
//       currentIndex = (currentIndex + 1) % images.length;
//       displayNextImage();
//     }, 4000); // Adjust delay for the time each image is visible
//   };

//   displayNextImage();
// }
// vvv EXAMPLE vvv
// const gestureRecognizer = await createGestureRecognizer();
// await getGesturesFromVideo(gestureRecognizer, videoElement);

const startGame = async () => {
  gameStarted.value = true;
  openCam();
  await handleSignDetection();
  game.start();
  setInterval(() => {
    console.log('visibility:', game.visibility);
  }, 1000);

  // // await createDetectionInstance();
  // randomImages.value = shuffleArray(images);
  // randomImages.value.forEach((_, index) => toggleVisibility(index)); // Start toggling visibility for each image
};

// console.log('randomImages:', randomImages.value);
// console.log('visibility:', visibility.value);

</script>

<template>
  <Homepage v-if="!gameStarted" @start="startGame" />
  <!-- <LevelUp v-if="!gameStarted" @start="startGame" />
  <GameOver v-if="!gameStarted" @start="startGame" /> -->
  <div v-show="gameStarted" class="wrapper">
    <!-- <div class="video-overlay">
      Overlay placeholder
    </div> -->
    <div class="wrapper">
      <div class="overlay">
        <transition name="fade" mode="out-in" v-for="(img, index) in game.randomImages" :key="index">
          <div class="overlay-quadrant" v-if="game.visibility[index]">
            <img :src="img" alt="Overlay Image" />
          </div>
        </transition>
      </div>
      <video
        ref="videoCam"
        class="peer-video"
        preload="auto"
        autoPlay
        muted
        playsInline
      />
      </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
}

.wrapper {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.overlay-quadrant {
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-quadrant img {
  max-width: 90%;
  max-height: 90%;
  object-fit: cover;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>

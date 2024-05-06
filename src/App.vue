<script setup>
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { onMounted, ref } from "vue";
import { createGestureRecognizer, getGesturesFromVideo } from './composable/handLlogic';
import Homepage from './components/Homepage.vue';
import LevelUp from './components/LevelUp.vue';
import GameOver from './components/GameOver.vue';
import {useGame} from './composable/loop.js'

const gameStarted = ref(false);
const videoCam = ref();
const game = useGame();

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
  
  console.log('handleSignDetection:', videoCam.value);

  const gestureRecognizer = await createGestureRecognizer();

  setInterval(async () => {
    try {   
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
        const gesture = results.gestures.map(gesture => gesture[0].categoryName)[0] || 'none';
        const aggregatedLocation = {
          x: aggregate.x / results.landmarks[0].length,
          y: aggregate.y / results.landmarks[0].length,
          z: aggregate.z / results.landmarks[0].length,
        };
        game.checkDetectionAndAddScore(gesture, aggregatedLocation);
      }
    } catch (error) {
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
  game.start();
  await handleSignDetection();
};


</script>

<template>
  <Homepage v-if="!gameStarted" @start="startGame" />
  <!-- <LevelUp v-if="!gameStarted" @start="startGame" />
  <GameOver v-if="!gameStarted" @start="startGame" /> -->
  <div v-show="gameStarted" class="wrapper">
    <div class="wrapper">
      <div class="overlay">
        <div class="overlay-quadrant" v-for="(img, index) in 4" :key="index">
          <transition name="fade" mode="out-in">
            <img v-if="game.visibility[index]" :src="game.currentImage()" alt="Overlay Image" />
          </transition>
        </div>
      </div>
      <video
        ref="videoCam"
        class="peer-video"
        preload="auto"
        autoPlay
        muted
        playsInline
      />
      <div>Your Score is: {{  game.score }}</div>
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
  max-width: 70%;
  max-height: 70%;
  object-fit: cover;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>

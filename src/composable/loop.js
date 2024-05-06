import { ref, reactive } from "vue";
export function useGame() {
  const gestures = ["open", "closed", "thumbsup", "thumbsdown"];
  const currentGesture = ref(null);
  const lastRender = ref(0);
  const updateSpeed = ref(3000);
  const playing = ref(false);
  const visibility = reactive([false, false, false, false]); 

  const randomImages = reactive(['https://americadomani.com/wp-content/uploads/2022/07/hand_gesture.jpg',
  'https://americadomani.com/wp-content/uploads/2022/07/hand_gesture.jpg',
  'https://americadomani.com/wp-content/uploads/2022/07/hand_gesture.jpg',
  'https://americadomani.com/wp-content/uploads/2022/07/hand_gesture.jpg']);
  

  const score = ref(0);
  const currentLevel = ref(0);
  const levels = reactive([ 10, 25, 50, 100, 200 ]);
  const gameStatus = ref('start');
  const levelUp = ref(false);
  const timer = ref(null);
  const LEVEL_DURATION = 60000;


  const endGame = () => {
    gameStatus.value = 'end';
    clearTimeout(timer.value);
  };

  const addScore = () => {
    score.value++;
    if (score.value === levels[currentLevel.value]) {
        levelUp.value = true;
        currentLevel.value++;
    }
  }

  const randomGesture = () => {
    let idx = Math.floor(Math.random() * gestures.length);
    return gestures[idx];
  };

  function checkLandmarkPosition(landmark, screenWidth, screenHeight) {
    var x = landmark[0];
    var y = landmark[1];

    if (x < screenWidth / 2 && y < screenHeight / 2) {
        return 0;
    } else if (x >= screenWidth / 2 && y < screenHeight / 2) {
        return 1;
    } else if (x < screenWidth / 2 && y >= screenHeight / 2) {
        return 2;
    } else {
        return 3;
    }
  }

  /**
   * Returns a random position within the predefined values
   * @param {number} width - the width of the screen
   * @param {number} height - the height of the screen
   * @returns {Object} - an object with x and y coordinates
   */
  const randomPosition = (width, height) => {
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    return x*1 + y*2;
  };
  
  function toggleVisibility(index) {
    visibility[index] = !visibility[index];
  }

  const loop = (time) => {
    // render some hands on screen
    if (playing.value) {
      if (time - lastRender.value > updateSpeed.value) {
        lastRender.value = time;
        let pos = randomPosition(2, 2);
        toggleVisibility(pos);
        const index = randomGesture();
        currentGesture.value = index;
      }
    } else {
      lastRender.value = time;
    }
    window.requestAnimationFrame(loop);
  };

  const start = () => {
    playing.value = true;
    score.value = 0;
    currentLevel.value = 0;
    gameStatus.value = 'playing';
    timer.value = setTimeout(endGame, LEVEL_DURATION);
    loop(0);
  }

  const stop = () => {
    playing.value = false;
  }

  return {
    start,
    stop,
    randomPosition,
    randomImages,
    visibility,
    playing
  }
}

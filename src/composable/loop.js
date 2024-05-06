import { ref, reactive } from "vue";
export function useGame() {
  const gestures = ["Open_Palm", "Closed_Fist"];
  const currentGesture = ref(null);
  const lastRender = ref(0);
  const updateSpeed = ref(3000);
  const playing = ref(false);
  const visibility = reactive([false, false, false, false]); 

  const randomImages = reactive(['/public/fist.svg',
  '/public/palm.svg',]);

  const score = ref(0);
  const currentLevel = ref(0);
  const levels = reactive([ 3, 6, 12, 18, 30 ]);
  const gameStatus = ref('start');
  const levelUp = ref(false);
  const timer = ref(null);
  const LEVEL_DURATION = 20000;


  const endGame = () => {
    gameStatus.value = 'end';
    clearTimeout(timer.value);
  };

  const checkDetectionAndAddScore = (gesture, position) => {
    const handPosition = checkLandmarkPosition(position.x, position.y);
    if( currentGesture.value !== gesture) {
      console.log('Wrong gesture', gesture, currentGesture.value);
      return;
    }

    if(visibility[handPosition] === false) {
      console.log('Wrong Hand', visibility, handPosition);
      return;
    }

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

  const currentImage = () => {
    const imageIndex = gestures.indexOf(currentGesture.value);
    return randomImages[imageIndex];
  }

  function checkLandmarkPosition(x, y) {

    if (x < 0.5 && y < 0.5) {
        return 0;
    } else if (x >= 0.5 && y < 0.5) {
        return 1;
    } else if (x < 0.5 && y >= 0.5) {
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
  
  function toggleVisibility(indexToToggle) {
    const newVisibility = visibility.map((entry, index ) => {
      return indexToToggle === index
    });
    Object.assign(visibility, newVisibility)
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
    currentImage,
    visibility,
    playing,
    score,
    checkDetectionAndAddScore,
  }
}

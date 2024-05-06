export class Game {
  gestures = ["open", "closed", "thumbsup", "thumbsdown"];

  gesturesOnScreen = [];
  lastRender = 0;
  updateSpeed = 3000;
  playing = false;

  randomGesture = () => {
    let idx = Math.floor(Math.random() * this.gestures.length);
    return this.gestures[idx];
  };

  /**
   * Returns a random position within the predefined values
   * @param {number} width - the width of the screen
   * @param {number} height - the height of the screen
   * @returns {Object} - an object with x and y coordinates
   */
  randomPosition = (width, height) => {
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    return { x, y };
  };

  loop = (time) => {
    // render some hands on screen
    if (this.playing) {
      if (time - this.lastRender > this.updateSpeed) {
        this.lastRender = time;
        let pos = this.randomPosition(2, 2);
        console.log(
          "render",
          this.randomGesture(),
          "at position",
          `${pos.x}, ${pos.y}`
        );
      }
    } else {
      this.lastRender = time;
    }
    window.requestAnimationFrame(this.loop);
  };

  constructor() {
    this.playing = false;
  }

  start() {
    this.playing = true;
    this.loop();
  }

  stop() {
    this.playing = false;
  }
}

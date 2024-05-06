import { ref, reactive } from 'vue';

const score = ref(0);
const currentLevel = ref(0);
const reactive = reactive([ 10, 25, 50, 100, 200 ]);
const gameStatus = ref('start');
const levelUp = ref(false);
const timer = ref(null);
const LEVEL_DURATION = 60000;

const startGame = () => {
    score.value = 0;
    currentLevel.value = 0;
    gameStatus.value = 'playing';
    timer.value = setTimeout(endGame, LEVEL_DURATION);
}

const endGame = () => {
    gameStatus.value = 'end';
    clearTimeout(timer.value);
};

const addScore = () => {
    score.value++;
    if (score.value === reactive[currentLevel.value]) {
        levelUp.value = true;
        currentLevel.value++;
    }
}
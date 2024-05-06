<template>
    <main>
        <h1>Game Over!</h1>
        <sub>I am sorry!</sub>
        <img src="../assets/game-overp.gif" alt="Game Over"  />
        <button @click="$emit('continue')">Continue</button>
    </main>
</template>
<script setup>
</script>
<style scoped>
img {
    width: 300px;
    height: 300px;
}
button {
    background-color: rgb(255, 42, 0);
    display: block;
    margin: auto;
    margin-top: 10px;
}
</style>
<template>
    <main>
        <h1>Level Up!</h1>
        <sub>Keep up the good work!</sub>
        <img src="../assets/level-up.gif" alt="Level Up"  />
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
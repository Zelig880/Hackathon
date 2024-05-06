<template>
    <main>
        <img src="../assets/logo.webp" alt="Handii logo"  />
        <h1>Welcome to Handii!</h1>
        <sub>Get ready to shake your hands like an proper Italian</sub>
        <button @click="$emit('start')">Start</button>
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
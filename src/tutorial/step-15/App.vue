<template>
<h1 @click="showConfetti">🎉 Congratulations!</h1>
</template>
<script>
import JSConfetti from 'js-confetti'

const confetti = new JSConfetti()

export default {
  setup() {
    function showConfetti() {
      confetti.addConfetti()
    }

    showConfetti()

    return {
      showConfetti
    }
  }
}
</script>
<style scoped>
h1 {
  text-align: center;
  cursor: pointer;
  margin-top: 3em;
}
</style>

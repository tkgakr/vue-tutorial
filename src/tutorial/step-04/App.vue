<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment(){
  count.value++
}
</script>

<template>
  <!-- make this button work -->
  <button @click="increment">Count is: {{ count }}</button>
</template>

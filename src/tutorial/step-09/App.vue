<script setup>
import { ref } from 'vue'

const pElementRef = ref(null)
</script>

<template>
  <p ref="pElementRef">Hello</p>
</template>

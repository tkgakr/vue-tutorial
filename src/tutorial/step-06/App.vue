<template>
<button @click="toggle">Toggle</button>
<h1>Vue is awesome!</h1>
<h1>Oh no 😢</h1>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const awesome = ref(true)

    function toggle() {
      // ...
    }

    return {
      awesome,
      toggle
    }
  }
}
</script>

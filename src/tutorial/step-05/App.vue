<template>
<input :value="text" @input="onInput" placeholder="Type here">
<p>{{ text }}</p>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const text = ref('')

    function onInput(e) {
      text.value = e.target.value
    }

    return {
      text,
      onInput
    }
  }
}
</script>

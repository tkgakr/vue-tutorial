<template>
<p ref="pElementRef">Hello</p>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const pElementRef = ref(null)

    return {
      pElementRef
    }
  }
}
</script>

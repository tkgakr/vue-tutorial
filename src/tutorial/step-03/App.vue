<template>
<h1>Make me red</h1> <!-- add dynamic class binding here -->
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const titleClass = ref('title')

    return {
      titleClass
    }
  }
}
</script>
<style scoped>
.title {
  color: red;
}
</style>

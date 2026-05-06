<template>
<ChildComp />
</template>
<script>
import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const greeting = ref('Hello from parent')

    return {
      greeting
    }
  }
}
</script>

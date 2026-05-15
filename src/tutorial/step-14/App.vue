<script setup>
import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

const msg = ref('from parent')
</script>

<template>
  <ChildComp>
    This is some slot content {{ msg }}!
  </ChildComp>
</template>

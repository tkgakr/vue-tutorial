<script setup>
defineProps({
    msg: String
  })
</script>

<template>
<h2>{{ msg || 'No props passed yet' }}</h2>
</template>

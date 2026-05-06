<template>
<h2>Child component</h2>
</template>
<script>
export default {
  emits: ['response'],
  setup(props, { emit }) {
    emit('response', 'hello from child')
    return {}
  }
}
</script>

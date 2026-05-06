<template>
<h2>{{ msg || 'No props passed yet' }}</h2>
</template>
<script>
export default {
  props: {
    msg: String
  }
}
</script>

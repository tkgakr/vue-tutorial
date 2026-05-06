<template>
<p>Todo id: {{ todoId }}</p>
<button @click="todoId++" :disabled="!todoData">Fetch next todo</button>
<p v-if="!todoData">Loading...</p>
<pre v-else>{{ todoData }}</pre>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const todoId = ref(1)
    const todoData = ref(null)

    async function fetchData() {
      todoData.value = null
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
      )
      todoData.value = await res.json()
    }

    fetchData()

    return {
      todoId,
      todoData
    }
  }
}
</script>

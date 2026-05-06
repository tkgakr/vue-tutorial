<script>
import { computed, markRaw, ref } from 'vue'
import { tutorialSteps } from './tutorial/metadata.js'

const modules = import.meta.glob('./tutorial/step-*/App.vue', { eager: true })

const stepComponents = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => {
    const match = path.match(/step-(\d+)\/App\.vue$/)
    return [Number(match[1]), markRaw(module.default)]
  })
)

function getInitialStep() {
  const params = new URLSearchParams(window.location.search)
  const step = Number(params.get('step'))
  return tutorialSteps.some((item) => item.number === step) ? step : 1
}

export default {
  setup() {
    const currentStep = ref(getInitialStep())

    const selected = computed(() =>
      tutorialSteps.find((step) => step.number === currentStep.value)
    )

    const currentComponent = computed(() => stepComponents[currentStep.value])
    const officialUrl = computed(
      () => `https://ja.vuejs.org/tutorial/#step-${currentStep.value}`
    )

    function selectStep(step) {
      currentStep.value = Number(step)
      const url = new URL(window.location.href)
      url.searchParams.set('step', String(currentStep.value))
      window.history.replaceState({}, '', url)
    }

    return {
      currentComponent,
      currentStep,
      officialUrl,
      selectStep,
      selected,
      tutorialSteps
    }
  }
}
</script>

<template>
  <main class="tutorial-shell">
    <aside class="step-list" aria-label="チュートリアルステップ">
      <h1>Vue Tutorial</h1>
      <label class="step-select">
        <span>Step</span>
        <select :value="currentStep" @change="selectStep($event.target.value)">
          <option
            v-for="step in tutorialSteps"
            :key="step.number"
            :value="step.number"
          >
            {{ step.number }}. {{ step.title }}
          </option>
        </select>
      </label>

      <nav>
        <button
          v-for="step in tutorialSteps"
          :key="step.number"
          :class="{ active: step.number === currentStep }"
          type="button"
          @click="selectStep(step.number)"
        >
          <span>{{ step.number }}</span>
          {{ step.title }}
        </button>
      </nav>
    </aside>

    <section class="workbench">
      <header>
        <div class="step-heading">
          <p>Step {{ selected.number }}</p>
          <a :href="officialUrl" target="_blank" rel="noreferrer">
            公式ドキュメント
          </a>
        </div>
        <h2>{{ selected.title }}</h2>
      </header>

      <section class="preview" aria-label="実行結果">
        <component :is="currentComponent" :key="currentStep" />
      </section>

      <p class="path-note">
        編集対象:
        <code>src/tutorial/step-{{ String(currentStep).padStart(2, '0') }}/App.vue</code>
      </p>
    </section>
  </main>
</template>

<style scoped>
.tutorial-shell {
  display: grid;
  grid-template-columns: minmax(240px, 320px) 1fr;
  min-height: 100vh;
}

.step-list {
  border-right: 1px solid #dce3df;
  background: #ffffff;
  padding: 1.25rem;
}

.step-list h1 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
}

.step-select {
  display: grid;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.step-select span {
  color: #526059;
  font-size: 0.875rem;
  font-weight: 700;
}

.step-select select {
  width: 100%;
  border: 1px solid #c9d4cf;
  border-radius: 6px;
  background: #fff;
  padding: 0.55rem 0.65rem;
}

nav {
  display: grid;
  gap: 0.35rem;
}

nav button {
  display: grid;
  grid-template-columns: 2rem 1fr;
  align-items: center;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #31423a;
  padding: 0.45rem 0.55rem;
  text-align: left;
  cursor: pointer;
}

nav button:hover,
nav button.active {
  border-color: #bad4c8;
  background: #eef7f3;
}

nav span {
  color: #62746c;
  font-weight: 700;
}

.workbench {
  display: grid;
  align-content: start;
  gap: 1rem;
  padding: 1.5rem;
}

.workbench header {
  border-bottom: 1px solid #dce3df;
  padding-bottom: 1rem;
}

.step-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.2rem;
}

.step-heading p {
  margin: 0;
  color: #527064;
  font-weight: 700;
}

.step-heading a {
  border: 1px solid #bad4c8;
  border-radius: 6px;
  color: #1f7a55;
  padding: 0.35rem 0.6rem;
  text-decoration: none;
  white-space: nowrap;
}

.step-heading a:hover {
  background: #eef7f3;
}

.workbench h2 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
}

.preview {
  border: 1px solid #dce3df;
  border-radius: 8px;
  background: #ffffff;
  padding: 1.25rem;
}

.preview {
  min-height: 220px;
}

.path-note {
  margin: 0;
  color: #526059;
}

@media (max-width: 800px) {
  .tutorial-shell {
    grid-template-columns: 1fr;
  }

  .step-list {
    border-right: 0;
    border-bottom: 1px solid #dce3df;
  }

  .step-list nav {
    display: none;
  }
}
</style>

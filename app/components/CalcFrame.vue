<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useCalculatorStore } from '~/stores/calculator'

export default defineComponent({
  data() {
    return {
      steps: [
        { title: 'Vehicle', icon: 'car' },
        { title: 'Shipping', icon: 'ship' },
        { title: 'Action Fee', icon: 'gavel' },
        { title: 'Customs Fee', icon: 'doc' },
      ],
    }
  },

  computed: {
    ...mapStores(useCalculatorStore),
  },
})
</script>

<template>
  <section class="calc">
    <header class="calc__header">
      <h1 class="calc__title">My Calculation</h1>

      <form class="calc-search" @submit.prevent>
        <input v-model="calculatorStore.lot" class="calc-search__input" type="text" placeholder="Enter Lot or Stock number">
        <button class="calc-search__btn" type="submit">
          <CalcIcon name="send" />
        </button>
      </form>
    </header>

    <div class="calc__body">
      <ol class="calc-steps">
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="calc-step"
          :class="{ 'is-active': index === calculatorStore.active, 'is-done': index < calculatorStore.active }"
        >
          <button type="button" class="calc-step__btn" @click="calculatorStore.goTo(index)">
            <span class="calc-step__bar" />
            <span class="calc-step__num">0{{ index + 1 }}</span>
            <span class="calc-step__icon">
              <CalcIcon :name="step.icon" />
            </span>
            <span class="calc-step__title">{{ step.title }}</span>
            <span class="calc-step__subtitle">Select your type</span>
          </button>
        </li>
      </ol>

      <main class="calc-panel">
        <slot />
      </main>
    </div>

    <footer class="calc__footer">
      <CalcNav />
    </footer>
  </section>
</template>

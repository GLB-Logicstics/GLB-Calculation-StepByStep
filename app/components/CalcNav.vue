<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useCalculatorStore } from '~/stores/calculator'

export default defineComponent({
  computed: {
    ...mapStores(useCalculatorStore),
  },

  methods: {
    async onNext() {
      if (!this.calculatorStore.isLast) {
        this.calculatorStore.next()
        return
      }

      this.calculatorStore.showPrice()
      await this.$nextTick()
      document.getElementById('calc-result')?.scrollIntoView({ behavior: 'smooth' })
    },
  },
})
</script>

<template>
  <div class="calc-nav">
    <button v-if="calculatorStore.active > 0" type="button" class="calc-nav__btn" @click="calculatorStore.back()">
      <CalcIcon name="chevron-left" />
      <span>Back Step</span>
    </button>

    <button type="button" class="calc-nav__btn" :disabled="!calculatorStore.canNext" @click="onNext">
      <span>{{ calculatorStore.isLast ? 'Show Price' : 'Next Step' }}</span>
      <CalcIcon name="chevron-right" />
    </button>
  </div>
</template>

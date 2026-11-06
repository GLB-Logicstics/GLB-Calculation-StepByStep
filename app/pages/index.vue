<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useCalculatorStore } from '~/stores/calculator'

export default defineComponent({
  computed: {
    ...mapStores(useCalculatorStore),
  },

  created() {
    this.calculatorStore.checkActive()
  },
})
</script>

<template>
  <div>
    <CalcFrame>
      <Transition name="calc-fade" mode="out-in">
        <StepVehicle v-if="calculatorStore.active === 0" />
        <StepShipping v-else-if="calculatorStore.active === 1" />
        <StepAuction v-else-if="calculatorStore.active === 2" />
        <StepCustoms v-else />
      </Transition>
    </CalcFrame>

    <CalcResult v-if="calculatorStore.resultVisible" id="calc-result" />
  </div>
</template>

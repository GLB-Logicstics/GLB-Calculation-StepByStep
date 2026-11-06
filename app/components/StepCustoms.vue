<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { readNumber } from '~/utils/helpers'
import { useCustomsStore, engineTypes, origins } from '~/stores/customs'

export default defineComponent({
  data() {
    return {
      engineTypes: engineTypes,
      origins: origins,
    }
  },

  computed: {
    ...mapStores(useCustomsStore),
  },

  methods: {
    setInvoice(event: Event) {
      this.customsStore.invoice = readNumber(event)
    },

    setTransport(event: Event) {
      this.customsStore.transport = readNumber(event)
    },

    setOther(event: Event) {
      this.customsStore.other = readNumber(event)
    },

    setEngine(event: Event) {
      this.customsStore.engine = readNumber(event)
    },
  },
})
</script>

<template>
  <div class="step">
    <h2 class="step__title">Vehicle Data</h2>
    <p class="step__lead">Enter the vehicle details to calculate the cost.</p>

    <div class="fields">
      <div class="field field--wide">
        <span class="field__text">{{ customsStore.vehicleKind }}</span>
        <span class="field__tag">From step 1</span>
      </div>

      <label class="field field--wide">
        <select v-model="customsStore.engineType" class="field__input" :class="{ 'is-empty': customsStore.engineType === '' }">
          <option value="" disabled>Engine type</option>
          <option v-for="engineType in engineTypes" :key="engineType.id" :value="engineType.id">{{ engineType.label }}</option>
        </select>
        <CalcIcon name="chevron-down" class="field__chevron" />
      </label>

      <label class="field">
        <input
          class="field__input"
          type="text"
          inputmode="numeric"
          placeholder="Invoice value (USD)*"
          :value="customsStore.invoice || ''"
          @input="setInvoice"
        >
        <span class="field__tag">From step 3</span>
      </label>

      <label class="field">
        <input
          class="field__input"
          type="text"
          inputmode="numeric"
          placeholder="Transportation costs (USD)*"
          :value="customsStore.transport || ''"
          @input="setTransport"
        >
        <span class="field__tag">From step 2</span>
      </label>

      <label class="field">
        <input
          class="field__input"
          type="text"
          inputmode="numeric"
          placeholder="Other expenses (USD)"
          :value="customsStore.other || ''"
          @input="setOther"
        >
      </label>

      <label class="field" :class="{ 'is-disabled': !customsStore.needsEngine }">
        <input
          v-if="customsStore.needsEngine"
          class="field__input"
          type="text"
          inputmode="numeric"
          placeholder="Engine capacity (cm3)*"
          :value="customsStore.engine || ''"
          @input="setEngine"
        >
        <input
          v-else
          class="field__input"
          type="text"
          placeholder="Engine capacity — not needed"
          disabled
        >
      </label>

      <label class="field field--wide field--date">
        <span class="field__label">Date of production</span>
        <input v-model="customsStore.date" class="field__input" type="date">
      </label>
    </div>

    <p class="origin-title">About the country of origin (production) and the country of the sender</p>

    <div class="origins">
      <button
        v-for="origin in origins"
        :key="origin.id"
        type="button"
        class="origin"
        :class="{ 'is-checked': customsStore.origin === origin.id }"
        @click="customsStore.toggleOrigin(origin.id)"
      >
        <span class="origin__box">✓</span>
        {{ origin.label }}
      </button>
    </div>
  </div>
</template>

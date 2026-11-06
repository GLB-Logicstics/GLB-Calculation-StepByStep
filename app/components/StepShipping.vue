<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useShippingStore, auctions, exitPorts } from '~/stores/shipping'

export default defineComponent({
  data() {
    return {
      openIndex: -1,
    }
  },

  computed: {
    ...mapStores(useShippingStore),

    fields() {
      return [
        {
          title: 'Auction',
          placeholder: 'Select auction platform',
          emptyText: '',
          options: auctions,
          value: this.shippingStore.auction,
        },
        {
          title: 'Location',
          placeholder: 'Select vehicle location',
          emptyText: 'Select an auction first to see its locations.',
          options: this.shippingStore.locationOptions,
          value: this.shippingStore.location,
        },
        {
          title: 'Exit Port',
          placeholder: 'Select exit port from USA',
          emptyText: '',
          options: exitPorts,
          value: this.shippingStore.exitPort,
        },
        {
          title: 'Port / City',
          placeholder: 'Select destination port or city',
          emptyText: 'Select a location first — its port code is used here.',
          options: this.shippingStore.cityOptions,
          value: this.shippingStore.city,
        },
      ]
    },
  },

  methods: {
    toggle(index: number) {
      if (this.openIndex === index) {
        this.openIndex = -1
      } else {
        this.openIndex = index
      }
    },

    choose(index: number, id: string) {
      if (index === 0) this.shippingStore.chooseAuction(id)
      if (index === 1) this.shippingStore.chooseLocation(id)
      if (index === 2) this.shippingStore.chooseExitPort(id)
      if (index === 3) this.shippingStore.chooseCity(id)

      this.openIndex = -1
      for (let i = index + 1; i < this.fields.length; i++) {
        if (this.fields[i].value === '') {
          this.openIndex = i
          break
        }
      }
    },

    selectedText(index: number): string {
      const field = this.fields[index]
      const option = field.options.find((option) => option.id === field.value)

      if (!option) {
        return field.placeholder
      }
      if (option.price) {
        return option.label + ' · ' + option.price
      }
      return option.label
    },
  },
})
</script>

<template>
  <div class="step">
    <h2 class="step__title">Shipping Details</h2>
    <p class="step__lead">Fill in the shipping details to calculate your cost.</p>

    <div class="accordions">
      <div
        v-for="(field, index) in fields"
        :key="field.title"
        class="acc"
        :class="{ 'is-open': openIndex === index, 'is-filled': field.value !== '' }"
      >
        <button type="button" class="acc__head" @click="toggle(index)">
          <span class="acc__num">0{{ index + 1 }}</span>
          <span class="acc__text">
            <span class="acc__title">{{ field.title }}</span>
            <span class="acc__sub">{{ selectedText(index) }}</span>
          </span>
          <CalcIcon name="chevron-down" class="acc__chevron" />
        </button>

        <div v-if="openIndex === index" class="acc__body">
          <p v-if="field.options.length === 0" class="acc__empty">{{ field.emptyText }}</p>

          <button
            v-for="option in field.options"
            :key="option.id"
            type="button"
            class="acc__option"
            :class="{ 'is-selected': field.value === option.id }"
            @click="choose(index, option.id)"
          >
            {{ option.label }}
            <span v-if="option.code" class="acc__code">{{ option.code }}</span>
            <span v-if="option.price" class="acc__price">{{ option.price }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

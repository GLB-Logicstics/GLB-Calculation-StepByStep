<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { readNumber } from '~/utils/helpers'
import { useAuctionStore, titleTypes } from '~/stores/auction'

export default defineComponent({
  data() {
    return {
      titleTypes: titleTypes,
    }
  },

  computed: {
    ...mapStores(useAuctionStore),
  },

  methods: {
    onInput(event: Event) {
      this.auctionStore.setBid(readNumber(event))
    },

    plus() {
      this.auctionStore.setBid(this.auctionStore.bid + 100)
    },

    minus() {
      this.auctionStore.setBid(this.auctionStore.bid - 100)
    },
  },
})
</script>

<template>
  <div class="step">
    <h2 class="step__title">Auction Fee</h2>
    <p class="step__lead">Enter the auction final bid amount to calculate the fee</p>

    <div class="bid">
      <input
        class="bid__input"
        type="text"
        inputmode="numeric"
        placeholder="Auction final bid in USD"
        :value="auctionStore.bid || ''"
        @input="onInput"
        @keydown.up.prevent="plus"
        @keydown.down.prevent="minus"
      >
      <div class="bid__arrows">
        <button type="button" class="bid__arrow" @click="plus">
          <svg viewBox="0 0 21 14"><path d="M9.2 1.2a1.6 1.6 0 0 1 2.6 0l8.6 11.3c.4.6 0 1.5-.8 1.5H1.4c-.8 0-1.2-.9-.8-1.5z" /></svg>
        </button>
        <button type="button" class="bid__arrow" @click="minus">
          <svg viewBox="0 0 21 14"><path d="M9.2 12.8a1.6 1.6 0 0 0 2.6 0L20.4 1.5c.4-.6 0-1.5-.8-1.5H1.4C.6 0 .2.9.6 1.5z" /></svg>
        </button>
      </div>
    </div>

    <div class="title-types">
      <button
        v-for="titleType in titleTypes"
        :key="titleType.id"
        type="button"
        class="title-type"
        :class="{ 'is-selected': auctionStore.titleType === titleType.id }"
        @click="auctionStore.setTitleType(titleType.id)"
      >
        <span class="title-type__dot" />
        {{ titleType.label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { money } from '~/utils/helpers'
import { useVehicleStore } from '~/stores/vehicle'
import { useShippingStore } from '~/stores/shipping'
import { useAuctionStore } from '~/stores/auction'
import { useCustomsStore } from '~/stores/customs'
import { useCalculatorStore } from '~/stores/calculator'

export default defineComponent({
  computed: {
    ...mapStores(useVehicleStore, useShippingStore, useAuctionStore, useCustomsStore, useCalculatorStore),
  },

  methods: {
    money: money,
  },
})
</script>

<template>
  <section class="result">
    <div class="result__card">
      <h1 class="step__title">Calculation Result</h1>
      <p class="step__lead">Here is the estimated cost based on the information you provided</p>

      <div class="result__hero">
        <div>
          <p class="result__total-label">Estimated Total Cost</p>
          <p class="result__total">$ {{ calculatorStore.total.toLocaleString('en-US') }}</p>
        </div>
        <img class="result__image" :src="vehicleStore.image" :alt="vehicleStore.classLabel">
      </div>

      <div class="result__info">
        <h2 class="result__info-title">Your Information</h2>

        <div class="result__section">
          <span class="result__num">01</span>
          <div>
            <h3 class="result__section-title">Vehicle</h3>
            <dl class="result__cols">
              <div class="result__col">
                <dt>Type</dt>
                <dd>{{ vehicleStore.typeLabel }}</dd>
              </div>
              <div class="result__col">
                <dt>Classification</dt>
                <dd>{{ vehicleStore.classLabel }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="result__section">
          <span class="result__num">02</span>
          <div>
            <h3 class="result__section-title">Shipping</h3>
            <dl class="result__cols">
              <div class="result__col">
                <dt>Auction</dt>
                <dd>{{ shippingStore.auctionLabel }}</dd>
              </div>
              <div class="result__col">
                <dt>Location</dt>
                <dd>{{ shippingStore.location }}</dd>
              </div>
              <div class="result__col">
                <dt>Exit Port</dt>
                <dd>{{ shippingStore.exitPortLabel }}</dd>
              </div>
              <div class="result__col">
                <dt>Country</dt>
                <dd>{{ shippingStore.country }}</dd>
              </div>
              <div class="result__col">
                <dt>Port \ City</dt>
                <dd>{{ shippingStore.city }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="result__section">
          <span class="result__num">03</span>
          <div>
            <h3 class="result__section-title">Price Details</h3>
            <dl class="result__cols">
              <div class="result__col">
                <dt>Auction final bid in USD</dt>
                <dd>{{ money(auctionStore.bid) }}</dd>
              </div>
              <div class="result__col">
                <dt>Auction Fee</dt>
                <dd :title="calculatorStore.auctionHint">{{ money(auctionStore.fee) }}</dd>
              </div>
              <div class="result__col">
                <dt>Delivery Cost</dt>
                <dd>{{ money(shippingStore.delivery) }}</dd>
              </div>
              <div class="result__col">
                <dt>Customs cost</dt>
                <dd :title="calculatorStore.customsHint">{{ money(customsStore.total) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

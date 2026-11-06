<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { useVehicleStore, categories } from '~/stores/vehicle'

export default defineComponent({
  data() {
    return {
      categories: categories,
    }
  },

  computed: {
    ...mapStores(useVehicleStore),
  },
})
</script>

<template>
  <div class="step-vehicle">
    <h2 class="step-vehicle__question">What are you shipping?</h2>

    <div class="step-vehicle__types">
      <OptionCard
        v-for="category in categories"
        :key="category.id"
        big
        :label="category.label"
        :image="category.image"
        :image-width="category.width"
        :selected="vehicleStore.category.id === category.id"
        @click="vehicleStore.selectType(category.id)"
      />
    </div>

    <h2 class="step-vehicle__question">{{ vehicleStore.category.question }}</h2>

    <div class="step-vehicle__items">
      <OptionCard
        v-for="item in vehicleStore.category.items"
        :key="item.id"
        :label="item.label"
        :image="item.image"
        :image-width="item.width"
        :selected="vehicleStore.selectedItem.id === item.id"
        @click="vehicleStore.selectItem(item.id)"
      />
    </div>
  </div>
</template>

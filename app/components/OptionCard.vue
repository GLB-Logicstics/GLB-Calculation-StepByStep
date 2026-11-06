<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    label: { type: String, required: true },
    image: { type: String, required: true },
    imageWidth: { type: Number, required: true },
    selected: { type: Boolean, default: false },
    big: { type: Boolean, default: false },
  },
})
</script>

<template>
  <button type="button" class="option-card" :class="{ 'option-card--big': big, 'is-selected': selected }">
    <CalcIcon v-if="selected" name="check" class="option-card__check" />
    <span class="option-card__media">
      <img
        class="option-card__img"
        :src="image"
        :alt="label"
        :width="imageWidth"
        :style="{ width: `calc(${imageWidth} * var(--s))` }"
        draggable="false"
      >
    </span>
    <span class="option-card__label">{{ label }}</span>
  </button>
</template>

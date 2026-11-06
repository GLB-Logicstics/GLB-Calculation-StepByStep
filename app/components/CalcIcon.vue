<script lang="ts">
import { defineComponent } from 'vue'

const sizes: Record<string, number[]> = {
  car: [45, 38],
  ship: [45, 46],
  gavel: [61, 54],
  doc: [38, 46],
  moto: [52, 34],
  box: [42, 44],
  send: [70, 70],
  check: [30, 30],
  'chevron-right': [18, 33],
  'chevron-left': [18, 33],
  'chevron-down': [26, 14],
}

export default defineComponent({
  props: {
    name: { type: String, required: true },
  },

  computed: {
    width(): number {
      return sizes[this.name][0]
    },

    height(): number {
      return sizes[this.name][1]
    },
  },
})
</script>

<template>
  <svg
    class="calc-icon"
    :width="width"
    :height="height"
    :style="{ width: `calc(${width} * var(--s))`, height: `calc(${height} * var(--s))` }"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-if="name === 'car'"
      fill="currentColor"
      fill-rule="evenodd"
      d="M8 0H37L40 11H45V19H42V38H37V33H8V38H3V19H0V11H5L8 0ZM12.5 5.5L10 16H35.5L33 5.5H12.5ZM11.6 22A2.6 2.6 0 1 0 11.6 27.2A2.6 2.6 0 1 0 11.6 22ZM34.6 22A2.6 2.6 0 1 0 34.6 27.2A2.6 2.6 0 1 0 34.6 22Z"
    />

    <g v-else-if="name === 'ship'" fill="currentColor">
      <path d="M13 0H33V9.5L23 6.6L13 9.5V0Z" />
      <path d="M3.6 19L23 13L42.4 19L40.4 39.4H45V46H37.5L31 42.8L23 46.4L15 42.8L8.5 46H0V39.4H6L3.6 19Z" />
    </g>

    <g v-else-if="name === 'gavel'" fill="currentColor">
      <g transform="translate(23 20) rotate(30)">
        <rect x="-7" y="-9.6" width="14" height="19.2" rx="1" />
        <rect x="-11" y="-16.8" width="22" height="5" rx="2.5" />
        <rect x="-11" y="11.8" width="22" height="5" rx="2.5" />
        <rect x="6" y="-2.8" width="35" height="5.6" rx="2.8" />
      </g>
      <path d="M3 47H31V50H34V54H0V50H3V47Z" />
    </g>

    <g v-else-if="name === 'doc'">
      <mask id="calc-icon-doc-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="38" height="46">
        <rect width="38" height="46" fill="#fff" />
        <rect x="8" y="22" width="22.6" height="3.2" rx="1.6" fill="#000" />
        <rect x="8" y="30" width="16.6" height="3.2" rx="1.6" fill="#000" />
      </mask>
      <g fill="currentColor" mask="url(#calc-icon-doc-mask)">
        <path d="M1.4 3.4L30.6 0.4C32.1 0.25 33.4 1.4 33.4 2.9V6.6H1.4V3.4Z" />
        <rect y="9" width="38" height="37" rx="6" />
      </g>
    </g>

    <g v-else-if="name === 'moto'" fill="currentColor">
      <path
        fill-rule="evenodd"
        d="M9 15A9.5 9.5 0 1 0 9 34A9.5 9.5 0 1 0 9 15ZM9 20A4.5 4.5 0 1 1 9 29A4.5 4.5 0 1 1 9 20ZM43 15A9.5 9.5 0 1 0 43 34A9.5 9.5 0 1 0 43 15ZM43 20A4.5 4.5 0 1 1 43 29A4.5 4.5 0 1 1 43 20Z"
      />
      <path d="M31 2H37L41 13L44 22L40 24L35 13L28 22H17L13 16H24L31 2Z" />
      <path d="M16 8H27L24 14H14L16 8Z" />
    </g>

    <g v-else-if="name === 'box'" fill="currentColor">
      <path d="M21 0L42 9.5L21 19L0 9.5L21 0Z" />
      <path d="M0 13L19 21.5V44L0 35V13Z" />
      <path d="M42 13L23 21.5V44L42 35V13Z" />
    </g>

    <g
      v-else-if="name === 'send'"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M53.6 17.6L23 30.2L37.6 38.2L44 49.4L53.6 17.6Z" />
      <path d="M37.6 38.2L53.6 17.6" />
      <path d="M17.6 45.6L22 40.4M27 49.8L29 46.4M35 55L37 52" />
    </g>

    <g v-else-if="name === 'check'">
      <circle cx="15" cy="15" r="15" fill="currentColor" />
      <path
        d="M9 15.4L13.3 19.6L21.4 11.2"
        stroke="#fff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <path
      v-else-if="name === 'chevron-right'"
      d="M2 1.5L16 16.5L2 31.5"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      v-else-if="name === 'chevron-left'"
      d="M16 1.5L2 16.5L16 31.5"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <path
      v-else-if="name === 'chevron-down'"
      d="M1.5 1.5L13 12.5L24.5 1.5"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

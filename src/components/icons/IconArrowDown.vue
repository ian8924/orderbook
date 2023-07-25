<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width || size"
    :height="height || size"
    viewBox="0 0 24 24"
    role="presentation"
    fill="none"
    fill-rule="nonzero"
    stroke="currentColor"
    stroke-width="4"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: [Number, String],
    required: false
  },
  width: {
    type: [Number, String],
    required: false
  },
  height: {
    type: [Number, String],
    required: false
  },
})
</script>

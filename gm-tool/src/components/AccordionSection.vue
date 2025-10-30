<template>
  <div class="accordion-section mb-4" :class="{ open: isOpen }">
    <button 
      class="accordion-header"
      @click="toggle"
    >
      <span class="icon text-sm">▶</span>
      <span v-if="icon" class="text-lg">{{ icon }}</span>
      <span class="flex-1 text-left">{{ title }}</span>
    </button>
    <div class="accordion-content bg-white">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  defaultOpen: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  }
})

const isOpen = ref(props.defaultOpen)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

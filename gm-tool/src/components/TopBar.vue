<template>
  <div class="bg-dark text-white shadow-lg sticky top-0 z-50">
    <div class="px-6 py-3 flex items-center justify-between gap-6">
      <!-- Current Time -->
      <div class="flex items-center gap-2">
        <span class="text-2xl">🕐</span>
        <span class="text-lg font-semibold">{{ currentTime }}</span>
      </div>
      
      <!-- Session Info -->
      <div class="flex-1 text-center">
        <div class="text-sm font-medium opacity-90">{{ sessionInfo.name }}</div>
        <div class="text-xs opacity-75">{{ sessionInfo.time }}</div>
      </div>
      
      <!-- Pacing Indicator -->
      <div class="flex items-center gap-4">
        <div :class="pacingClass" class="font-semibold">
          {{ pacingStatus.message }}
        </div>
        <div class="text-sm opacity-90">
          {{ scenesCompleted }}/{{ totalScenes }} scenes
        </div>
      </div>
      
      <!-- Scene Timer -->
      <div class="text-right">
        <div class="text-sm font-medium">Scene: {{ sceneTimer }}</div>
        <div class="text-xs opacity-75">(~{{ recommendedTime }}m)</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentTime = ref('14:32')
const sceneTimer = ref('0:00')
const recommendedTime = ref(20)
const scenesCompleted = ref(2)
const totalScenes = ref(3)

const sessionInfo = ref({
  name: 'Day 1, Session 1',
  time: '14:00 - 18:00'
})

const pacingStatus = ref({
  status: 'on-track',
  message: '→ On track'
})

const pacingClass = computed(() => {
  return {
    'text-success-light': pacingStatus.value.status === 'ahead',
    'text-warning-light': pacingStatus.value.status === 'on-track',
    'text-danger-light': pacingStatus.value.status === 'behind'
  }
})

// Update clock every second
let clockInterval
onMounted(() => {
  const updateClock = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  }
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})
</script>

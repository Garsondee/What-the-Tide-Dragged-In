<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          @click="handleContinueWithout"
        ></div>
        
        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
          <!-- Icon -->
          <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center">
              <span class="text-3xl">📋</span>
            </div>
          </div>
          
          <!-- Title -->
          <h3 class="text-xl font-bold text-center mb-2">
            Scene Has Incomplete Tasks
          </h3>
          
          <!-- Scene Info -->
          <div class="text-center mb-4 p-3 bg-gray-50 rounded">
            <div class="font-semibold text-gray-900">{{ sceneTitle }}</div>
            <div class="text-sm text-gray-600 mt-1">{{ taskStats }}</div>
          </div>
          
          <!-- Message -->
          <p class="text-gray-700 text-center mb-6">
            Would you like to mark this scene as complete before moving on?
          </p>
          
          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Complete and Continue -->
            <button
              @click="handleCompleteAndContinue"
              class="w-full px-6 py-3 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
            >
              ✓ Complete Scene and Continue
            </button>
            
            <!-- Continue Without Completing -->
            <button
              @click="handleContinueWithout"
              class="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
            >
              → Continue Without Completing
            </button>
            
            <!-- Cancel -->
            <button
              @click="handleCancel"
              class="w-full px-4 py-2 text-gray-500 hover:text-gray-700 text-sm transition"
            >
              Cancel Navigation
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const show = ref(false)
const sceneTitle = ref('')
const completedTasks = ref(0)
const totalTasks = ref(0)
const resolvePromise = ref(null)

const taskStats = computed(() => {
  return `${completedTasks.value}/${totalTasks.value} tasks completed`
})

function open(title, stats) {
  sceneTitle.value = title
  completedTasks.value = stats.completed
  totalTasks.value = stats.total
  show.value = true
  
  return new Promise((resolve) => {
    resolvePromise.value = resolve
  })
}

function handleCompleteAndContinue() {
  show.value = false
  resolvePromise.value?.('complete')
}

function handleContinueWithout() {
  show.value = false
  resolvePromise.value?.('continue')
}

function handleCancel() {
  show.value = false
  resolvePromise.value?.('cancel')
}

defineExpose({ open })
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

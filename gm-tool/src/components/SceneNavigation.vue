<template>
  <div class="bg-light-dark border-b border-gray-200 px-6 py-4">
    <!-- Scene Completion Modal -->
    <SceneCompletionModal ref="completionModal" />
    
    <div class="flex items-center justify-between">
      <!-- Previous Button -->
      <button 
        class="nav-btn" 
        @click="handlePrevious"
        :disabled="!scenes.canGoPrevious.value"
        :class="{ 'opacity-50 cursor-not-allowed': !scenes.canGoPrevious.value }"
      >
        ⬅️ Previous Scene
      </button>
      
      <!-- Breadcrumb -->
      <div class="flex-1 flex items-center justify-center gap-4">
        <div class="text-center">
          <div class="text-sm text-gray-600">Act {{ currentScene?.act ?? 0 }}</div>
          <div class="text-lg font-semibold">
            {{ currentScene?.title ?? 'Loading...' }}
          </div>
        </div>
        
        <!-- Index Button -->
        <button
          @click="goToIndex"
          class="nav-btn"
          title="Return to Document Index"
        >
          📚 Index
        </button>
      </div>
      
      <!-- Next Button -->
      <button 
        class="nav-btn" 
        @click="handleNext"
        :disabled="!scenes.canGoNext.value"
        :class="{ 'opacity-50 cursor-not-allowed': !scenes.canGoNext.value }"
      >
        Next Scene ➡️
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref } from 'vue'
import SceneCompletionModal from './SceneCompletionModal.vue'

const scenes = inject('scenes')
const taskTracking = inject('taskTracking')
const promptCooldown = inject('promptCooldown')
const completionModal = ref(null)

const currentScene = computed(() => scenes.currentScene.value)
const currentSceneId = computed(() => scenes.currentSceneId.value)
const isSceneCompleted = computed(() => scenes.completedScenes.value.has(currentSceneId.value))

async function checkIncompleteScene() {
  if (!currentScene.value || isSceneCompleted.value) {
    return true // Allow navigation
  }
  
  const hasIncomplete = taskTracking.hasIncompleteTasks(currentScene.value)
  
  // Check if we should show the prompt (respects cooldown)
  if (hasIncomplete && promptCooldown.shouldShowPrompt(currentSceneId.value) && completionModal.value) {
    const stats = taskTracking.getSceneTaskStats(currentScene.value)
    const result = await completionModal.value.open(currentScene.value.title, stats)
    
    if (result === 'complete') {
      // User chose to complete - clear cooldown and mark complete
      promptCooldown.clearCooldown(currentSceneId.value)
      scenes.markSceneCompleted(currentSceneId.value)
      return true
    } else if (result === 'continue') {
      // User chose to continue without completing - start cooldown
      promptCooldown.startCooldown(currentSceneId.value)
      return true
    } else {
      // User cancelled - don't start cooldown, they might want to finish tasks
      return false // Cancel navigation
    }
  }
  
  return true // Allow navigation (either no incomplete tasks or cooldown active)
}

async function handleNext() {
  const shouldContinue = await checkIncompleteScene()
  if (shouldContinue) {
    await scenes.nextScene()
  }
}

async function handlePrevious() {
  const shouldContinue = await checkIncompleteScene()
  if (shouldContinue) {
    await scenes.previousScene()
  }
}

function goToIndex() {
  // TODO: Navigate to document index when implemented
  console.log('Navigate to document index')
  alert('Document index coming soon!')
}
</script>

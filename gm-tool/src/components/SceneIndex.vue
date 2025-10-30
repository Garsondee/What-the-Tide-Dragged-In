<template>
  <aside class="scene-sidebar w-64 bg-dark-lighter text-white overflow-y-auto custom-scrollbar" role="navigation" aria-label="Scenes">
    <!-- Scene Completion Modal -->
    <SceneCompletionModal ref="completionModal" />
    
    <!-- Big Chunky Current Time -->
    <div class="bg-dark border-b-2 border-primary-500 py-4 px-4 text-center sticky top-0 z-20">
      <div class="text-4xl font-bold text-white">{{ currentTime }}</div>
    </div>
    
    <div class="p-4">
      <h2 class="text-lg font-semibold mb-4 px-2 sticky top-[72px] z-10 bg-dark-lighter/95 backdrop-blur text-white">Scenes</h2>
      
      <div v-for="(actData, actKey) in scenes.scenesByAct.value" :key="actKey" class="mb-4">
        <h3 class="text-sm font-semibold px-2 py-1 bg-dark/50 rounded mb-1 sticky top-[112px] z-10 text-gray-200">
          {{ actData.title }}
        </h3>
        <ul class="space-y-1" role="list">
          <li v-for="scene in actData.scenes" :key="scene.id">
            <div 
              class="scene-item text-gray-200 hover:text-gray-100"
              :class="{ 
                active: scene.id === scenes.currentSceneId.value,
                completed: scene.completed 
              }"
              @click="selectScene(scene.id)"
              :aria-current="scene.id === scenes.currentSceneId.value ? 'page' : undefined"
              tabindex="0"
            >
              <span class="text-xs opacity-75">{{ scene.act }}.{{ scene.sceneNumber }}</span>
              <span class="flex-1 truncate" :title="scene.title">{{ scene.title }}</span>
              <span v-if="scene.completed" class="text-[10px] px-1.5 py-0.5 rounded bg-success-600/15 text-success-300">Done</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { inject, computed, ref, onMounted, onUnmounted } from 'vue'
import SceneCompletionModal from './SceneCompletionModal.vue'

const scenes = inject('scenes')
const taskTracking = inject('taskTracking')
const promptCooldown = inject('promptCooldown')
const completionModal = ref(null)

const currentScene = computed(() => scenes.currentScene.value)
const currentSceneId = computed(() => scenes.currentSceneId.value)
const isSceneCompleted = computed(() => scenes.completedScenes.value.has(currentSceneId.value))

async function selectScene(sceneId) {
  // Don't check if clicking on current scene
  if (sceneId === currentSceneId.value) return
  
  // Check if current scene has incomplete tasks
  if (currentScene.value && !isSceneCompleted.value) {
    const hasIncomplete = taskTracking.hasIncompleteTasks(currentScene.value)
    
    // Check if we should show the prompt (respects cooldown)
    if (hasIncomplete && promptCooldown.shouldShowPrompt(currentSceneId.value) && completionModal.value) {
      const stats = taskTracking.getSceneTaskStats(currentScene.value)
      const result = await completionModal.value.open(currentScene.value.title, stats)
      
      if (result === 'complete') {
        promptCooldown.clearCooldown(currentSceneId.value)
        scenes.markSceneCompleted(currentSceneId.value)
      } else if (result === 'continue') {
        promptCooldown.startCooldown(currentSceneId.value)
      } else if (result === 'cancel') {
        return // Don't navigate
      }
    }
  }
  
  scenes.goToScene(sceneId)
}

// Current time display
const currentTime = ref('')
let timeInterval

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header with Scene Progress -->
    <div class="bg-dark text-white p-4 border-b border-gray-600">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">Scene Tasks</h3>
        <span class="text-sm opacity-75">{{ stats.completed }}/{{ stats.total }}</span>
      </div>
      
      <!-- Mini Progress Bar -->
      <div class="relative h-2 bg-dark-lighter rounded-full overflow-hidden">
        <div 
          class="absolute inset-y-0 left-0 bg-gradient-to-r from-success-600 to-success-500 transition-all duration-300"
          :style="{ width: stats.percent + '%' }"
        ></div>
      </div>
      
      <div class="mt-2 text-xs opacity-75 text-center">
        {{ stats.percent }}% Complete
      </div>
    </div>
    
    <!-- Task List -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
      <div v-if="tasks.length === 0" class="text-center text-gray-500 py-8">
        <div class="text-3xl mb-2">📋</div>
        <div class="text-sm">No trackable tasks in this scene</div>
      </div>
      
      <div v-for="task in tasks" :key="task.id" class="task-item">
        <label class="flex items-start gap-3 cursor-pointer group">
          <input 
            type="checkbox"
            :checked="task.completed"
            @change="toggleTask(task.id)"
            class="mt-1 w-4 h-4 text-success-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
          />
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-gray-600 mb-0.5">{{ task.label }}</div>
            <div 
              class="text-sm transition-all"
              :class="task.completed ? 'line-through text-gray-400' : 'text-gray-700'"
            >
              {{ truncateText(task.text, 80) }}
            </div>
          </div>
        </label>
      </div>
    </div>
    
    <!-- Actions Footer -->
    <div class="border-t border-gray-200 p-4 space-y-2 bg-white">
      <!-- Complete All Tasks Button -->
      <button 
        @click="completeAllTasks"
        class="w-full px-4 py-2 bg-success-100 text-success-700 rounded hover:bg-success-200 transition text-sm font-medium"
        :disabled="stats.completed === stats.total"
        :class="{ 'opacity-50 cursor-not-allowed': stats.completed === stats.total }"
      >
        ✓ Complete All Tasks
      </button>
      
      <!-- Mark Scene Complete Button -->
      <button 
        @click="markSceneComplete"
        class="w-full px-4 py-3 rounded font-semibold transition"
        :class="isSceneCompleted 
          ? 'bg-success-600 text-white hover:bg-success-700' 
          : 'bg-primary-600 text-white hover:bg-primary-700'"
      >
        {{ isSceneCompleted ? '✓ Scene Completed' : '→ Mark Scene Complete' }}
      </button>
      
      <!-- Clear Tasks Button -->
      <button 
        @click="clearTasks"
        class="w-full px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition text-xs"
      >
        Clear All Checks
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const scenes = inject('scenes')
const taskTracking = inject('taskTracking')

const currentScene = computed(() => scenes.currentScene.value)
const currentSceneId = computed(() => scenes.currentSceneId.value)

const tasks = computed(() => {
  if (!currentScene.value) {
    console.log('SceneTaskPanel: No current scene')
    return []
  }
  const sceneTasks = taskTracking.getSceneTasks(currentScene.value)
  console.log('SceneTaskPanel: Found tasks', sceneTasks.length, sceneTasks)
  return sceneTasks
})

const stats = computed(() => {
  if (!currentScene.value) return { completed: 0, total: 0, percent: 0 }
  const sceneStats = taskTracking.getSceneTaskStats(currentScene.value)
  console.log('SceneTaskPanel: Stats', sceneStats)
  return sceneStats
})

const isSceneCompleted = computed(() => {
  return scenes.completedScenes.value.has(currentSceneId.value)
})

function toggleTask(taskId) {
  taskTracking.toggleTask(currentSceneId.value, taskId)
}

function completeAllTasks() {
  if (currentScene.value) {
    taskTracking.completeAllTasks(currentScene.value)
  }
}

function markSceneComplete() {
  if (currentSceneId.value) {
    if (isSceneCompleted.value) {
      // Unmark as complete
      scenes.toggleSceneCompleted(currentSceneId.value)
    } else {
      // Mark as complete
      scenes.markSceneCompleted(currentSceneId.value)
    }
  }
}

function clearTasks() {
  if (currentSceneId.value) {
    if (confirm('Clear all task checkboxes for this scene?')) {
      taskTracking.clearSceneTasks(currentSceneId.value)
    }
  }
}

function truncateText(text, maxLength) {
  if (!text) return ''
  // Remove HTML tags for display
  const stripped = text.replace(/<[^>]+>/g, '')
  if (stripped.length <= maxLength) return stripped
  return stripped.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.task-item {
  @apply p-3 bg-gray-50 rounded border border-gray-200 hover:border-primary-300 transition;
}

.task-item:has(input:checked) {
  @apply bg-success-50 border-success-300;
}
</style>

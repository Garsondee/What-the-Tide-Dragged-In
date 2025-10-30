<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          @click="close"
        ></div>
        
        <!-- Panel -->
        <div class="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="bg-dark text-white p-6 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-3xl">⚙️</span>
                <h2 class="text-2xl font-bold">Configuration & Tools</h2>
              </div>
              <button 
                @click="close"
                class="text-white hover:text-gray-300 transition text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- Progress Reset Section -->
            <section>
              <h3 class="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                <span>🔄</span>
                <span>Reset Progress</span>
              </h3>
              
              <div class="space-y-3">
                <!-- Reset Current Scene -->
                <div class="panel">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h4 class="font-semibold text-dark mb-1">Reset Current Scene</h4>
                      <p class="text-sm text-gray-600">
                        Clear all task checkboxes for the current scene only.
                        {{ currentSceneName }}
                      </p>
                    </div>
                    <button
                      @click="resetCurrentScene"
                      class="px-4 py-2 bg-warning-100 text-warning-700 rounded hover:bg-warning-200 transition font-medium whitespace-nowrap"
                    >
                      Reset Scene
                    </button>
                  </div>
                </div>
                
                <!-- Reset Current Act -->
                <div class="panel">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h4 class="font-semibold text-dark mb-1">Reset Current Act</h4>
                      <p class="text-sm text-gray-600">
                        Clear all tasks and scene completions for Act {{ currentAct }}.
                      </p>
                    </div>
                    <button
                      @click="resetCurrentAct"
                      class="px-4 py-2 bg-warning-100 text-warning-700 rounded hover:bg-warning-200 transition font-medium whitespace-nowrap"
                    >
                      Reset Act {{ currentAct }}
                    </button>
                  </div>
                </div>
                
                <!-- Reset Prompt Cooldowns -->
                <div class="panel">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h4 class="font-semibold text-dark mb-1">Reset Prompt Cooldowns</h4>
                      <p class="text-sm text-gray-600">
                        Clear all completion prompt cooldowns. The system will ask again about incomplete scenes.
                      </p>
                    </div>
                    <button
                      @click="resetCooldowns"
                      class="px-4 py-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition font-medium whitespace-nowrap"
                    >
                      Reset Cooldowns
                    </button>
                  </div>
                </div>
                
                <!-- Reset All Progress -->
                <div class="panel border-2 border-danger-300">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h4 class="font-semibold text-danger-700 mb-1">Reset All Progress</h4>
                      <p class="text-sm text-gray-600">
                        Clear <strong>all</strong> task completions and scene progress for the entire adventure. This cannot be undone!
                      </p>
                    </div>
                    <button
                      @click="resetAllProgress"
                      class="px-4 py-2 bg-danger-100 text-danger-700 rounded hover:bg-danger-200 transition font-medium whitespace-nowrap"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            </section>
            
            <!-- Data Management Section -->
            <section>
              <h3 class="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                <span>💾</span>
                <span>Data Management</span>
              </h3>
              
              <div class="space-y-3">
                <!-- Export Progress -->
                <div class="panel">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h4 class="font-semibold text-dark mb-1">Export Progress</h4>
                      <p class="text-sm text-gray-600">
                        Download your progress data as a JSON file for backup or sharing.
                      </p>
                    </div>
                    <button
                      @click="exportProgress"
                      class="px-4 py-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition font-medium whitespace-nowrap"
                    >
                      Export
                    </button>
                  </div>
                </div>
                
                <!-- Import Progress -->
                <div class="panel">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h4 class="font-semibold text-dark mb-1">Import Progress</h4>
                      <p class="text-sm text-gray-600">
                        Load progress data from a previously exported JSON file.
                      </p>
                    </div>
                    <label class="px-4 py-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition font-medium cursor-pointer whitespace-nowrap">
                      Import
                      <input 
                        type="file" 
                        accept=".json"
                        @change="importProgress"
                        class="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </section>
            
            <!-- Statistics Section -->
            <section>
              <h3 class="text-lg font-semibold text-dark mb-3 flex items-center gap-2">
                <span>📊</span>
                <span>Progress Statistics</span>
              </h3>
              
              <div class="grid grid-cols-2 gap-3">
                <div class="panel bg-primary-50">
                  <div class="text-sm text-gray-600 mb-1">Scenes Completed</div>
                  <div class="text-2xl font-bold text-primary-700">{{ completedScenesCount }}</div>
                  <div class="text-xs text-gray-500">of {{ totalScenesCount }} total</div>
                </div>
                
                <div class="panel bg-success-50">
                  <div class="text-sm text-gray-600 mb-1">Tasks Completed</div>
                  <div class="text-2xl font-bold text-success-700">{{ totalTasksCompleted }}</div>
                  <div class="text-xs text-gray-500">across all scenes</div>
                </div>
                
                <div class="panel bg-warning-50">
                  <div class="text-sm text-gray-600 mb-1">Current Scene</div>
                  <div class="text-lg font-bold text-warning-700">{{ currentSceneName }}</div>
                  <div class="text-xs text-gray-500">Act {{ currentAct }}</div>
                </div>
                
                <div class="panel bg-primary-50">
                  <div class="text-sm text-gray-600 mb-1">Adventure Progress</div>
                  <div class="text-2xl font-bold text-primary-700">{{ adventureProgress }}%</div>
                  <div class="text-xs text-gray-500">overall completion</div>
                </div>
              </div>
            </section>
          </div>
          
          <!-- Footer -->
          <div class="border-t border-gray-200 p-4 bg-gray-50">
            <button
              @click="close"
              class="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const show = ref(false)

const scenes = inject('scenes')
const taskTracking = inject('taskTracking')
const promptCooldown = inject('promptCooldown')

const currentScene = computed(() => scenes.currentScene.value)
const currentSceneName = computed(() => currentScene.value?.title || 'None')
const currentAct = computed(() => currentScene.value?.act || 0)

const completedScenesCount = computed(() => scenes.completedScenes.value.size)
const totalScenesCount = computed(() => scenes.scenesIndex.value?.scenes.length || 0)

const totalTasksCompleted = computed(() => {
  let count = 0
  taskTracking.completedTasks.value.forEach(tasks => {
    count += tasks.size
  })
  return count
})

const adventureProgress = computed(() => {
  if (!scenes.scenesIndex.value) return 0
  const mainScenes = scenes.scenesIndex.value.scenes.filter(s => s.act >= 1)
  const completed = mainScenes.filter(s => scenes.completedScenes.value.has(s.id)).length
  return Math.round((completed / mainScenes.length) * 100)
})

function open() {
  show.value = true
}

function close() {
  show.value = false
}

function resetCurrentScene() {
  if (!currentScene.value) return
  
  const confirmed = confirm(`Reset all task checkboxes for "${currentSceneName.value}"?\n\nThis will NOT unmark the scene as complete, only clear the individual task checks.`)
  
  if (confirmed) {
    taskTracking.clearSceneTasks(currentScene.value.id)
  }
}

function resetCurrentAct() {
  if (!currentScene.value) return
  
  const act = currentAct.value
  const confirmed = confirm(`Reset all progress for Act ${act}?\n\nThis will clear:\n- All task checkboxes\n- All scene completions\n\nThis cannot be undone!`)
  
  if (confirmed) {
    const actScenes = scenes.scenesIndex.value.scenes.filter(s => s.act === act)
    
    // Clear tasks for all scenes in the act
    actScenes.forEach(scene => {
      taskTracking.clearSceneTasks(scene.id)
      scenes.completedScenes.value.delete(scene.id)
    })
    
    // Save scene completions
    localStorage.setItem('completedScenes', JSON.stringify([...scenes.completedScenes.value]))
  }
}

function resetCooldowns() {
  const confirmed = confirm('Reset all completion prompt cooldowns?\n\nThe system will start asking again about incomplete scenes when you navigate away from them.')
  
  if (confirmed) {
    promptCooldown.clearAllCooldowns()
    alert('✓ Prompt cooldowns have been reset.')
  }
}

function resetAllProgress() {
  const confirmed = confirm('⚠️ RESET ALL PROGRESS?\n\nThis will delete:\n- ALL task checkboxes\n- ALL scene completions\n- ALL progress data\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?')
  
  if (confirmed) {
    const doubleCheck = confirm('Final confirmation: Delete all progress data?')
    
    if (doubleCheck) {
      scenes.resetProgress()
      
      // Clear all tasks
      taskTracking.completedTasks.value.clear()
      localStorage.removeItem('completedTasks')
      
      // Clear all cooldowns
      promptCooldown.clearAllCooldowns()
      
      alert('✓ All progress has been reset.')
    }
  }
}

function exportProgress() {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    currentSceneId: scenes.currentSceneId.value,
    completedScenes: [...scenes.completedScenes.value],
    completedTasks: {}
  }
  
  // Convert tasks Map to object
  taskTracking.completedTasks.value.forEach((tasks, sceneId) => {
    data.completedTasks[sceneId] = [...tasks]
  })
  
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `gm-tool-progress-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  
  URL.revokeObjectURL(url)
}

function importProgress(event) {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      // Validate data structure
      if (!data.completedScenes || !data.completedTasks) {
        throw new Error('Invalid progress file format')
      }
      
      // Confirm import
      const confirmed = confirm(`Import progress data from ${data.exportDate || 'unknown date'}?\n\nThis will overwrite your current progress!`)
      
      if (confirmed) {
        // Import completed scenes
        scenes.completedScenes.value = new Set(data.completedScenes)
        localStorage.setItem('completedScenes', JSON.stringify([...scenes.completedScenes.value]))
        
        // Import completed tasks
        taskTracking.completedTasks.value = new Map(
          Object.entries(data.completedTasks).map(([k, v]) => [k, new Set(v)])
        )
        localStorage.setItem('completedTasks', JSON.stringify(data.completedTasks))
        
        // Load the imported scene if available
        if (data.currentSceneId) {
          scenes.loadScene(data.currentSceneId)
        }
        
        alert('✓ Progress imported successfully!')
        close()
      }
    } catch (error) {
      alert('❌ Error importing progress: ' + error.message)
    }
  }
  
  reader.readAsText(file)
  
  // Reset input
  event.target.value = ''
}

defineExpose({ open, close })
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

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center bg-dark">
      <div class="text-center text-white">
        <div class="text-4xl mb-4">🎲</div>
        <div class="text-xl font-semibold mb-2">Loading Adventure...</div>
        <div class="text-sm opacity-75">What the Tide Dragged In</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-dark">
      <div class="text-center text-white max-w-md">
        <div class="text-4xl mb-4">⚠️</div>
        <div class="text-xl font-semibold mb-2 text-danger-light">Error Loading Data</div>
        <div class="text-sm opacity-75 mb-4">{{ error }}</div>
        <button 
          @click="retryLoad" 
          class="px-4 py-2 bg-primary-500 rounded hover:bg-primary-600 transition"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Main App -->
    <div v-else class="min-h-screen flex flex-col">
      <!-- Config Panel Modal -->
      <ConfigPanel ref="configPanel" />
      
      <!-- Progress Bars - Adventure & Session Tracking -->
      <ProgressBars @open-config="openConfig" />
      
      <!-- Main Layout -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Scene Index Sidebar -->
        <SceneIndex />
        
        <!-- Main Content Area -->
        <main class="flex-1 flex flex-col overflow-hidden">
          <!-- Scene Navigation -->
          <SceneNavigation />
          
          <!-- Scene Content -->
          <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 bg-white">
            <SceneViewer />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, provide, computed, onBeforeUnmount, ref } from 'vue'
import { useScenes } from './composables/useScenes'
import { useHyperlinks } from './composables/useHyperlinks'
import { useTaskTracking } from './composables/useTaskTracking'
import { useScenePromptCooldown } from './composables/useScenePromptCooldown'
import ProgressBars from './components/ProgressBars.vue'
import SceneIndex from './components/SceneIndex.vue'
import SceneNavigation from './components/SceneNavigation.vue'
import SceneViewer from './components/SceneViewer.vue'
import ConfigPanel from './components/ConfigPanel.vue'

// Initialize scene management
const scenes = useScenes()

// Initialize hyperlink system
const hyperlinks = useHyperlinks()

// Initialize task tracking
const taskTracking = useTaskTracking(scenes)

// Initialize scene prompt cooldown
const promptCooldown = useScenePromptCooldown(scenes)

// Config panel ref
const configPanel = ref(null)

// Computed states
const loading = computed(() => scenes.loading.value && !scenes.currentScene.value)
const error = computed(() => scenes.error.value || hyperlinks.error.value)

// Provide to all child components
provide('scenes', scenes)
provide('hyperlinks', hyperlinks)
provide('taskTracking', taskTracking)
provide('promptCooldown', promptCooldown)
provide('openConfig', openConfig)

// Load data on mount
onMounted(async () => {
  // Initialize hyperlink engine first
  await hyperlinks.initialize()
  
  // Load the scenes index
  await scenes.loadScenesIndex()
  
  // Try to resume last scene, otherwise load first scene
  const resumed = await scenes.resumeLastScene()
  if (!resumed && scenes.scenesIndex.value?.scenes.length > 0) {
    await scenes.loadScene(scenes.scenesIndex.value.scenes[0].id)
  }
  
  // Set up global click handler for entity links
  hyperlinks.setupClickHandler(document.body, {
    onCharacterClick: (id, name) => {
      console.log(`🐾 Character clicked: ${name}`)
      // TODO: Open character sheet
    },
    onNPCClick: (id, name) => {
      console.log(`🐾 NPC clicked: ${name}`)
      // TODO: Open NPC sheet
    },
    onSceneClick: (id, name) => {
      console.log(`📖 Scene clicked: ${name}`)
      scenes.goToScene(id)
    },
    onAspectClick: (name, element) => {
      console.log(`✨ Aspect clicked: ${name}`)
      // TODO: Show aspect tooltip
    },
    onStuntClick: (name, element) => {
      console.log(`⚡ Stunt clicked: ${name}`)
      // TODO: Show stunt tooltip
    },
    onLocationClick: (id, name) => {
      console.log(`🗺️ Location clicked: ${name}`)
      // TODO: Show location info
    }
  })
})

// Retry loading on error
async function retryLoad() {
  await scenes.loadScenesIndex()
  if (scenes.scenesIndex.value?.scenes.length > 0) {
    await scenes.loadScene(scenes.scenesIndex.value.scenes[0].id)
  }
}

// Open config panel
function openConfig() {
  configPanel.value?.open()
}

// Cleanup on unmount
onBeforeUnmount(() => {
  promptCooldown.stopAllTimers()
})

// Expose for debugging in console
if (import.meta.env.DEV) {
  window.__scenes = scenes
  window.__hyperlinks = hyperlinks
  window.__promptCooldown = promptCooldown
}
</script>

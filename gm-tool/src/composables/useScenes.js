import { ref, computed } from 'vue'

/**
 * Scene Management Composable
 * Handles loading scenes from JSON and navigation state
 */
export function useScenes() {
  const scenesIndex = ref(null)
  const currentSceneId = ref(null)
  const currentScene = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const completedScenes = ref(new Set())

  // Computed properties
  const currentSceneIndex = computed(() => {
    if (!scenesIndex.value || !currentSceneId.value) return -1
    return scenesIndex.value.scenes.findIndex(s => s.id === currentSceneId.value)
  })

  const canGoPrevious = computed(() => currentSceneIndex.value > 0)
  const canGoNext = computed(() => {
    return scenesIndex.value && currentSceneIndex.value < scenesIndex.value.scenes.length - 1
  })

  const scenesByAct = computed(() => {
    if (!scenesIndex.value) return {}
    
    const grouped = {}
    scenesIndex.value.scenes.forEach(scene => {
      const actKey = `act${scene.act}`
      if (!grouped[actKey]) {
        grouped[actKey] = {
          act: scene.act,
          title: scenesIndex.value.actSummaries[actKey]?.title || `Act ${scene.act}`,
          scenes: []
        }
      }
      grouped[actKey].scenes.push({
        ...scene,
        completed: completedScenes.value.has(scene.id)
      })
    })
    
    return grouped
  })

  /**
   * Load the scenes index file
   */
  async function loadScenesIndex() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('/data/scenes-index.json')
      if (!response.ok) {
        throw new Error(`Failed to load scenes index: ${response.status}`)
      }
      
      scenesIndex.value = await response.json()
      
      // Load completed scenes from localStorage
      const saved = localStorage.getItem('completedScenes')
      if (saved) {
        completedScenes.value = new Set(JSON.parse(saved))
      }
      
      // Set first scene as current if none selected
      if (!currentSceneId.value && scenesIndex.value.scenes.length > 0) {
        currentSceneId.value = scenesIndex.value.scenes[0].id
      }
      
      return scenesIndex.value
    } catch (e) {
      error.value = `Error loading scenes index: ${e.message}`
      console.error(error.value, e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Load a specific scene by ID
   */
  async function loadScene(sceneId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`/data/scenes/${sceneId}.json`)
      if (!response.ok) {
        throw new Error(`Failed to load scene ${sceneId}: ${response.status}`)
      }
      
      const sceneData = await response.json()
      currentScene.value = sceneData
      currentSceneId.value = sceneId
      
      // Save to localStorage for resuming
      localStorage.setItem('currentSceneId', sceneId)
      
      return sceneData
    } catch (e) {
      error.value = `Error loading scene: ${e.message}`
      console.error(error.value, e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Navigate to the next scene
   */
  async function nextScene() {
    if (!canGoNext.value) return false
    
    const nextIndex = currentSceneIndex.value + 1
    const nextSceneId = scenesIndex.value.scenes[nextIndex].id
    
    await loadScene(nextSceneId)
    return true
  }

  /**
   * Navigate to the previous scene
   */
  async function previousScene() {
    if (!canGoPrevious.value) return false
    
    const prevIndex = currentSceneIndex.value - 1
    const prevSceneId = scenesIndex.value.scenes[prevIndex].id
    
    await loadScene(prevSceneId)
    return true
  }

  /**
   * Jump to a specific scene
   */
  async function goToScene(sceneId) {
    await loadScene(sceneId)
  }

  /**
   * Mark current scene as completed
   */
  function markSceneCompleted(sceneId = currentSceneId.value) {
    if (!sceneId) return
    
    completedScenes.value.add(sceneId)
    
    // Save to localStorage
    localStorage.setItem('completedScenes', JSON.stringify([...completedScenes.value]))
  }

  /**
   * Toggle scene completion
   */
  function toggleSceneCompleted(sceneId) {
    if (completedScenes.value.has(sceneId)) {
      completedScenes.value.delete(sceneId)
    } else {
      completedScenes.value.add(sceneId)
    }
    
    // Save to localStorage
    localStorage.setItem('completedScenes', JSON.stringify([...completedScenes.value]))
  }

  /**
   * Get scene metadata without loading full content
   */
  function getSceneMetadata(sceneId) {
    if (!scenesIndex.value) return null
    return scenesIndex.value.scenes.find(s => s.id === sceneId)
  }

  /**
   * Resume from last viewed scene
   */
  async function resumeLastScene() {
    const lastSceneId = localStorage.getItem('currentSceneId')
    if (lastSceneId) {
      await loadScene(lastSceneId)
      return true
    }
    return false
  }

  /**
   * Reset all progress
   */
  function resetProgress() {
    completedScenes.value.clear()
    localStorage.removeItem('completedScenes')
    localStorage.removeItem('currentSceneId')
  }

  return {
    // State
    scenesIndex,
    currentSceneId,
    currentScene,
    loading,
    error,
    completedScenes,
    
    // Computed
    currentSceneIndex,
    canGoPrevious,
    canGoNext,
    scenesByAct,
    
    // Methods
    loadScenesIndex,
    loadScene,
    nextScene,
    previousScene,
    goToScene,
    markSceneCompleted,
    toggleSceneCompleted,
    getSceneMetadata,
    resumeLastScene,
    resetProgress
  }
}

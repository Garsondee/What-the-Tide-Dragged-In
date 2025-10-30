import { ref, computed, watch } from 'vue'

/**
 * Task Tracking Composable
 * Tracks completion of individual tasks within scenes
 */
export function useTaskTracking(scenes) {
  // Map of sceneId -> Set of completed task IDs
  const completedTasks = ref(new Map())
  
  // Load from localStorage
  const loadTasksFromStorage = () => {
    try {
      const saved = localStorage.getItem('completedTasks')
      if (saved) {
        const parsed = JSON.parse(saved)
        completedTasks.value = new Map(Object.entries(parsed).map(([k, v]) => [k, new Set(v)]))
      }
    } catch (e) {
      console.error('Error loading completed tasks:', e)
    }
  }
  
  // Save to localStorage
  const saveTasksToStorage = () => {
    try {
      const obj = {}
      completedTasks.value.forEach((tasks, sceneId) => {
        obj[sceneId] = [...tasks]
      })
      localStorage.setItem('completedTasks', JSON.stringify(obj))
    } catch (e) {
      console.error('Error saving completed tasks:', e)
    }
  }
  
  // Initialize
  loadTasksFromStorage()
  
  /**
   * Toggle a task's completion status
   */
  function toggleTask(sceneId, taskId) {
    if (!completedTasks.value.has(sceneId)) {
      completedTasks.value.set(sceneId, new Set())
    }
    
    const sceneTasks = completedTasks.value.get(sceneId)
    if (sceneTasks.has(taskId)) {
      sceneTasks.delete(taskId)
    } else {
      sceneTasks.add(taskId)
    }
    
    saveTasksToStorage()
  }
  
  /**
   * Check if a task is completed
   */
  function isTaskCompleted(sceneId, taskId) {
    return completedTasks.value.get(sceneId)?.has(taskId) || false
  }
  
  /**
   * Get completion stats for a scene
   */
  function getSceneTaskStats(scene) {
    if (!scene) return { completed: 0, total: 0, percent: 0 }
    
    let total = 0
    let completed = 0
    
    const sceneId = scene.id
    
    // Count tasks from various sections
    if (scene.gmGuidance?.leversAndButtons) total += scene.gmGuidance.leversAndButtons.length
    if (scene.gmGuidance?.hiddenAspects) total += scene.gmGuidance.hiddenAspects.length
    if (scene.gmGuidance?.breadcrumbs) total += scene.gmGuidance.breadcrumbs.length
    if (scene.potentialOutcomes) total += scene.potentialOutcomes.length
    if (scene.asSceneUnfolds) total += scene.asSceneUnfolds.length
    
    // Count NPCs as tasks (one per NPC)
    if (scene.npcs) total += scene.npcs.length
    
    // Count completed tasks
    const sceneTasks = completedTasks.value.get(sceneId)
    if (sceneTasks) {
      completed = sceneTasks.size
    }
    
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { completed, total, percent }
  }
  
  /**
   * Get all tasks for current scene
   */
  function getSceneTasks(scene) {
    if (!scene) return []
    
    const tasks = []
    const sceneId = scene.id
    
    // Levers & Buttons
    if (scene.gmGuidance?.leversAndButtons) {
      scene.gmGuidance.leversAndButtons.forEach((task, index) => {
        tasks.push({
          id: `lever-${index}`,
          type: 'lever',
          label: 'Lever/Button',
          text: task,
          completed: isTaskCompleted(sceneId, `lever-${index}`)
        })
      })
    }
    
    // Hidden Aspects
    if (scene.gmGuidance?.hiddenAspects) {
      scene.gmGuidance.hiddenAspects.forEach((task, index) => {
        tasks.push({
          id: `hidden-${index}`,
          type: 'hidden',
          label: 'Hidden Aspect',
          text: task,
          completed: isTaskCompleted(sceneId, `hidden-${index}`)
        })
      })
    }
    
    // Breadcrumbs
    if (scene.gmGuidance?.breadcrumbs) {
      scene.gmGuidance.breadcrumbs.forEach((task, index) => {
        tasks.push({
          id: `breadcrumb-${index}`,
          type: 'breadcrumb',
          label: 'Breadcrumb',
          text: task,
          completed: isTaskCompleted(sceneId, `breadcrumb-${index}`)
        })
      })
    }
    
    // Potential Outcomes
    if (scene.potentialOutcomes) {
      scene.potentialOutcomes.forEach((outcome, index) => {
        tasks.push({
          id: `outcome-${index}`,
          type: 'outcome',
          label: `Outcome: ${outcome.type}`,
          text: outcome.description,
          completed: isTaskCompleted(sceneId, `outcome-${index}`)
        })
      })
    }
    
    // As Scene Unfolds
    if (scene.asSceneUnfolds) {
      scene.asSceneUnfolds.forEach((event, index) => {
        tasks.push({
          id: `unfold-${index}`,
          type: 'unfold',
          label: 'Scene Event',
          text: event.trigger,
          completed: isTaskCompleted(sceneId, `unfold-${index}`)
        })
      })
    }
    
    // NPCs
    if (scene.npcs) {
      scene.npcs.forEach((npc, index) => {
        tasks.push({
          id: `npc-${index}`,
          type: 'npc',
          label: 'NPC',
          text: `Introduced ${npc.name}`,
          completed: isTaskCompleted(sceneId, `npc-${index}`)
        })
      })
    }
    
    return tasks
  }
  
  /**
   * Clear all tasks for a scene
   */
  function clearSceneTasks(sceneId) {
    completedTasks.value.delete(sceneId)
    saveTasksToStorage()
  }
  
  /**
   * Mark all tasks in a scene as complete
   */
  function completeAllTasks(scene) {
    if (!scene) return
    
    const tasks = getSceneTasks(scene)
    const sceneId = scene.id
    
    if (!completedTasks.value.has(sceneId)) {
      completedTasks.value.set(sceneId, new Set())
    }
    
    const sceneTasks = completedTasks.value.get(sceneId)
    tasks.forEach(task => sceneTasks.add(task.id))
    
    saveTasksToStorage()
  }
  
  /**
   * Check if scene has any incomplete tasks
   */
  function hasIncompleteTasks(scene) {
    if (!scene) return false
    const stats = getSceneTaskStats(scene)
    return stats.completed < stats.total
  }
  
  return {
    completedTasks,
    toggleTask,
    isTaskCompleted,
    getSceneTaskStats,
    getSceneTasks,
    clearSceneTasks,
    completeAllTasks,
    hasIncompleteTasks
  }
}

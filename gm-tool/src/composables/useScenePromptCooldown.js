import { ref, watch } from 'vue'

/**
 * Scene Prompt Cooldown Composable
 * Tracks when users decline to complete scenes and implements smart cooldown
 * to avoid annoying prompts when scrubbing between scenes
 */
export function useScenePromptCooldown(scenes) {
  // GLOBAL cooldown timestamp - when user last said "continue without completing"
  const globalCooldownStart = ref(null)
  
  // Map of sceneId -> interval ID for tracking time in scene
  const sceneTimers = ref(new Map())
  
  // Cooldown duration in milliseconds (60 seconds)
  const COOLDOWN_DURATION = 60 * 1000
  
  /**
   * User declined to complete a scene - start GLOBAL cooldown
   */
  function startCooldown(sceneId) {
    const now = Date.now()
    globalCooldownStart.value = now
    
    console.log(`GLOBAL cooldown started (from scene ${sceneId || 'unknown'}) - no prompts for 60s`)
  }
  
  /**
   * Check if we should show the completion prompt
   * Uses GLOBAL cooldown - applies to ALL scenes
   */
  function shouldShowPrompt(sceneId) {
    // No global cooldown active - show prompt
    if (!globalCooldownStart.value) {
      console.log(`No global cooldown - WILL prompt for scene ${sceneId || 'unknown'}`)
      return true
    }
    
    const now = Date.now()
    const elapsed = now - globalCooldownStart.value
    
    // Cooldown expired - show prompt
    if (elapsed >= COOLDOWN_DURATION) {
      globalCooldownStart.value = null
      console.log(`GLOBAL cooldown expired - WILL prompt for scene ${sceneId || 'unknown'}`)
      return true
    }
    
    // Still in global cooldown - don't show prompt for ANY scene
    const remaining = Math.ceil((COOLDOWN_DURATION - elapsed) / 1000)
    console.log(`GLOBAL cooldown active: ${remaining}s remaining - will NOT prompt for scene ${sceneId || 'unknown'}`)
    return false
  }
  
  /**
   * User completed a scene - clear GLOBAL cooldown
   */
  function clearCooldown(sceneId) {
    globalCooldownStart.value = null
    console.log(`GLOBAL cooldown cleared (scene ${sceneId || 'unknown'} completed)`)
  }
  
  /**
   * Clear all cooldowns (e.g., on session restart)
   */
  function clearAllCooldowns() {
    globalCooldownStart.value = null
    console.log('GLOBAL cooldown cleared')
  }
  
  /**
   * Start tracking time in current scene
   * If user stays for 60+ seconds, global cooldown auto-expires
   */
  function startSceneTimer(sceneId) {
    if (!sceneId) return
    
    // Clear any existing timer
    stopSceneTimer(sceneId)
    
    // Set up interval to check GLOBAL cooldown every 10 seconds
    const intervalId = setInterval(() => {
      if (globalCooldownStart.value) {
        const elapsed = Date.now() - globalCooldownStart.value
        if (elapsed >= COOLDOWN_DURATION) {
          // Cooldown expired naturally
          globalCooldownStart.value = null
          stopSceneTimer(sceneId)
          console.log(`GLOBAL cooldown auto-expired (user stayed in scene ${sceneId})`)
        }
      }
    }, 10000) // Check every 10 seconds
    
    sceneTimers.value.set(sceneId, intervalId)
  }
  
  /**
   * Stop tracking time in scene
   */
  function stopSceneTimer(sceneId) {
    const intervalId = sceneTimers.value.get(sceneId)
    if (intervalId) {
      clearInterval(intervalId)
      sceneTimers.value.delete(sceneId)
    }
  }
  
  /**
   * Stop all scene timers (cleanup)
   */
  function stopAllTimers() {
    sceneTimers.value.forEach((intervalId) => {
      clearInterval(intervalId)
    })
    sceneTimers.value.clear()
  }
  
  // Watch for scene changes
  watch(() => scenes.currentSceneId.value, (newSceneId, oldSceneId) => {
    // Stop timer for old scene
    if (oldSceneId) {
      stopSceneTimer(oldSceneId)
    }
    
    // Start timer for new scene
    if (newSceneId) {
      startSceneTimer(newSceneId)
    }
  }, { immediate: true })
  
  return {
    startCooldown,
    shouldShowPrompt,
    clearCooldown,
    clearAllCooldowns,
    stopAllTimers
  }
}

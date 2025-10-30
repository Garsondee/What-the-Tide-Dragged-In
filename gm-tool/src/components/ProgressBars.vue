<template>
  <div class="bg-dark-lighter border-b-2 border-primary-500 relative">
    <!-- Config Button - Top Left -->
    <button
      @click="$emit('open-config')"
      class="absolute top-0 left-0 w-16 h-full bg-gray-700 hover:bg-gray-600 transition flex items-center justify-center border-r-2 border-primary-500"
      title="Configuration & Tools"
    >
      <span class="text-3xl">⚙️</span>
    </button>
    
    <!-- Adventure Progress Bar -->
    <div class="py-2 pr-4 pl-20">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 min-w-[160px]">
          <span class="text-white text-xs font-semibold opacity-75">ADVENTURE</span>
          <span class="text-primary-300 text-xs font-bold">{{ adventureProgress }}%</span>
        </div>
        
        <!-- Progress Bar with Act Breaks -->
        <div class="relative h-6 bg-dark rounded overflow-hidden flex-1" role="progressbar" :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="adventureProgress" aria-label="Adventure progress">
        <!-- Filled Progress -->
        <div 
          class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-500 transition-all duration-500"
          :style="{ width: adventureProgress + '%' }"
          aria-hidden="true"
        >
          <div class="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
        </div>
        
        <!-- Act Dividers and Labels -->
        <div class="absolute inset-0 flex">
          <div 
            v-for="act in adventureActs" 
            :key="act.number"
            class="relative border-r border-dark-lighter"
            :style="{ width: act.widthPercent + '%' }"
          >
            <!-- Act Label -->
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-dark/60" :class="act.completed ? 'text-success-300' : 'text-white/80'">
                ACT {{ act.number }}
              </span>
            </div>
            
            <!-- Scene Markers -->
            <div class="absolute bottom-0 left-0 right-0 flex">
              <div 
                v-for="scene in act.scenes" 
                :key="scene.id"
                class="flex-1 h-1 border-r border-dark-lighter"
                :class="scene.completed ? 'bg-success-500' : 'bg-gray-600'"
                :title="scene.title"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- Current Scene Marker -->
        <div 
          class="absolute inset-y-0 w-1 bg-warning-400 shadow-lg"
          :style="{ left: currentScenePercent + '%' }"
        >
          <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-warning-400 rounded-full border-2 border-dark"></div>
        </div>
        </div>
        
        <div class="flex items-center gap-3 text-[10px] text-gray-400 min-w-[200px]">
          <div class="text-white opacity-75">{{ completedCount }}/{{ totalCount }} scenes • Act {{ currentAct }}</div>
        </div>
      </div>
    </div>
    
    <!-- Session/Day Progress Bar -->
    <div class="py-2 pr-4 pl-20 border-t border-dark">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 min-w-[160px]">
          <span class="text-white text-xs font-semibold opacity-75">SESSION</span>
          <span class="text-success-300 text-xs font-bold">{{ sessionProgress }}%</span>
        </div>
        
        <div class="relative h-4 bg-dark rounded overflow-hidden flex-1" role="progressbar" :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="sessionProgress" aria-label="Session progress">
        <!-- Filled Progress -->
        <div 
          class="absolute inset-y-0 left-0 bg-gradient-to-r from-success-600 to-success-500 transition-all duration-300"
          :style="{ width: sessionProgress + '%' }"
          aria-hidden="true"
        ></div>
        
        <!-- Scene Breaks in Session -->
        <div class="absolute inset-0 flex">
          <div 
            v-for="n in sessionSceneCount" 
            :key="n"
            class="flex-1 border-r border-dark-lighter"
          ></div>
        </div>
        
        <!-- Time Markers -->
        <div class="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-medium text-white pointer-events-none">
          <span>{{ sessionInfo.startTime }}</span>
          <span>{{ sessionInfo.endTime }}</span>
        </div>
        </div>
        
        <div class="flex items-center gap-3 text-[10px] text-gray-400 min-w-[200px]">
          <div>{{ sessionScenesCompleted }}/{{ sessionSceneCount }} scenes</div>
          <div>{{ timeRemaining }} left</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref, onMounted, onUnmounted } from 'vue'

const scenes = inject('scenes')

// Current time tracking
const currentTime = ref('14:00')

// Holiday configuration
const HOLIDAY_START = new Date('2025-11-21T18:00:00') // Friday evening
const HOLIDAY_END = new Date('2025-11-23T23:00:00')   // Sunday late evening

// Session configuration (dynamic based on whether we're on holiday)
const sessionInfo = computed(() => {
  const now = new Date()
  
  if (now < HOLIDAY_START) {
    // Before holiday - show countdown
    return {
      name: 'Countdown to Holiday',
      startTime: 'Now',
      endTime: 'Nov 21',
      isCountdown: true
    }
  } else if (now >= HOLIDAY_START && now <= HOLIDAY_END) {
    // During holiday
    return {
      name: 'Holiday Sessions',
      startTime: 'Nov 21 6pm',
      endTime: 'Nov 23 11pm',
      isCountdown: false
    }
  } else {
    // After holiday
    return {
      name: 'Adventure Complete',
      startTime: 'Nov 21',
      endTime: 'Nov 23',
      isCountdown: false
    }
  }
})

const sessionSceneCount = ref(3) // Expected scenes this session
const sessionScenesCompleted = ref(0) // Completed in this session

// Adventure progress (Acts 1-4 only, excluding Act 0 prologue)
const adventureActs = computed(() => {
  if (!scenes.scenesIndex.value) return []
  
  const acts = []
  const mainActScenes = scenes.scenesIndex.value.scenes.filter(s => s.act >= 1)
  const totalMainScenes = mainActScenes.length
  
  for (let actNum = 1; actNum <= 4; actNum++) {
    const actScenes = mainActScenes.filter(s => s.act === actNum)
    const actSummary = scenes.scenesIndex.value.actSummaries[`act${actNum}`]
    
    if (actScenes.length > 0) {
      const completedInAct = actScenes.filter(s => scenes.completedScenes.value.has(s.id)).length
      
      acts.push({
        number: actNum,
        title: actSummary?.title || `Act ${actNum}`,
        scenes: actScenes.map(s => ({
          ...s,
          completed: scenes.completedScenes.value.has(s.id)
        })),
        sceneCount: actScenes.length,
        widthPercent: (actScenes.length / totalMainScenes) * 100,
        completed: completedInAct === actScenes.length
      })
    }
  }
  
  return acts
})

// Overall adventure progress
const adventureProgress = computed(() => {
  if (!scenes.scenesIndex.value) return 0
  
  const mainScenes = scenes.scenesIndex.value.scenes.filter(s => s.act >= 1)
  const completed = mainScenes.filter(s => scenes.completedScenes.value.has(s.id)).length
  
  return Math.round((completed / mainScenes.length) * 100)
})

const completedCount = computed(() => {
  if (!scenes.scenesIndex.value) return 0
  const mainScenes = scenes.scenesIndex.value.scenes.filter(s => s.act >= 1)
  return mainScenes.filter(s => scenes.completedScenes.value.has(s.id)).length
})

const totalCount = computed(() => {
  if (!scenes.scenesIndex.value) return 0
  return scenes.scenesIndex.value.scenes.filter(s => s.act >= 1).length
})

const currentAct = computed(() => {
  return scenes.currentScene.value?.act || 0
})

// Current scene position in the adventure progress bar
const currentScenePercent = computed(() => {
  if (!scenes.scenesIndex.value || !scenes.currentSceneId.value) return 0
  
  const mainScenes = scenes.scenesIndex.value.scenes.filter(s => s.act >= 1)
  const currentIndex = mainScenes.findIndex(s => s.id === scenes.currentSceneId.value)
  
  if (currentIndex === -1) return 0
  
  return ((currentIndex + 0.5) / mainScenes.length) * 100
})

// Session progress (holiday countdown or progress)
const sessionProgress = computed(() => {
  const now = new Date()
  
  if (now < HOLIDAY_START) {
    // Countdown mode - progress toward holiday start
    // Show as inverse: 100% when far away, 0% at start
    const totalDuration = HOLIDAY_START - now
    // Cap at 30 days for visual purposes
    const maxDuration = 30 * 24 * 60 * 60 * 1000
    const cappedDuration = Math.min(totalDuration, maxDuration)
    return Math.max(0, 100 - Math.round((cappedDuration / maxDuration) * 100))
  } else if (now >= HOLIDAY_START && now <= HOLIDAY_END) {
    // During holiday - show progress through holiday
    const elapsed = now - HOLIDAY_START
    const total = HOLIDAY_END - HOLIDAY_START
    return Math.round((elapsed / total) * 100)
  } else {
    // After holiday
    return 100
  }
})

const timeRemaining = computed(() => {
  const now = new Date()
  
  if (now < HOLIDAY_START) {
    // Countdown to holiday
    const remaining = HOLIDAY_START - now
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) {
      return `${days}d ${hours}h`
    }
    return `${hours}h`
  } else if (now >= HOLIDAY_START && now <= HOLIDAY_END) {
    // During holiday
    const remaining = HOLIDAY_END - now
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  } else {
    // After holiday
    return 'Complete'
  }
})

// Update clock
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

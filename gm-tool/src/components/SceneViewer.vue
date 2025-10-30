<template>
  <div class="max-w-full mx-auto">
    <!-- Loading State -->
    <div v-if="!scene" class="text-center py-12 text-gray-500">
      <div class="text-4xl mb-4">📖</div>
      <div>Loading scene...</div>
    </div>

    <div v-else>
      <!-- Scene Title (Always Visible) -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-dark mb-2">
          Act {{ scene.act }}, Scene {{ scene.sceneNumber }}: {{ scene.title }}
        </h1>
        <p class="text-lg text-gray-700" v-html="'<strong>Central Question:</strong> ' + linkify(scene.centralQuestion)"></p>
        <p v-if="scene.recommendedTime" class="text-sm text-gray-600 mt-1">
          ⏱️ Recommended Time: {{ scene.recommendedTime }}
        </p>
      </div>

      <!-- SITUATION ASPECTS - Badges Row -->
      <div class="mb-6 p-5 border-2 border-primary-300 rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-bold text-dark flex items-center gap-2">
            <span class="text-2xl">✨</span>
            <span>Situation Aspects</span>
          </h2>
          <button class="btn-outline text-xs py-1 px-2" @click="promptAddAspect">+ Add</button>
        </div>
        <div class="flex flex-wrap gap-2 items-center">
          <span
            v-for="(aspect, index) in (visibleAspects || [])"
            :key="index"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-base font-semibold bg-primary-100 text-primary-900 border border-primary-400 whitespace-nowrap shadow-sm hover:bg-primary-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
          >
            <span>{{ aspect }}</span>
            <button class="ml-1 text-primary-700 hover:text-primary-900 cursor-pointer" @click="removeAspect(index)" title="Remove">×</button>
          </span>
          <span v-if="!visibleAspects || visibleAspects.length === 0" class="text-sm text-gray-600">No aspects yet</span>
        </div>
      </div>

      <!-- Narrative: Opening + Perspective -->
      <div class="prose text-dyslexia mb-8">
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-600 mb-2">Opening</h4>
          <p class="whitespace-pre-wrap">
            <template v-for="(part, idx) in renderParts(scene.readAloud.opening)" :key="idx">
              <TaskCallout
                v-if="part.type === 'task'"
                :id="part.id"
                :label="part.label"
                :text="part.text"
                :scene-id="currentSceneId"
              />
              <span v-else v-html="linkify(part.text)"></span>
            </template>
          </p>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-gray-600 mb-2">From a Cat's Perspective</h4>
          <p class="whitespace-pre-wrap">
            <template v-for="(part, idx) in renderParts(scene.readAloud.perspective)" :key="'p'+idx">
              <TaskCallout
                v-if="part.type === 'task'"
                :id="part.id"
                :label="part.label"
                :text="part.text"
                :scene-id="currentSceneId"
              />
              <span v-else v-html="linkify(part.text)"></span>
            </template>
          </p>
        </div>
      </div>

      <!-- Zones: description + actionable tasks -->
      <div v-if="scene.zones?.length" class="space-y-6">
        <div v-for="(zone, index) in scene.zones" :key="index" class="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 class="text-lg font-semibold text-dark mb-2">{{ zone.name }}</h3>
          <p v-if="zone.description" class="text-sm text-gray-700 mb-3" v-html="linkify(zone.description)"></p>
          <div v-if="zone.tasks?.length" class="space-y-2 mt-4">
            <div class="text-xs font-semibold text-gray-600">Things to do here</div>
            <ul class="space-y-2">
              <li v-for="(task, tIdx) in zone.tasks" :key="tIdx" class="flex items-start gap-2">
                <input 
                  type="checkbox"
                  :checked="isTaskCompleted(`zone-${index}-task-${tIdx}`)"
                  @change="toggleTaskInline(`zone-${index}-task-${tIdx}`)"
                  class="mt-1 w-4 h-4 text-success-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer flex-shrink-0"
                />
                <span class="flex-1 text-sm" v-html="linkify(task)"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Optional: keep GM Guidance section hidden in new flow (can be re-enabled if needed) -->

      <AccordionSection 
        v-if="scene.npcs?.length"
        title="NPCs in This Scene" 
        :defaultOpen="true"
        icon="🐾"
      >
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(npc, index) in scene.npcs" :key="npc.id" class="panel">
            <!-- NPC Checkbox -->
            <div class="flex items-start gap-2 mb-2">
              <input 
                type="checkbox"
                :checked="isTaskCompleted(`npc-${index}`)"
                @change="toggleTaskInline(`npc-${index}`)"
                class="mt-1 w-4 h-4 text-success-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer flex-shrink-0"
              />
              <span class="text-xs text-gray-600">Introduced</span>
            </div>
            <h4 class="font-semibold text-dark mb-3 text-lg" v-html="linkify(npc.name) + ' (' + npc.pronouns + ')'"></h4>
            
            <!-- Aspects - Always Visible -->
            <div class="mb-3 p-2 bg-primary-50 rounded border border-primary-200">
              <div class="text-xs font-semibold text-primary-700 mb-1">ASPECTS</div>
              <div class="text-sm space-y-1">
                <div v-if="npc.aspects?.highConcept" class="flex items-start gap-2">
                  <span class="text-primary-500">★</span>
                  <span v-html="'<strong>High Concept:</strong> ' + linkify(npc.aspects.highConcept)"></span>
                </div>
                <div v-if="npc.aspects?.trouble" class="flex items-start gap-2">
                  <span class="text-danger-500">⚠</span>
                  <span v-html="'<strong>Trouble:</strong> ' + linkify(npc.aspects.trouble)"></span>
                </div>
                <div v-if="npc.aspects?.other" v-for="(aspect, idx) in npc.aspects.other" :key="idx" class="flex items-start gap-2">
                  <span class="text-warning-500">⚡</span>
                  <span v-html="linkify(aspect)"></span>
                </div>
              </div>
            </div>
            
            <div class="text-sm space-y-1">
              <div v-if="npc.role" v-html="'<strong>Role:</strong> ' + linkify(npc.role)"></div>
              <div v-if="npc.linguisticClues" class="text-xs italic text-gray-600 mt-2" v-html="linkify(npc.linguisticClues)"></div>
            </div>
          </div>
        </div>
      </AccordionSection>

      <!-- Potential Outcomes -->
      <AccordionSection 
        v-if="scene.potentialOutcomes?.length"
        title="Potential Outcomes" 
        icon="🎯"
      >
        <div class="space-y-3">
          <div v-for="(outcome, index) in scene.potentialOutcomes" :key="index" class="border-l-4 pl-4 flex gap-3" :class="{
            'border-success-500': outcome.type === 'success',
            'border-warning-500': outcome.type === 'successWithCost',
            'border-danger-500': outcome.type === 'failure'
          }">
            <input 
              type="checkbox"
              :checked="isTaskCompleted(`outcome-${index}`)"
              @change="toggleTaskInline(`outcome-${index}`)"
              class="mt-1 w-4 h-4 text-success-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer flex-shrink-0"
            />
            <div class="flex-1">
              <h4 class="font-semibold text-sm mb-1 capitalize">{{ outcome.type.replace('successWithCost', 'Success with Cost') }}</h4>
              <p class="text-sm text-gray-700" v-html="linkify(outcome.description)"></p>
            </div>
          </div>
        </div>
      </AccordionSection>

      

      <!-- As Scene Unfolds (if present) -->
      <AccordionSection 
        v-if="scene.asSceneUnfolds?.length"
        title="As Scene Unfolds" 
        icon="🎬"
      >
        <div class="space-y-3">
          <div v-for="(event, index) in scene.asSceneUnfolds" :key="index" class="border-l-4 border-primary-400 pl-4 flex gap-3">
            <input 
              type="checkbox"
              :checked="isTaskCompleted(`unfold-${index}`)"
              @change="toggleTaskInline(`unfold-${index}`)"
              class="mt-1 w-4 h-4 text-success-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer flex-shrink-0"
            />
            <div class="flex-1">
              <h4 class="font-semibold text-sm text-primary-700 mb-1">{{ event.trigger }}</h4>
              <p class="text-sm text-gray-700 whitespace-pre-wrap" v-html="linkify(event.description)"></p>
            </div>
          </div>
        </div>
      </AccordionSection>

      <!-- GM Notes (if present) -->
      <AccordionSection 
        v-if="scene.gmNotes"
        title="GM Notes" 
        icon="📝"
      >
        <div class="prose text-sm">
          <p class="whitespace-pre-wrap" v-html="linkify(scene.gmNotes)"></p>
        </div>
      </AccordionSection>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, watch } from 'vue'
import AccordionSection from './AccordionSection.vue'
import TaskCallout from './TaskCallout.vue'
import { getHyperlinkEngine } from '../utils/HyperlinkEngine'

const scenes = inject('scenes')
const taskTracking = inject('taskTracking')
const scene = computed(() => scenes.currentScene.value)
const currentSceneId = computed(() => scenes.currentSceneId.value)

// Memoization cache to prevent re-processing the same text
const linkifyCache = new Map()

// Clear cache when scene changes
watch(scene, () => {
  linkifyCache.clear()
})

// ---- Situation Aspects helpers ----
function toTitleCase(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\b([a-z])([a-z']*)/g, (_, a, b) => a.toUpperCase() + b)
}

function cleanAspect(str) {
  if (!str) return ''
  // Remove parenthetical info
  const noParen = str.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim()
  const titled = toTitleCase(noParen)
  // Limit length
  return titled.length > 48 ? titled.slice(0, 45) + '…' : titled
}

const visibleAspects = computed(() => {
  const list = scene.value?.situationAspects || []
  return list.map(cleanAspect).filter(Boolean)
})

function promptAddAspect() {
  const input = window.prompt('Add Situation Aspect (short, no parentheses):')
  if (!input) return
  const cleaned = cleanAspect(input)
  if (!cleaned) return
  if (!scene.value.situationAspects) scene.value.situationAspects = []
  scene.value.situationAspects.push(cleaned)
}

function removeAspect(index) {
  if (!scene.value?.situationAspects) return
  scene.value.situationAspects.splice(index, 1)
}

// ---- Inline task parsing ----
// Format: [[task:ID:Label|Optional text]]
function renderParts(text) {
  if (!text) return []
  const parts = []
  const regex = /\[\[task:([^:\]|]+)?(?::([^\]|]+))?(?:\|([^\]]*))?\]\]/gi
  let lastIndex = 0
  let match
  let autoIdx = 0
  while ((match = regex.exec(text)) !== null) {
    const [full, idMaybe, labelMaybe, bodyMaybe] = match
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: text.slice(lastIndex, match.index) })
    }
    const id = (idMaybe && idMaybe.trim()) || `inline-${++autoIdx}`
    const label = (labelMaybe && labelMaybe.trim()) || 'Task'
    const body = (bodyMaybe && bodyMaybe.trim()) || ''
    parts.push({ type: 'task', id, label, text: body })
    lastIndex = match.index + full.length
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', text: text.slice(lastIndex) })
  }
  return parts
}

/**
 * Linkify text - convert entity names to HTML links
 * MEMOIZED to prevent recursive processing
 */
function linkify(text) {
  if (!text) return ''
  
  // Check cache first
  if (linkifyCache.has(text)) {
    return linkifyCache.get(text)
  }
  
  const engine = getHyperlinkEngine()
  if (!engine) return text
  
  const result = engine.linkifyText(text)
  linkifyCache.set(text, result)
  return result
}

/**
 * Check if a task is completed
 */
function isTaskCompleted(taskId) {
  return taskTracking.isTaskCompleted(currentSceneId.value, taskId)
}

/**
 * Toggle task completion from inline checkbox
 */
function toggleTaskInline(taskId) {
  taskTracking.toggleTask(currentSceneId.value, taskId)
}
</script>

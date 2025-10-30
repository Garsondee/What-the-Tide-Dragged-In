<template>
  <span class="task-callout float-right ml-3 mb-2 mt-1 inline-flex items-start gap-2 select-none">
    <input
      type="checkbox"
      :checked="checked"
      @change="onToggle"
      class="mt-0.5 w-4 h-4 text-success-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
      :aria-label="`Mark task ${label} as completed`"
    />
    <span class="flex flex-col text-xs leading-snug">
      <span class="font-semibold text-gray-700">{{ label }}</span>
      <span class="text-gray-600" v-html="textHtml"></span>
    </span>
  </span>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  text: { type: String, default: '' },
  sceneId: { type: String, required: true },
})

const taskTracking = inject('taskTracking')
const checked = computed(() => taskTracking?.isTaskCompleted(props.sceneId, props.id))

const onToggle = () => {
  taskTracking?.toggleTask(props.sceneId, props.id)
}

// Allow basic links via existing engine in parent; keep plain here
const textHtml = computed(() => props.text)
</script>

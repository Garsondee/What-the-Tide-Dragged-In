import { getHyperlinkEngine } from '../utils/HyperlinkEngine'

/**
 * v-linkify directive
 * Automatically converts entity names to clickable links
 * 
 * Usage:
 *   <div v-linkify>Your content with Sappho and Jewels</div>
 *   <div v-linkify.defer>Content that loads later</div>
 */
export const linkifyDirective = {
  mounted(el, binding) {
    // Mark as pending and process on next frame
    if (!binding.modifiers.defer) {
      el.dataset.linkifyPending = 'true'
      processElement(el)
    }
  },

  updated(el, binding) {
    // Only reprocess if content actually changed and not already processed
    // Skip if already processed in this update cycle
    if (el.dataset.linkifyPending === 'true') {
      return
    }
    
    if (binding.value !== binding.oldValue) {
      el.dataset.linkifyPending = 'true'
      processElement(el)
    }
  }
}

function processElement(el) {
  // Clear any existing processing flag after a short delay
  setTimeout(() => {
    delete el.dataset.linkifyPending
  }, 100)
  
  // Wait for next tick to ensure content is rendered
  requestAnimationFrame(() => {
    const engine = getHyperlinkEngine()
    if (engine) {
      // Only process if not already fully linked
      if (!el.dataset.linked) {
        engine.processContent(el)
        el.dataset.linked = 'partial' // Mark as processed
      }
    } else {
      console.warn('HyperlinkEngine not initialized yet')
    }
  })
}

/**
 * Register the directive globally
 */
export function registerLinkifyDirective(app) {
  app.directive('linkify', linkifyDirective)
}

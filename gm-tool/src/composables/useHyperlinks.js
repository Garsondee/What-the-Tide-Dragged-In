import { ref, onMounted } from 'vue'
import { initializeHyperlinkEngine, getHyperlinkEngine } from '../utils/HyperlinkEngine'

/**
 * Composable for managing hyperlinks in content
 */
export function useHyperlinks() {
  const engine = ref(null)
  const ready = ref(false)
  const error = ref(null)

  /**
   * Initialize the hyperlink engine
   */
  async function initialize() {
    try {
      engine.value = await initializeHyperlinkEngine()
      ready.value = !!engine.value
      
      if (!ready.value) {
        error.value = 'Failed to initialize hyperlink engine'
      }
    } catch (e) {
      error.value = e.message
      console.error('useHyperlinks initialization error:', e)
    }
  }

  /**
   * Process an element's content to add links
   */
  function linkifyElement(element) {
    if (!ready.value || !engine.value) {
      console.warn('HyperlinkEngine not ready')
      return
    }

    engine.value.processContent(element)
  }

  /**
   * Set up click handler for entity links
   */
  function setupClickHandler(elementOrSelector, callbacks = {}) {
    const element = typeof elementOrSelector === 'string' 
      ? document.querySelector(elementOrSelector)
      : elementOrSelector

    if (!element) {
      console.warn('Element not found for click handler')
      return
    }

    const handler = (event) => {
      if (engine.value) {
        engine.value.handleClick(event, callbacks)
      }
    }

    element.addEventListener('click', handler)

    // Return cleanup function
    return () => {
      element.removeEventListener('click', handler)
    }
  }

  /**
   * Get the engine instance directly (for advanced use)
   */
  function getEngine() {
    return engine.value || getHyperlinkEngine()
  }

  return {
    engine,
    ready,
    error,
    initialize,
    linkifyElement,
    setupClickHandler,
    getEngine
  }
}

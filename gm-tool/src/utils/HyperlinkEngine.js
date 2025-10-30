/**
 * HyperlinkEngine
 * Automatically detects and links entity names in content
 */

export class HyperlinkEngine {
  constructor(entityRegistry) {
    this.registry = entityRegistry;
    this.patterns = [];
    this.buildPatterns();
  }

  /**
   * Build regex patterns for all entities
   */
  buildPatterns() {
    const patterns = [];

    // Process each entity category
    const categories = [
      { key: 'characters', type: 'character', color: 'blue' },
      { key: 'npcs', type: 'npc', color: 'blue' },
      { key: 'scenes', type: 'scene', color: 'green' },
      { key: 'aspects', type: 'aspect', color: 'purple' },
      { key: 'stunts', type: 'stunt', color: 'orange' },
      { key: 'locations', type: 'location', color: 'brown' }
    ];

    for (const category of categories) {
      const entities = this.registry[category.key] || [];
      
      for (const entity of entities) {
        // Collect all names (primary + aliases)
        const names = [entity.name];
        if (entity.aliases) {
          names.push(...entity.aliases);
        }
        if (entity.fullName) {
          names.push(entity.fullName);
        }

        // Create patterns for each name
        for (const name of names) {
          if (!name || name.length < 3) continue; // Skip very short names
          
          const escapedName = this.escapeRegex(name);
          
          // Match whole words, optionally with possessive
          // Use negative lookbehind to avoid matching inside words
          const pattern = {
            regex: new RegExp(
              `(?<!\\w)(${escapedName})(?:'s)?(?!\\w)`,
              'gi'
            ),
            entityType: category.type,
            entityId: entity.id,
            entityName: entity.name,
            color: category.color,
            priority: name.length // Longer names get higher priority
          };
          
          patterns.push(pattern);
        }
      }
    }

    // Sort by priority (longest first) to match "Sappho the Sea Dog" before "Sappho"
    patterns.sort((a, b) => b.priority - a.priority);
    
    this.patterns = patterns;
    console.log(`📎 HyperlinkEngine: Built ${patterns.length} patterns from ${this.registry.metadata?.totalEntities || 0} entities`);
  }

  /**
   * Escape special regex characters
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Process HTML content and add links
   */
  processContent(element) {
    if (!element) return;
    
    // Process all text nodes recursively
    this.processNode(element);
  }

  /**
   * Recursively process a DOM node
   */
  processNode(node) {
    // Skip if already processed (check element itself)
    if (node.nodeType === Node.ELEMENT_NODE && node.dataset?.linked === 'true') {
      return;
    }

    // Skip if inside an already-processed element
    if (node.parentElement?.closest('[data-linked="true"]')) {
      return;
    }

    // Skip certain elements
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName;
      
      // Don't process links, code, pre, or already-linked content
      if (['A', 'CODE', 'PRE', 'SCRIPT', 'STYLE'].includes(tagName)) {
        return;
      }
      
      // Don't process if inside a link
      if (node.closest('a, .entity-link')) {
        return;
      }

      // Process child nodes
      const children = Array.from(node.childNodes);
      for (const child of children) {
        this.processNode(child);
      }
    }
    
    // Process text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) return;
      
      // Don't process if this text node is inside a link
      if (node.parentElement?.closest('a, .entity-link')) {
        return;
      }
      
      const linkedHTML = this.linkifyText(text);
      
      // Only replace if changes were made
      if (linkedHTML !== text) {
        const span = document.createElement('span');
        span.innerHTML = linkedHTML;
        span.dataset.linked = 'true';
        node.replaceWith(span);
      }
    }
  }

  /**
   * Convert entity names in text to HTML links
   * Uses a two-pass approach to prevent recursive linking
   */
  linkifyText(text) {
    // CRITICAL: Don't process if text already contains HTML tags
    // This prevents recursive linking of attributes
    if (/<[^>]+>/.test(text)) {
      return text;
    }
    
    // Phase 1: Find all matches and create placeholders
    const replacements = [];
    let searchText = text;
    
    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      let match;
      
      while ((match = regex.exec(searchText)) !== null) {
        const matchText = match[1];
        const startPos = match.index;
        const endPos = startPos + match[0].length;

        // Check for overlaps with existing replacements
        const hasOverlap = replacements.some(r => 
          (startPos >= r.start && startPos < r.end) || 
          (endPos > r.start && endPos <= r.end)
        );

        if (!hasOverlap) {
          replacements.push({
            start: startPos,
            end: endPos,
            matchText: matchText,
            pattern: pattern
          });
        }
      }
    }

    // If no matches, return original text
    if (replacements.length === 0) {
      return text;
    }

    // Sort replacements by start position (descending) so we replace from end to start
    // This preserves the positions of earlier matches
    replacements.sort((a, b) => b.start - a.start);

    // Phase 2: Build result by replacing from end to start
    let result = text;
    for (const replacement of replacements) {
      const link = `<a href="#" class="entity-link entity-${replacement.pattern.entityType}" data-entity-type="${replacement.pattern.entityType}" data-entity-id="${replacement.pattern.entityId}" data-entity-name="${this.escapeHtml(replacement.pattern.entityName)}" title="${replacement.pattern.entityName}">${replacement.matchText}</a>`;
      
      result = result.substring(0, replacement.start) + link + result.substring(replacement.end);
    }

    return result;
  }

  /**
   * Escape HTML special characters
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Handle clicks on entity links
   */
  handleClick(event, callbacks = {}) {
    const link = event.target.closest('.entity-link');
    if (!link) return false;

    event.preventDefault();

    const { entityType, entityId, entityName } = link.dataset;

    console.log(`🔗 Clicked ${entityType}: ${entityName} (${entityId})`);

    // Call appropriate callback
    switch (entityType) {
      case 'character':
      case 'npc':
        if (callbacks.onCharacterClick) {
          callbacks.onCharacterClick(entityId, entityName);
        }
        break;
      
      case 'scene':
        if (callbacks.onSceneClick) {
          callbacks.onSceneClick(entityId, entityName);
        }
        break;
      
      case 'aspect':
        if (callbacks.onAspectClick) {
          callbacks.onAspectClick(entityName, link);
        }
        break;
      
      case 'stunt':
        if (callbacks.onStuntClick) {
          callbacks.onStuntClick(entityName, link);
        }
        break;
      
      case 'location':
        if (callbacks.onLocationClick) {
          callbacks.onLocationClick(entityId, entityName);
        }
        break;
    }

    return true;
  }
}

/**
 * Create a singleton instance once registry is loaded
 */
let engineInstance = null;

export async function initializeHyperlinkEngine() {
  if (engineInstance) return engineInstance;

  try {
    const response = await fetch('/data/entity-registry.json');
    const registry = await response.json();
    engineInstance = new HyperlinkEngine(registry);
    console.log('✅ HyperlinkEngine initialized');
    return engineInstance;
  } catch (error) {
    console.error('❌ Failed to initialize HyperlinkEngine:', error);
    return null;
  }
}

export function getHyperlinkEngine() {
  return engineInstance;
}

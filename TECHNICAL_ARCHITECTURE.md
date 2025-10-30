# Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (GM View)                    │
├─────────────────────────────────────────────────────────┤
│  UI Layer (HTML/CSS)                                    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Scene     │  │  Character   │  │    Dice      │  │
│  │   Viewer    │  │    Sheet     │  │   Roller     │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│  Application Layer (JavaScript)                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  UIController - Coordinate all components       │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │   Content    │  │    State     │  │  Hyperlink   ││
│  │   Loader     │  │   Manager    │  │   Engine     ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │    Dice      │  │     Time     │  │  Checklist   ││
│  │   Roller     │  │   Tracker    │  │   Manager    ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
├─────────────────────────────────────────────────────────┤
│  Storage Layer                                          │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ LocalStorage │  │  JSON Files  │                   │
│  │ (State)      │  │  (Content)   │                   │
│  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. ContentLoader
**Purpose**: Load and cache JSON content files

```javascript
class ContentLoader {
  constructor() {
    this.cache = new Map();
    this.basePath = './data';
  }
  
  async loadCharacter(id) {
    if (this.cache.has(`char_${id}`)) {
      return this.cache.get(`char_${id}`);
    }
    
    const response = await fetch(`${this.basePath}/characters/${id}.json`);
    const data = await response.json();
    this.cache.set(`char_${id}`, data);
    return data;
  }
  
  async loadScene(id) {
    if (this.cache.has(`scene_${id}`)) {
      return this.cache.get(`scene_${id}`);
    }
    
    const response = await fetch(`${this.basePath}/scenes/${id}.json`);
    const data = await response.json();
    this.cache.set(`scene_${id}`, data);
    return data;
  }
  
  async loadEntityRegistry() {
    if (this.cache.has('registry')) {
      return this.cache.get('registry');
    }
    
    const response = await fetch(`${this.basePath}/entity-registry.json`);
    const data = await response.json();
    this.cache.set('registry', data);
    return data;
  }
  
  async preloadAll() {
    // Preload frequently accessed data
    await this.loadEntityRegistry();
    // Could preload all scenes for offline use
  }
}
```

### 2. StateManager
**Purpose**: Manage character state persistence

```javascript
class StateManager {
  constructor() {
    this.states = new Map();
    this.history = [];
    this.maxHistorySize = 50;
  }
  
  async initialize() {
    // Load all character states from localStorage
    const keys = Object.keys(localStorage).filter(k => k.startsWith('char_'));
    for (const key of keys) {
      const id = key.replace('char_', '');
      const state = JSON.parse(localStorage.getItem(key));
      this.states.set(id, state);
    }
  }
  
  getCharacterState(id) {
    return this.states.get(id);
  }
  
  updateStress(charId, trackType, boxIndex, checked) {
    const state = this.states.get(charId);
    if (!state) return;
    
    const oldValue = state.stress[trackType].current[boxIndex];
    state.stress[trackType].current[boxIndex] = checked;
    
    this.recordHistory({
      type: 'stress',
      charId,
      trackType,
      boxIndex,
      oldValue,
      newValue: checked
    });
    
    this.saveState(charId);
    this.notifyChange(charId, 'stress');
  }
  
  addConsequence(charId, severity, name) {
    const state = this.states.get(charId);
    if (!state) return;
    
    const consequence = state.consequences[severity];
    const oldValue = consequence.current;
    
    consequence.current = name;
    consequence.recoveryRemaining = this.getRecoveryTime(severity);
    
    this.recordHistory({
      type: 'consequence',
      charId,
      severity,
      oldValue,
      newValue: name
    });
    
    this.saveState(charId);
    this.notifyChange(charId, 'consequence');
  }
  
  clearConsequence(charId, severity) {
    const state = this.states.get(charId);
    if (!state) return;
    
    state.consequences[severity].current = null;
    state.consequences[severity].recoveryRemaining = 0;
    
    this.saveState(charId);
    this.notifyChange(charId, 'consequence');
  }
  
  updateFatePoints(charId, delta) {
    const state = this.states.get(charId);
    if (!state) return;
    
    const oldValue = state.fatePoints.current;
    state.fatePoints.current = Math.max(0, state.fatePoints.current + delta);
    
    this.recordHistory({
      type: 'fatePoint',
      charId,
      oldValue,
      newValue: state.fatePoints.current
    });
    
    this.saveState(charId);
    this.notifyChange(charId, 'fatePoints');
  }
  
  addTemporaryAspect(charId, aspect, duration) {
    const state = this.states.get(charId);
    if (!state) return;
    
    state.temporaryAspects.push({
      name: aspect,
      duration: duration,
      created: Date.now()
    });
    
    this.saveState(charId);
    this.notifyChange(charId, 'aspects');
  }
  
  saveState(charId) {
    const state = this.states.get(charId);
    localStorage.setItem(`char_${charId}`, JSON.stringify(state));
  }
  
  recordHistory(action) {
    this.history.push({
      timestamp: Date.now(),
      ...action
    });
    
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }
  
  undo() {
    if (this.history.length === 0) return;
    
    const lastAction = this.history.pop();
    
    switch (lastAction.type) {
      case 'stress':
        this.updateStress(
          lastAction.charId,
          lastAction.trackType,
          lastAction.boxIndex,
          lastAction.oldValue
        );
        break;
      case 'consequence':
        // Restore old consequence
        const state = this.states.get(lastAction.charId);
        state.consequences[lastAction.severity].current = lastAction.oldValue;
        this.saveState(lastAction.charId);
        break;
      // ... handle other action types
    }
    
    this.history.pop(); // Remove the undo action itself
  }
  
  notifyChange(charId, changeType) {
    // Emit event for UI to react
    window.dispatchEvent(new CustomEvent('characterStateChanged', {
      detail: { charId, changeType }
    }));
  }
  
  exportSession() {
    const session = {
      timestamp: Date.now(),
      states: Array.from(this.states.entries()),
      history: this.history,
      gameState: JSON.parse(localStorage.getItem('gameState') || '{}')
    };
    
    const blob = new Blob([JSON.stringify(session, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `fate-session-${new Date().toISOString()}.json`;
    a.click();
  }
  
  async importSession(file) {
    const text = await file.text();
    const session = JSON.parse(text);
    
    // Restore states
    this.states = new Map(session.states);
    this.history = session.history || [];
    
    // Save to localStorage
    for (const [id, state] of this.states) {
      localStorage.setItem(`char_${id}`, JSON.stringify(state));
    }
    
    if (session.gameState) {
      localStorage.setItem('gameState', JSON.stringify(session.gameState));
    }
    
    // Trigger full UI refresh
    window.dispatchEvent(new CustomEvent('sessionLoaded'));
  }
  
  getRecoveryTime(severity) {
    return {
      'mild': { type: 'scenes', count: 1 },
      'moderate': { type: 'sessions', count: 1 },
      'severe': { type: 'scenarios', count: 1 }
    }[severity];
  }
  
  onSceneEnd() {
    // Called when GM marks scene as complete
    for (const [charId, state] of this.states) {
      for (const [severity, consequence] of Object.entries(state.consequences)) {
        if (consequence.current && consequence.recoveryRemaining?.type === 'scenes') {
          consequence.recoveryRemaining.count--;
          if (consequence.recoveryRemaining.count <= 0) {
            this.clearConsequence(charId, severity);
            this.showNotification(`${state.name}'s ${severity} consequence has cleared!`);
          }
        }
      }
      this.saveState(charId);
    }
  }
  
  showNotification(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
```

### 3. HyperlinkEngine
**Purpose**: Auto-detect and link entity names

```javascript
class HyperlinkEngine {
  constructor(entityRegistry) {
    this.registry = entityRegistry;
    this.patterns = this.buildPatterns();
  }
  
  buildPatterns() {
    const patterns = [];
    
    // Build patterns for each entity type
    for (const type of ['characters', 'npcs', 'scenes']) {
      for (const entity of this.registry.entities[type]) {
        // Create pattern for primary name and aliases
        const names = [entity.name, ...entity.aliases];
        
        // Sort by length (longest first) to match "Sappho the Sea Dog" before "Sappho"
        names.sort((a, b) => b.length - a.length);
        
        for (const name of names) {
          patterns.push({
            regex: new RegExp(`\\b(${this.escapeRegex(name)})(?:'s)?\\b`, 'gi'),
            entityType: type.slice(0, -1), // Remove plural
            entityId: entity.id,
            entityName: entity.name
          });
        }
      }
    }
    
    // Sort patterns by length (longest matches first)
    patterns.sort((a, b) => {
      const aLen = a.regex.source.length;
      const bLen = b.regex.source.length;
      return bLen - aLen;
    });
    
    return patterns;
  }
  
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  processContent(element) {
    // Process all text nodes, skipping already-linked content
    this.processNode(element);
  }
  
  processNode(node) {
    // Skip if already processed or is a link
    if (node.dataset?.linked === 'true' || node.closest('a')) {
      return;
    }
    
    // Process text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const fragment = this.linkifyText(text);
      if (fragment !== text) {
        const temp = document.createElement('span');
        temp.innerHTML = fragment;
        node.replaceWith(temp);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Skip code, pre, and already-linked elements
      if (['CODE', 'PRE', 'A'].includes(node.tagName)) {
        return;
      }
      
      // Recursively process children
      Array.from(node.childNodes).forEach(child => this.processNode(child));
    }
  }
  
  linkifyText(text) {
    let result = text;
    const matched = new Set(); // Track matched positions to avoid overlaps
    
    for (const pattern of this.patterns) {
      result = result.replace(pattern.regex, (match, p1, offset) => {
        // Check if this position was already matched
        const range = Array.from({length: match.length}, (_, i) => offset + i);
        if (range.some(pos => matched.has(pos))) {
          return match; // Don't re-link
        }
        
        // Mark positions as matched
        range.forEach(pos => matched.add(pos));
        
        return `<a href="#" class="entity-link entity-${pattern.entityType}" 
                   data-entity-type="${pattern.entityType}" 
                   data-entity-id="${pattern.entityId}" 
                   data-entity-name="${pattern.entityName}">${match}</a>`;
      });
    }
    
    return result;
  }
  
  handleClick(event) {
    const link = event.target.closest('.entity-link');
    if (!link) return;
    
    event.preventDefault();
    
    const { entityType, entityId, entityName } = link.dataset;
    
    switch (entityType) {
      case 'character':
      case 'npc':
        this.openCharacterSheet(entityId);
        break;
      case 'scene':
        this.navigateToScene(entityId);
        break;
      case 'aspect':
        this.showAspectTooltip(entityName, link);
        break;
      case 'stunt':
        this.showStuntTooltip(entityName, link);
        break;
    }
  }
  
  openCharacterSheet(id) {
    window.dispatchEvent(new CustomEvent('openCharacterSheet', {
      detail: { characterId: id }
    }));
  }
  
  navigateToScene(id) {
    window.dispatchEvent(new CustomEvent('navigateToScene', {
      detail: { sceneId: id }
    }));
  }
  
  showAspectTooltip(name, element) {
    // Create and position tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'entity-tooltip aspect-tooltip';
    tooltip.innerHTML = `
      <h4>${name}</h4>
      <p>Situation Aspect</p>
      <button class="invoke-btn">Invoke (+2)</button>
      <button class="compel-btn">Compel</button>
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.left = `${rect.left}px`;
    
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', () => tooltip.remove(), { once: true });
    }, 10);
  }
}
```

## Data Flow

### Loading a Scene
```
User clicks scene
    ↓
UIController.loadScene(sceneId)
    ↓
ContentLoader.loadScene(sceneId) → JSON
    ↓
UIController.renderScene(sceneData)
    ↓
HyperlinkEngine.processContent(sceneElement)
    ↓
Scene displayed with clickable links
```

### Updating Character State
```
User checks stress box
    ↓
Event listener captures click
    ↓
StateManager.updateStress(charId, track, box, true)
    ↓
Update state object
    ↓
Save to localStorage
    ↓
Emit 'characterStateChanged' event
    ↓
UI updates to reflect change
```

### Rolling Dice
```
User clicks "Roll"
    ↓
DiceRoller.roll(modifier, dc)
    ↓
Generate 4dF results
    ↓
Calculate total and outcome
    ↓
Display result with GM guidance
    ↓
[Optional] User clicks "Manual Override"
    ↓
Use GM-selected outcome instead
```

## Storage Strategy

### LocalStorage Structure
```javascript
{
  // Character states (one key per character)
  "char_sappho": { /* full character state */ },
  "char_jewels": { /* full character state */ },
  "char_punk": { /* full character state */ },
  
  // Game state
  "gameState": {
    "currentAct": 1,
    "currentScene": "01_01_harbour_heist",
    "fragmentsCollected": 3,
    "scenesCompleted": ["01_01_harbour_heist"],
    "sessionStartTime": "2025-10-30T16:00:00Z"
  },
  
  // Checklists
  "checklists": {
    "fragments": {
      "1": true,
      "2": true,
      "3": true
    },
    "scenes": {
      "01_01_harbour_heist": true
    }
  },
  
  // Scene timers
  "sceneTimers": {
    "01_01_harbour_heist": 1500000,
    "01_02_seagulls_descend": 2100000
  }
}
```

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Load scenes on demand, not all at once
2. **Caching**: Cache loaded JSON to avoid repeated fetches
3. **Debouncing**: Debounce state saves to avoid excessive writes
4. **Virtual Scrolling**: For long scene lists (if needed)
5. **Service Worker**: Cache all JSON for offline use

### Memory Management
- Clear old history entries (keep last 50)
- Limit cached scenes (keep last 5 accessed)
- Compress large text fields in localStorage

## Browser Compatibility

Target: Modern browsers (Chrome, Firefox, Edge, Safari)
- ES6+ features required
- LocalStorage API
- Fetch API
- CustomEvent
- Optional: File System Access API (for save/load)

## Offline Support

Use Service Worker to cache:
- HTML/CSS/JS files
- All JSON data files
- Assets (if any)

This ensures the tool works without internet after initial load.

# Feature Specifications

## 1. Wiki-Style Hyperlinking System

### Requirements

The system must automatically detect entity names in displayed text and convert them to clickable hyperlinks.

### Implementation Approach

**Phase 1: Entity Registry**
1. Build master entity registry from all JSON files
2. Index by primary name and aliases
3. Include character names, scene titles, aspect names, stunt names, location names

**Phase 2: Link Detection**
```javascript
class HyperlinkEngine {
  constructor(entityRegistry) {
    this.entities = entityRegistry;
    this.buildPatternMatcher();
  }
  
  buildPatternMatcher() {
    // Create regex patterns for each entity type
    // Prioritize longer matches (e.g., "Sappho the Sea Dog" before "Sappho")
    // Handle case-insensitive matching
  }
  
  processText(htmlContent) {
    // Scan text nodes (avoid processing existing links/tags)
    // Replace entity names with <a> tags
    // Add data attributes for entity type and ID
    return linkedContent;
  }
}
```

**Phase 3: Click Handling**
```javascript
document.addEventListener('click', (e) => {
  if (e.target.dataset.entityType) {
    const { entityType, entityId } = e.target.dataset;
    loadEntityDetail(entityType, entityId);
  }
});
```

### Entity Types and Link Behavior

| Entity Type | Link Color | Click Behavior |
|------------|-----------|----------------|
| Character/NPC | Blue | Open character sheet in sidebar |
| Scene | Green | Navigate to scene view |
| Aspect | Purple | Show aspect tooltip/modal |
| Stunt | Orange | Show stunt tooltip/modal |
| Location | Brown | Show location description |

### Edge Cases

- **Partial matches**: "Sappho's collar" should link "Sappho" only
- **Possessives**: Handle "Jewels'" correctly
- **Plurals**: "the gulls" links to "Gull Mafia"
- **Already linked**: Don't double-link text
- **Code blocks**: Skip linking in `<code>` or `<pre>` tags

## 2. Character State Persistence

### State Tracking

Every character (PC and NPC) has a **state file** that persists across scenes:

```javascript
class CharacterStateManager {
  constructor() {
    this.states = new Map();
    this.stateHistory = []; // For undo functionality
  }
  
  async loadCharacter(characterId) {
    const state = await fetch(`/data/characters/${characterId}.json`);
    this.states.set(characterId, await state.json());
  }
  
  markStress(characterId, trackType, boxIndex) {
    const char = this.states.get(characterId);
    char.stress[trackType].current[boxIndex] = true;
    this.saveState(characterId);
    this.addToHistory('stress', characterId, { trackType, boxIndex });
  }
  
  clearStress(characterId, trackType, boxIndex) {
    const char = this.states.get(characterId);
    char.stress[trackType].current[boxIndex] = false;
    this.saveState(characterId);
  }
  
  addConsequence(characterId, severity, name) {
    const char = this.states.get(characterId);
    char.consequences[severity].current = name;
    char.consequences[severity].recoveryRemaining = this.getRecoveryTime(severity);
    this.saveState(characterId);
  }
  
  getRecoveryTime(severity) {
    // Fate Core recovery times
    return {
      'mild': { type: 'scenes', count: 1 },
      'moderate': { type: 'sessions', count: 1 },
      'severe': { type: 'scenarios', count: 1 }
    }[severity];
  }
  
  saveState(characterId) {
    const char = this.states.get(characterId);
    // Save to localStorage or backend
    localStorage.setItem(`char_${characterId}`, JSON.stringify(char));
  }
}
```

### UI Components

**Character Sheet Display**
```html
<div class="character-sheet" data-character-id="sappho">
  <h2>Sappho <span class="pronouns">(she/her)</span></h2>
  
  <!-- Stress Tracks -->
  <div class="stress-track">
    <label>Physical Stress:</label>
    <div class="stress-boxes">
      <input type="checkbox" id="sappho-phys-1" data-track="physical" data-box="0">
      <input type="checkbox" id="sappho-phys-2" data-track="physical" data-box="1">
      <input type="checkbox" id="sappho-phys-3" data-track="physical" data-box="2">
      <input type="checkbox" id="sappho-phys-4" data-track="physical" data-box="3">
    </div>
  </div>
  
  <!-- Consequences -->
  <div class="consequences">
    <div class="consequence-slot mild">
      <label>Mild (2):</label>
      <input type="text" placeholder="Empty" data-severity="mild">
      <span class="recovery-info"></span>
    </div>
  </div>
  
  <!-- Fate Points -->
  <div class="fate-points">
    <label>Fate Points:</label>
    <span class="current">3</span> / <span class="refresh">3</span>
    <button class="spend-fp">-</button>
    <button class="gain-fp">+</button>
  </div>
</div>
```

### Persistence Mechanism

**Option A: LocalStorage** (Simple, client-only)
- Save state to browser localStorage
- Export/import for session portability
- Risk: Clearing browser data loses state

**Option B: File-Based** (Recommended for offline GM tool)
- Save state JSON files to local filesystem
- Requires file system access API or electron wrapper
- Can version control game states

**Option C: Hybrid**
- Use localStorage as working memory
- Provide "Save Session" button to export JSON
- "Load Session" imports previous state

### Recovery Tracking

At end of each scene:
```javascript
function onSceneComplete(sceneId) {
  // Tick recovery counters
  for (const [charId, char] of characterStates.entries()) {
    for (const [severity, consequence] of Object.entries(char.consequences)) {
      if (consequence.current && consequence.recoveryType === 'scenes') {
        consequence.recoveryRemaining--;
        if (consequence.recoveryRemaining <= 0) {
          consequence.current = null;
          notifyGM(`${char.name}'s ${severity} consequence has cleared!`);
        }
      }
    }
  }
}
```

## 3. Dice Rolling System

### Requirements
- Roll 4dF (Fudge/Fate dice: -1, 0, +1)
- Apply skill modifier
- Compare to DC
- Display outcome (Fail, Tie, Success, Success with Style)
- **Manual override**: GM can input result directly

### Implementation

```javascript
class FateDiceRoller {
  roll4dF() {
    const faces = [-1, 0, 1];
    return Array.from({length: 4}, () => 
      faces[Math.floor(Math.random() * 3)]
    );
  }
  
  calculateTotal(dice, modifier) {
    const diceTotal = dice.reduce((sum, die) => sum + die, 0);
    return diceTotal + modifier;
  }
  
  getOutcome(total, dc) {
    const shift = total - dc;
    if (shift >= 3) return 'Success with Style';
    if (shift >= 1) return 'Success';
    if (shift === 0) return 'Tie';
    return 'Fail';
  }
  
  displayRoll(dice, modifier, dc) {
    const symbols = dice.map(d => ({'-1': '−', '0': '◯', '1': '+'}[d]));
    const total = this.calculateTotal(dice, modifier);
    const outcome = this.getOutcome(total, dc);
    
    return {
      faces: symbols.join(' '),
      diceTotal: dice.reduce((a,b) => a+b, 0),
      modifier: modifier,
      finalTotal: total,
      dc: dc,
      shift: total - dc,
      outcome: outcome,
      gmGuidance: this.getGMGuidance(outcome)
    };
  }
  
  getGMGuidance(outcome) {
    const guidance = {
      'Success with Style': 'They achieve decisively and gain a boost.',
      'Success': 'They succeed cleanly. Move forward.',
      'Tie': 'Success at minor cost, or create a boost.',
      'Fail': 'Introduce a complication or offer success-at-a-cost.'
    };
    return guidance[outcome];
  }
}
```

### UI for Rolling

```html
<div class="dice-roller">
  <h3>Roll Dice</h3>
  <label>Skill Modifier: <input type="number" id="modifier" value="3"></label>
  <label>Difficulty (DC): <input type="number" id="dc" value="2"></label>
  <button id="roll-btn">Roll 4dF</button>
  
  <div class="roll-result" style="display: none;">
    <p class="dice-faces">+ ◯ − +</p>
    <p>Dice: +0 | Modifier: +3 | Total: 3</p>
    <p class="outcome success">Success (shift +1)</p>
    <p class="gm-guidance">They succeed cleanly. Move forward.</p>
  </div>
  
  <!-- Manual Override -->
  <div class="manual-roll">
    <h4>Manual Roll Entry</h4>
    <select id="manual-outcome">
      <option value="fail">Fail</option>
      <option value="tie">Tie</option>
      <option value="success">Success</option>
      <option value="sws">Success with Style</option>
    </select>
    <button id="manual-submit">Use This Result</button>
  </div>
</div>
```

## 4. Time Tracking System

### Requirements
- Track how long each scene has been running
- Warn GM when scene exceeds recommended duration
- Log scene times for post-session review

### Implementation

```javascript
class SceneTimeTracker {
  constructor() {
    this.currentScene = null;
    this.sceneStart = null;
    this.timers = new Map();
  }
  
  startScene(sceneId, recommendedMinutes) {
    this.currentScene = sceneId;
    this.sceneStart = Date.now();
    this.updateTimer();
    
    // Set warning threshold (e.g., 10 min over recommended)
    const warningTime = (recommendedMinutes + 10) * 60 * 1000;
    setTimeout(() => this.warnLongScene(), warningTime);
  }
  
  updateTimer() {
    if (!this.sceneStart) return;
    
    const elapsed = Date.now() - this.sceneStart;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    document.getElementById('scene-timer').textContent = 
      `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    requestAnimationFrame(() => this.updateTimer());
  }
  
  warnLongScene() {
    if (this.currentScene) {
      showNotification('⏰ Scene running longer than recommended');
    }
  }
  
  endScene() {
    const elapsed = Date.now() - this.sceneStart;
    this.timers.set(this.currentScene, elapsed);
    this.currentScene = null;
    this.sceneStart = null;
    return elapsed;
  }
  
  getSessionSummary() {
    return Array.from(this.timers.entries()).map(([scene, time]) => ({
      scene,
      duration: Math.round(time / 60000) + ' minutes'
    }));
  }
}
```

### UI Display

```html
<div class="scene-header">
  <h2 id="scene-title">Act 1, Scene 1: The Harbour Heist</h2>
  <div class="scene-meta">
    <span class="timer">⏱️ <span id="scene-timer">0:00</span></span>
    <span class="recommended">Recommended: 20-30 min</span>
  </div>
</div>
```

## 5. Interactive Checkboxes

### Use Cases
- Mark scenes as completed
- Track fragment collection (11 + 1 heart)
- Check off breadcrumbs/clues discovered
- Mark milestones achieved

### Implementation

```javascript
class ChecklistManager {
  constructor() {
    this.state = this.loadState();
  }
  
  loadState() {
    return JSON.parse(localStorage.getItem('checklists') || '{}');
  }
  
  toggle(listId, itemId) {
    if (!this.state[listId]) this.state[listId] = {};
    this.state[listId][itemId] = !this.state[listId][itemId];
    this.save();
  }
  
  isChecked(listId, itemId) {
    return this.state[listId]?.[itemId] || false;
  }
  
  save() {
    localStorage.setItem('checklists', JSON.stringify(this.state));
  }
}
```

### UI Examples

**Fragment Tracker**
```html
<div class="fragment-tracker">
  <h3>Speaking Stone Fragments (3/12)</h3>
  <div class="checklist">
    <label><input type="checkbox" data-list="fragments" data-item="1" checked> #1 Grove Discovery</label>
    <label><input type="checkbox" data-list="fragments" data-item="2" checked> #2 Exceptional Play</label>
    <label><input type="checkbox" data-list="fragments" data-item="3" checked> #3 Diplomacy</label>
    <!-- ... -->
    <label class="heart-piece"><input type="checkbox" data-list="fragments" data-item="12"> ❤️ #12 Jade Heart</label>
  </div>
</div>
```

# Priority Features Specification

Based on your requirements for the 3-day holiday playthrough.

## 1. Core Navigation System

### Linear Scene Progression
Large, prominent buttons for sequential navigation:

```html
<div class="scene-nav-controls">
  <button class="nav-btn nav-prev" onclick="loadPreviousScene()">
    ⬅️ Previous Scene
  </button>
  
  <div class="scene-breadcrumb">
    Act 1 > Scene 2: The Seagulls Descend
  </div>
  
  <button class="nav-btn nav-next" onclick="loadNextScene()">
    Next Scene ➡️
  </button>
</div>
```

### Master Scene Index
Quick-jump sidebar:

```html
<nav class="scene-index">
  <div class="act-group">
    <h3 class="act-header">Act 0: Tutorial</h3>
    <ul class="scene-list">
      <li class="scene-item completed">
        <span class="scene-number">0.1</span>
        <span class="scene-title">The Cat Parliament</span>
        <span class="scene-duration">25m</span>
      </li>
      <!-- ... -->
    </ul>
  </div>
  
  <div class="act-group">
    <h3 class="act-header">Act 1: The Heist</h3>
    <ul class="scene-list">
      <li class="scene-item active">
        <span class="scene-number">1.1</span>
        <span class="scene-title">The Harbour Heist</span>
        <span class="scene-duration">--</span>
      </li>
      <!-- ... -->
    </ul>
  </div>
</nav>
```

## 2. Initiative Tracker

### Full Initiative System

```javascript
class InitiativeTracker {
  constructor() {
    this.participants = [];
    this.currentIndex = 0;
    this.round = 1;
  }
  
  addParticipant(name, charId, initiativeRoll, skill) {
    this.participants.push({
      name,
      charId,
      initiative: initiativeRoll,
      skill: skill,
      hasActed: false
    });
    this.sortParticipants();
  }
  
  sortParticipants() {
    this.participants.sort((a, b) => b.initiative - a.initiative);
  }
  
  nextTurn() {
    if (this.currentIndex < this.participants.length - 1) {
      this.currentIndex++;
    } else {
      this.newRound();
    }
    this.render();
  }
  
  newRound() {
    this.round++;
    this.currentIndex = 0;
    this.participants.forEach(p => p.hasActed = false);
  }
  
  removeParticipant(index) {
    this.participants.splice(index, 1);
    if (this.currentIndex >= this.participants.length) {
      this.currentIndex = Math.max(0, this.participants.length - 1);
    }
  }
}
```

### UI Implementation

```html
<div class="initiative-panel">
  <div class="initiative-header">
    <h3>Initiative Tracker</h3>
    <span class="round-counter">Round: <span id="round-num">1</span></span>
  </div>
  
  <div class="add-participant">
    <input type="text" id="participant-name" placeholder="Name">
    <select id="participant-skill">
      <option value="notice">Notice</option>
      <option value="athletics">Athletics</option>
      <option value="fight">Fight</option>
      <option value="other">Other...</option>
    </select>
    <input type="number" id="initiative-roll" placeholder="Roll">
    <button onclick="addToInitiative()">Add</button>
  </div>
  
  <ul class="initiative-list">
    <li class="initiative-item active">
      <span class="init-value">7</span>
      <span class="char-name">Punk</span>
      <span class="init-skill">(Notice +3)</span>
      <button class="remove-btn">×</button>
    </li>
    <li class="initiative-item">
      <span class="init-value">5</span>
      <span class="char-name">Gull Mafia</span>
      <span class="init-skill">(Notice +2)</span>
      <button class="remove-btn">×</button>
    </li>
  </ul>
  
  <div class="initiative-controls">
    <button class="next-turn-btn" onclick="nextTurn()">Next Turn ▶</button>
    <button onclick="newRound()">New Round</button>
    <button onclick="clearInitiative()">Clear All</button>
  </div>
</div>
```

## 3. Advanced Time Tracking

### Session Schedule System

```javascript
class SessionScheduleTracker {
  constructor(schedule) {
    this.schedule = schedule; // Hard-coded 3-day plan
    this.sessionStart = null;
    this.currentScene = null;
  }
  
  // Schedule format:
  // {
  //   sessions: [
  //     { day: 1, start: '14:00', end: '18:00', targetScenes: ['Act0.1', 'Act0.2', 'Act1.1'] },
  //     { day: 2, start: '10:00', end: '14:00', targetScenes: ['Act1.2', 'Act2.1'] },
  //     ...
  //   ]
  // }
  
  getCurrentSession() {
    const now = new Date();
    // Find which session we're in based on current time
    return this.schedule.sessions.find(s => this.isInSession(s, now));
  }
  
  getPacingStatus() {
    const session = this.getCurrentSession();
    if (!session) return { status: 'unknown', message: 'No active session' };
    
    const targetScenes = session.targetScenes;
    const completedCount = targetScenes.filter(id => this.isSceneComplete(id)).length;
    const totalScenes = targetScenes.length;
    
    const timeElapsed = Date.now() - this.sessionStart;
    const sessionDuration = this.getSessionDuration(session);
    const percentTime = timeElapsed / sessionDuration;
    const percentScenes = completedCount / totalScenes;
    
    if (percentScenes >= percentTime + 0.15) {
      return { status: 'ahead', message: '✓ Ahead of schedule', color: 'green' };
    } else if (percentScenes <= percentTime - 0.15) {
      return { status: 'behind', message: '⚠️ Behind schedule - speed up!', color: 'red' };
    } else {
      return { status: 'on-track', message: '→ On track', color: 'yellow' };
    }
  }
}
```

### Top Bar Display

```html
<div class="top-bar">
  <div class="current-time-display">
    <span class="clock">🕐 <span id="real-time">14:32</span></span>
  </div>
  
  <div class="session-info">
    <span class="session-label">Day 1, Session 1</span>
    <span class="session-time">14:00 - 18:00</span>
  </div>
  
  <div class="pacing-indicator">
    <span class="pacing-status on-track">→ On track</span>
    <span class="scenes-progress">2/3 scenes</span>
  </div>
  
  <div class="scene-timer">
    <span>Scene: <span id="scene-elapsed">12:34</span></span>
    <span class="recommended">(~20m)</span>
  </div>
</div>
```

## 4. Accordion-Based UI

### Collapsible Sections

```html
<div class="scene-content">
  <!-- Always visible -->
  <div class="scene-essential">
    <h2>Act 1, Scene 1: The Harbour Heist</h2>
    <p class="central-question">
      <strong>Central Question:</strong> Can the players fend off the Seagull Mafia?
    </p>
  </div>
  
  <!-- Accordion sections -->
  <div class="accordion-section">
    <button class="accordion-header" onclick="toggleSection('read-aloud')">
      <span class="icon">▶</span> Read-Aloud Text
    </button>
    <div class="accordion-content" id="read-aloud">
      <p>After the chaos of Wally's madness...</p>
    </div>
  </div>
  
  <div class="accordion-section">
    <button class="accordion-header" onclick="toggleSection('aspects')">
      <span class="icon">▶</span> Situation Aspects
    </button>
    <div class="accordion-content" id="aspects">
      <ul>
        <li>The Catch is Coming In</li>
        <li>Moored Ships and Creaking Ropes</li>
      </ul>
    </div>
  </div>
  
  <div class="accordion-section">
    <button class="accordion-header" onclick="toggleSection('gm-guidance')">
      <span class="icon">▶</span> GM Guidance
    </button>
    <div class="accordion-content" id="gm-guidance">
      <h4>Levers & Buttons</h4>
      <ul>
        <li>Zone Control: Create Advantage with Athletics/Notice (DC 2)</li>
      </ul>
    </div>
  </div>
  
  <div class="accordion-section">
    <button class="accordion-header" onclick="toggleSection('npcs')">
      <span class="icon">▶</span> NPCs in This Scene
    </button>
    <div class="accordion-content" id="npcs">
      <!-- Quick-access NPC cards -->
    </div>
  </div>
</div>
```

## 5. Scene Stages

### Multi-Stage Scene Support

```javascript
// In scene JSON:
{
  "id": "01_02_seagulls_descend",
  "stages": [
    {
      "id": "stage_1_heist",
      "title": "The Heist",
      "description": "Players work to secure the catch",
      "aspects": ["The Catch is Coming In"],
      "npcs": ["sappho", "jewels"],
      "guidance": "Let players establish their approach"
    },
    {
      "id": "stage_2_gulls_attack",
      "title": "Gull Attack",
      "trigger": "After 2-3 rolls or 10 minutes",
      "description": "The Gull Mafia descends",
      "aspects": ["A Sky Black with Gulls", "Nowhere to Hide"],
      "npcs": ["gull_mafia"],
      "guidance": "Escalate tension with mass attack"
    },
    {
      "id": "stage_3_catastrophe",
      "title": "The Catastrophe",
      "trigger": "Manual - GM decides when",
      "description": "The Speaking Stone shatters",
      "aspects": ["Magical Backlash", "Communication Lost"],
      "guidance": "Narrative moment - no rolls needed"
    }
  ]
}
```

### Stage UI

```html
<div class="scene-stages">
  <div class="stage-nav">
    <button class="stage-btn completed" onclick="loadStage(0)">
      ✓ Stage 1: The Heist
    </button>
    <button class="stage-btn active" onclick="loadStage(1)">
      ▶ Stage 2: Gull Attack
    </button>
    <button class="stage-btn locked" onclick="loadStage(2)">
      🔒 Stage 3: Catastrophe
    </button>
  </div>
  
  <div class="current-stage-content">
    <!-- Current stage content loads here -->
  </div>
  
  <button class="advance-stage-btn">Advance to Next Stage ➡️</button>
</div>
```

## Implementation Priority

1. **Week 1**: Navigation system + Scene index
2. **Week 2**: Accordion UI + Basic time tracking
3. **Week 3**: Initiative tracker
4. **Week 4**: Advanced time tracking with session schedule
5. **Week 5**: Scene stages system
6. **Week 6**: Polish and integration testing

## Hard-Coded Session Schedule

```javascript
const ADVENTURE_SCHEDULE = {
  sessions: [
    {
      day: 1,
      name: "Day 1 - Afternoon",
      start: "14:00",
      end: "18:00",
      targetScenes: [
        "00_01_the_cat_parliament",
        "00_02_the_dark_woods",
        "01_01_the_harbour_heist",
        "01_02_the_seagulls_descend"
      ]
    },
    {
      day: 2,
      name: "Day 2 - Morning",
      start: "10:00",
      end: "14:00",
      targetScenes: [
        "01_03_the_aftermath",
        "02_01_the_squeaky_sabotage",
        "02_02_the_hydrant_havoc"
      ]
    },
    {
      day: 2,
      name: "Day 2 - Afternoon",
      start: "15:00",
      end: "19:00",
      targetScenes: [
        "02_03_the_catnip_calamity",
        "02_04_the_shamans_warning",
        "03_01_pound_rescue"
      ]
    },
    {
      day: 3,
      name: "Day 3 - Final Push",
      start: "10:00",
      end: "15:00",
      targetScenes: [
        "03_02_zoo_rescue",
        "03_03_shifters_fight",
        "04_01_epilogue"
      ]
    }
  ]
};
```

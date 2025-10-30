# Focused Implementation Plan - 3-Day Adventure Playthrough

## Executive Summary

This plan focuses on creating a **minimal, highly functional GM tool** optimized for running "What the Tide Dragged In" over a 3-day holiday. Emphasis on clean UI, accordion-based information architecture, and critical time tracking.

## Core Principle: Progressive Disclosure

**Information is hidden until needed.** Use accordions extensively to keep the UI clean while making everything accessible with one click.

## Priority 1: Navigation (Week 1)

### Goals
- Instant scene-to-scene movement
- Clear visual hierarchy
- Fast random access

### Deliverables
1. **Big navigation buttons** (Previous/Next)
2. **Scene index sidebar** with Act grouping
3. **Breadcrumb trail** showing current location
4. **Keyboard shortcuts** (Ctrl+Arrow for navigation)

### Success Criteria
- Can navigate entire adventure in under 10 seconds
- Never get lost or confused about current location
- One-click access to any scene

## Priority 2: Time Tracking System (Week 2)

### Goals
- Real-time session pacing feedback
- Hard-coded 3-day schedule
- Clear visual indicators

### Components

#### Top Bar (Always Visible)
```
Current Time | Session Info | Pacing Status | Scene Timer
  14:32     | Day 1, 14-18 | → On track   | Scene: 12m
```

#### Pacing Algorithm
```javascript
// Simple math:
if (completed_scenes / target_scenes > time_elapsed / session_duration + 0.15) {
  status = "ahead" (green)
} else if (completed_scenes / target_scenes < time_elapsed / session_duration - 0.15) {
  status = "behind" (red)
} else {
  status = "on-track" (yellow)
}
```

#### Hard-Coded Schedule
```javascript
const SCHEDULE = {
  day1_afternoon: {
    start: "14:00", end: "18:00",
    scenes: 4  // Act 0.1, 0.2, 1.1, 1.2
  },
  day2_morning: {
    start: "10:00", end: "14:00",
    scenes: 3  // Act 1.3, 2.1, 2.2
  },
  day2_afternoon: {
    start: "15:00", end: "19:00",
    scenes: 3  // Act 2.3, 2.4, 3.1
  },
  day3_finale: {
    start: "10:00", end: "15:00",
    scenes: 3  // Act 3.2, 3.3, 4.1
  }
};
```

### Success Criteria
- GM knows at a glance if pacing is good
- Color-coded feedback (green/yellow/red)
- Automatic scene timing logged

## Priority 3: Accordion UI (Week 3)

### Goals
- Clean, uncluttered interface
- Show only relevant information
- Fast collapse/expand

### Section Types

#### Always Open
- Scene title
- Central question
- Stage indicator (if multi-stage)

#### Default Collapsed
- Read-aloud text
- Situation aspects
- GM guidance (levers, hidden aspects, breadcrumbs)
- Zones description
- Potential outcomes

#### Auto-Open When Scene Loads
- Read-aloud text
- NPCs in this scene

#### Manually Expanded As Needed
- GM guidance
- Situation aspects

### Implementation
```javascript
class AccordionManager {
  constructor() {
    this.sections = new Map();
  }
  
  toggle(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('open');
  }
  
  openDefaults() {
    ['read-aloud', 'npcs'].forEach(id => this.open(id));
  }
  
  closeAll() {
    document.querySelectorAll('.accordion-section').forEach(s => {
      s.classList.remove('open');
    });
  }
}
```

### Success Criteria
- Scene loads showing only essentials
- Expand any section in one click
- No scrolling to find critical info

## Priority 4: Initiative Tracker (Week 4)

### Goals
- Flexible skill-based initiative
- Clear turn order
- Quick add/remove

### Features
1. **Flexible Initiative Input**
   - Name field
   - Skill dropdown (Notice, Athletics, Fight, Other)
   - Initiative roll value
   - Auto-sort by roll value

2. **Turn Management**
   - Highlight current actor
   - "Next Turn" button
   - Round counter
   - "New Round" resets all

3. **Participant Management**
   - Remove button per participant
   - Drag to reorder (optional)
   - Clear all button

### UI Flow
```
1. Conflict starts
2. GM: "Everyone roll Notice for initiative"
3. GM adds each participant with their roll
4. System auto-sorts by roll value
5. Click "Next Turn" to advance
6. After last participant: "New Round" button
```

### Success Criteria
- Add participant in 3 clicks
- Always clear who acts next
- Works for any skill-based initiative

## Priority 5: Scene Stages (Week 5)

### Goals
- Multi-phase scene support
- Clear stage progression
- Different content per stage

### Structure
```javascript
// Scene JSON with stages
{
  "id": "01_02_seagulls_descend",
  "stages": [
    {
      "id": "stage_1",
      "title": "The Heist",
      "aspects": ["The Catch is Coming In"],
      "npcs": ["sappho", "jewels"],
      "guidance": "..."
    },
    {
      "id": "stage_2",
      "title": "Gull Attack",
      "trigger": "After 10 minutes or 3 rounds",
      "aspects": ["A Sky Black with Gulls"],
      "npcs": ["gull_mafia"],
      "guidance": "..."
    }
  ]
}
```

### UI Display
```
┌─────────────────────────────────────┐
│ ✓ Stage 1  ▶ Stage 2  🔒 Stage 3   │
└─────────────────────────────────────┘

Current: Stage 2 - Gull Attack
Trigger: After 10 minutes or 3 rounds

[Stage 2 Content Here]

[Advance to Stage 3 ➡️]
```

### Success Criteria
- Clear visual stage progression
- Content changes per stage
- Optional: Auto-advance based on timer

## Priority 6: Character State (Week 6)

### Goals
- Stress/consequence tracking
- Persistence across scenes
- Quick-view in scene context

### Features
1. **Sidebar Character Sheets**
   - Collapsible list of all PCs/major NPCs
   - Quick stress checkbox toggles
   - Consequence input fields
   - Full sheet modal on click

2. **In-Scene NPC Cards**
   - Show only NPCs in current scene
   - Compact stat display
   - Stress tracking
   - Link to full sheet

3. **State Persistence**
   - LocalStorage auto-save
   - Export/import session
   - Undo last change

### Success Criteria
- Mark stress without leaving scene
- State survives page refresh
- Can export end-of-session state

## Technology Stack

### Core
- HTML5
- CSS3 (Grid, Flexbox, Variables)
- Vanilla JavaScript (ES6+)
- LocalStorage API

### No Frameworks
- Keep it simple
- Fast load times
- Easy to debug

### File Structure
```
gm-tool/
├── index.html
├── css/
│   ├── layout.css         # Grid layout
│   ├── navigation.css     # Nav buttons, breadcrumbs
│   ├── accordion.css      # Collapsible sections
│   ├── initiative.css     # Initiative tracker
│   └── topbar.css         # Time tracking bar
├── js/
│   ├── app.js            # Main initialization
│   ├── navigation.js     # Scene navigation
│   ├── time-tracker.js   # Pacing system
│   ├── accordion.js      # Collapse/expand
│   ├── initiative.js     # Initiative tracker
│   ├── state-manager.js  # Character state
│   └── stages.js         # Scene stages
└── data/
    ├── scenes/
    ├── characters/
    └── entity-registry.json
```

## Development Timeline

### Week 1: Foundation & Navigation
- HTML layout structure
- Scene index sidebar
- Navigation buttons
- Scene loading system

### Week 2: Time Tracking
- Top bar implementation
- Real-time clock
- Pacing algorithm
- Session schedule hard-coding

### Week 3: Accordion UI
- Collapsible sections
- Auto-open defaults
- Keyboard shortcuts
- CSS animations

### Week 4: Initiative Tracker
- Add participant UI
- Turn advancement
- Round management
- Sorting algorithm

### Week 5: Scene Stages
- Multi-stage scene support
- Stage navigation UI
- Content switching
- Trigger display

### Week 6: Character State
- Stress/consequence tracking
- NPC quick cards
- State persistence
- Export/import

### Week 7: Polish & Testing
- Bug fixes
- CSS refinement
- Keyboard shortcuts
- Print mode

## Testing Strategy

### Functional Tests
- Navigate through all scenes
- Track stress across scenes
- Initiative tracker with 6+ participants
- Pacing calculation accuracy

### Usability Tests
- Can GM find any scene in <10 seconds?
- Is pacing status immediately clear?
- Can GM operate mostly with keyboard?
- Does accordion reduce cognitive load?

### Performance Tests
- Page load time <500ms
- Scene navigation instant
- No lag with 10+ NPCs tracked
- LocalStorage doesn't bloat

## Success Metrics

### Week by Week
1. ✅ Can navigate entire adventure
2. ✅ Pacing status displays correctly
3. ✅ All scene content collapsible
4. ✅ Initiative tracker functional
5. ✅ Multi-stage scenes work
6. ✅ Character state persists
7. ✅ No critical bugs

### Overall Success
- GM can run entire adventure from tool
- Pacing keeps sessions on track
- UI never feels cluttered
- Everything loads instantly
- Zero learning curve

## Post-Launch Enhancements

After the 3-day game:
- Add session notes per scene
- Dice roller history
- Aspect tracker
- Compel suggester
- NPC relationship map
- Search functionality

## Documentation Needed

1. **Quick Start Guide** - 5 minutes to understand basics
2. **Keyboard Shortcuts** - Reference card
3. **Session Schedule** - How to adjust for your timing
4. **Troubleshooting** - Common issues

## Critical Path

**Must have for Day 1 of gaming:**
- Navigation system ✓
- Scene display ✓
- Time tracking ✓
- Basic accordion ✓

**Nice to have:**
- Initiative tracker
- Scene stages
- Full character state

**Can be manual:**
- Dice rolling (use physical dice)
- Aspect tracking (use paper)
- Fragment collection (use tokens)

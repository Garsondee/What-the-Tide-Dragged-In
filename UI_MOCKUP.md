# UI Layout Mockup

## Full Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🕐 14:32  │  Day 1, Session 1 (14:00-18:00)  │  → On track │
│            │         2/3 scenes complete       │  Scene: 12m │
├──────────┬──────────────────────────────────────────────────┤
│          │  ⬅️ Previous    Act 1 > Scene 2    Next Scene ➡️ │
│          ├──────────────────────────────────────────────────┤
│  SCENE   │                                                   │
│  INDEX   │  ▼ Read-Aloud Text                               │
│          │  After the chaos of Wally's madness...           │
│  Act 0   │                                                   │
│  ✓ 0.1   │  ▶ Situation Aspects                             │
│  ✓ 0.2   │                                                   │
│          │  ▶ GM Guidance                                    │
│  Act 1   │                                                   │
│  ✓ 1.1   │  ▼ NPCs in This Scene                            │
│  ▶ 1.2 ← │  ┌──────────────┐ ┌──────────────┐              │
│    1.3   │  │ Sappho       │ │ Gull Mafia   │              │
│          │  │ Fight: +4    │ │ Fight: +3    │              │
│  Act 2   │  │ Stress: ☑☐☐☐ │ │ Stress: ☐☐☐☐ │              │
│    2.1   │  └──────────────┘ └──────────────┘              │
│    2.2   │                                                   │
│          │  ▶ Scene Stages                                   │
│          │                                                   │
├──────────┼──────────────────────────────────────────────────┤
│ CHAR     │  INITIATIVE TRACKER          │  DICE ROLLER     │
│ SHEETS   │  Round: 1                     │                   │
│          │  7  Punk (Notice)      [×]   │  Modifier: +3    │
│ Punk     │  5  Gull Mafia (Notice)[×]   │  DC: 2           │
│ Pippin   │  [Add participant...]         │  [Roll 4dF]      │
│ Rusty    │  [Next Turn ▶]                │                   │
│          │                                │  Result: +1      │
│ Sappho   │  ACTIVE ASPECTS               │  Success!        │
│ Jewels   │  • The Catch is Coming In     │                   │
└──────────┴───────────────────────────────┴──────────────────┘
```

## CSS Structure

```css
/* Top Bar - Always Visible */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #2c3e50;
  color: white;
  padding: 10px 20px;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 20px;
  font-size: 14px;
  border-bottom: 3px solid #34495e;
}

.pacing-indicator.ahead { color: #2ecc71; }
.pacing-indicator.on-track { color: #f39c12; }
.pacing-indicator.behind { color: #e74c3c; }

/* Main Layout */
.app-layout {
  display: grid;
  grid-template-columns: 250px 1fr 350px;
  grid-template-rows: auto 1fr;
  height: calc(100vh - 60px);
}

.scene-nav {
  grid-column: 2;
  padding: 15px;
  background: #ecf0f1;
  border-bottom: 2px solid #bdc3c7;
}

.nav-btn {
  font-size: 18px;
  padding: 12px 24px;
  font-weight: bold;
  border: 2px solid #3498db;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #3498db;
  color: white;
  transform: scale(1.05);
}

/* Scene Index Sidebar */
.scene-index {
  grid-column: 1;
  grid-row: 2;
  overflow-y: auto;
  background: #34495e;
  color: white;
  padding: 15px;
}

.scene-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.scene-item:hover {
  background: rgba(255,255,255,0.1);
}

.scene-item.active {
  background: #3498db;
  font-weight: bold;
}

.scene-item.completed {
  opacity: 0.6;
}

/* Main Scene Content */
.scene-content {
  grid-column: 2;
  grid-row: 2;
  overflow-y: auto;
  padding: 20px;
  background: white;
}

/* Accordion Sections */
.accordion-section {
  margin: 15px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.accordion-header {
  width: 100%;
  padding: 12px 15px;
  background: #f8f9fa;
  border: none;
  text-align: left;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s;
}

.accordion-header:hover {
  background: #e9ecef;
}

.accordion-header .icon {
  transition: transform 0.2s;
  font-size: 12px;
}

.accordion-section.open .icon {
  transform: rotate(90deg);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: 0 15px;
}

.accordion-section.open .accordion-content {
  max-height: 2000px;
  padding: 15px;
}

/* Right Sidebar - Tools */
.tools-sidebar {
  grid-column: 3;
  grid-row: 2;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 15px;
  border-left: 2px solid #ddd;
}

.tool-panel {
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 15px;
}

/* Initiative Tracker */
.initiative-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.initiative-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.initiative-item.active {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  font-weight: bold;
}

.init-value {
  font-size: 20px;
  font-weight: bold;
  color: #2196f3;
  min-width: 30px;
}

/* Responsive Behavior */
@media (max-width: 1400px) {
  .app-layout {
    grid-template-columns: 200px 1fr 300px;
  }
}

@media (max-width: 1200px) {
  /* Stack right sidebar below main content */
  .app-layout {
    grid-template-columns: 200px 1fr;
  }
  .tools-sidebar {
    grid-column: 2;
    grid-row: 3;
    max-height: 400px;
  }
}
```

## JavaScript Accordion Behavior

```javascript
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId).closest('.accordion-section');
  const wasOpen = section.classList.contains('open');
  
  // Optional: Close all other sections
  // document.querySelectorAll('.accordion-section').forEach(s => {
  //   s.classList.remove('open');
  // });
  
  if (wasOpen) {
    section.classList.remove('open');
  } else {
    section.classList.add('open');
  }
}

// Auto-open essential sections when scene loads
function loadScene(sceneId) {
  // ... load scene data ...
  
  // Auto-open read-aloud and NPCs
  setTimeout(() => {
    ['read-aloud', 'npcs'].forEach(id => {
      const section = document.getElementById(id)?.closest('.accordion-section');
      if (section) section.classList.add('open');
    });
  }, 100);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'ArrowRight':
        loadNextScene();
        e.preventDefault();
        break;
      case 'ArrowLeft':
        loadPreviousScene();
        e.preventDefault();
        break;
      case 'i':
        document.querySelector('.initiative-panel').scrollIntoView();
        e.preventDefault();
        break;
    }
  }
});
```

## Scene Stage Visualization

```
┌────────────────────────────────────────────────┐
│ Scene Stages                                    │
├────────────────────────────────────────────────┤
│ ✓ Stage 1: The Heist  ▶ Stage 2: Gull Attack   │
│                        🔒 Stage 3: Catastrophe  │
├────────────────────────────────────────────────┤
│ Current Stage: Gull Attack                      │
│                                                 │
│ The Gull Mafia descends like a feathered...   │
│                                                 │
│ New Aspects:                                    │
│ • A Sky Black with Gulls                       │
│ • Nowhere to Hide                               │
│                                                 │
│ [Advance to Stage 3 ➡️]                        │
└────────────────────────────────────────────────┘
```

## Character Sheet Quick View

```html
<div class="char-quick-sheet">
  <div class="char-header">
    <h3>Sappho</h3>
    <span class="pronouns">(she/her)</span>
  </div>
  
  <div class="stress-compact">
    Physical: <input type="checkbox"> <input type="checkbox"> 
              <input type="checkbox"> <input type="checkbox">
    Mental: <input type="checkbox"> <input type="checkbox"> 
            <input type="checkbox">
  </div>
  
  <div class="top-skills">
    Fight: +4 | Athletics: +3 | Physique: +3
  </div>
  
  <button onclick="openFullSheet('sappho')">Full Sheet ↗</button>
</div>
```

## Color Scheme

```css
:root {
  --primary: #3498db;      /* Blue - Navigation */
  --success: #2ecc71;      /* Green - Ahead of schedule */
  --warning: #f39c12;      /* Orange - On track */
  --danger: #e74c3c;       /* Red - Behind schedule */
  --dark: #2c3e50;         /* Dark blue-gray - Headers */
  --light: #ecf0f1;        /* Light gray - Backgrounds */
  --border: #bdc3c7;       /* Medium gray - Borders */
}
```

## Print-Friendly Mode

```css
@media print {
  .top-bar,
  .scene-nav,
  .scene-index,
  .tools-sidebar {
    display: none;
  }
  
  .accordion-content {
    max-height: none !important;
  }
  
  .accordion-section {
    page-break-inside: avoid;
  }
  
  .scene-content {
    grid-column: 1 / -1;
  }
}
```

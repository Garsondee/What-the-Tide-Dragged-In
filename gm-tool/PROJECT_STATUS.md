# GM Tool - Project Status

**Last Updated:** October 30, 2025, 5:45 PM  
**Target:** 3-day playthrough starting soon  
**Overall Progress:** 45% Complete ⬆️

---

## 🎯 Current Status: Phase 2 - Navigation & Polish

**Phase 1 Complete!** Scene data is loading and displaying perfectly. All 15 scenes are accessible through navigation.

**Next:** Enhance navigation features and add session management.

---

## ✅ Completed (45%)

### 1. ✅ Project Foundation (100%)
- ✅ Vue 3 + Vite setup
- ✅ Tailwind CSS configured with dyslexia-friendly fonts
- ✅ Project structure established
- ✅ Build pipeline working

### 2. ✅ UI Components Created (100%)
- ✅ `TopBar.vue` - Real-time clock, session info, pacing
- ✅ `SceneIndex.vue` - Sidebar with act grouping
- ✅ `SceneNavigation.vue` - Previous/Next buttons
- ✅ `SceneViewer.vue` - Main scene content with accordions
- ✅ `AccordionSection.vue` - Reusable collapsible component
- ✅ `ToolsSidebar.vue` - Initiative tracker, dice roller
- ✅ `App.vue` - Main layout structure

### 3. ✅ Data Layer (100%)
- ✅ All 15 scenes converted to JSON
- ✅ Scene index manifest created
- ✅ Validation system built and tested (10/10 tests passing)
- ✅ All data validated (16/16 files valid, 0 errors)

### 4. ✅ Styling & Design (100%)
- ✅ Dyslexia-friendly typography (Atkinson Hyperlegible, Lexend)
- ✅ Color palette defined
- ✅ Custom components styled
- ✅ Responsive layout
- ✅ **GM Feedback Applied:** Aspects always visible and prominent

### 5. ✅ Phase 1: Scene Data Loading (100%) 🎉
**Status:** ✅ COMPLETE  
**Completed:** October 30, 2025

**Achievements:**
- ✅ Created `useScenes.js` composable for scene management
- ✅ Loads scenes-index.json on app mount
- ✅ Scene switching with Previous/Next buttons working
- ✅ SceneViewer dynamically displays real JSON data
- ✅ SceneIndex shows all 15 scenes grouped by Act
- ✅ Click navigation working (jump to any scene)
- ✅ Scene completion tracking with localStorage persistence
- ✅ Loading and error states implemented
- ✅ Auto-resume last viewed scene

**What Works:**
- Navigate through all 15 scenes using Previous/Next
- Click any scene in sidebar to jump to it
- All scene data displays correctly (aspects, NPCs, guidance, outcomes)
- Scene completion checkmarks persist
- Beautiful dyslexia-friendly UI with aspects prominently displayed

---

## 🚧 In Progress (0%)

### Phase 2: Enhanced Navigation (NEXT UP)
**Status:** Ready to Start  
**Estimated Time:** 1-2 days

**Tasks:**
- [ ] Keyboard shortcuts (Ctrl+Left/Right for navigation)
- [ ] Mark scene as complete button
- [ ] Scene completion stats in TopBar
- [ ] URL routing for deep linking to scenes
- [ ] Scene search/filter
- [ ] Breadcrumb trail improvements

---

## 📋 Not Started (70%)

### Phase 2: Navigation & State (Week 1)
**Status:** Not Started  
**Estimated Time:** 1 week

- [ ] State management (Pinia or reactive store)
- [ ] Scene navigation with Previous/Next
- [ ] Scene index clicking to jump scenes
- [ ] Breadcrumb updates
- [ ] Keyboard shortcuts (Ctrl+Arrow)
- [ ] URL-based scene routing
- [ ] Scene completion persistence (localStorage)

### Phase 3: Time Tracking (Week 2)
**Status:** Not Started  
**Estimated Time:** 3-4 days

- [ ] Real-time clock (✅ already working)
- [ ] Session schedule system
- [ ] Pacing calculator
- [ ] Scene timer implementation
- [ ] Completion time logging
- [ ] Session progress tracking

### Phase 4: Initiative Tracker (Week 3)
**Status:** Not Started  
**Estimated Time:** 2-3 days

- [ ] Add participant UI
- [ ] Initiative sorting
- [ ] Turn advancement
- [ ] Round counter
- [ ] Remove participants
- [ ] Persistence across scenes

### Phase 5: Dice Roller (Week 4)
**Status:** Not Started  
**Estimated Time:** 1-2 days

- [ ] 4dF dice rolling logic
- [ ] Modifier input
- [ ] DC comparison
- [ ] Result display with symbols
- [ ] Manual override option
- [ ] Roll history

### Phase 6: Character State (Week 5)
**Status:** Not Started  
**Estimated Time:** 3-4 days

- [ ] Character data loading
- [ ] Stress box tracking
- [ ] Consequence tracking
- [ ] Fate point counter
- [ ] Persistence (localStorage)
- [ ] Character quick reference

### Phase 7: Polish & Features (Week 6-7)
**Status:** Not Started  
**Estimated Time:** 1 week

- [ ] Accordion behavior refinement
- [ ] Print mode
- [ ] Session notes
- [ ] Export/import game state
- [ ] Keyboard shortcut panel
- [ ] Performance optimization

---

## 🎯 Next Immediate Steps

### Step 1: Create Scene Loader (30 min)
Create `src/composables/useScenes.js`:

```javascript
import { ref, computed } from 'vue'

export function useScenes() {
  const scenes = ref([])
  const currentSceneId = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  async function loadScenesIndex() {
    loading.value = true
    try {
      const response = await fetch('/data/scenes-index.json')
      const data = await response.json()
      scenes.value = data.scenes
      currentSceneId.value = data.scenes[0]?.id
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
  
  async function loadScene(sceneId) {
    loading.value = true
    try {
      const response = await fetch(`/data/scenes/${sceneId}.json`)
      return await response.json()
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }
  
  return {
    scenes,
    currentSceneId,
    loading,
    error,
    loadScenesIndex,
    loadScene
  }
}
```

### Step 2: Update App.vue (15 min)
Wire up the scene loader in App.vue to provide scene data to child components.

### Step 3: Update SceneViewer.vue (30 min)
Replace hardcoded content with dynamic data from loaded scene.

### Step 4: Update SceneIndex.vue (20 min)
Load all 15 scenes from index and implement click navigation.

### Step 5: Wire Navigation Buttons (15 min)
Make Previous/Next actually switch scenes.

**Total Time for Phase 1:** ~2 hours

---

## 📊 Progress Metrics

### By Feature Area

| Feature | Progress | Status |
|---------|----------|--------|
| UI Foundation | 100% | ✅ Complete |
| Data Layer | 100% | ✅ Complete |
| Scene Loading | 0% | 🚧 Next |
| Navigation | 0% | 📋 Planned |
| Time Tracking | 20% | 🚧 UI Only |
| Initiative | 20% | 🚧 UI Only |
| Dice Roller | 20% | 🚧 UI Only |
| Character State | 0% | 📋 Planned |
| Polish | 0% | 📋 Planned |

### Timeline

```
Week 1 (NOW):     Scene Loading + Navigation
Week 2:           Time Tracking Implementation
Week 3:           Initiative Tracker Logic
Week 4:           Dice Roller + Character State
Week 5-6:         Polish & Testing
Week 7:           READY FOR GAME
```

---

## 🔥 Critical Path to Playable

To have a **minimally functional tool**, we need:

1. ✅ UI Components (Done)
2. ✅ Data Files (Done)
3. 🚧 Scene Loading (2 hours) - **DO THIS NEXT**
4. 🚧 Navigation (1 day)
5. 🚧 Time Tracking (3 days)
6. 🚧 Initiative Tracker (2 days)

**Minimum Viable Product:** 1 week from now  
**Fully Featured:** 4-5 weeks from now

---

## 💡 Recommended Focus

### TODAY (2-3 hours)
Focus on **Phase 1: Scene Data Loading**

This unlocks everything else and gives you a functional scene viewer.

**Why this first?**
- All other features depend on scenes being loaded
- You can immediately see your content in the beautiful UI
- Provides instant gratification
- Unblocks testing of all components
- Enables GM feedback on actual content display

### THIS WEEK
Complete navigation so you can flip through all 15 scenes smoothly.

---

## 🎮 Demo-able Milestones

### Milestone 1: Static Scene Display (NOW → 2 hours)
- Load and display any scene from JSON
- Show all aspects, NPCs, outcomes
- Accordions work

### Milestone 2: Full Navigation (2 hours → 1 day)
- Navigate through all 15 scenes
- Scene index sidebar clickable
- Previous/Next buttons work
- Remember current scene

### Milestone 3: Functional GM Tool (1 week)
- Navigation complete
- Time tracking working
- Initiative tracker functional
- Can actually run a session

### Milestone 4: Production Ready (4 weeks)
- All features implemented
- Tested with real gameplay
- Polished and fast
- Ready for 3-day marathon

---

## 📝 Notes

### What's Working Right Now
- ✅ App loads and displays
- ✅ UI looks beautiful
- ✅ Real-time clock ticks
- ✅ All components render
- ✅ Accordions expand/collapse
- ✅ Aspects prominently displayed

### What's Not Working
- ❌ Scene data is hardcoded
- ❌ Navigation buttons don't navigate
- ❌ Can't switch scenes
- ❌ Scene index doesn't reflect all 15 scenes
- ❌ Initiative tracker is static
- ❌ Dice roller doesn't roll

### Blockers
**None!** All systems are go. Just need to implement features.

---

## 🚀 Quick Start Next Session

```bash
# Start dev server
cd gm-tool
npm run dev

# Validate data (ensure still valid)
npm run validate

# Open in browser
# http://localhost:5173

# Create scene loader composable
# File: src/composables/useScenes.js

# Test scene loading in browser console:
# const scene = await fetch('/data/scenes/00_01_the_cat_parliament.json').then(r => r.json())
```

---

## 📞 Need Help?

- **Planning Docs:** `FOCUSED_IMPLEMENTATION_PLAN.md`, `PRIORITY_FEATURES.md`
- **Schema Reference:** `SCENE_JSON_SCHEMA.md`
- **Validation:** `npm run validate`
- **Test Data:** All 15 scenes in `public/data/scenes/`

---

**RECOMMENDATION: Start with Scene Data Loading composable. 2 hours of work unlocks everything else.**

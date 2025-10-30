# ✅ Task Completion Tracking System

## Overview

Complete task tracking system that monitors GM progress through scene elements, provides visual feedback, and automatically prompts for scene completion when navigating away.

---

## 🎯 Key Features

### 1. **Scene Task Checklist**
Right sidebar shows all trackable elements in the current scene:
- ☐ Levers & Buttons (GM Guidance)
- ☐ Hidden/Discoverable Aspects
- ☐ Breadcrumbs (plot threads)
- ☐ Potential Outcomes (track which occurred)
- ☐ As Scene Unfolds events (track which triggered)
- ☐ NPCs (track which were introduced)

### 2. **Visual Progress Tracking**
- **Mini Progress Bar** - Shows % completion within current scene
- **Task Counter** - "5/12" completed display
- **Color Feedback** - Checked tasks turn green
- **Adventure Progress Bar** - Fills up as scenes are completed

### 3. **Scene Completion**
- **"Mark Scene Complete" Button** - Manually mark entire scene done
- **"Complete All Tasks" Button** - Check all boxes at once
- **Auto-Completion Prompt** - Asks GM when navigating away from incomplete scene
- **Scene Indicators** - ✓ marks show in scene index sidebar

### 4. **Smart Navigation Prompts**
When GM tries to navigate away from an incomplete scene:
```
⚠️ This scene has incomplete tasks.

Would you like to mark "The Harbour Heist" as complete 
before moving on?

[OK] [Cancel]
```

**Prompts trigger on:**
- Next Scene button click
- Previous Scene button click  
- Clicking a different scene in sidebar

---

## 📊 Task Categories

### What Gets Tracked

**GM Guidance Elements:**
- Levers & Buttons (mechanical hooks for players)
- Hidden Aspects (discoverable during play)
- Breadcrumbs (future plot threads)

**Scene Outcomes:**
- Success outcome
- Success with Cost outcome
- Failure outcome

**Dynamic Events:**
- "As Scene Unfolds" triggers

**NPC Introductions:**
- Each NPC counts as one task

### What Doesn't Get Tracked
- Read-aloud text (always shown)
- Situation aspects (always visible)
- GM notes (reference only)
- Zone descriptions (environmental)

---

## 🎨 UI Components

### Task Panel (Right Sidebar)

```
┌─────────────────────────────────┐
│ Scene Tasks              5/12   │
│ ████████░░░░░░░░░░░ 42%         │
├─────────────────────────────────┤
│ ☑ Lever/Button                  │
│   Calm the Floor: Overcome...   │
│                                 │
│ ☐ Hidden Aspect                 │
│   Buried Agenda Item...         │
│                                 │
│ ☐ Breadcrumb                    │
│   Sappho points to the Dark...  │
├─────────────────────────────────┤
│ [✓ Complete All Tasks]          │
│ [→ Mark Scene Complete]         │
│ [Clear All Checks]              │
└─────────────────────────────────┘
```

### Visual States

**Unchecked Task:**
- White/gray background
- Normal text
- Empty checkbox

**Checked Task:**
- Green background
- Strikethrough text
- Filled checkbox

**Scene Completed:**
- Green button: "✓ Scene Completed"
- ✓ mark in scene index
- Green bar in adventure progress

---

## 🔧 How It Works

### Data Storage

**localStorage Keys:**
- `completedTasks` - Map of sceneId → Set of task IDs
- `completedScenes` - Set of completed scene IDs

**Format:**
```javascript
{
  "00_01_the_cat_parliament": ["lever-0", "hidden-1", "npc-0"],
  "01_01_the_harbour_heist": ["outcome-0", "unfold-2"]
}
```

### Task ID Format
- `lever-{index}` - Levers & Buttons
- `hidden-{index}` - Hidden Aspects
- `breadcrumb-{index}` - Breadcrumbs
- `outcome-{index}` - Potential Outcomes
- `unfold-{index}` - As Scene Unfolds
- `npc-{index}` - NPC introductions

### Progress Calculation

**Per-Scene Progress:**
```javascript
progress = (completedTasks / totalTasks) * 100
```

**Adventure Progress:**
```javascript
progress = (completedScenes / totalScenes) * 100
```

---

## 🎮 GM Workflow

### During a Scene

1. **View Tasks** - Check right sidebar for trackable elements
2. **Tick Off Elements** - Click checkboxes as events occur
3. **Monitor Progress** - Watch mini progress bar fill up
4. **Complete Scene** - Click "Mark Scene Complete" when done

### When Navigating

1. **Click Next/Previous** or **Select Scene**
2. **Confirmation Prompt** appears if current scene incomplete
3. **Choose:**
   - Click "OK" to mark scene complete
   - Click "Cancel" to leave scene incomplete
4. **Navigation Proceeds** regardless of choice

### Reviewing Progress

- **Scene Index** - ✓ marks show completed scenes
- **Adventure Progress Bar** - Green segments show progress
- **Per-Scene Stats** - "5/12" shows task completion

---

## 💡 Usage Tips

### Best Practices

**✅ DO:**
- Check off tasks as they happen in real-time
- Use "Complete All Tasks" for scenes you skipped
- Mark scenes complete when moving to the next
- Review task list before starting a scene

**❌ DON'T:**
- Worry about checking everything perfectly
- Feel obligated to use every element
- Let unchecked tasks stress you out
- Mark scenes complete too early

### Flexible Tracking

The system is **advisory, not mandatory:**
- Incomplete scenes are still playable
- Navigation always works regardless of completion
- Tasks can be checked retroactively
- You can clear all checks if needed

---

## 🔄 Persistence

### Auto-Saving
- Tasks save to localStorage immediately when checked
- Scene completion saves immediately when marked
- No manual save needed
- Persists across browser sessions

### Clearing Progress
- **Per-Scene:** Click "Clear All Checks" button
- **Full Reset:** Browser dev tools → localStorage → clear

---

## 📈 Impact on Progress Bars

### Adventure Progress Bar
- Fills based on **completed scenes** only
- Tasks don't directly affect the main progress bar
- Green segments = completed scenes

### Session Progress Bar
- Time-based, not task-based
- Shows elapsed session time
- Independent of task completion

### Scene Progress (Mini Bar)
- Shows task completion within current scene
- Resets when changing scenes
- Purely informational

---

## 🎯 Benefits for GMs

1. **Never Forget Plot Threads** - Breadcrumbs are tracked
2. **Know What to Introduce** - See all scene elements
3. **Track Outcomes** - Record which outcomes occurred
4. **Measure Pacing** - Visual feedback on progress
5. **Stay Organized** - Checklist reduces cognitive load

---

## 🛠️ Technical Details

### Files Created
- `src/composables/useTaskTracking.js` (195 lines)
- `src/components/SceneTaskPanel.vue` (130 lines)

### Files Modified
- `src/App.vue` - Initialize task tracking
- `src/components/ToolsSidebar.vue` - Show task panel
- `src/components/SceneNavigation.vue` - Add navigation confirmation
- `src/components/SceneIndex.vue` - Add navigation confirmation

### API

**useTaskTracking composable:**
```javascript
const {
  toggleTask,           // Toggle a task's completion
  isTaskCompleted,      // Check if task is done
  getSceneTaskStats,    // Get {completed, total, percent}
  getSceneTasks,        // Get all tasks for a scene
  clearSceneTasks,      // Clear all checks for a scene
  completeAllTasks,     // Mark all tasks complete
  hasIncompleteTasks    // Check if scene has incomplete tasks
} = useTaskTracking(scenes)
```

---

## 🎨 Styling

### Task Item States
```css
.task-item                     /* Default: gray border */
.task-item:has(input:checked)  /* Checked: green background */
.task-item:hover              /* Hover: blue border */
```

### Progress Bar
- Gradient: success-600 → success-500
- Height: 8px
- Animation: smooth transitions
- Border radius: full

---

## 📊 Statistics

**Task Types Available:**
- ~6-8 tasks per scene (average)
- ~80+ total trackable tasks in adventure
- 6 different task categories

**Storage:**
- ~2-5KB per complete playthrough
- Efficient Set-based storage
- JSON serialization

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Task notes/comments
- [ ] Task timestamps
- [ ] Export task completion report
- [ ] Task suggestions based on scene type
- [ ] Bulk scene completion
- [ ] Task priorities/importance levels

### Potential Improvements
- Custom task categories
- Task dependencies
- Completion analytics
- Session replay from task data
- Share task lists between GMs

---

## ✅ Completion Criteria

**Scene is "Complete" when:**
- GM clicks "Mark Scene Complete" button, OR
- GM confirms completion in navigation prompt

**Scene Progress shows 100% when:**
- All trackable tasks are checked

**Adventure Progress increases when:**
- A scene is marked complete (not just tasks)

---

**Status:** ✅ **COMPLETE & TESTED**

The task tracking system provides GMs with comprehensive progress monitoring while maintaining flexibility and ease of use. Tasks are tracked automatically, prompts are helpful but not intrusive, and visual feedback keeps GMs informed throughout the adventure.

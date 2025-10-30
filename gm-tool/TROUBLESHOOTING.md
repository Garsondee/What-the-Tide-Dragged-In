# 🔧 Troubleshooting Guide

## Task Boxes Not Showing

### Quick Checklist

1. **Hard Refresh Browser**
   - Windows/Linux: `Ctrl + F5` or `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
   - This clears cached JavaScript

2. **Check Browser Console**
   - Press `F12` to open DevTools
   - Click "Console" tab
   - Look for:
     ```
     SceneTaskPanel: Found tasks 17 [...]
     SceneTaskPanel: Stats {completed: 0, total: 17, percent: 0}
     ```
   - If you see errors, that's the issue!

3. **Verify Right Sidebar is Visible**
   - The task panel should be in the **right sidebar**
   - It replaces the old "Initiative Tracker" placeholder
   - Should show "Scene Tasks" header

4. **Check Scene Data**
   - Tasks are generated from scene JSON fields
   - Required fields: `gmGuidance`, `potentialOutcomes`, `npcs`, `asSceneUnfolds`
   - "The Cat Parliament" has 17+ trackable tasks

### Debug Steps

**If no tasks appear:**

1. Open browser console (F12)
2. Look for debug logs:
   ```
   SceneTaskPanel: Found tasks 0 []
   ```
3. This means the scene data isn't loading properly

**If console shows errors:**
- Check for missing imports
- Verify `taskTracking` is injected
- Make sure `useTaskTracking` composable is initialized in `App.vue`

**If right sidebar is missing:**
- Check that `ToolsSidebar.vue` is rendering
- Verify `SceneTaskPanel` component is imported correctly

### Expected Behavior

**"The Cat Parliament" should show 17 tasks:**
- 4x Levers & Buttons
- 3x Hidden Aspects
- 3x Breadcrumbs
- 3x Potential Outcomes
- 3x As Scene Unfolds
- 1x NPC (Sappho)

---

## Scene Completion Dialog Issues

### ✅ **FIXED!**

The native `confirm()` dialog has been replaced with a **custom modal** featuring:

### New Dialog Design

```
┌─────────────────────────────────────┐
│           📋                        │
│                                     │
│  Scene Has Incomplete Tasks         │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ The Cat Parliament            ║  │
│  ║ 5/17 tasks completed          ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  Would you like to mark this scene  │
│  as complete before moving on?      │
│                                     │
│  [✓ Complete Scene and Continue]    │
│  [→ Continue Without Completing]    │
│  [Cancel Navigation]                │
│                                     │
└─────────────────────────────────────┘
```

### Three Clear Actions

1. **✓ Complete Scene and Continue** (Green)
   - Marks scene as complete
   - Proceeds to next scene
   - Fills adventure progress bar

2. **→ Continue Without Completing** (Gray)
   - Leaves scene incomplete
   - Proceeds to next scene
   - Does NOT mark scene complete

3. **Cancel Navigation** (Text link)
   - Stays on current scene
   - No changes made
   - Allows you to finish tasks

### No More Confusion!

**Old dialog:**
```
This scene has incomplete tasks.
Would you like to mark...

[OK] [Cancel]  ← Unclear!
```

**New dialog:**
```
[✓ Complete Scene and Continue]     ← Clear!
[→ Continue Without Completing]     ← Clear!
[Cancel Navigation]                 ← Clear!
```

---

## Common Issues

### "Tasks show 0/0"

**Cause:** Scene data not loaded yet

**Fix:** Wait for scene to fully load, or check scene JSON structure

### "Modal doesn't appear"

**Cause:** Scene already marked complete

**Fix:** Only appears for incomplete scenes with tasks

### "Can't navigate away"

**Cause:** Clicked "Cancel Navigation" in modal

**Fix:** Click the green or gray button to proceed

### "Checkboxes don't work"

**Cause:** `taskTracking` not initialized

**Fix:** Check browser console for errors, verify imports

---

## Verification Commands

### Check Task Tracking (Browser Console)

```javascript
// See completed tasks
localStorage.getItem('completedTasks')

// See completed scenes
localStorage.getItem('completedScenes')

// Clear all progress
localStorage.clear()
location.reload()
```

### Manual Debugging

```javascript
// Check if composables are loaded
window.__scenes
window.__hyperlinks
window.__taskTracking  // Should exist
```

---

## Known Limitations

### Current Features
- ✅ Task checkboxes
- ✅ Scene completion tracking
- ✅ Navigation prompts
- ✅ Progress bars
- ✅ localStorage persistence

### Not Yet Implemented
- ⏳ Task notes/timestamps
- ⏳ Task history/undo
- ⏳ Export progress reports
- ⏳ Multi-user sync

---

## Need More Help?

### Files to Check
1. `src/components/SceneTaskPanel.vue` - Task UI
2. `src/composables/useTaskTracking.js` - Task logic
3. `src/components/ToolsSidebar.vue` - Sidebar container
4. `src/App.vue` - Initialization

### Console Commands
```javascript
// Force refresh task panel
location.reload()

// Check current scene
scenes.currentScene.value

// Check tasks
taskTracking.getSceneTasks(scenes.currentScene.value)
```

---

**Last Updated:** After implementing custom completion modal

**Status:** 
- ✅ Dialog UX fixed
- 🔍 Task boxes debugging in progress

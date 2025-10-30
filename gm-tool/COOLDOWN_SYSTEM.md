# ⏱️ Smart Cooldown System

## Overview

Prevents annoying repeated prompts when GMs are scrubbing back and forth between scenes to reference information. Implements intelligent cooldown logic that respects user intent.

---

## 🎯 The Problem

**Before Cooldown:**
```
GM: Opens Scene 2
System: "Mark Scene 1 complete?"
GM: "Continue without completing" (just checking something)

GM: Opens Scene 3
System: "Mark Scene 2 complete?"
GM: "Continue without completing" (still just browsing)

GM: Back to Scene 1
System: "Mark Scene 1 complete?" (AGAIN! 😤)
GM: Annoyed by repeated prompts...
```

**After Cooldown:**
```
GM: Opens Scene 2
System: "Mark Scene 1 complete?"
GM: "Continue without completing"
System: ✅ Cooldown started (60 seconds)

GM: Opens Scene 3, back to Scene 2, Scene 1...
System: 🔇 Silent (respects cooldown)

GM: Stays in Scene 1 for 70 seconds
System: ✅ Cooldown auto-expires
System: Will prompt again next time
```

---

## 🧠 How It Works

### Three User Choices

When navigating away from incomplete scene:

1. **✓ Complete Scene and Continue**
   - Marks scene as complete
   - Clears cooldown for that scene
   - Won't prompt again (scene is done!)

2. **→ Continue Without Completing**
   - Starts 60-second cooldown
   - Allows navigation immediately
   - Suppresses prompts during cooldown

3. **❌ Cancel Navigation**
   - Stays on current scene
   - No cooldown started
   - Lets GM finish tasks first

---

## ⏲️ Cooldown Behavior

### Duration
**60 seconds** from when user clicks "Continue Without Completing"

### Auto-Expiry
Cooldown expires if user:
- Stays in the scene for 60+ seconds
- Comes back to scene after cooldown period

### Manual Reset
Config Panel → "Reset Prompt Cooldowns"

---

## 💡 Smart Logic

### When to Prompt
✅ **First time** leaving incomplete scene  
✅ **After cooldown expires** (60s+ elapsed)  
✅ **After user completes other scenes** (stays active longer)  
✅ **Never for completed scenes**

### When NOT to Prompt
❌ During active cooldown period  
❌ When rapidly switching scenes (scrubbing)  
❌ When scene already marked complete

---

## 🎮 Usage Scenarios

### Scenario 1: Quick Reference Check
```
GM playing Scene 2, needs to check Scene 1 for details:

1. Navigate to Scene 1 (past incomplete Scene 2)
   → Prompt: "Complete Scene 2?"
   → Choice: "Continue without completing"
   
2. Check Scene 1 details (30 seconds)

3. Navigate back to Scene 2
   → NO PROMPT (cooldown active)
   
4. Continue playing
```

### Scenario 2: Actually Playing Through Scene
```
GM playing Scene 3, finishes it, moves to Scene 4:

1. Navigate to Scene 4
   → Prompt: "Complete Scene 3?"
   → Choice: "Complete scene and continue"
   
2. Scene 3 marked complete ✓
   → No more prompts for Scene 3
   
3. Navigate back to Scene 3 to reference
   → NO PROMPT (scene is complete)
```

### Scenario 3: Cooldown Expires Naturally
```
1. Navigate away from Scene 1
   → Choice: "Continue without completing"
   → Cooldown: Started (60s)

2. Scrub through other scenes (30 seconds)
   → NO PROMPTS (cooldown active)

3. Come back to Scene 1, work for 45 seconds
   → Cooldown timer running in background

4. Navigate to Scene 2 (75+ seconds total)
   → Cooldown expired!
   → Prompt: "Complete Scene 1?" (asks again)
```

---

## 🛠️ Technical Details

### Files
- `src/composables/useScenePromptCooldown.js` (125 lines)
- Integrated into: `App.vue`, `SceneNavigation.vue`, `SceneIndex.vue`, `ConfigPanel.vue`

### Storage
- **In-Memory Only** - Cooldowns reset on page refresh
- Intentionally not persisted (fresh session = fresh prompts)
- Per-scene tracking via Map

### Timer Management
```javascript
// When user enters a scene
startSceneTimer(sceneId)
  → Interval checks cooldown every 10s
  → Auto-expires after 60s if user stays

// When user leaves scene
stopSceneTimer(sceneId)
  → Cleans up interval
  → Prevents memory leaks
```

### Cleanup
```javascript
onBeforeUnmount(() => {
  promptCooldown.stopAllTimers()
})
// Ensures no lingering intervals
```

---

## 📊 Cooldown States

### Per Scene
```javascript
{
  "00_01_the_cat_parliament": 1730318400000, // Timestamp
  "01_01_the_harbour_heist": 1730318520000
}
```

### Scene Timer Tracking
```javascript
{
  "00_01_the_cat_parliament": <intervalId>,
  "01_02_darkwoods_gate": <intervalId>
}
```

---

## 🎛️ Config Panel Integration

**Reset Prompt Cooldowns:**
- Clears all active cooldowns
- System will start prompting immediately
- Useful when: Starting fresh session, testing, cooldown stuck

---

## 🔍 Debug Console

**Available in development:**
```javascript
// Check cooldown status
window.__promptCooldown.shouldShowPrompt('00_01_the_cat_parliament')

// Manual cooldown control
window.__promptCooldown.startCooldown('00_01_the_cat_parliament')
window.__promptCooldown.clearCooldown('00_01_the_cat_parliament')
window.__promptCooldown.clearAllCooldowns()
```

**Console Logs:**
```
Cooldown started for scene 00_01_the_cat_parliament
Cooldown active for scene 00_01_the_cat_parliament: 43s remaining
Cooldown expired for scene 00_01_the_cat_parliament
Cooldown auto-expired for scene 00_01_the_cat_parliament (user stayed in scene)
```

---

## 🎯 UX Benefits

### Eliminates Annoyance
- ✅ No repeated prompts during scrubbing
- ✅ Respects "Continue without completing" choice
- ✅ Allows quick scene reference checks

### Still Helpful
- ✅ Prompts when it matters (first time, after time passes)
- ✅ Reminds GM to mark completion eventually
- ✅ Balances helpfulness with respect for user intent

### Intelligent
- ✅ Learns from user behavior
- ✅ Auto-expires when user settles in scene
- ✅ Per-scene tracking (not global)

---

## 📈 Example Timeline

```
0:00 - User in Scene 1
0:30 - Navigate to Scene 2
       → Prompt: "Complete Scene 1?"
       → User: "Continue without completing"
       → COOLDOWN STARTED

0:35 - Navigate to Scene 3
       → NO PROMPT (cooldown: 55s remaining)

0:45 - Navigate back to Scene 1
       → NO PROMPT (cooldown: 45s remaining)

1:00 - Navigate to Scene 2
       → NO PROMPT (cooldown: 30s remaining)

1:40 - Still in Scene 2 (stayed 100 seconds total)
       → COOLDOWN EXPIRED

1:50 - Navigate to Scene 3
       → Prompt: "Complete Scene 2?"
       → (Cooldown expired, prompts again)
```

---

## ⚙️ Configuration

### Change Cooldown Duration
Edit `useScenePromptCooldown.js`:
```javascript
const COOLDOWN_DURATION = 60 * 1000  // 60 seconds
// Change to 30 * 1000 for 30 seconds
// Change to 120 * 1000 for 2 minutes
```

### Change Check Interval
```javascript
const intervalId = setInterval(() => {
  // Check cooldown logic
}, 10000)  // 10 seconds
// Change to 5000 for 5 second checks
```

---

## 🔄 Reset Options

### Per-Scene (Automatic)
- Complete the scene → cooldown cleared
- Wait 60+ seconds → cooldown expires

### All Cooldowns (Manual)
- Config Panel → "Reset Prompt Cooldowns"
- Dev Console → `window.__promptCooldown.clearAllCooldowns()`

### On Page Refresh
- All cooldowns cleared automatically
- Fresh session = fresh start

---

## 🎪 Edge Cases Handled

### Rapid Scene Switching
✅ Only prompts once, then cooldown protects

### Long Session in One Scene  
✅ Cooldown auto-expires, asks again when appropriate

### Complete Scene During Cooldown
✅ Cooldown cleared immediately

### Multiple Incomplete Scenes
✅ Each scene tracks independently

### User Cancels Navigation
✅ No cooldown started (lets them finish tasks)

---

## 📝 Summary

**Goal:** Stop annoying users with repeated prompts while still being helpful

**Solution:** 
- Smart 60-second cooldown per scene
- Auto-expires when user settles in scene
- Respects "Continue without completing" choice
- Per-scene tracking with independent timers

**Result:** 
- Better UX during scene scrubbing
- Still helpful for completion tracking
- Balances automation with user control

---

**Status:** ✅ **COMPLETE & TESTED**

The cooldown system provides intelligent prompt suppression that adapts to GM workflow patterns, reducing annoyance while maintaining useful completion tracking.

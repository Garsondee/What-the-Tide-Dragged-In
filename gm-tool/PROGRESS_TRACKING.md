# 📊 Progress Tracking System

## Overview

Visual progress tracking system at the top of the GM tool showing:
1. **Adventure Progress** - Overall progress through Acts 1-4
2. **Session Progress** - Time-based tracking for the current playing session

---

## Adventure Progress Bar

### Features
- **Act-by-Act Breakdown** - Shows Acts 1-4 with proportional widths based on scene count
- **Scene Markers** - Individual scenes shown as small bars within each act
- **Completion Tracking** - Green for completed scenes, gray for upcoming
- **Current Position** - Yellow marker shows which scene you're currently viewing
- **Visual Feedback** - Animated fill shows overall completion percentage

### Act Structure (excluding Act 0 Prologue)
- **Act 1:** 3 scenes (The Shattered Stone)
- **Act 2:** 4 scenes (Chaos in Silverfield)
- **Act 3:** 3 scenes (The Rescue and Revelation)
- **Act 4:** 1 scene (Epilogue)

**Total:** 11 main adventure scenes

### Color Coding
- 🟢 **Green** - Completed scenes
- ⬜ **Gray** - Upcoming scenes
- 🟡 **Yellow** - Current scene marker
- 🔵 **Blue gradient** - Overall progress fill

---

## Session Progress Bar

### Features
- **Time-Based Tracking** - Shows progress through the current playing session
- **Auto-Updates** - Clock updates every second
- **Scene Goals** - Displays expected vs completed scenes for the session
- **Time Remaining** - Shows how much session time is left

### Configuration
Currently set to:
- **Session:** Day 1, Session 1
- **Start Time:** 14:00
- **End Time:** 18:00
- **Duration:** 4 hours
- **Expected Scenes:** 3 scenes per session

### Display Elements
- Start time, current time, and end time markers
- Progress bar fills based on elapsed time
- Scenes completed this session
- Time remaining calculation

---

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│ ADVENTURE PROGRESS                               42%        │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ ACT 1  │  ACT 2   │  ACT 3  │ ACT 4 │               │    │
│ │ ━━━    │  ━━━━    │  ━━━    │  ━    │               │    │
│ │    🟡                                                 │    │
│ └──────────────────────────────────────────────────────┘    │
│ 🟡 Current  🟢 Completed  ⬜ Upcoming      5/11 scenes      │
├─────────────────────────────────────────────────────────────┤
│ SESSION PROGRESS                    62%   Day 1, Session 1  │
│ ┌──────────────────────────────────────────────────────┐    │
│ │████████████████████                                  │    │
│ │ 14:00         16:28                          18:00   │    │
│ └──────────────────────────────────────────────────────┘    │
│ 2/3 scenes this session              1h 32m remaining      │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Component
`src/components/ProgressBars.vue`

### Dependencies
- Uses `scenes` composable from inject
- Real-time clock updates via setInterval
- Reactive to scene changes and completions

### Data Sources
- Scene completion: `localStorage` ('completedScenes')
- Current scene: `scenes.currentSceneId`
- Scene index: `/data/scenes-index.json`
- Act summaries: `actSummaries` in scenes-index.json

### Calculations

**Adventure Progress:**
```javascript
progress = (completedScenes / totalMainScenes) * 100
```

**Session Progress:**
```javascript
elapsed = currentMinutes - startMinutes
total = endMinutes - startMinutes
progress = (elapsed / total) * 100
```

---

## Future Enhancements

### Planned Features
- [ ] Configurable session times via UI
- [ ] Multiple sessions per day tracking
- [ ] Session history/log
- [ ] Pacing indicators (ahead/behind schedule)
- [ ] Scene timer integration
- [ ] Break reminders
- [ ] Export session reports

### Potential Improvements
- Click on act to jump to first scene in that act
- Click on scene marker to jump to that scene
- Tooltip on hover showing scene titles
- Session templates (2hr, 3hr, 4hr sessions)
- Milestone celebrations when acts complete

---

## Customization

### Adjust Session Time
Edit in `ProgressBars.vue`:

```javascript
const sessionInfo = ref({
  name: 'Day 1, Session 1',
  startTime: '14:00',  // Change this
  endTime: '18:00',    // Change this
  totalMinutes: 240
})
```

### Change Expected Scenes per Session
```javascript
const sessionSceneCount = ref(3)  // Adjust this number
```

---

## Benefits for GMs

1. **Visual Pacing** - See at a glance if you're on track
2. **Session Planning** - Know how many scenes to aim for
3. **Progress Motivation** - Watch the adventure unfold
4. **Time Management** - Stay aware of session time
5. **Act Awareness** - Understand story structure

---

**Status:** ✅ **COMPLETE & FUNCTIONAL**

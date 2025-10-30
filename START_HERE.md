# HTML GM Tool - Documentation Index

## 🚀 Quick Start

**New to this project?** Read the documents in this order:

1. **[FOCUSED_IMPLEMENTATION_PLAN.md](./FOCUSED_IMPLEMENTATION_PLAN.md)** ⭐ **START HERE**
   - The streamlined plan for your 3-day adventure
   - Focus on essential features only
   - Week-by-week timeline

2. **[PRIORITY_FEATURES.md](./PRIORITY_FEATURES.md)**
   - Detailed specs for your must-have features
   - Navigation system
   - Initiative tracker
   - Advanced time tracking
   - Accordion UI
   - Scene stages

3. **[UI_MOCKUP.md](./UI_MOCKUP.md)**
   - Visual layout mockup
   - CSS implementation
   - Component designs
   - Color scheme

## 📚 Complete Documentation

### Implementation Guides

- **[IMPLEMENTATION_OVERVIEW.md](./IMPLEMENTATION_OVERVIEW.md)**
  - High-level architecture overview
  - Core requirements summary
  - Technology stack

- **[IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md)**
  - Original 7-week development plan
  - All features (including future enhancements)
  - Success criteria

- **[FOCUSED_IMPLEMENTATION_PLAN.md](./FOCUSED_IMPLEMENTATION_PLAN.md)** ⭐
  - **Use this one for your 3-day game**
  - Streamlined 6-week plan
  - Priority features only

### Technical Specifications

- **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)**
  - System architecture diagrams
  - JavaScript class specifications
  - Data flow patterns
  - Storage strategy

- **[JSON_SCHEMAS.md](./JSON_SCHEMAS.md)**
  - Complete JSON structure definitions
  - Character schema
  - Scene schema
  - NPC schema
  - Entity registry

- **[FEATURE_SPECIFICATIONS.md](./FEATURE_SPECIFICATIONS.md)**
  - Detailed feature requirements
  - Implementation examples
  - Code snippets

### UI & Design

- **[UI_MOCKUP.md](./UI_MOCKUP.md)** ⭐
  - Screen layout mockup
  - CSS architecture
  - Component designs
  - Responsive behavior

- **[PRIORITY_FEATURES.md](./PRIORITY_FEATURES.md)** ⭐
  - Your confirmed feature set
  - Initiative tracker
  - Session schedule tracker
  - Accordion system
  - Scene stages

### Data Conversion

- **[CONVERSION_STRATEGY.md](./CONVERSION_STRATEGY.md)**
  - Python scripts to convert markdown → JSON
  - Entity registry builder
  - Validation approach

### Project Overview

- **[README_GM_TOOL.md](./README_GM_TOOL.md)**
  - Complete project documentation
  - Feature showcase
  - Project structure
  - Technology overview

## 🎯 Your Priority Features

Based on your requirements for the 3-day holiday playthrough:

### 1. **Navigation System** (Week 1)
- ⬅️ **Big Previous/Next buttons**
- **Scene index sidebar** (Act-based)
- **Quick jump** to any scene
- Keyboard shortcuts

### 2. **Time Tracking** (Week 2)
- **Top bar** showing current time
- **Hard-coded schedule** for 3-day plan
- **Pacing indicators**: Ahead/On-track/Behind
- Scene duration tracking

### 3. **Accordion UI** (Week 3)
- **Collapsible sections** for all content
- Auto-open essentials (read-aloud, NPCs)
- Manual expand for guidance
- Clean, uncluttered interface

### 4. **Initiative Tracker** (Week 4)
- **Flexible skill-based** initiative
- Add participants with any skill
- Auto-sort by roll value
- Turn advancement

### 5. **Scene Stages** (Week 5)
- **Multi-phase scenes**
- Stage progression UI
- Different content per stage
- Escalation support

### 6. **Character State** (Week 6)
- **Stress tracking** across scenes
- Consequence management
- State persistence
- NPC quick-view cards

## 📅 3-Day Adventure Schedule

Your hard-coded schedule (to be implemented):

```
Day 1 - Afternoon (14:00-18:00)
  ✓ Act 0, Scene 1: The Cat Parliament
  ✓ Act 0, Scene 2: The Dark Woods
  ✓ Act 1, Scene 1: The Harbour Heist
  ✓ Act 1, Scene 2: The Seagulls Descend

Day 2 - Morning (10:00-14:00)
  ✓ Act 1, Scene 3: The Aftermath
  ✓ Act 2, Scene 1: The Squeaky Sabotage
  ✓ Act 2, Scene 2: The Hydrant Havoc

Day 2 - Afternoon (15:00-19:00)
  ✓ Act 2, Scene 3: The Catnip Calamity
  ✓ Act 2, Scene 4: The Shaman's Warning
  ✓ Act 3, Scene 1: Pound Rescue

Day 3 - Finale (10:00-15:00)
  ✓ Act 3, Scene 2: Zoo Rescue
  ✓ Act 3, Scene 3: Shifters Fight
  ✓ Act 4, Scene 1: Epilogue
```

## 🛠️ What You DON'T Need

Based on your feedback:

- ❌ Zone maps (use whiteboard)
- ❌ Player-facing views (physical character sheets)
- ❌ Complex automation (focus on display)
- ❌ Advanced features (add after basic system works)

## 📖 Recommended Reading Order

### For Development
1. FOCUSED_IMPLEMENTATION_PLAN.md
2. UI_MOCKUP.md
3. TECHNICAL_ARCHITECTURE.md
4. CONVERSION_STRATEGY.md

### For Feature Details
1. PRIORITY_FEATURES.md
2. FEATURE_SPECIFICATIONS.md
3. JSON_SCHEMAS.md

### For Big Picture
1. README_GM_TOOL.md
2. IMPLEMENTATION_OVERVIEW.md

## 🎨 Key Design Principles

1. **Progressive Disclosure** - Hide until needed (accordions)
2. **Minimal Friction** - Big buttons, fast navigation
3. **Real-Time Feedback** - Pacing status always visible
4. **Offline First** - No internet required
5. **GM-Focused** - One screen, all information

## ⚡ Quick Reference

### File Locations
```
/Root/                          # Original markdown files
/data/                          # Generated JSON (from conversion)
/gm-tool/                       # HTML application
  /index.html
  /css/
  /js/
  /data/ → ../data
```

### Development Timeline
- Week 1: Navigation
- Week 2: Time tracking
- Week 3: Accordion UI
- Week 4: Initiative tracker
- Week 5: Scene stages
- Week 6: Character state
- Week 7: Polish

### Technology
- HTML5 + CSS3 + Vanilla JS
- No frameworks
- LocalStorage for state
- Offline-capable

## 🚦 Next Steps

1. ✅ Read **FOCUSED_IMPLEMENTATION_PLAN.md**
2. ✅ Review **UI_MOCKUP.md** for visual design
3. ⬜ Run conversion script (CONVERSION_STRATEGY.md)
4. ⬜ Build Week 1: Navigation system
5. ⬜ Build Week 2: Time tracking
6. ⬜ Continue through Week 7

## 💡 Important Notes

- **Sappho and Jewels** use she/her pronouns (both female)
- Focus on **basics first** - polish later
- **3-day schedule is hard-coded** in the system
- Use **physical dice** initially (digital roller is optional)
- Prioritize **speed and clarity** over features

## 📞 Questions?

Refer to the specific documentation file based on your question:

- **"How should the UI look?"** → UI_MOCKUP.md
- **"What features are priority?"** → PRIORITY_FEATURES.md
- **"How do I structure the code?"** → TECHNICAL_ARCHITECTURE.md
- **"What's the timeline?"** → FOCUSED_IMPLEMENTATION_PLAN.md
- **"How do I convert the data?"** → CONVERSION_STRATEGY.md

---

**Last Updated:** 2025-10-30  
**Version:** 1.0 - Focused for 3-Day Playthrough

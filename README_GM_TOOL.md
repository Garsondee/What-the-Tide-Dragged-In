# HTML GM Tool - Project Documentation

This folder contains the complete implementation plan for converting "What the Tide Dragged In" into an interactive HTML-based GM tool.

## 📄 Documentation Files

### 1. [IMPLEMENTATION_OVERVIEW.md](./IMPLEMENTATION_OVERVIEW.md)
**Start here!** High-level summary of the project goals, architecture, and required features.

**Key Sections:**
- Core Requirements (display, interactivity, hyperlinking, persistence)
- Technical Architecture overview
- Data layer, application layer, presentation layer

### 2. [JSON_SCHEMAS.md](./JSON_SCHEMAS.md)
Detailed JSON schema specifications for all data types.

**Covers:**
- Character schema (with state tracking)
- Scene schema (with GM guidance)
- NPC schema (simplified stat blocks)
- Aspect/stunt registry for hyperlinking
- Game state schema
- Consequence recovery rules

### 3. [FEATURE_SPECIFICATIONS.md](./FEATURE_SPECIFICATIONS.md)
Complete feature requirements with implementation details.

**Includes:**
- Wiki-style hyperlinking system
- Character state persistence
- Dice rolling system (with manual override)
- Time tracking system
- Interactive checkboxes and fragment tracker

### 4. [CONVERSION_STRATEGY.md](./CONVERSION_STRATEGY.md)
Step-by-step guide for converting markdown files to JSON.

**Contains:**
- Python conversion script examples
- Parsing logic for characters, NPCs, scenes
- Entity registry builder
- Validation approach

### 5. [IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md)
7-week development roadmap broken into phases.

**Phases:**
1. Data Conversion (Week 1)
2. Frontend Foundation (Week 2)
3. Character State System (Week 3)
4. Wiki Hyperlinking (Week 4)
5. Dice & Time Systems (Week 5)
6. Checklists & Fragment Tracking (Week 6)
7. Polish & Testing (Week 7)

### 6. [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
Deep dive into technical implementation.

**Covers:**
- System architecture diagram
- Core component specifications (ContentLoader, StateManager, HyperlinkEngine)
- Data flow diagrams
- Storage strategy
- Performance considerations

## 🎯 Quick Start Guide

### For Developers

**Phase 1: Convert Data**
```bash
cd "c:/Users/Ingram/Documents/What the Tide Dragged In/Root"
python convert_to_json.py
```

**Phase 2: Set Up Frontend**
```bash
mkdir gm-tool
cd gm-tool
# Copy data/ folder from conversion output
# Create index.html, css/, js/ folders
```

**Phase 3: Build Core Features**
- Implement ContentLoader → load JSON files
- Create StateManager → track character states
- Build HyperlinkEngine → auto-link entities
- Add DiceRoller → Fate dice mechanics
- Implement TimeTracker → scene duration

**Phase 4: Polish**
- Style with minimal CSS
- Add keyboard shortcuts
- Test all features
- Write user documentation

### For Project Managers

**Timeline**: 7 weeks for core functionality
**Technology**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
**Dependencies**: None (runs entirely in browser)
**Output**: Single-page application, offline-first

**Success Criteria:**
- ✅ All 20+ scenes displayable
- ✅ Character state persists across sessions
- ✅ Auto-linking for 50+ entities
- ✅ Dice roller with manual override
- ✅ Fragment tracker (12/12)
- ✅ Export/import session state

## 🔑 Key Features

### 1. Wiki-Style Hyperlinking
Auto-detects character names, scene titles, aspects, and stunts in text and converts them to clickable links.

**Example:**
> "Sappho and Jewels slip away early..."

Becomes:
> "[Sappho](#) and [Jewels](#) slip away early..."

Clicking "Sappho" opens her character sheet. Clicking "Jewels" opens her sheet.

### 2. Character State Persistence
Track stress, consequences, fate points, and temporary aspects. Changes persist across scenes and sessions.

**Example:**
- Mark Sappho's stress box in Scene 1
- Navigate to Scene 5
- Sappho's stress still marked
- Export session → Reload later → State restored

### 3. Dice Rolling with Override
Roll 4dF dice with skill modifiers, compare to DC, get Fate outcomes. GM can manually override results.

**Example:**
```
Roll: + ◯ − +  (total: +0)
Modifier: +3
DC: 2
Final: 3
Outcome: Success (shift +1)
GM Guidance: They succeed cleanly. Move forward.

[Manual Override: Use "Fail" instead ▼]
```

### 4. Time Tracking
Automatically track how long each scene takes. Warn GM when exceeding recommended duration.

**Example:**
```
⏱️ 32:15
Recommended: 20-30 min
⚠️ Scene running long!
```

### 5. Fragment Tracker
Visual checklist for all 12 Speaking Stone fragments.

**Example:**
```
Speaking Stone Fragments (5/12)
☑ #1 Grove Discovery
☑ #2 Exceptional Play
☑ #3 Diplomacy
☐ #4 Investigation
☑ #5 Peacemaking
☑ #6 Witness Memory
☐ #7 Shaman Gift
...
```

## 📊 Project Structure

```
What the Tide Dragged In/
├── Root/                          # Original markdown files
│   ├── Characters/
│   ├── NPCs/
│   ├── Scenes/
│   └── fate_roller.py
│
├── data/                          # Generated JSON files
│   ├── characters/
│   ├── npcs/
│   ├── scenes/
│   ├── entity-registry.json
│   └── game-state.json
│
├── gm-tool/                       # HTML application
│   ├── index.html
│   ├── css/
│   │   ├── styles.css
│   │   ├── character-sheet.css
│   │   └── dice-roller.css
│   ├── js/
│   │   ├── app.js
│   │   ├── content-loader.js
│   │   ├── state-manager.js
│   │   ├── hyperlink-engine.js
│   │   ├── dice-roller.js
│   │   ├── time-tracker.js
│   │   ├── checklist-manager.js
│   │   └── ui-controller.js
│   └── data/ → ../data (symlink)
│
└── [Documentation files - this folder]
```

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage API (with export/import)
- **Data Format**: JSON
- **Conversion**: Python 3.x
- **No backend required** - runs entirely offline

## 📝 Next Steps

1. **Review all documentation files** to understand the full scope
2. **Run the conversion script** (see CONVERSION_STRATEGY.md)
3. **Start with Phase 1** (see IMPLEMENTATION_PHASES.md)
4. **Build incrementally** - each phase adds core functionality
5. **Test thoroughly** - ensure state persistence works correctly

## 🤝 Contributing

When developing:
- Follow the JSON schemas exactly
- Maintain consistency with Fate Core rules
- Keep the UI minimal and functional (GM-focused)
- Test state persistence thoroughly
- Document any deviations from the plan

## ❓ Questions?

Refer to the specific documentation file for detailed information:
- Architecture questions → TECHNICAL_ARCHITECTURE.md
- Feature details → FEATURE_SPECIFICATIONS.md
- Implementation steps → IMPLEMENTATION_PHASES.md
- Data format questions → JSON_SCHEMAS.md

## 📌 Important Notes

### Character Pronouns
- **Sappho**: she/her (piratical Labrador)
- **Jewels**: she/her (spiritual lynx)
- Update these in the converted JSON files

### Consequence Recovery
- **Mild**: Clears after 1 scene
- **Moderate**: Clears after 1 session
- **Severe**: Clears after 1 scenario

### Fragment Collection
- **11 shell fragments** (white/silver)
- **1 jade heart** (green, final piece)
- Heart can only be placed when all 11 shells collected

## 🚀 Vision

The final GM tool will be a **self-contained, offline-first web application** that:
- Loads instantly
- Works without internet
- Persists all state
- Auto-links all entities
- Tracks everything the GM needs
- Provides a smooth, minimal UI
- Requires zero setup after initial load

**Goal**: Make running "What the Tide Dragged In" as smooth as possible for the GM.

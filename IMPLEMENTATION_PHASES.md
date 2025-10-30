# Implementation Phases

## Phase 1: Data Conversion (Week 1)

### Goals
- Convert all markdown to JSON
- Build entity registry
- Validate data integrity

### Tasks
1. **Write conversion script** (`convert_to_json.py`)
   - Parse character markdown files
   - Parse NPC markdown files
   - Parse scene markdown files
   - Build entity registry
   
2. **Run conversion**
   - Execute on all files
   - Review output
   
3. **Manual corrections**
   - Update pronouns (Sappho, Jewels = she/her)
   - Add missing time guidelines
   - Verify DC values in GM guidance
   
4. **Validation**
   - Run validation script
   - Fix any errors
   - Commit to git

### Deliverables
- `/data/characters/*.json` (3 PCs + major NPCs)
- `/data/scenes/*.json` (~20 scenes)
- `/data/entity-registry.json`
- Validation report

## Phase 2: Frontend Foundation (Week 2)

### Goals
- Create basic HTML structure
- Implement JSON loading
- Display content

### Tasks
1. **Create HTML structure**
   ```
   /gm-tool/
     index.html
     /css/
       styles.css
     /js/
       app.js
       content-loader.js
       state-manager.js
     /data/ (symlink or copy from conversion)
   ```

2. **Implement ContentLoader**
   - Load JSON files via fetch
   - Parse and cache data
   - Handle loading errors
   
3. **Create basic UI**
   - Navigation sidebar (Acts → Scenes)
   - Main content area
   - Character sheet sidebar
   
4. **Display scenes**
   - Render scene title, central question
   - Display read-aloud text
   - Show situation aspects
   - List NPCs

### Deliverables
- Working HTML page that displays scenes
- Basic navigation between scenes
- Character sheets visible in sidebar

## Phase 3: Character State System (Week 3)

### Goals
- Implement stress/consequence tracking
- Enable state persistence
- Add recovery mechanics

### Tasks
1. **Build StateManager class**
   - Load character states
   - Save to localStorage
   - Export/import functionality
   
2. **Create character sheet UI**
   - Stress checkboxes
   - Consequence input fields
   - Fate point tracker
   - Skill/stunt display
   
3. **Wire up interactions**
   - Click checkbox → update state
   - Add consequence → track recovery
   - Spend fate point → decrement counter
   
4. **Implement recovery**
   - Scene end hook
   - Decrement recovery counters
   - Clear recovered consequences
   - Show notifications

### Deliverables
- Fully functional character sheets
- State persists across page reload
- Recovery system working

## Phase 4: Wiki Hyperlinking (Week 4)

### Goals
- Auto-detect entity names
- Convert to clickable links
- Handle edge cases

### Tasks
1. **Build HyperlinkEngine**
   - Load entity registry
   - Create regex patterns
   - Process text nodes
   
2. **Implement link detection**
   - Scan displayed content
   - Match entity names
   - Replace with `<a>` tags
   
3. **Handle edge cases**
   - Partial matches
   - Possessives
   - Plurals
   - Already-linked text
   
4. **Link click behavior**
   - Character links → open sheet
   - Scene links → navigate
   - Aspect/stunt links → tooltip

### Deliverables
- Auto-linking working in all content
- Tooltips for aspects/stunts
- Smooth navigation via links

## Phase 5: Dice & Time Systems (Week 5)

### Goals
- Implement Fate dice roller
- Add time tracking
- Manual roll override

### Tasks
1. **Build FateDiceRoller**
   - 4dF rolling logic
   - DC comparison
   - Outcome calculation
   - GM guidance display
   
2. **Create roller UI**
   - Input fields (modifier, DC)
   - Roll button
   - Result display
   - Manual override controls
   
3. **Build TimeTracker**
   - Scene timer
   - Elapsed time display
   - Warning notifications
   - Session summary
   
4. **Integrate with scenes**
   - Auto-start timer on scene load
   - Show recommended time
   - Log times to session state

### Deliverables
- Working dice roller with outcomes
- Manual override functional
- Time tracking for all scenes

## Phase 6: Checklists & Fragment Tracking (Week 6)

### Goals
- Scene completion tracking
- Fragment collection UI
- Breadcrumb/clue tracking

### Tasks
1. **Build ChecklistManager**
   - Generic checkbox system
   - State persistence
   - List types (fragments, scenes, clues)
   
2. **Create fragment tracker UI**
   - 11 shell fragments + 1 heart
   - Visual progress indicator
   - Descriptions of each fragment
   
3. **Scene completion checklist**
   - Mark scenes complete
   - Track breadcrumbs discovered
   - Show progress through acts
   
4. **Session tracking**
   - Export session state
   - Import previous sessions
   - Session notes

### Deliverables
- Fragment tracker working
- Scene completion tracked
- Session export/import

## Phase 7: Polish & Testing (Week 7)

### Goals
- Improve UX
- Fix bugs
- Add quality of life features

### Tasks
1. **UI improvements**
   - Better styling (minimal but clean)
   - Keyboard shortcuts
   - Print-friendly mode
   
2. **Bug fixes**
   - Test all features
   - Fix edge cases
   - Ensure data consistency
   
3. **QOL features**
   - Search functionality
   - Quick reference panel
   - GM notes per scene
   
4. **Documentation**
   - User guide
   - Keyboard shortcuts reference
   - Troubleshooting guide

### Deliverables
- Polished, stable GM tool
- User documentation
- Bug-free experience

## Phase 8: Advanced Features (Optional)

### Future Enhancements
- **Multi-device sync**: Use a simple backend or cloud storage
- **Roll history**: Log all rolls for session review
- **NPC quick reference**: Floating panel with active NPCs
- **Aspect card generator**: Print aspect cards for table
- **Audio integration**: Background music/ambiance triggers
- **Campaign mode**: Track multiple campaigns/sessions
- **Mobile view**: Responsive design for tablets

## Technology Stack

### Core Technologies
- **HTML5**: Structure
- **CSS3**: Styling (CSS Grid, Flexbox)
- **Vanilla JavaScript (ES6+)**: Logic, no frameworks needed
- **LocalStorage API**: State persistence
- **File System Access API** (optional): Save/load session files

### Optional Enhancements
- **Electron**: Package as desktop app
- **Service Worker**: Offline support
- **IndexedDB**: More robust storage than localStorage
- **Web Components**: Reusable UI components

## File Structure

```
gm-tool/
├── index.html                  # Main HTML file
├── css/
│   ├── styles.css             # Main styles
│   ├── character-sheet.css    # Character sheet specific
│   └── dice-roller.css        # Dice roller specific
├── js/
│   ├── app.js                 # Main app initialization
│   ├── content-loader.js      # Load JSON data
│   ├── state-manager.js       # Character state persistence
│   ├── hyperlink-engine.js    # Wiki-style linking
│   ├── dice-roller.js         # Fate dice logic
│   ├── time-tracker.js        # Scene timing
│   ├── checklist-manager.js   # Fragment/scene tracking
│   └── ui-controller.js       # Coordinate UI updates
├── data/
│   ├── characters/            # Character JSON files
│   ├── npcs/                  # NPC JSON files (scene-specific in subfolders)
│   ├── scenes/                # Scene JSON files
│   ├── lore/                  # Setting/lore JSON files
│   ├── entity-registry.json   # For hyperlinking
│   └── game-state.json        # Current session state
└── docs/
    ├── user-guide.md
    └── keyboard-shortcuts.md
```

## Estimated Timeline

- **Phase 1**: 1 week (conversion)
- **Phase 2**: 1 week (foundation)
- **Phase 3**: 1 week (character state)
- **Phase 4**: 1 week (hyperlinking)
- **Phase 5**: 1 week (dice & time)
- **Phase 6**: 1 week (checklists)
- **Phase 7**: 1 week (polish)

**Total**: 7 weeks for core functionality

## Success Criteria

The GM tool is ready when:
- ✅ All scenes display correctly with full content
- ✅ Character sheets track stress, consequences, fate points
- ✅ State persists across sessions
- ✅ Entity names auto-link to relevant content
- ✅ Dice roller works with manual override
- ✅ Time tracking warns for long scenes
- ✅ Fragment collection tracked to 12/12
- ✅ Scene completion marked
- ✅ Export/import session state works
- ✅ No critical bugs
- ✅ Runs locally without internet (offline-first)

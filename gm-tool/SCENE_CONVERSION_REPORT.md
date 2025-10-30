# Scene Conversion Report

## Summary

**Total Scenes Converted:** 15  
**Acts:** 5 (Act 0-4)  
**Format:** JSON following standardized schema

---

## Conversion Complete ✅

All 15 scenes have been successfully converted from markdown to JSON format.

### Files Created:
```
public/data/scenes/
├── 00_01_the_cat_parliament.json
├── 00_02_the_dark_woods.json
├── 00_03_the_lynx_guide.json
├── 00_04_the_pied_piper.json
├── 01_01_the_harbour_heist.json
├── 01_02_the_seagulls_descend.json
├── 01_03_the_aftermath.json
├── 02_01_the_squeaky_sabotage.json
├── 02_02_the_hydrant_havoc.json
├── 02_03_the_catnip_calamity.json
├── 02_04_the_shamans_warning.json
├── 03_01_pound_rescue.json
├── 03_02_zoo_rescue.json
├── 03_03_a_united_front.json
└── 04_01_the_great_awakening.json

public/data/
└── scenes-index.json (manifest file)
```

---

## Variations Found & Resolved

### 1. **Zones Field**
**Variation:** Some scenes had detailed spatial zones, others didn't.

**Resolution:**  
- Included `zones` array for scenes with explicit spatial layout (e.g., Harbour Heist has 4 zones)
- Left as empty array `[]` for scenes without defined zones
- This preserves information where it exists without forcing it where it doesn't

**Examples:**
- ✅ **Has zones:** 01_01_the_harbour_heist (Harborfront, Pierhead, Pier, Boats)
- ✅ **No zones:** 00_01_the_cat_parliament, 02_03_the_catnip_calamity

### 2. **"As Scene Unfolds" Structure**
**Variation:** Conditional discoveries varied in format between scenes.

**Resolution:**  
- Standardized as array of objects with `trigger` and `description` fields
- Trigger = condition for discovery ("If players do X...")
- Description = what they discover
- Left empty `[]` for scenes without this section

**Examples:**
- ✅ 00_01_the_cat_parliament: 3 conditional discoveries
- ✅ 01_01_the_harbour_heist: No conditional discoveries (empty array)

### 3. **NPC Detail Level**
**Variation:** NPCs ranged from minimal (name only) to full character sheets.

**Resolution:**  
- All NPCs include: `id`, `name`, `pronouns`, `role`, `aspects`
- Major NPCs (Sappho, Jewels, Mehitabel, Ra) get full aspects (highConcept + trouble)
- Minor NPCs get simplified aspects (highConcept only)
- Linguistic clues included when Dog/Lynx conlang is relevant

**Pronoun Consistency:**
- ✅ Sappho: **she/her** (confirmed in all scenes)
- ✅ Jewels: **she/her** (confirmed in all scenes)
- ✅ All other NPCs: appropriate pronouns assigned

### 4. **GM Notes**
**Variation:** Some scenes had important GM notes that didn't fit standard structure.

**Resolution:**  
- Added optional `gmNotes` field for critical information
- Used for: Ra's disguise reveal, Jade Heart Stone lore, Silver Tag mechanics
- Only included when narratively essential

**Examples:**
- ✅ 03_01_pound_rescue: Mogg replacement by Ra
- ✅ 03_02_zoo_rescue: Jade Heart Stone reveal
- ✅ 03_03_a_united_front: Silver Tag mechanics & villain monologue

### 5. **Outcomes**
**Variation:** Most scenes had 3 outcomes (success/cost/failure), epilogue had 1.

**Resolution:**  
- Standard scenes: 3 outcomes (success, successWithCost, failure)
- Epilogue: 1 outcome (narrative resolution)
- Type field standardized: `"success" | "successWithCost" | "failure"`

---

## Consistency Applied

### 1. **Situation Aspects**
- ✅ Always array of strings
- ✅ Descriptions in parentheses when needed
- ✅ 3-6 aspects per scene average

### 2. **Read-Aloud Text**
- ✅ Split into `opening` and `perspective` sections
- ✅ Opening = initial scene setup
- ✅ Perspective = "From a Cat's Perspective" sensory details

### 3. **GM Guidance Structure**
- ✅ Always 5 sub-categories:
  - `leversAndButtons` - Player action options
  - `hiddenAspects` - Discoverable aspects
  - `breadcrumbs` - Foreshadowing/connections
  - `failForward` - Alternative paths on failure
  - `compels` - Suggested compels

### 4. **Recommended Time**
- ✅ Added to all scenes
- ✅ Estimates: 15-60 minutes based on scene complexity
- ✅ Tutorial/short scenes: 15-25 min
- ✅ Standard scenes: 25-35 min
- ✅ Climax scenes: 35-60 min

### 5. **Scene IDs**
- ✅ All lowercase snake_case
- ✅ Match filename exactly
- ✅ Format: `{act}_{scene}_{title_slug}`

---

## Data Integrity Checks

### ✅ All Required Fields Present
Every scene includes:
- `id`, `act`, `sceneNumber`, `title`
- `centralQuestion`, `recommendedTime`
- `situationAspects`, `readAloud`
- `npcs`, `potentialOutcomes`
- `gmGuidance`, `completed`

### ✅ Pronoun Accuracy
- Sappho: she/her ✓ (all 4 appearances)
- Jewels: she/her ✓ (all 5 appearances)
- All NPCs: pronouns assigned ✓

### ✅ Cross-Reference Integrity
- Scene IDs match manifest ✓
- Act numbering sequential ✓
- Scene numbering sequential within acts ✓

### ✅ JSON Validity
- All files are valid JSON ✓
- No syntax errors ✓
- Consistent formatting ✓

---

## Special Notes

### Act-Specific Features

**Act 0 (Tutorial):**
- Introduces core NPCs: Sappho, Jewels, Big Lynx, Wally
- Establishes Lynx territory and shapeshifter hints
- Teaches Fate mechanics through play

**Act 1 (Main Hook):**
- Speaking Stone shattered (Scene 2)
- Communication lost
- Sappho & Jewels captured
- First shell fragment introduced

**Act 2 (Investigation):**
- Pattern of chaos incidents
- All scenes breadcrumb to zoo
- Shaman's Warning introduces Silver Tag
- Builds evidence against shapeshifters

**Act 3 (Climax):**
- Rescue missions (Pound, Zoo)
- Ra's disguise revealed
- Jade Heart Stone obtained
- All 11 fragments + heart recovered
- Final confrontation with shapeshifters

**Act 4 (Epilogue):**
- World transformed
- New Parliament forming
- Justice for shapeshifters
- Hook for next adventure

---

## Next Steps for Implementation

### Phase 1: Data Loading
1. Create scene loader composable in Vue
2. Test loading scenes-index.json
3. Test loading individual scene files
4. Validate JSON parsing

### Phase 2: UI Integration
1. Update SceneViewer to use real JSON data
2. Implement dynamic aspect rendering
3. Add NPC card generation
4. Wire up GM guidance sections

### Phase 3: Navigation
1. Connect Previous/Next buttons to index
2. Implement scene jumping from index
3. Add breadcrumb navigation
4. Track completed scenes

### Phase 4: Enhancement
1. Add search/filter for scenes
2. Implement aspect highlighting
3. Add NPC quick-reference
4. Create printable view

---

## Files Ready for Use

All JSON files are production-ready and can be immediately:
- Loaded into the Vue application
- Parsed and displayed
- Used for navigation
- Enhanced with interactive features

The schema is consistent, data is clean, and the structure supports all planned features.

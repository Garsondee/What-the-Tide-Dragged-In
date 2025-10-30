# PLAYTEST PROTOCOL
## AI-Driven Scenario Quality Assurance

---

## PURPOSE

This document controls **AI Playtest Mode**, where an AI acts as both GM and players to execute the adventure using ONLY the provided scenario materials. The goal is to identify gaps, errors, and missing information that would prevent a human GM from running the adventure successfully.

### Critical Directive

**FATAL ERROR MODE**: If the AI encounters missing information that prevents proper scene execution, it must IMMEDIATELY halt play and report:

```
🚨 FATAL ERROR - SCENARIO INCOMPLETE 🚨
Scene: [Scene ID]
Issue: [Specific missing information]
Impact: [How this blocks gameplay]
Required: [What needs to be added]
```

Do NOT improvise or fill gaps. The purpose is to find what's missing.

---

## REQUIRED FILES MAP

### Tier 1: Core Adventure Framework
**Without these, the adventure cannot be understood:**
- ✅ `Root/Adventure.md` - Overview, hook, opposition
- ✅ `Root/GM_Guide_Mastering_the_Meow.md` - System guidance and tone
- ✅ `Root/Lore/Adventure_Timeline.md` - Canonical event sequence
- ✅ `Root/Lore/Silverfield_Setting.md` - World context

### Tier 2: Scene Execution Files
**Required to run specific scenes:**
- ✅ `Root/Scenes/Act[N]/[SceneID].md` - Scene description, aspects, guidance
- ✅ `Root/Scenes/Act[N]/[SceneID]_Characters/[NPC].md` - Scene-specific NPCs
- ✅ `Root/NPCs/[NPC].md` - Major NPC stat blocks

### Tier 3: Player Resources
**Required to represent player capabilities:**
- ✅ `Root/Test_PCs/*.md` - Test character sheets with skills, stunts, stress
- ✅ `Root/Players/*.md` - Player archetypes (optional reference)

### Tier 4: Tracking & Tools
**Required for mechanical execution:**
- ✅ `Root/fate_roller.py` - Dice rolling and progress tracking
- ✅ `Root/SPEAKING_STONE_FRAGMENT_TRACKER.md` - Fragment collection system
- ⚠️ Any scene-specific tracking documents

---

## PLAYTEST EXECUTION PROTOCOL

### Player Role: Active Testing & Probing

**CRITICAL**: Players are not passive participants. They are **quality assurance testers** whose job is to:

#### Ask Clarifying Questions
Players should constantly question unclear elements:
- **"Wait, why would my cat know this?"** (Tests if information delivery makes sense)
- **"How far away is that? Can I see it from here?"** (Tests spatial clarity)
- **"What does my character actually see/hear/smell?"** (Tests sensory description completeness)
- **"Why can't we just [obvious alternative]?"** (Tests for logical gaps)
- **"What's stopping us from [sequence break]?"** (Tests scenario guardrails)

#### Make Comments About Confusion
Players should vocalize when something doesn't make sense:
- **"I'm confused - I thought we could understand dogs?"** (Flags unclear transitions)
- **"Wait, didn't the scene say [X] but now you're saying [Y]?"** (Catches contradictions)
- **"I don't understand what I'm supposed to do here."** (Identifies unclear objectives)
- **"This feels railroaded - do we have any real choices?"** (Tests player agency)

#### Challenge the GM's Information
Players should push back when the GM makes unsupported claims:
- **"The scene notes don't mention that. Where did you get that info?"** (Ensures GM fidelity to materials)
- **"Is that written somewhere or are you making it up?"** (Catches improvisation)
- **"Can you show me which aspect or stat allows that?"** (Tests mechanical support)

#### Propose Unconventional Solutions
Players should deliberately test scenario flexibility:
- **"What if we split the party?"**
- **"Can I use [Skill X] instead of the obvious [Skill Y]?"**
- **"I want to negotiate with the antagonists."**
- **"We're just going to run away."**

#### Roleplay Player Archetypes
Each test player embodies a specific testing focus (see `Root/Players/` for full profiles):

**Whisker (Alex "The Logical Detective"):**
- Questions plot logic constantly
- Notices inconsistencies
- Asks "Does this make sense?" and "Why hasn't anyone done this before?"

**Cinder (Morgan "The Improviser"):**
- Attempts creative/unusual solutions
- Tests sequence-breaking
- Asks "Can I try this crazy idea?"

**Silk (Riley "The Empath"):**
- Questions NPC motivations
- Asks about emotional consequences
- Asks "How does everyone feel about this?"

**Driftwood (Jordan "The Lore Keeper"):**
- Challenges worldbuilding consistency
- References previous lore
- Asks "How does this fit with what we established?"

**If a player question cannot be answered from scenario materials → FATAL ERROR or Minor Issue depending on severity.**

---

### Phase 1: Pre-Flight Check

Before starting ANY scene:

1. **Verify Scene File Exists**
   ```
   Required: Root/Scenes/Act[N]/[SceneID].md
   ```

2. **Check Scene Completeness**
   - [ ] Central Question defined
   - [ ] Situation Aspects listed
   - [ ] Zones/Spatial Layout provided
   - [ ] Key NPCs identified
   - [ ] Potential Outcomes specified
   - [ ] GM Guidance section present

3. **Verify NPC Availability**
   For each NPC mentioned:
   - Check if stat block exists in `Root/NPCs/` or scene folder
   - **FATAL ERROR if combat NPC lacks stats**

4. **Check Tool Requirements**
   - Physical props mentioned? (Note for GM)
   - Dice rolling needed? (Verify `fate_roller.py` works)
   - Progress tracking needed? (Know the commands)

### Phase 2: Scene Execution

Run the scene using this loop:

1. **Read Aloud** (if provided)
   - GM uses exact text from "Read-Aloud" section
   - Players ASK QUESTIONS: "What can I see/smell/hear?" "How big is that?" "Where am I exactly?"
   - Note if missing/insufficient

2. **Establish Aspects**
   - GM lists all Situation Aspects
   - Players CHALLENGE: "Can you point to where that aspect is mentioned in the scene?"
   - Track when discovered/created

3. **Play Round**
   - GM presents situation based on scenario materials
   - Players ASK: "What are our options here?" "Why can't we just [alternative]?"
   - Players declare actions (some conventional, some unconventional)
   - Players QUESTION: "Can I use [unusual skill] for this?" "What if I do [creative solution]?"
   - Roll dice using `fate_roller.py`
   - GM narrates outcome using GM Guidance
   - Players COMMENT: "That doesn't match what you said before" or "That makes sense!"

4. **Player Testing During Round**
   - **Whisker (Logic Test)**: "Wait, why hasn't anyone done this before?"
   - **Cinder (Flexibility Test)**: "What if I just attack the seagulls instead of distracting them?"
   - **Silk (Emotion Test)**: "How does Sappho seem? Is she nervous about the mission?"
   - **Driftwood (Lore Test)**: "Didn't we establish that cats can understand dogs? How does that work?"

5. **Error Checking**
   - Missing difficulty rating? → FATAL ERROR
   - Unclear outcome? → FATAL ERROR
   - NPC behavior undefined? → FATAL ERROR
   - **Player question unanswerable from materials? → FATAL ERROR or Minor Issue**

### Phase 3: Post-Scene Report

After each scene, document:

1. **What Worked**
   - Strong mechanical guidance
   - Evocative descriptions
   - Clear player choices

2. **Fatal Errors** (scenario-breaking)
   - Missing stats/difficulties
   - Undefined scene triggers
   - Unclear transitions

3. **Minor Issues** (annoying but workable)
   - Vague guidance
   - Missing flavor details

4. **Inspiration** (emergent moments)
   - Fun PC actions
   - Memorable narration
   - Potential additions

---

## DICE ROLLER & TRACKER USAGE

### Basic Dice Rolling

**Standard Roll:**
```bash
python fate_roller.py -m [MODIFIER]
```
Example: Roll with +3 skill
```bash
python fate_roller.py -m 3
```
Output: Final total (e.g., `5`)

**Verbose Roll (Shows Details):**
```bash
python fate_roller.py -m [MODIFIER] -v
```
Example: Roll with +4 skill, see dice faces
```bash
python fate_roller.py -m 4 -v
```
Output: 
```
Roll 1: faces=+0-+ base=0 modifier=+4 => total=4
```

**Roll vs Difficulty Class:**
```bash
python fate_roller.py -m [MODIFIER] --dc [DIFFICULTY] -v
```
Example: +3 skill against Fair (+2) difficulty
```bash
python fate_roller.py -m 3 --dc 2 -v
```
Output:
```
Roll 1: faces=0++- base=+1 modifier=+3 => total=4 | DC=2 => shift=2 | outcome=Success
GM: They succeed cleanly. Move forward; highlight competence and progress.
```

**Advantage/Disadvantage:**
```bash
python fate_roller.py -m [MODIFIER] -a  # Advantage (take higher)
python fate_roller.py -m [MODIFIER] -d  # Disadvantage (take lower)
```

**Multiple Rolls:**
```bash
python fate_roller.py -m 3 -n 5  # Roll 5 times with +3 modifier
```

### Progress Tracking

**Create a Progress Track:**
```bash
python fate_roller.py track create [NAME] [BOXES] -d "[DESCRIPTION]"
```
Example: Track tension between factions
```bash
python fate_roller.py track create "Faction Tension" 8 -d "Rising conflict between Sea Dogs and Lynx"
```

**List All Tracks:**
```bash
python fate_roller.py track list
```
Output:
```
=== ACTIVE TRACKS ===

Faction Tension: [-----] 0/8
  > Rising conflict between Sea Dogs and Lynx
```

**Mark Progress (Tick Boxes):**
```bash
python fate_roller.py track tick [NAME]  # Mark 1 box
python fate_roller.py track tick [NAME] -c [COUNT]  # Mark multiple boxes
```
Example:
```bash
python fate_roller.py track tick "Faction Tension" -c 2
```
Output:
```
[OK] Track 'Faction Tension' updated: [##------] 2/8
  (Marked 2 boxes)
```

**Add Boxes (Complications):**
```bash
python fate_roller.py track add [NAME] [BOXES] -r "[REASON]"
```
Example: Situation worsens
```bash
python fate_roller.py track add "Faction Tension" 2 -r "Sabotage incident escalates tensions"
```

**Other Track Commands:**
```bash
python fate_roller.py track rename [OLD] [NEW]  # Rename track
python fate_roller.py track remove [NAME]       # Remove completed track
python fate_roller.py track remove [NAME] --force  # Remove incomplete track
```

---

## COMMON ERROR PATTERNS TO CHECK

### 1. Missing Difficulty Ratings
**Symptom:** Scene says "make an Overcome roll" but doesn't specify DC
**Fix Required:** Add default difficulties or specific DCs to GM Guidance

**Standard Fate Difficulties:**
- Mediocre: +0
- Average: +1
- Fair: +2
- Good: +3
- Great: +4
- Superb: +5

### 2. Undefined NPC Opposition
**Symptom:** Scene mentions antagonists but no stats provided
**Fix Required:** Add opposition stat blocks or reference existing NPCs

### 3. Unclear Scene Timing
**Symptom:** "After a while..." or "When the catastrophe happens..." without triggers
**Fix Required:** Specify round count, PC action triggers, or time-based events

### 4. Missing Transition Guidance
**Symptom:** Scene ends but no direction to next scene
**Fix Required:** Add "Transition to Scene X" with trigger conditions

### 5. Undefined Scene Outcomes
**Symptom:** Success/failure mentioned but no mechanical consequences
**Fix Required:** Specify aspects created, fate points awarded, tracks ticked, etc.

---

## PLAYTEST INVOCATION

To run a playtest session:

1. **AI reads this document first**
2. **AI reads required Tier 1-4 files**
3. **AI creates progress tracks** for the session:
   ```bash
   python fate_roller.py track create "Scene Completion" [SCENE_COUNT]
   python fate_roller.py track create "Fatal Errors Found" 20 -d "Critical scenario gaps"
   python fate_roller.py track create "Minor Issues Found" 20 -d "Annoying but workable problems"
   ```
4. **AI begins playtest** at specified scene
5. **AI ticks tracks** as it progresses:
   ```bash
   python fate_roller.py track tick "Scene Completion"  # After each scene
   python fate_roller.py track tick "Fatal Errors Found"  # When FATAL ERROR occurs
   python fate_roller.py track tick "Minor Issues Found"  # When minor issue found
   ```
6. **AI halts on FATAL ERROR** and reports
7. **AI provides final report** when session ends

---

## SAMPLE PLAYTEST SESSION LOG

```
SESSION START: Act 1, Scene 1 - The Harbour Heist
════════════════════════════════════════════════

PRE-FLIGHT CHECK:
✅ Scene file found: Act1/01_01_The_Harbour_Heist.md
✅ Central Question defined
✅ Situation Aspects present (6 aspects)
✅ Zones defined (4 zones)
⚠️  Key NPCs: Sappho & Jewels (found in NPCs/)
🚨 FATAL ERROR: Seagull Mafia mentioned but no stat block found

Required: Create Root/NPCs/Seagull_Mafia.md with:
- Average (+1) Fight for individual gulls
- Fair (+2) for coordinated attacks
- Aspects: "Squawking Chaos", "Dive Bomb Specialists"

Tracking:
$ python fate_roller.py track tick "Fatal Errors Found"
[OK] Track 'Fatal Errors Found' updated: [#-------------------] 1/20

PLAYTEST HALTED - Cannot proceed without opposition stats
```

---

## SUCCESS CRITERIA

A scene is **playtest-complete** when:
- ✅ AI can execute from start to finish
- ✅ No FATAL ERRORS encountered
- ✅ All dice rolls have clear DCs
- ✅ All NPC interactions are defined
- ✅ Scene transitions are obvious
- ⚠️ Minor issues are acceptable if noted - The GM is able to accomodate unusual requests or provide creative solutions, we know the GM and Players are good at improvising, that they WANT to solve the problems and that they are more generally useful than difficult to please or unhelpful. Players should ask natural questions which arise from encountering the material but you shouldn't check first to see if that has already been covered, the point is to organically discover edge cases or missing content.

An adventure is **playtest-ready** when:
- ✅ All scenes pass individual playtest
- ✅ Continuity between scenes is clear
- ✅ Fragment tracking system works
- ✅ Final confrontation is mechanically sound

---

## FINAL REPORT TEMPLATE

```markdown
# PLAYTEST REPORT: [Adventure Name] - [Act/Scene Range]

## Executive Summary
- Scenes Tested: [count]
- Fatal Errors: [count]
- Minor Issues: [count]
- Overall Playability: [1-10]

## Fatal Errors (Scenario-Breaking)
1. [Scene ID] - [Issue] - [Fix Required]
2. ...

## Minor Issues (Workable but Annoying)
1. [Scene ID] - [Issue] - [Suggested Fix]
2. ...

## What Worked Well
- [Highlight 1]
- [Highlight 2]
- ...

## Inspirational Moments
- [Emergent moment 1]
- [Cool PC action 1]
- ...

## Recommendations
- [ ] Add missing stat blocks
- [ ] Clarify scene timings
- [ ] Specify difficulty ratings
- ...
```

---

## VERSION CONTROL

**Protocol Version:** 1.0.0
**Last Updated:** 2025-10-30
**Compatible With:** "What the Tide Dragged In" v1.x

---

**Remember: The AI is a quality assurance tool, not a creative filler. Report gaps, don't patch them.**

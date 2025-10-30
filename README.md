# What the Tide Dragged In

A Fate Core adventure set in the magical seaside town of Silverfield, Maine (1992)

## Overview

**What the Tide Dragged In** is a complete Fate Core adventure where players take on the roles of secret, magical cats protecting their town from supernatural threats. This adventure features:

- **Noir detective mystery** combined with whimsical animal antics
- **Inter-species politics** between cats, dogs, and lynx
- A **conlang puzzle** involving the mysterious Speaking Stone
- **Shapeshifting villains** seeking revenge
- **4 Acts** with detailed scenes, NPCs, and GM guidance

## Setting

Silverfield—affectionately dubbed "Strangefield" by locals—is a coastal Maine town where:
- Animal factions hold their own parliaments and wage their own wars
- A magical Speaking Stone enables inter-species communication
- The veil between the mundane and mystical is dangerously thin
- Ancient curses, fey magic, and modern problems collide

**Current Year:** 1992

## The Adventure

### The Hook
The adventure begins *in media res* with a heist at the harbor. The Cat Parliament serves as muscle while their allies—star-crossed lovers Sappho (a dog) and Jewels (a lynx)—act as the getaway team. When the magical Speaking Stone is shattered, inter-species communication fails, and the lovers are kidnapped. The players must:

1. **Investigate** the conspiracy behind the Stone's destruction
2. **Decode** Dog and Lynx conlangs to communicate with allies
3. **Rescue** Sappho and Jewels from human captivity
4. **Expose** the shapeshifter villains plotting revenge
5. **Reforge** the Speaking Stone before war erupts

### Structure

- **Act 0:** Tutorial mini-adventure introducing Sappho and Jewels
- **Act 1:** The harbor heist and the Stone's shattering
- **Act 2:** Investigation and decoding the conspiracy
- **Act 3:** Rescues at the pound and zoo; final confrontation
- **Act 4:** Epilogue and world-changing consequences

## Contents

### Core Adventure Files
- **`Root/Adventure.md`** - Main adventure introduction and overview
- **`Root/Main.md`** - Quick reference and session guide

### Lore & Setting
- **`Root/Lore/Silverfield_Setting.md`** - Comprehensive setting guide
- **`Root/Lore/Adventure_Timeline.md`** - Canonical sequence of events
- **`Root/Lore/Previous_Adventure_The_Case_of_the_Greedy_Ghost.md`** - Backstory

### Scenes
Each scene includes:
- Central dramatic question
- Situation aspects and zones
- Key NPCs and linguistic clues
- Potential outcomes
- **GM Guidance** with levers, hidden aspects, breadcrumbs, and fail-forward options
- **Verbose read-aloud descriptions** for immersive narration

```
Root/Scenes/
├── Act0/          # Tutorial scenes
├── Act1/          # The heist and catastrophe
├── Act2/          # Investigation
├── Act3/          # Rescues and confrontation
└── Act4/          # Epilogue
```

### NPCs & Characters
- **`Root/NPCs/`** - Major NPCs with full Fate Core stats
- **`Root/Characters/`** - Pre-generated player characters
- Scene-specific NPC files in `[Scene]_Characters/` folders

### Tools
- **`Root/fate_roller.py`** - Python CLI Fate dice roller with DC comparison and GM instructions

## Using This Adventure

### For Game Masters

1. **Start with Act 0** if your players are new to Fate Core or need introduction to the setting
2. **Read `Silverfield_Setting.md`** for comprehensive world-building
3. **Use the verbose read-aloud sections** to set scenes dramatically
4. **Follow GM Guidance** for each scene—it provides:
   - Mechanical levers players can pull
   - Hidden aspects to reward investigation
   - Breadcrumbs connecting to future scenes
   - Fail-forward options to maintain momentum
   - Compels to create drama

### For Players

Pre-generated characters are provided, or work with your GM to create cats tied to Silverfield's factions:
- **Cat Parliament** - Political cats from various neighborhoods
- **Feral Cats** - Outcasts with grudges (use cautiously)
- **House Cats** - Comfortable but curious
- **Strays** - Scrappy survivors

### Tools & Utilities

**Fate Dice Roller:**
```bash
python Root/fate_roller.py -m 3 -v --dc 2
# Roll 4dF with +3 modifier against DC 2, verbose output
```

Options:
- `-m, --modifier` - Skill modifier
- `-a, --advantage` - Roll twice, take higher
- `-d, --disadvantage` - Roll twice, take lower
- `-v, --verbose` - Show dice faces and GM instructions
- `--dc` - Difficulty Class for comparison
- `-n, --times` - Number of rolls
- `-s, --seed` - Random seed for reproducibility

## Key Themes

- **Found Family & Community:** Factions learning to trust despite differences
- **Noir Mystery:** Investigations, clues, conspiracies
- **Whimsy Meets Horror:** Cats stealing lobsters one moment, facing vengeful spirits the next
- **The Thin Veil:** Constant tension between mundane and magical
- **Consequences of Victory:** Even heroes leave collateral damage

## Credits

**Original Adventure:** "The Secret of Cats" by Richard Βellingham  
**Adapted & Expanded:** Pippa Foster Cammack and Ingram Blakelock

**System:** Fate Core by Evil Hat Productions

## License

This adventure is provided for personal and non-commercial use.

Fate Core is a trademark of Evil Hat Productions, LLC and is used with permission.

## Requirements

- Fate Core rulebook (or Fate Accelerated)
- 4 Fate/Fudge dice (or use `fate_roller.py`)
- 3-5 players (1 GM, 2-4 players)
- 3-5 sessions of ~3 hours each

## Getting Started

1. Read `Adventure.md` for the full overview
2. Review `Silverfield_Setting.md` for world context
3. Choose whether to start with Act 0 (tutorial) or Act 1 (heist)
4. Prepare Scene 1 using the verbose read-aloud descriptions
5. Print or reference NPC stat blocks
6. Have fun protecting Silverfield!

---

*"Silverfield endures, but its peace is always fragile, and new mysteries are always waiting to surface from the depths—whether from the sea, the mine, or the spaces between worlds."*

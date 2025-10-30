# JSON Schema Specifications

## Character Schema

Characters need to track both **static data** (name, aspects, skills) and **dynamic state** (stress, consequences, temporary aspects).

```json
{
  "id": "sappho",
  "type": "npc",
  "name": "Sappho",
  "pronouns": "she/her",
  "highConcept": "Piratical Sea Dog with a Secret Heart",
  "trouble": "Star-Crossed Lover Across Clan Lines",
  "aspects": [
    "Salt in My Fur, Fire in My Belly",
    "The Sea is My Home",
    "A Bond that Bridges the Divide"
  ],
  "skills": {
    "fight": 4,
    "athletics": 3,
    "physique": 3,
    "notice": 2,
    "rapport": 2,
    "will": 1
  },
  "stunts": [
    {
      "name": "Sea Legs",
      "description": "+2 to Athletics when on boats, docks, or slippery surfaces"
    }
  ],
  "stress": {
    "physical": {
      "boxes": 4,
      "current": [false, false, false, false]
    },
    "mental": {
      "boxes": 3,
      "current": [false, false, false]
    }
  },
  "consequences": {
    "mild": { "value": 2, "current": null, "recoveryScenes": 0 },
    "moderate": { "value": 4, "current": null, "recoveryScenes": 0 },
    "severe": { "value": 6, "current": null, "recoveryScenes": 0 }
  },
  "temporaryAspects": [],
  "fatePoints": {
    "refresh": 3,
    "current": 3
  },
  "notes": "Captured in Act 1, rescued in Act 3 Scene 1"
}
```

## Scene Schema

```json
{
  "id": "01_01_harbour_heist",
  "act": 1,
  "sceneNumber": 1,
  "title": "The Harbour Heist",
  "centralQuestion": "Can the players fend off the Seagull Mafia long enough for the getaway team to secure the feast?",
  "readAloud": "After the chaos of Wally's madness...",
  "situationAspects": [
    "The Catch is Coming In",
    "Moored Ships and Creaking Ropes",
    "Sunset",
    "Hungry, Hungry Seagulls",
    "Everything Here is Twice Our Height",
    "A Symphony of Overwhelming Scents"
  ],
  "zones": [
    {
      "name": "Harborfront",
      "description": "Locals and tourists linger on benches..."
    }
  ],
  "npcs": ["sappho", "jewels", "fisherfolk"],
  "potentialOutcomes": {
    "success": "Perfect heist, allies impressed",
    "successWithCost": "Get lobsters but make noise, chase ensues",
    "failure": "Spotted early, forced to flee empty-pawed"
  },
  "gmGuidance": {
    "levers": [
      "Zone Control: Create Advantage with Athletics/Notice (DC 2)",
      "Bait & Switch: Deceive/Provoke (DC 3)"
    ],
    "hiddenAspects": [
      {
        "name": "Loose Tarp Over Crates",
        "skill": "Notice",
        "dc": 2,
        "effect": "Can be turned into a net to trap gulls"
      }
    ],
    "breadcrumbs": [
      "Gull drops wrench tag with foreign brand"
    ],
    "failForward": [
      "Lose some crates but keep one with a clue"
    ]
  },
  "timeGuideline": "20-30 minutes",
  "completed": false
}
```

## NPC Schema (Simplified)

```json
{
  "id": "gull_mafia",
  "name": "The Gull Mafia",
  "type": "mob",
  "highConcept": "Coordinated Flock of Food Thieves",
  "trouble": "Greedy and Overconfident",
  "aspects": [
    "Dive-Bombers",
    "Eyes on the Prize",
    "Scatter at a Shout"
  ],
  "skills": {
    "fight": 3,
    "createAdvantage": 2,
    "overcome": 1
  },
  "stunts": [
    {
      "name": "Swarming Dives",
      "description": "+2 to Create Advantage when harrying a single target"
    }
  ],
  "stress": {
    "group": {
      "boxes": 4,
      "current": [false, false, false, false]
    }
  },
  "notes": "Mob enemy, no individual consequences"
}
```

## Aspect/Stunt Registry Schema

For wiki-style hyperlinking, maintain registries:

```json
{
  "entities": {
    "characters": [
      { "id": "sappho", "name": "Sappho", "aliases": ["the dog", "piratical labrador"] },
      { "id": "jewels", "name": "Jewels", "aliases": ["the lynx", "spiritual lynx"] }
    ],
    "scenes": [
      { "id": "01_01_harbour_heist", "name": "The Harbour Heist", "aliases": ["harbour heist", "harbor heist"] }
    ],
    "aspects": [
      { "name": "The Catch is Coming In", "type": "situation", "scenes": ["01_01_harbour_heist"] },
      { "name": "Sea Legs", "type": "stunt", "owner": "sappho" }
    ],
    "skills": [
      "Fight", "Athletics", "Physique", "Notice", "Rapport", "Will", "Deceive", "Investigate", "Stealth", "Lore", "Provoke", "Crafts", "Empathy", "Resources", "Contacts", "Warding"
    ]
  }
}
```

## Game State Schema

Track overall session progress:

```json
{
  "sessionId": "session_001",
  "currentAct": 1,
  "currentScene": "01_01_harbour_heist",
  "fragmentsCollected": 0,
  "scenesCompleted": [],
  "timeTracking": {
    "sessionStart": "2025-10-30T16:00:00Z",
    "sceneTimers": {
      "01_01_harbour_heist": {
        "start": "2025-10-30T16:05:00Z",
        "elapsed": 1200000
      }
    }
  },
  "characterStates": {
    "sappho": "characters/sappho.json",
    "jewels": "characters/jewels.json"
  },
  "notes": "PCs took creative approach to distraction"
}
```

## Consequence Recovery Rules

In Fate Core, consequences recover based on severity:

- **Mild (2-shift)**: Recovers after one scene
- **Moderate (4-shift)**: Recovers after one session
- **Severe (6-shift)**: Recovers after one scenario

Track this in JSON:

```json
"consequences": {
  "mild": {
    "value": 2,
    "current": "Bruised Ribs",
    "recoveryType": "scenes",
    "recoveryRemaining": 1
  }
}
```

When a scene ends, decrement `recoveryRemaining` for all consequences with `recoveryType: "scenes"`.

# Scene JSON Schema Reference

## Standard Scene Structure

All scenes follow this JSON format:

```json
{
  "id": "string (snake_case filename)",
  "act": "number (0-4)",
  "sceneNumber": "number (1-4)",
  "title": "string",
  "centralQuestion": "string",
  "recommendedTime": "string (e.g., '20-30 minutes')",
  
  "situationAspects": [
    "string (aspect name with optional description in parentheses)"
  ],
  
  "readAloud": {
    "opening": "string (first paragraph)",
    "perspective": "string (From a Cat's Perspective section)"
  },
  
  "npcs": [
    {
      "id": "string (snake_case)",
      "name": "string",
      "pronouns": "string (she/her, he/him, they/them)",
      "role": "string (brief description)",
      "aspects": {
        "highConcept": "string",
        "trouble": "string (optional)",
        "other": ["string (optional additional aspects)"]
      },
      "linguisticClues": "string (optional - for Dog/Lynx conlang)"
    }
  ],
  
  "zones": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  
  "potentialOutcomes": [
    {
      "type": "success | successWithCost | failure",
      "description": "string"
    }
  ],
  
  "gmGuidance": {
    "leversAndButtons": ["string (action options for players)"],
    "hiddenAspects": ["string (discoverable aspects)"],
    "breadcrumbs": ["string (foreshadowing/connections)"],
    "failForward": ["string (alternative paths)"],
    "compels": ["string (suggested compels)"]
  },
  
  "asSceneUnfolds": [
    {
      "trigger": "string (condition for this info)",
      "description": "string (what players discover)"
    }
  ],
  
  "completed": false
}
```

## Field Descriptions

### Core Fields (Required)
- **id**: Filename in snake_case (e.g., `01_01_the_harbour_heist`)
- **act**: Act number (0 for tutorial, 1-4 for main acts)
- **sceneNumber**: Scene number within the act
- **title**: Scene title without "Act X, Scene Y:" prefix
- **centralQuestion**: The core dramatic question
- **recommendedTime**: Suggested duration for the GM

### Content Fields (Required)
- **situationAspects**: Array of aspect strings. Format: "Name" or "Name (description)"
- **readAloud**: Object with `opening` and `perspective` sections
- **npcs**: Array of NPCs present in this scene
- **potentialOutcomes**: Array of success/failure outcomes

### Optional Fields
- **zones**: Array of spatial zones (if scene has defined areas)
- **asSceneUnfolds**: Conditional discoveries/reveals during play
- **linguisticClues**: For scenes with Dog/Lynx conlang dialogue

### GM Guidance Structure
Always includes these sub-fields:
- **leversAndButtons**: What players can do/mechanical options
- **hiddenAspects**: Discoverable aspects via investigation
- **breadcrumbs**: Connections to future scenes/plot points
- **failForward**: How to keep story moving on failure
- **compels**: Suggested compels based on character aspects

## NPC Aspects Format

NPCs should include their key aspects prominently:

```json
"aspects": {
  "highConcept": "Primary defining aspect",
  "trouble": "Character complication (if major NPC)",
  "other": ["Additional aspects if relevant"]
}
```

**Important**: For Sappho and Jewels, always use she/her pronouns!

## Variations Noted So Far

### Scene Structure Variations:
1. **Zones**: Some scenes have detailed zones (spatial), others don't
2. **As Scene Unfolds**: Format varies between:
   - Conditional discoveries ("If players do X...")
   - Narrative beats ("When X happens...")
   - Investigation prompts

### Consistent Across All Scenes:
- Central Question (always present)
- Situation Aspects (always 3-6 aspects)
- Read-Aloud sections (opening + perspective)
- GM Guidance structure (5 categories)
- Potential Outcomes (3 outcomes: success, success w/cost, failure)

## Scenes Converted So Far

✅ **Act 0:**
- 00_01_the_cat_parliament.json
- 00_02_the_dark_woods.json

⏳ **Remaining:**
- Act 0: Scenes 3-4
- Act 1: Scenes 1-3
- Act 2: Scenes 1-4
- Act 3: Scenes 1-3
- Act 4: Scene 1

## Next Steps

1. Convert remaining 13 scenes to JSON using this schema
2. Second pass: Ensure consistency across all scenes
3. Create scene index file (manifest) for easy loading
4. Validate all JSON files

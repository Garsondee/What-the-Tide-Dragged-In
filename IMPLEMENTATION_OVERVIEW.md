# HTML GM Tool - Implementation Overview

## Executive Summary

This document outlines converting the Fate Core adventure "What the Tide Dragged In" from markdown files into an interactive HTML-based GM tool with JSON data backend.

## Core Requirements

### 1. Content Display
- Load and display scene content dynamically
- Character sheets with full Fate Core stats
- NPC stat blocks
- Lore documents and setting information

### 2. Interactive Features
- **Dice Rolling**: Integrate fate_roller.py logic into JavaScript
- **Manual Roll Override**: GM can input success/failure manually
- **Checkboxes**: Track completion status, fragment collection, scene milestones
- **Time Tracking**: Monitor scene duration to maintain pacing

### 3. Wiki-Style Hyperlinking
- **Auto-detection**: Scan content for entity names (characters, NPCs, scenes, aspects, stunts)
- **Smart Linking**: Match names to JSON entities and create clickable links
- **Navigation**: Click a name to jump to that entity's detail view

### 4. Character State Persistence
- **Damage Tracking**: Stress boxes persist across scenes
- **Consequences**: Track mild/moderate/severe consequences and recovery time
- **Aspects & Boosts**: Track temporary aspects and their durations
- **Fate Points**: Track spending and refresh

## Technical Architecture

### Data Layer (JSON)
```
/data/
  /characters/      - PC stat blocks with state
  /npcs/           - NPC stat blocks with state
  /scenes/         - Scene content and metadata
  /aspects/        - Aspect definitions for hyperlinking
  /stunts/         - Stunt definitions for hyperlinking
  /lore/           - Setting and world documents
  game-state.json  - Current session state
```

### Application Layer (JavaScript)
- **ContentLoader**: Load and parse JSON files
- **HyperlinkEngine**: Detect and link entity names
- **StateManager**: Persist character state changes
- **DiceRoller**: Fate dice mechanics
- **TimeTracker**: Scene duration monitoring
- **UIController**: Coordinate display updates

### Presentation Layer (HTML/CSS)
- Single-page application with tab navigation
- Minimal, functional design (GM-focused)
- Responsive layout for laptop/tablet use

## Next Steps

See companion documents:
- `JSON_SCHEMAS.md` - Detailed JSON structure specifications
- `CONVERSION_STRATEGY.md` - Markdown-to-JSON conversion approach
- `FEATURE_SPECIFICATIONS.md` - Detailed feature requirements
- `IMPLEMENTATION_PHASES.md` - Development roadmap

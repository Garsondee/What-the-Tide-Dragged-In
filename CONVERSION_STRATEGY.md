# Markdown to JSON Conversion Strategy

## Overview

Convert existing markdown files to structured JSON while preserving all content and adding metadata for the HTML tool.

## Conversion Process

### Phase 1: Parse Markdown Files

Create a Python script to read and parse markdown:

```python
import os
import json
import re
from pathlib import Path

class MarkdownToJSONConverter:
    def __init__(self, root_path):
        self.root = Path(root_path)
        self.output = Path(root_path) / 'data'
        self.entity_registry = {
            'characters': [],
            'npcs': [],
            'scenes': [],
            'aspects': [],
            'stunts': []
        }
    
    def convert_all(self):
        self.convert_characters()
        self.convert_npcs()
        self.convert_scenes()
        self.build_entity_registry()
        self.save_registry()
    
    def convert_characters(self):
        """Convert /Characters/*.md to /data/characters/*.json"""
        char_dir = self.root / 'Characters'
        output_dir = self.output / 'characters'
        output_dir.mkdir(parents=True, exist_ok=True)
        
        for md_file in char_dir.glob('*.md'):
            character = self.parse_character(md_file)
            json_file = output_dir / f"{character['id']}.json"
            with open(json_file, 'w') as f:
                json.dump(character, f, indent=2)
    
    def parse_character(self, filepath):
        """Parse a character markdown file into JSON structure"""
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract character name from first heading
        name_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        name = name_match.group(1).strip("'\"") if name_match else filepath.stem
        
        # Generate ID from filename
        char_id = filepath.stem.lower().replace(' ', '_').replace("'", '')
        
        # Extract aspects
        high_concept = self.extract_field(content, r'\*\*High Concept:\*\*\s*(.+)')
        trouble = self.extract_field(content, r'\*\*Trouble:\*\*\s*(.+)')
        other_aspects = self.extract_list(content, r'\*\*Other Aspects:\*\*(.*?)\*\*Skills:', re.DOTALL)
        
        # Extract skills
        skills = self.extract_skills(content)
        
        # Extract stunts
        stunts = self.extract_stunts(content)
        
        # Extract stress tracks
        stress = self.extract_stress(content)
        
        return {
            'id': char_id,
            'type': 'pc',
            'name': name,
            'pronouns': 'they/them',  # Default, update manually if specified
            'highConcept': high_concept,
            'trouble': trouble,
            'aspects': other_aspects,
            'skills': skills,
            'stunts': stunts,
            'stress': stress,
            'consequences': {
                'mild': {'value': 2, 'current': None, 'recoveryType': 'scenes', 'recoveryRemaining': 0},
                'moderate': {'value': 4, 'current': None, 'recoveryType': 'sessions', 'recoveryRemaining': 0},
                'severe': {'value': 6, 'current': None, 'recoveryType': 'scenarios', 'recoveryRemaining': 0}
            },
            'temporaryAspects': [],
            'fatePoints': {
                'refresh': 3,
                'current': 3
            },
            'notes': ''
        }
    
    def extract_field(self, content, pattern):
        """Extract a single field using regex"""
        match = re.search(pattern, content)
        return match.group(1).strip() if match else ''
    
    def extract_list(self, content, pattern, flags=0):
        """Extract a bulleted list"""
        match = re.search(pattern, content, flags)
        if not match:
            return []
        
        list_text = match.group(1)
        items = re.findall(r'^\*\s+(.+)$', list_text, re.MULTILINE)
        return [item.strip() for item in items]
    
    def extract_skills(self, content):
        """Parse skills section into dict"""
        skills = {}
        skill_levels = {
            'Great': 4, 'Good': 3, 'Fair': 2, 'Average': 1,
            '+4': 4, '+3': 3, '+2': 2, '+1': 1
        }
        
        # Find skills section
        skills_match = re.search(r'\*\*Skills:\*\*(.*?)\*\*Stunts:', content, re.DOTALL)
        if not skills_match:
            return skills
        
        skills_text = skills_match.group(1)
        
        # Parse each skill line
        for line in skills_text.split('\n'):
            for level_name, level_value in skill_levels.items():
                if level_name in line:
                    # Extract skill names after the level
                    skills_str = re.sub(r'.*?:\*\*\s*', '', line)
                    skill_names = [s.strip() for s in skills_str.split(',')]
                    for skill_name in skill_names:
                        if skill_name:
                            skills[skill_name.lower()] = level_value
                    break
        
        return skills
    
    def extract_stunts(self, content):
        """Parse stunts section"""
        stunts = []
        
        stunts_match = re.search(r'\*\*Stunts:\*\*(.*?)\*\*Stress', content, re.DOTALL)
        if not stunts_match:
            return stunts
        
        stunts_text = stunts_match.group(1)
        
        # Match stunt bullets: "**Name:** description"
        stunt_pattern = r'\*\s+\*\*(.+?):\*\*\s*(.+?)(?=\n\*|\Z)'
        for match in re.finditer(stunt_pattern, stunts_text, re.DOTALL):
            stunts.append({
                'name': match.group(1).strip(),
                'description': match.group(2).strip()
            })
        
        return stunts
    
    def extract_stress(self, content):
        """Parse stress tracks"""
        physical_count = content.count('[ ]') // 2 if 'Physical' in content else 2
        mental_count = content.count('[ ]') - physical_count if 'Mental' in content else 2
        
        return {
            'physical': {
                'boxes': physical_count,
                'current': [False] * physical_count
            },
            'mental': {
                'boxes': mental_count,
                'current': [False] * mental_count
            }
        }
```

### Phase 2: Convert Scenes

Scenes are more complex due to structured sections:

```python
def convert_scenes(self):
    """Convert /Scenes/**/*.md to /data/scenes/*.json"""
    scenes_dir = self.root / 'Scenes'
    output_dir = self.output / 'scenes'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for act_dir in scenes_dir.iterdir():
        if not act_dir.is_dir():
            continue
        
        for md_file in act_dir.glob('*.md'):
            # Skip character subdirectories
            if '_Characters' in md_file.stem:
                continue
            
            scene = self.parse_scene(md_file, act_dir.name)
            json_file = output_dir / f"{scene['id']}.json"
            with open(json_file, 'w') as f:
                json.dump(scene, f, indent=2)

def parse_scene(self, filepath, act_name):
    """Parse a scene markdown file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract act and scene numbers from filename
    # e.g., "01_01_The_Harbour_Heist.md"
    filename_parts = filepath.stem.split('_')
    act = int(filename_parts[0])
    scene_num = int(filename_parts[1])
    
    # Generate scene ID
    scene_id = filepath.stem.lower()
    
    # Extract title
    title_match = re.search(r'^#\s+Act\s+\d+,\s+Scene\s+\d+:\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else filepath.stem.replace('_', ' ')
    
    # Extract central question
    central_question = self.extract_field(content, r'\*\*Central Question:\*\*\s*(.+)')
    
    # Extract read-aloud section
    read_aloud = self.extract_section(content, r'##\s+Read-Aloud:', r'##')
    
    # Extract situation aspects
    aspects = self.extract_list_from_section(content, r'\*\*Situation Aspects:\*\*', r'\*\*')
    
    # Extract zones
    zones = self.extract_zones(content)
    
    # Extract NPCs
    npcs = self.extract_npcs_from_scene(content)
    
    # Extract outcomes
    outcomes = self.extract_outcomes(content)
    
    # Extract GM guidance
    gm_guidance = self.extract_gm_guidance(content)
    
    # Estimate time guideline (default to 20-30 min)
    time_guideline = '20-30 minutes'
    
    return {
        'id': scene_id,
        'act': act,
        'sceneNumber': scene_num,
        'title': title,
        'centralQuestion': central_question,
        'readAloud': read_aloud,
        'situationAspects': aspects,
        'zones': zones,
        'npcs': npcs,
        'potentialOutcomes': outcomes,
        'gmGuidance': gm_guidance,
        'timeGuideline': time_guideline,
        'completed': False
    }

def extract_section(self, content, start_pattern, end_pattern):
    """Extract text between two section markers"""
    match = re.search(f'{start_pattern}(.*?){end_pattern}', content, re.DOTALL)
    return match.group(1).strip() if match else ''
```

### Phase 3: Build Entity Registry

Create the master registry for hyperlinking:

```python
def build_entity_registry(self):
    """Build searchable entity registry for hyperlinking"""
    
    # Add all characters
    char_dir = self.output / 'characters'
    for json_file in char_dir.glob('*.json'):
        with open(json_file, 'r') as f:
            char = json.load(f)
            self.entity_registry['characters'].append({
                'id': char['id'],
                'name': char['name'],
                'aliases': self.generate_aliases(char['name']),
                'type': 'character'
            })
            
            # Add stunts to registry
            for stunt in char['stunts']:
                self.entity_registry['stunts'].append({
                    'name': stunt['name'],
                    'owner': char['id'],
                    'type': 'stunt'
                })
    
    # Add all NPCs
    npc_dir = self.root / 'NPCs'
    for md_file in npc_dir.glob('*.md'):
        npc_data = self.parse_character(md_file)
        self.entity_registry['npcs'].append({
            'id': npc_data['id'],
            'name': npc_data['name'],
            'aliases': self.generate_aliases(npc_data['name']),
            'type': 'npc'
        })
    
    # Add all scenes
    scene_dir = self.output / 'scenes'
    for json_file in scene_dir.glob('*.json'):
        with open(json_file, 'r') as f:
            scene = json.load(f)
            self.entity_registry['scenes'].append({
                'id': scene['id'],
                'name': scene['title'],
                'aliases': [scene['title'].lower(), scene['id'].replace('_', ' ')],
                'type': 'scene'
            })
            
            # Add scene aspects to registry
            for aspect in scene['situationAspects']:
                self.entity_registry['aspects'].append({
                    'name': aspect,
                    'context': f"Scene: {scene['title']}",
                    'type': 'situation'
                })

def generate_aliases(self, name):
    """Generate common aliases for an entity"""
    aliases = [name.lower()]
    
    # Add lowercase version
    # Add version without articles
    no_article = re.sub(r'^(the|a|an)\s+', '', name, flags=re.IGNORECASE)
    aliases.append(no_article.lower())
    
    # Add version with common descriptors removed
    simplified = re.sub(r'\s+(the|of|from|with)\s+.+$', '', name, flags=re.IGNORECASE)
    aliases.append(simplified.lower())
    
    return list(set(aliases))

def save_registry(self):
    """Save entity registry to JSON"""
    registry_file = self.output / 'entity-registry.json'
    with open(registry_file, 'w') as f:
        json.dump(self.entity_registry, f, indent=2)
```

## Running the Conversion

Create a main script:

```python
# convert_to_json.py
if __name__ == '__main__':
    converter = MarkdownToJSONConverter('c:/Users/Ingram/Documents/What the Tide Dragged In/Root')
    converter.convert_all()
    print("Conversion complete!")
    print(f"Characters: {len(converter.entity_registry['characters'])}")
    print(f"NPCs: {len(converter.entity_registry['npcs'])}")
    print(f"Scenes: {len(converter.entity_registry['scenes'])}")
```

## Manual Adjustments

After automated conversion, manually review and adjust:

1. **Pronouns**: Update character pronouns (especially Sappho and Jewels → she/her)
2. **Time Guidelines**: Add specific time recommendations per scene
3. **DC Values**: Ensure all skill checks have difficulty classes
4. **Aliases**: Add common name variations not caught automatically
5. **Recovery Times**: Verify consequence recovery is correct

## Validation

Create a validation script:

```python
def validate_json_files(self):
    """Check all JSON files for required fields"""
    errors = []
    
    # Validate characters
    for json_file in (self.output / 'characters').glob('*.json'):
        with open(json_file) as f:
            char = json.load(f)
            if not char.get('highConcept'):
                errors.append(f"{json_file.name}: Missing high concept")
            if not char.get('skills'):
                errors.append(f"{json_file.name}: No skills defined")
    
    # Validate scenes
    for json_file in (self.output / 'scenes').glob('*.json'):
        with open(json_file) as f:
            scene = json.load(f)
            if not scene.get('centralQuestion'):
                errors.append(f"{json_file.name}: Missing central question")
    
    return errors
```

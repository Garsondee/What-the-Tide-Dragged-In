#!/usr/bin/env node

/**
 * Entity Registry Builder
 * Builds a searchable index of all entities for hyperlinking
 */

const fs = require('fs');
const path = require('path');

class EntityRegistryBuilder {
  constructor() {
    this.registry = {
      characters: [],
      npcs: [],
      scenes: [],
      aspects: [],
      stunts: [],
      locations: [],
      metadata: {
        buildDate: new Date().toISOString(),
        totalEntities: 0
      }
    };
  }

  /**
   * Generate common aliases for an entity name
   */
  generateAliases(name) {
    const aliases = new Set([name.toLowerCase()]);
    
    // Remove articles
    const noArticle = name.replace(/^(the|a|an)\s+/i, '');
    if (noArticle !== name) {
      aliases.add(noArticle.toLowerCase());
    }
    
    // Handle possessives
    aliases.add(`${name.toLowerCase()}'s`);
    aliases.add(`${noArticle.toLowerCase()}'s`);
    
    // Add simplified versions (remove descriptors)
    const simplified = name.replace(/\s+(the|of|from|with|and)\s+.+$/i, '');
    if (simplified !== name) {
      aliases.add(simplified.toLowerCase());
    }
    
    return Array.from(aliases);
  }

  /**
   * Add scenes from JSON files
   */
  addScenes(scenesDir) {
    console.log('📖 Processing scenes...');
    
    const sceneFiles = fs.readdirSync(scenesDir).filter(f => f.endsWith('.json'));
    
    for (const file of sceneFiles) {
      const filePath = path.join(scenesDir, file);
      const scene = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      this.registry.scenes.push({
        id: scene.id,
        name: scene.title,
        fullName: `Act ${scene.act}, Scene ${scene.sceneNumber}: ${scene.title}`,
        aliases: this.generateAliases(scene.title),
        act: scene.act,
        sceneNumber: scene.sceneNumber,
        type: 'scene'
      });
      
      // Add situation aspects
      if (scene.situationAspects) {
        scene.situationAspects.forEach(aspect => {
          // Remove parenthetical descriptions for matching
          const cleanAspect = aspect.replace(/\s*\([^)]*\)/g, '').trim();
          
          this.registry.aspects.push({
            name: cleanAspect,
            fullText: aspect,
            context: `Scene: ${scene.title}`,
            sceneId: scene.id,
            type: 'situation',
            aliases: this.generateAliases(cleanAspect)
          });
        });
      }
      
      // Add NPCs from this scene
      if (scene.npcs) {
        scene.npcs.forEach(npc => {
          // Check if we've already added this NPC
          const existing = this.registry.npcs.find(n => n.id === npc.id);
          if (!existing) {
            this.registry.npcs.push({
              id: npc.id,
              name: npc.name,
              pronouns: npc.pronouns,
              aliases: this.generateAliases(npc.name),
              type: 'npc',
              appearances: [scene.id],
              aspects: npc.aspects
            });
          } else {
            // Add this scene to appearances
            if (!existing.appearances.includes(scene.id)) {
              existing.appearances.push(scene.id);
            }
          }
        });
      }
    }
    
    console.log(`   ✓ Added ${this.registry.scenes.length} scenes`);
    console.log(`   ✓ Added ${this.registry.aspects.length} aspects`);
    console.log(`   ✓ Added ${this.registry.npcs.length} NPCs`);
  }

  /**
   * Add character sheets (if they exist)
   */
  addCharacters(charactersDir) {
    if (!fs.existsSync(charactersDir)) {
      console.log('ℹ️  No characters directory found, skipping...');
      return;
    }
    
    console.log('🐾 Processing character sheets...');
    
    const characterFiles = fs.readdirSync(charactersDir).filter(f => f.endsWith('.json'));
    
    for (const file of characterFiles) {
      const filePath = path.join(charactersDir, file);
      const char = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      this.registry.characters.push({
        id: char.id,
        name: char.name,
        pronouns: char.pronouns,
        aliases: this.generateAliases(char.name),
        type: 'character',
        aspects: char.aspects,
        isPC: true
      });
      
      // Add character aspects
      if (char.aspects) {
        Object.values(char.aspects).forEach(aspect => {
          if (aspect && typeof aspect === 'string') {
            this.registry.aspects.push({
              name: aspect,
              context: `Character: ${char.name}`,
              characterId: char.id,
              type: 'character',
              aliases: this.generateAliases(aspect)
            });
          }
        });
      }
      
      // Add stunts
      if (char.stunts) {
        char.stunts.forEach(stunt => {
          this.registry.stunts.push({
            name: stunt.name,
            description: stunt.description,
            owner: char.id,
            ownerName: char.name,
            type: 'stunt',
            aliases: this.generateAliases(stunt.name)
          });
        });
      }
    }
    
    console.log(`   ✓ Added ${this.registry.characters.length} characters`);
    console.log(`   ✓ Added ${this.registry.stunts.length} stunts`);
  }

  /**
   * Add known locations (can be expanded)
   */
  addLocations() {
    console.log('🗺️  Processing locations...');
    
    // Common locations mentioned in the adventure
    const knownLocations = [
      { id: 'silverfield', name: 'Silverfield', type: 'town' },
      { id: 'darkwoods', name: 'Darkwoods', aliases: ['the Darkwoods', 'Dark Woods'], type: 'forest' },
      { id: 'cat_parliament', name: 'Cat Parliament', type: 'government' },
      { id: 'riverside_park', name: 'Riverside Park', type: 'location' },
      { id: 'harbor', name: 'Silverfield Harbor', aliases: ['the harbor', 'harbour'], type: 'location' },
      { id: 'animal_control', name: 'Animal Control', type: 'building' },
      { id: 'zoo', name: 'Silverfield Zoo', aliases: ['the zoo'], type: 'location' }
    ];
    
    knownLocations.forEach(loc => {
      this.registry.locations.push({
        id: loc.id,
        name: loc.name,
        type: 'location',
        locationType: loc.type,
        aliases: loc.aliases ? loc.aliases.map(a => a.toLowerCase()) : this.generateAliases(loc.name)
      });
    });
    
    console.log(`   ✓ Added ${this.registry.locations.length} locations`);
  }

  /**
   * Sort entities by name length (longest first for better matching)
   */
  sortRegistry() {
    for (const category of Object.keys(this.registry)) {
      if (Array.isArray(this.registry[category])) {
        this.registry[category].sort((a, b) => {
          const aLen = a.name ? a.name.length : 0;
          const bLen = b.name ? b.name.length : 0;
          return bLen - aLen; // Longest first
        });
      }
    }
  }

  /**
   * Calculate metadata
   */
  calculateMetadata() {
    this.registry.metadata.totalEntities = 
      this.registry.characters.length +
      this.registry.npcs.length +
      this.registry.scenes.length +
      this.registry.locations.length;
    
    this.registry.metadata.counts = {
      characters: this.registry.characters.length,
      npcs: this.registry.npcs.length,
      scenes: this.registry.scenes.length,
      aspects: this.registry.aspects.length,
      stunts: this.registry.stunts.length,
      locations: this.registry.locations.length
    };
  }

  /**
   * Build complete registry
   */
  async build(dataDir) {
    console.log('\n🔨 Building Entity Registry...\n');
    
    const scenesDir = path.join(dataDir, 'scenes');
    const charactersDir = path.join(dataDir, 'characters');
    
    // Add all entities
    this.addScenes(scenesDir);
    this.addCharacters(charactersDir);
    this.addLocations();
    
    // Sort for better matching
    this.sortRegistry();
    
    // Calculate metadata
    this.calculateMetadata();
    
    console.log('\n📊 Registry Statistics:');
    console.log(`   Total Entities: ${this.registry.metadata.totalEntities}`);
    console.log(`   - Characters: ${this.registry.metadata.counts.characters}`);
    console.log(`   - NPCs: ${this.registry.metadata.counts.npcs}`);
    console.log(`   - Scenes: ${this.registry.metadata.counts.scenes}`);
    console.log(`   - Aspects: ${this.registry.metadata.counts.aspects}`);
    console.log(`   - Stunts: ${this.registry.metadata.counts.stunts}`);
    console.log(`   - Locations: ${this.registry.metadata.counts.locations}`);
    
    return this.registry;
  }

  /**
   * Save registry to file
   */
  save(outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(this.registry, null, 2));
    console.log(`\n✅ Registry saved to: ${path.basename(outputPath)}\n`);
  }
}

// Main execution
async function main() {
  const builder = new EntityRegistryBuilder();
  const dataDir = path.join(__dirname, '../public/data');
  const outputPath = path.join(dataDir, 'entity-registry.json');
  
  const registry = await builder.build(dataDir);
  builder.save(outputPath);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { EntityRegistryBuilder };

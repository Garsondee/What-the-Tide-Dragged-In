#!/usr/bin/env node

/**
 * JSON Data Validator for GM Tool
 * Validates scenes, characters, NPCs, and other JSON data files
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class DataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.validFiles = [];
    this.stats = {
      totalFiles: 0,
      validFiles: 0,
      invalidFiles: 0,
      warnings: 0,
      errors: 0
    };
  }

  // Validate Scene JSON
  validateScene(data, filename) {
    const errors = [];
    const warnings = [];

    // Required fields
    const requiredFields = [
      'id', 'act', 'sceneNumber', 'title', 'centralQuestion', 
      'recommendedTime', 'situationAspects', 'readAloud', 'npcs',
      'potentialOutcomes', 'gmGuidance', 'completed'
    ];

    requiredFields.forEach(field => {
      if (data[field] === undefined) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Type validations
    if (typeof data.id !== 'string' || !data.id.match(/^[a-z0-9_]+$/)) {
      errors.push('id must be a lowercase snake_case string');
    }

    if (typeof data.act !== 'number' || data.act < 0 || data.act > 4) {
      errors.push('act must be a number between 0 and 4');
    }

    if (typeof data.sceneNumber !== 'number' || data.sceneNumber < 1) {
      errors.push('sceneNumber must be a positive number');
    }

    if (typeof data.title !== 'string' || data.title.length === 0) {
      errors.push('title must be a non-empty string');
    }

    if (typeof data.centralQuestion !== 'string' || data.centralQuestion.length === 0) {
      errors.push('centralQuestion must be a non-empty string');
    }

    // situationAspects validation
    if (!Array.isArray(data.situationAspects)) {
      errors.push('situationAspects must be an array');
    } else {
      if (data.situationAspects.length < 2 || data.situationAspects.length > 8) {
        warnings.push(`situationAspects has ${data.situationAspects.length} items (recommended 3-6)`);
      }
      data.situationAspects.forEach((aspect, i) => {
        if (typeof aspect !== 'string' || aspect.length === 0) {
          errors.push(`situationAspects[${i}] must be a non-empty string`);
        }
      });
    }

    // readAloud validation
    if (typeof data.readAloud !== 'object' || data.readAloud === null) {
      errors.push('readAloud must be an object');
    } else {
      if (typeof data.readAloud.opening !== 'string' || data.readAloud.opening.length === 0) {
        errors.push('readAloud.opening must be a non-empty string');
      }
      if (typeof data.readAloud.perspective !== 'string' || data.readAloud.perspective.length === 0) {
        errors.push('readAloud.perspective must be a non-empty string');
      }
    }

    // NPCs validation
    if (!Array.isArray(data.npcs)) {
      errors.push('npcs must be an array');
    } else {
      data.npcs.forEach((npc, i) => {
        this.validateNPC(npc, `npcs[${i}]`, errors, warnings);
      });
    }

    // zones validation (optional but must be array if present)
    if (data.zones !== undefined && !Array.isArray(data.zones)) {
      errors.push('zones must be an array if present');
    }

    // potentialOutcomes validation
    if (!Array.isArray(data.potentialOutcomes)) {
      errors.push('potentialOutcomes must be an array');
    } else {
      if (data.potentialOutcomes.length === 0) {
        errors.push('potentialOutcomes must have at least one outcome');
      }
      data.potentialOutcomes.forEach((outcome, i) => {
        if (!outcome.type || !['success', 'successWithCost', 'failure'].includes(outcome.type)) {
          errors.push(`potentialOutcomes[${i}].type must be 'success', 'successWithCost', or 'failure'`);
        }
        if (typeof outcome.description !== 'string' || outcome.description.length === 0) {
          errors.push(`potentialOutcomes[${i}].description must be a non-empty string`);
        }
      });
    }

    // gmGuidance validation
    if (typeof data.gmGuidance !== 'object' || data.gmGuidance === null) {
      errors.push('gmGuidance must be an object');
    } else {
      const guidanceFields = ['leversAndButtons', 'hiddenAspects', 'breadcrumbs', 'failForward', 'compels'];
      guidanceFields.forEach(field => {
        if (!Array.isArray(data.gmGuidance[field])) {
          errors.push(`gmGuidance.${field} must be an array`);
        }
      });
    }

    // asSceneUnfolds validation (optional)
    if (data.asSceneUnfolds !== undefined) {
      if (!Array.isArray(data.asSceneUnfolds)) {
        errors.push('asSceneUnfolds must be an array if present');
      } else {
        data.asSceneUnfolds.forEach((item, i) => {
          if (typeof item.trigger !== 'string' || item.trigger.length === 0) {
            errors.push(`asSceneUnfolds[${i}].trigger must be a non-empty string`);
          }
          if (typeof item.description !== 'string' || item.description.length === 0) {
            errors.push(`asSceneUnfolds[${i}].description must be a non-empty string`);
          }
        });
      }
    }

    // completed must be boolean
    if (typeof data.completed !== 'boolean') {
      errors.push('completed must be a boolean');
    }

    // Check for Sappho and Jewels pronouns
    if (data.npcs && Array.isArray(data.npcs)) {
      data.npcs.forEach(npc => {
        if (npc.name && npc.name.toLowerCase().includes('sappho') && npc.pronouns !== 'she/her') {
          errors.push(`Sappho must use she/her pronouns (found: ${npc.pronouns})`);
        }
        if (npc.name && npc.name.toLowerCase().includes('jewels') && npc.pronouns !== 'she/her') {
          errors.push(`Jewels must use she/her pronouns (found: ${npc.pronouns})`);
        }
      });
    }

    return { errors, warnings };
  }

  // Validate NPC structure
  validateNPC(npc, path, errors, warnings) {
    if (typeof npc !== 'object' || npc === null) {
      errors.push(`${path} must be an object`);
      return;
    }

    const requiredFields = ['id', 'name', 'pronouns', 'role', 'aspects'];
    requiredFields.forEach(field => {
      if (npc[field] === undefined) {
        errors.push(`${path}.${field} is required`);
      }
    });

    if (npc.id && (typeof npc.id !== 'string' || !npc.id.match(/^[a-z0-9_]+$/))) {
      errors.push(`${path}.id must be lowercase snake_case`);
    }

    if (npc.name && typeof npc.name !== 'string') {
      errors.push(`${path}.name must be a string`);
    }

    const validPronouns = ['she/her', 'he/him', 'they/them'];
    if (npc.pronouns && !validPronouns.includes(npc.pronouns)) {
      warnings.push(`${path}.pronouns should be one of: ${validPronouns.join(', ')} (found: ${npc.pronouns})`);
    }

    if (npc.aspects && typeof npc.aspects === 'object') {
      if (!npc.aspects.highConcept) {
        warnings.push(`${path}.aspects should include highConcept`);
      }
    }
  }

  // Validate JSON file
  async validateFile(filePath, type = 'scene') {
    this.stats.totalFiles++;

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      const filename = path.basename(filePath);

      let result;
      if (type === 'scene') {
        result = this.validateScene(data, filename);
      } else if (type === 'index') {
        result = this.validateIndex(data, filename);
      } else {
        result = { errors: [], warnings: [] };
      }

      if (result.errors.length > 0) {
        this.stats.invalidFiles++;
        this.stats.errors += result.errors.length;
        this.errors.push({
          file: filePath,
          type,
          errors: result.errors,
          warnings: result.warnings
        });
      } else {
        this.stats.validFiles++;
        this.validFiles.push(filePath);
        if (result.warnings.length > 0) {
          this.stats.warnings += result.warnings.length;
          this.warnings.push({
            file: filePath,
            type,
            warnings: result.warnings
          });
        }
      }

      return result;
    } catch (error) {
      this.stats.invalidFiles++;
      this.stats.errors++;
      this.errors.push({
        file: filePath,
        type,
        errors: [error.message],
        warnings: []
      });
      return { errors: [error.message], warnings: [] };
    }
  }

  // Validate scenes index
  validateIndex(data, filename) {
    const errors = [];
    const warnings = [];

    if (!data.adventure || typeof data.adventure !== 'object') {
      errors.push('Missing or invalid adventure metadata');
    }

    if (!Array.isArray(data.scenes)) {
      errors.push('scenes must be an array');
    } else {
      if (data.scenes.length === 0) {
        errors.push('scenes array is empty');
      }
    }

    return { errors, warnings };
  }

  // Print report
  printReport() {
    console.log('\n' + colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.cyan + '           JSON VALIDATION REPORT' + colors.reset);
    console.log(colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset + '\n');

    // Summary
    console.log(colors.blue + '📊 SUMMARY' + colors.reset);
    console.log(`   Total Files:     ${this.stats.totalFiles}`);
    console.log(`   ${colors.green}✓ Valid:${colors.reset}         ${this.stats.validFiles}`);
    console.log(`   ${colors.red}✗ Invalid:${colors.reset}       ${this.stats.invalidFiles}`);
    console.log(`   ${colors.yellow}⚠ Warnings:${colors.reset}      ${this.stats.warnings}`);
    console.log(`   ${colors.red}✗ Errors:${colors.reset}        ${this.stats.errors}\n`);

    // Errors
    if (this.errors.length > 0) {
      console.log(colors.red + '❌ ERRORS' + colors.reset);
      this.errors.forEach(({ file, type, errors }) => {
        console.log(`\n   ${colors.red}✗${colors.reset} ${path.basename(file)} (${type})`);
        errors.forEach(err => {
          console.log(`      • ${err}`);
        });
      });
      console.log('');
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log(colors.yellow + '⚠️  WARNINGS' + colors.reset);
      this.warnings.forEach(({ file, warnings }) => {
        console.log(`\n   ${colors.yellow}⚠${colors.reset} ${path.basename(file)}`);
        warnings.forEach(warn => {
          console.log(`      • ${warn}`);
        });
      });
      console.log('');
    }

    // Success
    if (this.stats.invalidFiles === 0) {
      console.log(colors.green + '✅ ALL FILES VALID!' + colors.reset + '\n');
    }

    console.log(colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset + '\n');
  }

  // Generate JSON report
  getJSONReport() {
    return {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      errors: this.errors,
      warnings: this.warnings,
      validFiles: this.validFiles
    };
  }
}

// Main execution
async function main() {
  const validator = new DataValidator();
  const dataDir = path.join(__dirname, '../public/data');

  console.log(colors.cyan + '\n🔍 Validating JSON data files...\n' + colors.reset);

  // Validate scene index
  const indexPath = path.join(dataDir, 'scenes-index.json');
  if (fs.existsSync(indexPath)) {
    await validator.validateFile(indexPath, 'index');
  }

  // Validate all scene files
  const scenesDir = path.join(dataDir, 'scenes');
  if (fs.existsSync(scenesDir)) {
    const sceneFiles = fs.readdirSync(scenesDir).filter(f => f.endsWith('.json'));
    for (const file of sceneFiles) {
      await validator.validateFile(path.join(scenesDir, file), 'scene');
    }
  }

  // Print report
  validator.printReport();

  // Save JSON report
  const reportPath = path.join(__dirname, '../validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(validator.getJSONReport(), null, 2));
  console.log(colors.blue + `📄 Detailed report saved to: ${path.basename(reportPath)}` + colors.reset + '\n');

  // Exit with error code if validation failed
  process.exit(validator.stats.invalidFiles > 0 ? 1 : 0);
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DataValidator };

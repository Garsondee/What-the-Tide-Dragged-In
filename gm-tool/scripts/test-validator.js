#!/usr/bin/env node

/**
 * Automated Test Suite for Data Validator
 * Tests the validator with valid and invalid data to ensure it catches errors
 */

const { DataValidator } = require('./validate-data.js');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class ValidatorTester {
  constructor() {
    this.testResults = [];
    this.passed = 0;
    this.failed = 0;
  }

  // Test helper
  test(name, testFn) {
    try {
      testFn();
      this.passed++;
      this.testResults.push({ name, passed: true });
      console.log(`${colors.green}✓${colors.reset} ${name}`);
    } catch (error) {
      this.failed++;
      this.testResults.push({ name, passed: false, error: error.message });
      console.log(`${colors.red}✗${colors.reset} ${name}`);
      console.log(`  Error: ${error.message}`);
    }
  }

  // Assertion helper
  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  // Test valid scene
  testValidScene() {
    const validator = new DataValidator();
    const validScene = {
      id: 'test_scene',
      act: 1,
      sceneNumber: 1,
      title: 'Test Scene',
      centralQuestion: 'Can they succeed?',
      recommendedTime: '20-30 minutes',
      situationAspects: ['Aspect 1', 'Aspect 2', 'Aspect 3'],
      readAloud: {
        opening: 'This is the opening.',
        perspective: 'This is the perspective.'
      },
      npcs: [
        {
          id: 'test_npc',
          name: 'Test NPC',
          pronouns: 'they/them',
          role: 'A test character',
          aspects: {
            highConcept: 'Test Concept'
          }
        }
      ],
      zones: [],
      potentialOutcomes: [
        {
          type: 'success',
          description: 'They succeed!'
        }
      ],
      gmGuidance: {
        leversAndButtons: [],
        hiddenAspects: [],
        breadcrumbs: [],
        failForward: [],
        compels: []
      },
      asSceneUnfolds: [],
      completed: false
    };

    const result = validator.validateScene(validScene, 'test.json');
    this.assert(result.errors.length === 0, `Expected no errors, got ${result.errors.length}: ${result.errors.join(', ')}`);
  }

  // Test missing required field
  testMissingRequiredField() {
    const validator = new DataValidator();
    const invalidScene = {
      id: 'test_scene',
      // Missing 'act' field
      sceneNumber: 1,
      title: 'Test Scene'
    };

    const result = validator.validateScene(invalidScene, 'test.json');
    this.assert(result.errors.length > 0, 'Expected errors for missing required field');
    this.assert(result.errors.some(e => e.includes('act')), 'Expected error about missing act field');
  }

  // Test invalid act number
  testInvalidActNumber() {
    const validator = new DataValidator();
    const invalidScene = {
      id: 'test_scene',
      act: 10, // Invalid: must be 0-4
      sceneNumber: 1,
      title: 'Test'
    };

    const result = validator.validateScene(invalidScene, 'test.json');
    this.assert(result.errors.some(e => e.includes('act')), 'Expected error about invalid act number');
  }

  // Test invalid ID format
  testInvalidIDFormat() {
    const validator = new DataValidator();
    const invalidScene = {
      id: 'Test-Scene!', // Invalid: must be snake_case
      act: 1,
      sceneNumber: 1
    };

    const result = validator.validateScene(invalidScene, 'test.json');
    this.assert(result.errors.some(e => e.includes('snake_case')), 'Expected error about ID format');
  }

  // Test situation aspects validation
  testSituationAspectsValidation() {
    const validator = new DataValidator();
    
    // Too few aspects (warning)
    const fewAspects = {
      id: 'test',
      act: 1,
      sceneNumber: 1,
      title: 'Test',
      centralQuestion: 'Question?',
      recommendedTime: '20 min',
      situationAspects: ['Only One'], // Should warn
      readAloud: { opening: 'Hi', perspective: 'Bye' },
      npcs: [],
      potentialOutcomes: [{ type: 'success', description: 'Win' }],
      gmGuidance: {
        leversAndButtons: [],
        hiddenAspects: [],
        breadcrumbs: [],
        failForward: [],
        compels: []
      },
      completed: false
    };

    const result = validator.validateScene(fewAspects, 'test.json');
    this.assert(result.warnings.length > 0, 'Expected warning for too few aspects');
  }

  // Test NPC pronoun validation for Sappho
  testSapphoPronouns() {
    const validator = new DataValidator();
    const sceneWithSappho = {
      id: 'test',
      act: 1,
      sceneNumber: 1,
      title: 'Test',
      centralQuestion: 'Question?',
      recommendedTime: '20 min',
      situationAspects: ['Aspect'],
      readAloud: { opening: 'Hi', perspective: 'Bye' },
      npcs: [
        {
          id: 'sappho',
          name: 'Sappho',
          pronouns: 'he/him', // WRONG! Should be she/her
          role: 'Dog',
          aspects: { highConcept: 'Captain' }
        }
      ],
      potentialOutcomes: [{ type: 'success', description: 'Win' }],
      gmGuidance: {
        leversAndButtons: [],
        hiddenAspects: [],
        breadcrumbs: [],
        failForward: [],
        compels: []
      },
      completed: false
    };

    const result = validator.validateScene(sceneWithSappho, 'test.json');
    this.assert(
      result.errors.some(e => e.includes('Sappho') && e.includes('she/her')),
      'Expected error about Sappho pronouns'
    );
  }

  // Test NPC pronoun validation for Jewels
  testJewelsPronouns() {
    const validator = new DataValidator();
    const sceneWithJewels = {
      id: 'test',
      act: 1,
      sceneNumber: 1,
      title: 'Test',
      centralQuestion: 'Question?',
      recommendedTime: '20 min',
      situationAspects: ['Aspect'],
      readAloud: { opening: 'Hi', perspective: 'Bye' },
      npcs: [
        {
          id: 'jewels',
          name: 'Jewels',
          pronouns: 'they/them', // WRONG! Should be she/her
          role: 'Lynx',
          aspects: { highConcept: 'Bridge' }
        }
      ],
      potentialOutcomes: [{ type: 'success', description: 'Win' }],
      gmGuidance: {
        leversAndButtons: [],
        hiddenAspects: [],
        breadcrumbs: [],
        failForward: [],
        compels: []
      },
      completed: false
    };

    const result = validator.validateScene(sceneWithJewels, 'test.json');
    this.assert(
      result.errors.some(e => e.includes('Jewels') && e.includes('she/her')),
      'Expected error about Jewels pronouns'
    );
  }

  // Test invalid outcome type
  testInvalidOutcomeType() {
    const validator = new DataValidator();
    const invalidScene = {
      id: 'test',
      act: 1,
      sceneNumber: 1,
      title: 'Test',
      centralQuestion: 'Question?',
      recommendedTime: '20 min',
      situationAspects: ['Aspect'],
      readAloud: { opening: 'Hi', perspective: 'Bye' },
      npcs: [],
      potentialOutcomes: [
        {
          type: 'maybe', // Invalid type
          description: 'Something happens'
        }
      ],
      gmGuidance: {
        leversAndButtons: [],
        hiddenAspects: [],
        breadcrumbs: [],
        failForward: [],
        compels: []
      },
      completed: false
    };

    const result = validator.validateScene(invalidScene, 'test.json');
    this.assert(
      result.errors.some(e => e.includes('type')),
      'Expected error about invalid outcome type'
    );
  }

  // Test GM guidance structure
  testGMGuidanceStructure() {
    const validator = new DataValidator();
    const invalidScene = {
      id: 'test',
      act: 1,
      sceneNumber: 1,
      title: 'Test',
      centralQuestion: 'Question?',
      recommendedTime: '20 min',
      situationAspects: ['Aspect'],
      readAloud: { opening: 'Hi', perspective: 'Bye' },
      npcs: [],
      potentialOutcomes: [{ type: 'success', description: 'Win' }],
      gmGuidance: {
        // Missing required arrays
        leversAndButtons: 'not an array' // Should be array
      },
      completed: false
    };

    const result = validator.validateScene(invalidScene, 'test.json');
    this.assert(
      result.errors.some(e => e.includes('gmGuidance')),
      'Expected error about GM guidance structure'
    );
  }

  // Test completed field type
  testCompletedFieldType() {
    const validator = new DataValidator();
    const invalidScene = {
      id: 'test',
      act: 1,
      sceneNumber: 1,
      title: 'Test',
      centralQuestion: 'Question?',
      recommendedTime: '20 min',
      situationAspects: ['Aspect'],
      readAloud: { opening: 'Hi', perspective: 'Bye' },
      npcs: [],
      potentialOutcomes: [{ type: 'success', description: 'Win' }],
      gmGuidance: {
        leversAndButtons: [],
        hiddenAspects: [],
        breadcrumbs: [],
        failForward: [],
        compels: []
      },
      completed: 'false' // Should be boolean, not string
    };

    const result = validator.validateScene(invalidScene, 'test.json');
    this.assert(
      result.errors.some(e => e.includes('completed') && e.includes('boolean')),
      'Expected error about completed field type'
    );
  }

  // Run all tests
  runAllTests() {
    console.log('\n' + colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.cyan + '        VALIDATOR TEST SUITE' + colors.reset);
    console.log(colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset + '\n');

    console.log(colors.blue + '🧪 Running Tests...\n' + colors.reset);

    this.test('Valid scene passes validation', () => this.testValidScene());
    this.test('Missing required field detected', () => this.testMissingRequiredField());
    this.test('Invalid act number detected', () => this.testInvalidActNumber());
    this.test('Invalid ID format detected', () => this.testInvalidIDFormat());
    this.test('Situation aspects warnings work', () => this.testSituationAspectsValidation());
    this.test('Sappho pronoun enforcement works', () => this.testSapphoPronouns());
    this.test('Jewels pronoun enforcement works', () => this.testJewelsPronouns());
    this.test('Invalid outcome type detected', () => this.testInvalidOutcomeType());
    this.test('GM guidance structure validated', () => this.testGMGuidanceStructure());
    this.test('Completed field type validated', () => this.testCompletedFieldType());

    console.log('\n' + colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '📊 TEST RESULTS' + colors.reset);
    console.log(`   ${colors.green}✓ Passed:${colors.reset}  ${this.passed}`);
    console.log(`   ${colors.red}✗ Failed:${colors.reset}  ${this.failed}`);
    console.log(`   Total:    ${this.passed + this.failed}`);
    console.log(colors.cyan + '═══════════════════════════════════════════════════════════' + colors.reset + '\n');

    if (this.failed === 0) {
      console.log(colors.green + '✅ ALL TESTS PASSED!\n' + colors.reset);
    } else {
      console.log(colors.red + '❌ SOME TESTS FAILED\n' + colors.reset);
    }

    return this.failed === 0;
  }
}

// Run tests
const tester = new ValidatorTester();
const success = tester.runAllTests();
process.exit(success ? 0 : 1);

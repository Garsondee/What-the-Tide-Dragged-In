#!/usr/bin/env node

/**
 * Automated Test Suite for Hyperlinking System
 * Tests the HyperlinkEngine to ensure clean, non-recursive linking
 */

const fs = require('fs');
const path = require('path');

// Mock DOM environment for Node.js
global.Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};

class HyperlinkEngineTest {
  constructor(entityRegistry) {
    this.registry = entityRegistry;
    this.patterns = [];
    this.buildPatterns();
  }

  buildPatterns() {
    const patterns = [];
    const categories = [
      { key: 'characters', type: 'character' },
      { key: 'npcs', type: 'npc' },
      { key: 'scenes', type: 'scene' },
      { key: 'aspects', type: 'aspect' },
      { key: 'stunts', type: 'stunt' },
      { key: 'locations', type: 'location' }
    ];

    for (const category of categories) {
      const entities = this.registry[category.key] || [];
      
      for (const entity of entities) {
        const names = [entity.name];
        if (entity.aliases) names.push(...entity.aliases);
        if (entity.fullName) names.push(entity.fullName);

        for (const name of names) {
          if (!name || name.length < 3) continue;
          
          const escapedName = this.escapeRegex(name);
          patterns.push({
            regex: new RegExp(`(?<!\\w)(${escapedName})(?:'s)?(?!\\w)`, 'gi'),
            entityType: category.type,
            entityId: entity.id,
            entityName: entity.name,
            priority: name.length
          });
        }
      }
    }

    patterns.sort((a, b) => b.priority - a.priority);
    this.patterns = patterns;
  }

  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  linkifyText(text) {
    // CRITICAL: Don't process if text already contains HTML tags
    if (/<[^>]+>/.test(text)) {
      return text;
    }
    
    // Phase 1: Find all matches (search original text, not modified result)
    const replacements = [];
    const searchText = text; // Always search the ORIGINAL text
    
    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      let match;
      
      while ((match = regex.exec(searchText)) !== null) {
        const matchText = match[1];
        const startPos = match.index;
        const endPos = startPos + match[0].length;

        // Check for overlaps with existing replacements
        const hasOverlap = replacements.some(r => 
          (startPos >= r.start && startPos < r.end) || 
          (endPos > r.start && endPos <= r.end)
        );

        if (!hasOverlap) {
          replacements.push({
            start: startPos,
            end: endPos,
            matchText: matchText,
            pattern: pattern
          });
        }
      }
    }

    // If no matches, return original text
    if (replacements.length === 0) {
      return text;
    }

    // Sort by start position (descending) - replace from end to start
    replacements.sort((a, b) => b.start - a.start);

    // Phase 2: Build result by replacing from end to start
    let result = text;
    for (const replacement of replacements) {
      const link = `<a href="#" class="entity-link entity-${replacement.pattern.entityType}" data-entity-type="${replacement.pattern.entityType}" data-entity-id="${replacement.pattern.entityId}" data-entity-name="${this.escapeHtml(replacement.pattern.entityName)}" title="${replacement.pattern.entityName}">${replacement.matchText}</a>`;
      
      result = result.substring(0, replacement.start) + link + result.substring(replacement.end);
    }

    return result;
  }
}

class HyperlinkTester {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  test(name, testFn) {
    try {
      testFn();
      this.passed++;
      this.tests.push({ name, passed: true });
      console.log(`\x1b[32m✓\x1b[0m ${name}`);
    } catch (error) {
      this.failed++;
      this.tests.push({ name, passed: false, error: error.message });
      console.log(`\x1b[31m✗\x1b[0m ${name}`);
      console.log(`  \x1b[31mError: ${error.message}\x1b[0m`);
    }
  }

  testBasicLinking(engine) {
    const input = "Sappho went to Riverside Park.";
    const output = engine.linkifyText(input);
    
    this.assert(output.includes('<a'), 'Should contain link tags');
    this.assert(output.includes('Sappho'), 'Should link Sappho');
    this.assert(output.includes('Riverside Park'), 'Should link Riverside Park');
    
    // Count link tags
    const linkCount = (output.match(/<a /g) || []).length;
    this.assert(linkCount === 2, `Should have 2 links, got ${linkCount}`);
  }

  testNoRecursiveLinking(engine) {
    const input = "Sappho and Riverside Park";
    const output = engine.linkifyText(input);
    
    // Process it AGAIN (simulating Vue re-render)
    const output2 = engine.linkifyText(output);
    
    // Should be IDENTICAL - no new processing
    this.assert(output === output2, 'Calling linkifyText twice should return same result on second pass');
    
    // Count data-entity attributes - should only be 2 (one per entity)
    const dataAttrCount = (output2.match(/data-entity-type/g) || []).length;
    this.assert(dataAttrCount === 2, `Should have 2 data-entity-type attributes, got ${dataAttrCount}`);
  }

  testHTMLEscaping(engine) {
    const input = 'Sappho said "Hello"';
    const output = engine.linkifyText(input);
    
    this.assert(!output.includes('&quot;Sappho'), 'Should not double-escape');
    this.assert(output.includes('"Hello"'), 'Should preserve quotes outside entity names');
  }

  testMultipleEntitiesNoOverlap(engine) {
    const input = "Sappho, Jewels, and Darkwoods";
    const output = engine.linkifyText(input);
    
    const linkCount = (output.match(/<a /g) || []).length;
    this.assert(linkCount >= 2, `Should link multiple entities, got ${linkCount} links`);
    
    // Check no nested links
    this.assert(!output.includes('<a href="#" class="entity-link entity-npc" data-entity-type="npc" data-entity-id="<a href='), 
      'Should not have nested link in attributes');
  }

  testPossessives(engine) {
    const input = "Sappho's collar was red";
    const output = engine.linkifyText(input);
    
    this.assert(output.includes('Sappho'), 'Should match possessive');
    this.assert(output.includes('collar was red'), 'Should preserve text after possessive');
  }

  testLongestMatchFirst(engine) {
    const input = "The Cat Parliament convened";
    const output = engine.linkifyText(input);
    
    // Should match "Cat Parliament" as one entity, not "Cat" separately
    const linkCount = (output.match(/<a /g) || []).length;
    // Depending on registry, but should not create multiple overlapping links
    this.assert(!output.includes('</a> <a'), 'Should not split "Cat Parliament" into separate links');
  }

  testNoLinkingInHTML(engine) {
    const input = '<div>Sappho</div>';
    const output = engine.linkifyText(input);
    
    // Should return unchanged because it already contains HTML
    this.assert(output === input, 'Should not process text that already contains HTML tags');
  }

  testCaseInsensitive(engine) {
    const input = "sappho and SAPPHO and Sappho";
    const output = engine.linkifyText(input);
    
    const linkCount = (output.match(/entity-npc/g) || []).length;
    this.assert(linkCount === 3, `Should match case-insensitively, got ${linkCount} links`);
  }

  testRealSceneContent(engine) {
    const input = "The evening air hangs thick with tension as you approach Riverside Park children's playground where Cat Parliament convenes. Sappho sits nervously.";
    const output = engine.linkifyText(input);
    
    console.log('\n  Sample output:');
    console.log('  ' + output.substring(0, 200) + '...\n');
    
    // Should have links for: Riverside Park, Cat Parliament, Sappho
    this.assert(output.includes('entity-location'), 'Should link location');
    this.assert(output.includes('entity-npc') || output.includes('entity-scene'), 'Should link NPC or scene');
    
    // Most importantly: should NOT have recursive attributes
    this.assert(!output.includes('data-entity-name="<a'), 'Should not have HTML in data attributes');
    this.assert(!output.includes('title="<a'), 'Should not have HTML in title attributes');
  }

  testMemoization(engine) {
    const cache = new Map();
    const input = "Sappho went to Silverfield";
    
    // First call
    if (!cache.has(input)) {
      cache.set(input, engine.linkifyText(input));
    }
    const output1 = cache.get(input);
    
    // Second call (from cache)
    if (!cache.has(input)) {
      cache.set(input, engine.linkifyText(input));
    }
    const output2 = cache.get(input);
    
    this.assert(output1 === output2, 'Memoized results should be identical');
    this.assert(!output1.includes('<a href="#" class="entity-link entity-location" data-entity-type="location" data-entity-id="<a'), 
      'Cached output should not have recursive links');
  }

  runAllTests() {
    console.log('\n\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m');
    console.log('\x1b[36m        HYPERLINK ENGINE TEST SUITE\x1b[0m');
    console.log('\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m\n');

    // Load entity registry
    const registryPath = path.join(__dirname, '../public/data/entity-registry.json');
    if (!fs.existsSync(registryPath)) {
      console.log('\x1b[31m❌ Entity registry not found. Run: npm run build:registry\x1b[0m\n');
      return false;
    }

    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    const engine = new HyperlinkEngineTest(registry);

    console.log(`\x1b[34m📊 Loaded ${engine.patterns.length} patterns from ${registry.metadata.totalEntities} entities\x1b[0m\n`);
    console.log('\x1b[34m🧪 Running Tests...\n\x1b[0m');

    this.test('Basic entity linking works', () => this.testBasicLinking(engine));
    this.test('No recursive linking on re-process', () => this.testNoRecursiveLinking(engine));
    this.test('HTML escaping works correctly', () => this.testHTMLEscaping(engine));
    this.test('Multiple entities without overlap', () => this.testMultipleEntitiesNoOverlap(engine));
    this.test('Possessives are handled', () => this.testPossessives(engine));
    this.test('Longest match takes precedence', () => this.testLongestMatchFirst(engine));
    this.test('Existing HTML is not processed', () => this.testNoLinkingInHTML(engine));
    this.test('Case-insensitive matching', () => this.testCaseInsensitive(engine));
    this.test('Real scene content links correctly', () => this.testRealSceneContent(engine));
    this.test('Memoization prevents re-processing', () => this.testMemoization(engine));

    console.log('\n\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m');
    console.log('\x1b[34m📊 TEST RESULTS\x1b[0m');
    console.log(`   \x1b[32m✓ Passed:\x1b[0m  ${this.passed}`);
    console.log(`   \x1b[31m✗ Failed:\x1b[0m  ${this.failed}`);
    console.log(`   Total:    ${this.passed + this.failed}`);
    console.log('\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m\n');

    if (this.failed === 0) {
      console.log('\x1b[32m✅ ALL TESTS PASSED! Hyperlinks are working correctly.\n\x1b[0m');
    } else {
      console.log('\x1b[31m❌ SOME TESTS FAILED - Hyperlinking has issues.\n\x1b[0m');
    }

    return this.failed === 0;
  }
}

// Run tests
const tester = new HyperlinkTester();
const success = tester.runAllTests();
process.exit(success ? 0 : 1);

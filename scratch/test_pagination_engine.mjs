import assert from 'assert';
import { shouldRenderBlock, computePageAssignments, assertNoDuplicateRenderedContent } from '../src/utils/paginationEngine.js';

console.log('Testing Pagination Engine...');

// Test 1: shouldRenderBlock
{
  assert.strictEqual(shouldRenderBlock('header', null), true);
  assert.strictEqual(shouldRenderBlock('header', new Set()), true); // empty set fallback -> renders all
  assert.strictEqual(shouldRenderBlock('header', new Set(['header', 'summary'])), true);
  assert.strictEqual(shouldRenderBlock('exp-0', new Set(['header', 'summary'])), false);
  console.log('✔ Test 1: shouldRenderBlock passed');
}

// Test 2: computePageAssignments with no blocks (content-height fallback)
{
  const mockMeasureEl = {
    scrollHeight: 1600, // ~423mm (fits across 2 pages)
    querySelectorAll: () => []
  };

  const pages = computePageAssignments(mockMeasureEl, {
    pageMargin: 'normal',
    pageBreakOffset: 0
  });

  assert(pages.length >= 2, `Expected at least 2 pages for 423mm content, got ${pages.length}`);
  console.log(`✔ Test 2: Content height fallback computed ${pages.length} pages`);
}

// Test 3: computePageAssignments with no blocks and user clicked "Split Page 2" (pageBreakOffset = -60)
{
  const mockMeasureEl = {
    scrollHeight: 900, // ~238mm (would fit on single page if offset was 0)
    querySelectorAll: () => []
  };

  const pages = computePageAssignments(mockMeasureEl, {
    pageMargin: 'normal',
    pageBreakOffset: -60 // user clicked Split Page 2!
  });

  assert(pages.length >= 2, `Expected at least 2 pages when user clicked Split Page 2, got ${pages.length}`);
  console.log(`✔ Test 3: Split Page 2 forced multi-page successfully (${pages.length} pages)`);
}

// Test 4: computePageAssignments with actual block elements
{
  const createMockBlock = (id, heightPx) => ({
    getAttribute: (name) => name === 'data-block-id' ? id : null,
    getBoundingClientRect: () => ({ height: heightPx })
  });

  // Resume with: header, summary, 5 exp, edu, 5 projects, skills (matching user's resume)
  const blocks = [
    createMockBlock('header', 130), // ~34mm
    createMockBlock('summary', 90), // ~24mm
    createMockBlock('exp-0', 280), // ~74mm
    createMockBlock('edu-0', 110), // ~29mm
    createMockBlock('proj-0', 120), // ~32mm
    createMockBlock('proj-1', 120), // ~32mm
    createMockBlock('proj-2', 120), // ~32mm
    createMockBlock('proj-3', 120), // ~32mm
    createMockBlock('proj-4', 120), // ~32mm
    createMockBlock('skills', 130)  // ~34mm
  ]; // Total ~333mm -> Should definitely split across 2 pages!

  const mockMeasureEl = {
    querySelectorAll: (sel) => sel === '[data-block-id]' ? blocks : []
  };

  const pages = computePageAssignments(mockMeasureEl, {
    pageMargin: 'normal',
    pageBreakOffset: 0
  });

  assert.strictEqual(pages.length, 2, `Expected 2 pages for 333mm resume, got ${pages.length}`);
  assert(pages[0].has('header'), 'Page 1 has header');
  assert(pages[0].has('summary'), 'Page 1 has summary');
  assert(pages[0].has('exp-0'), 'Page 1 has experience');
  assert(pages[1].has('skills'), 'Page 2 has skills');

  // Verify zero duplication
  assertNoDuplicateRenderedContent(pages);
  console.log('✔ Test 4: Real-world resume block pagination partitioned cleanly into 2 pages with ZERO duplication');
}

// Test 5: User clicks "Split Page 2" (pageBreakOffset = -60) on block elements
{
  const createMockBlock = (id, heightPx) => ({
    getAttribute: (name) => name === 'data-block-id' ? id : null,
    getBoundingClientRect: () => ({ height: heightPx }),
    parentElement: null
  });

  const blocks = [
    createMockBlock('header', 100),
    createMockBlock('summary', 80),
    createMockBlock('exp-0', 150),
    createMockBlock('edu-0', 100),
    createMockBlock('proj-0', 120),
    createMockBlock('skills', 100)
  ];

  const mockMeasureEl = {
    querySelectorAll: (sel) => sel === '[data-block-id]' ? blocks : []
  };

  // With offset 0, might fit or not. With offset -60, MUST split to Page 2!
  const pages = computePageAssignments(mockMeasureEl, {
    pageMargin: 'normal',
    pageBreakOffset: -60,
    template: 'asia-compact'
  });

  assert(pages.length >= 2, `Expected at least 2 pages with pageBreakOffset = -60, got ${pages.length}`);
  assert(pages[1].size > 0, 'Page 2 has assigned blocks');
  assertNoDuplicateRenderedContent(pages);
  console.log(`✔ Test 5: Split Page 2 pushed ${pages[1].size} blocks onto Page 2`);
}

// Test 6: Legacy unlisted template uses continuous height fallback and returns empty sets
{
  const mockMeasureEl = {
    scrollHeight: 1500, // ~396mm
    querySelectorAll: () => [
      { getAttribute: () => 'skills', getBoundingClientRect: () => ({ height: 100 }), parentElement: null }
    ]
  };

  const pages = computePageAssignments(mockMeasureEl, {
    pageMargin: 'normal',
    pageBreakOffset: 0,
    template: 'legacy-unlisted' // unlisted template
  });

  assert(pages.length >= 2, `Expected 2 pages for legacy-unlisted, got ${pages.length}`);
  assert.strictEqual(pages[0].size, 0, 'Page 1 has empty set for continuous template fallback');
  assert.strictEqual(pages[1].size, 0, 'Page 2 has empty set for continuous template fallback');
  console.log(`✔ Test 6: Legacy template fallback smoothly returned empty sets for viewport offset`);
}

// Test 7: Nested [data-block-id] elements are filtered out so inner elements are not double-counted
{
  const outerSkillsBlock = {
    getAttribute: (name) => name === 'data-block-id' ? 'skills' : null,
    hasAttribute: (name) => name === 'data-block-id',
    getBoundingClientRect: () => ({ height: 120 }),
    parentElement: null
  };

  const innerSkillsBlock = {
    getAttribute: (name) => name === 'data-block-id' ? 'skills' : null,
    hasAttribute: (name) => name === 'data-block-id',
    getBoundingClientRect: () => ({ height: 100 }),
    parentElement: outerSkillsBlock
  };

  const mockMeasureEl = {
    querySelectorAll: () => [outerSkillsBlock, innerSkillsBlock]
  };
  outerSkillsBlock.parentElement = mockMeasureEl;

  const pages = computePageAssignments(mockMeasureEl, {
    pageMargin: 'normal',
    pageBreakOffset: 0,
    template: 'asia-compact'
  });

  assert.strictEqual(pages[0].size, 1, 'Only outer skills block is counted, inner is skipped');
  assert(pages[0].has('skills'), 'Skills block assigned');
  console.log(`✔ Test 7: Nested [data-block-id] deduplication prevented double counting`);
}

// Test 8: BRE Creative user scenario with physical geometry coordinates and Drag Line at -77mm (220mm cutoff)
{
  // In user's resume:
  // Left sidebar items (all bottom <= 220mm)
  // Right column: exp-0 (bottom 100mm), proj-0 (bottom 180mm), proj-1 (bottom 235mm), profiles (bottom 275mm)
  const createGeoBlock = (id, topMm, bottomMm) => ({
    getAttribute: (name) => name === 'data-block-id' ? id : null,
    getBoundingClientRect: () => ({
      top: topMm * 3.7795,
      bottom: bottomMm * 3.7795,
      height: (bottomMm - topMm) * 3.7795
    }),
    parentElement: null
  });

  const breBlocks = [
    createGeoBlock('header', 0, 50),
    createGeoBlock('summary', 55, 95),
    createGeoBlock('contact', 100, 145),
    createGeoBlock('skills', 150, 195),
    createGeoBlock('exp-0', 0, 85),
    createGeoBlock('proj-0', 95, 160),
    createGeoBlock('proj-1', 165, 235), // Crosses 220mm! (Cutoff is 220mm)
    createGeoBlock('profiles', 240, 275) // Below 220mm!
  ];

  const mockMeasureEl = {
    getBoundingClientRect: () => ({ top: 0, height: 280 * 3.7795 }),
    querySelectorAll: () => breBlocks
  };

  const pages = computePageAssignments(mockMeasureEl, {
    pageMargin: 'normal',
    pageBreakOffset: -77, // Cutoff at 220mm
    template: 'bre-creative'
  });

  assert.strictEqual(pages.length, 2, 'Must split into 2 pages');
  // Page 1 should have blocks that fit before 220mm
  assert(pages[0].has('header'), 'Page 1 has header');
  assert(pages[0].has('proj-0'), 'Page 1 has proj-0');
  assert(!pages[0].has('proj-1'), 'Page 1 must NOT have proj-1 (it crosses the cutoff!)');
  assert(!pages[0].has('profiles'), 'Page 1 must NOT have profiles');

  // Page 2 should cleanly have the entire proj-1 and profiles (ZERO text line chopping!)
  assert(pages[1].has('proj-1'), 'Page 2 has entire unbroken proj-1');
  assert(pages[1].has('profiles'), 'Page 2 has entire unbroken profiles');
  assertNoDuplicateRenderedContent(pages);
  console.log(`✔ Test 8: BRE Creative with Drag Line at -77mm cleanly partitioned proj-1 and profiles to Page 2 with ZERO slicing`);
}

console.log('\nALL 8 PAGINATION ENGINE UNIT TESTS PASSED!');

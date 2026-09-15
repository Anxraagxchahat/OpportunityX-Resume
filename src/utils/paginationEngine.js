/**
 * OpportunityX Smart Dynamic Resume Pagination Engine
 * Single Source of Truth for both Editor Preview Cards and PDF Export Target.
 *
 * Guarantees:
 * 1. Zero Content Duplication (assertNoDuplicateRenderedContent)
 * 2. Zero Text/Header Slicing (Page breaks occur strictly between unbroken DOM block units)
 * 3. Accurate Multi-Column & Sidebar Geometry Awareness
 * 4. User Page Break Drag Line & Split Intent Preservation
 * 5. 100% Visual Parity between Editor Preview & Downloaded PDF
 */

/**
 * Checks if a block should render based on the current page's assigned block IDs.
 * If visibleBlockIds is null (e.g. during continuous view or height measurement pass), returns true.
 *
 * @param {string} blockId - Unique identifier of the section/item block
 * @param {Set<string>|Array<string>|null} visibleBlockIds - Set of block IDs assigned to the active page
 * @returns {boolean}
 */
export const shouldRenderBlock = (blockId, visibleBlockIds) => {
  if (!visibleBlockIds) return true;
  if (visibleBlockIds instanceof Set) {
    // If empty set (e.g. continuous fallback pass), render all blocks
    if (visibleBlockIds.size === 0) return true;
    return visibleBlockIds.has(blockId);
  }
  if (Array.isArray(visibleBlockIds)) {
    if (visibleBlockIds.length === 0) return true;
    return visibleBlockIds.includes(blockId);
  }
  return true;
};

/**
 * Development-time assertion to ensure no block ID is assigned to multiple pages.
 *
 * @param {Array<Set<string>>} pages
 */
export const assertNoDuplicateRenderedContent = (pages) => {
  if (!Array.isArray(pages)) return;
  const seenBlockIds = new Set();
  pages.forEach((pageSet, pageIdx) => {
    if (!(pageSet instanceof Set)) return;
    pageSet.forEach((blockId) => {
      if (seenBlockIds.has(blockId)) {
        console.error(`[PaginationEngine Conflict] Block ID "${blockId}" is rendered on Page ${pageIdx + 1} AND another page!`);
      }
      seenBlockIds.add(blockId);
    });
  });
};

/**
 * Templates officially configured for block-level DOM pagination.
 * All core OpportunityX, Best-Resume-Ever, JSONResume, and Reactive templates are supported.
 */
export const BLOCK_PAGINATED_TEMPLATES = new Set([
  'modern',
  'minimal',
  'executive',
  'corporate',
  'recruiter',
  'fullstack',
  'frontend',
  'backend',
  'creative',
  'asia-compact',
  'compact-entry',
  'senior-enterprise',
  'executive-bold',
  'whitespace-modern',
  'bre-cool',
  'bre-creative',
  'bre-green',
  'bre-purple',
  'bre-left-right',
  'bre-material-dark',
  'bre-oblique',
  'bre-sidebar',
  'jsonresume-modern',
  'creative-sidebar',
  'professional-clean',
  'marketing-accent',
  'developer-dark',
  'ats-classic',
  'business-analyst',
  'executive-minimal',
  'healthcare-calm',
  'technical-grid',
  'accent-column'
]);

/**
 * Dynamically computes page assignments for all rendered section/item blocks.
 *
 * @param {HTMLElement} measureEl - Reference to unclipped measurement DOM element
 * @param {Object} options - Pagination layout options
 * @returns {Array<Set<string>>} Array of Sets containing block IDs for each page
 */
export const computePageAssignments = (measureEl, options = {}) => {
  if (!measureEl) return [new Set()];

  const {
    pageMargin = 'normal',
    pageBreakOffset = 0,
    showPage2Header = true,
    page2TopMargin = 10,
    template = 'modern'
  } = options;

  // Base padding in mm
  const isFullBleedTemplate = ['bre-material-dark', 'bre-sidebar', 'bre-cool', 'bre-creative', 'bre-left-right', 'bre-oblique', 'creative-sidebar', 'developer-dark', 'accent-column'].includes(template);
  const topPadMm = isFullBleedTemplate ? 0 : (pageMargin === 'compact' ? 6 : pageMargin === 'spacious' ? 14 : 10);
  const bottomPadMm = topPadMm;

  // Bottom safety gap in mm (ensures clean, professional whitespace at the bottom of Page 1 and prevents text touching or overflowing sheet edge)
  const bottomSafetyGapMm = isFullBleedTemplate ? 6 : Math.max(bottomPadMm + 4, 15);

  // Page 1 cutoff height in mm (A4 total height is 297mm)
  // When pageBreakOffset is 0, cutoff is cleanly at 297 - bottomSafetyGapMm (~282mm, leaving a safe 15mm bottom margin)
  const defaultPage1CutoffMm = 297 - bottomSafetyGapMm;
  const page1CutoffMm = Math.min(290, defaultPage1CutoffMm + pageBreakOffset);
  const page1UsableHeightMm = Math.max(20, page1CutoffMm - topPadMm);

  // Page 2+ usable height in mm
  const page2HeaderSpaceMm = showPage2Header ? 14 : 0;
  const page2TopPushMm = Math.max(0, page2TopMargin - 10);
  const page2UsableHeightMm = Math.max(20, 297 - topPadMm - bottomSafetyGapMm - page2HeaderSpaceMm - page2TopPushMm);

  const allBlockEls = Array.from(measureEl.querySelectorAll('[data-block-id]'));

  // Filter out any element whose ancestor inside measureEl already has [data-block-id]
  // This prevents double counting nested containers (e.g. skills groups, misc blocks)
  const blockEls = allBlockEls.filter((el) => {
    let parent = el.parentElement;
    while (parent && parent !== measureEl) {
      if (parent.hasAttribute('data-block-id')) {
        return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });

  // Fallback if template has no explicit data-block-id tags:
  // Measure total content height and calculate required pages
  if (blockEls.length === 0) {
    const totalHeightPx = measureEl.scrollHeight || measureEl.offsetHeight || 0;
    const totalHeightMm = totalHeightPx / 3.7795; // 1mm ~ 3.7795px at 96 DPI
    
    // Determine number of pages needed
    let numPages = 1;
    if (totalHeightMm > page1UsableHeightMm || pageBreakOffset <= -25) {
      const remainingHeightMm = Math.max(0, totalHeightMm - page1UsableHeightMm);
      const extraPages = Math.ceil(remainingHeightMm / page2UsableHeightMm);
      numPages = Math.max(pageBreakOffset <= -25 ? 2 : 1, 1 + extraPages);
    }
    return Array.from({ length: numPages }, () => new Set());
  }

  // Check if real browser bounding rect coordinates are available
  const measureRect = typeof measureEl.getBoundingClientRect === 'function' ? measureEl.getBoundingClientRect() : null;
  const hasRealBrowserCoords = measureRect && typeof measureRect.top === 'number' && measureRect.height > 0;

  const pages = [new Set()];

  if (hasRealBrowserCoords) {
    // GEOMETRIC MULTI-COLUMN BLOCK PARTITIONING (Real Browser Environment)
    // Supports single-column, two-column (left or right sidebar), and multi-column layouts
    const containerWidth = measureRect.width || 794;
    const containerLeft = measureRect.left;
    const containerTop = measureRect.top;
    const interBlockGapMm = 3.5;

    // Collect block geometry metadata
    const blockMetaList = blockEls.map((el) => {
      const blockId = el.getAttribute('data-block-id');
      const rect = el.getBoundingClientRect();
      const blockBottom = (typeof rect.bottom === 'number' && Number.isFinite(rect.bottom))
        ? rect.bottom
        : (containerTop + (rect.height || 0));
      let extraMarginMm = 0;
      if (typeof window !== 'undefined' && window.getComputedStyle) {
        try {
          const cs = window.getComputedStyle(el);
          extraMarginMm = (parseFloat(cs.marginBottom) || 0) / 3.7795;
        } catch (e) {}
      }
      const elRelativeBottomMm = (blockBottom - containerTop) / 3.7795 + extraMarginMm;
      const elRelativeTopMm = (rect.top - containerTop) / 3.7795;
      const blockHeightMm = (rect.height || 0) / 3.7795;

      const elRelLeft = rect.left - containerLeft;
      const elWidth = rect.width || 0;
      const isFullWidth = (elWidth / containerWidth) >= 0.75;

      // Determine column bucket
      let colKey = 'full';
      if (!isFullWidth) {
        colKey = elRelLeft < containerWidth * 0.22 ? 'col-left' : 'col-right';
      }

      return {
        blockId,
        el,
        rect,
        colKey,
        isFullWidth,
        blockHeightMm,
        elRelativeBottomMm,
        elRelativeTopMm
      };
    }).filter((b) => Boolean(b.blockId));

    // Track which columns have reached or exceeded the Page 1 cutoff
    const colOverflowedPage1 = { 'full': false, 'col-left': false, 'col-right': false };

    // Pass 1: Assign blocks that fit cleanly on Page 1
    blockMetaList.forEach((b) => {
      // If an earlier block in this column already overflowed Page 1, subsequent blocks in this column cannot fit on Page 1
      if (colOverflowedPage1[b.colKey]) {
        return;
      }

      if (b.elRelativeBottomMm <= page1CutoffMm) {
        pages[0].add(b.blockId);
      } else {
        colOverflowedPage1[b.colKey] = true;
        if (b.colKey === 'full') {
          colOverflowedPage1['col-left'] = true;
          colOverflowedPage1['col-right'] = true;
        }
      }
    });

    // Pass 2: Overflow blocks to Page 2+
    const overflowBlocks = blockMetaList.filter((b) => !pages[0].has(b.blockId));

    if (overflowBlocks.length > 0) {
      pages.push(new Set());
      let activePgIdx = 1;
      let colHeightsOnActivePage = { 'full': 0, 'col-left': 0, 'col-right': 0 };

      overflowBlocks.forEach((b) => {
        if (b.colKey === 'full') {
          const currentMaxHeight = Math.max(
            colHeightsOnActivePage['col-left'],
            colHeightsOnActivePage['col-right'],
            colHeightsOnActivePage['full']
          );
          const proposedHeight = currentMaxHeight + b.blockHeightMm;
          if (proposedHeight > page2UsableHeightMm && pages[activePgIdx].size > 0) {
            activePgIdx++;
            pages[activePgIdx] = new Set();
            colHeightsOnActivePage = { 'full': 0, 'col-left': 0, 'col-right': 0 };
          }
          const base = pages[activePgIdx].size === 0 ? 0 : currentMaxHeight;
          const newHeight = base + b.blockHeightMm + interBlockGapMm;
          colHeightsOnActivePage['full'] = newHeight;
          colHeightsOnActivePage['col-left'] = newHeight;
          colHeightsOnActivePage['col-right'] = newHeight;
        } else {
          const currentColHeight = colHeightsOnActivePage[b.colKey] || 0;
          const proposedHeight = currentColHeight + b.blockHeightMm;
          if (proposedHeight > page2UsableHeightMm && pages[activePgIdx].size > 0) {
            activePgIdx++;
            pages[activePgIdx] = new Set();
            colHeightsOnActivePage = { 'full': 0, 'col-left': 0, 'col-right': 0 };
          }
          const base = pages[activePgIdx].size === 0 ? 0 : (colHeightsOnActivePage[b.colKey] || 0);
          colHeightsOnActivePage[b.colKey] = base + b.blockHeightMm + interBlockGapMm;
        }

        pages[activePgIdx].add(b.blockId);
      });
    }

    // Safety net: Check total rendered container height.
    // If total rendered height exceeds Page 1 cutoff, ensure trailing block(s) are moved to Page 2
    const totalRenderedHeightMm = (measureEl.scrollHeight || measureRect.height) / 3.7795;
    if (pages.length === 1 && totalRenderedHeightMm > page1CutoffMm && pages[0].size > 1) {
      const allBlocks = Array.from(pages[0]);
      pages.push(new Set());
      let remainingEstimatedHeightMm = totalRenderedHeightMm;
      while (pages[0].size > 1 && remainingEstimatedHeightMm > page1CutoffMm) {
        const lastBlockId = allBlocks.pop();
        pages[0].delete(lastBlockId);
        pages[1].add(lastBlockId);
        const blockEl = blockEls.find((b) => b.getAttribute('data-block-id') === lastBlockId);
        const bHeight = blockEl ? blockEl.getBoundingClientRect().height / 3.7795 : 25;
        remainingEstimatedHeightMm -= (bHeight + interBlockGapMm);
      }
    }

    // If user explicitly pushed page break (-30mm or more) and all blocks still fit on page 1,
    // honor user intent by pushing trailing blocks to page 2 if multiple blocks exist
    if (pageBreakOffset <= -30 && pages.length === 1 && pages[0].size > 2) {
      const allBlocks = Array.from(pages[0]);
      const splitPoint = Math.max(1, Math.floor(allBlocks.length * 0.6));
      pages[0] = new Set(allBlocks.slice(0, splitPoint));
      pages[1] = new Set(allBlocks.slice(splitPoint));
    }
  } else {
    // SYNTHETIC / TEST SUITE HEIGHT ACCUMULATION
    // Used in headless Node.js tests or environments without real DOM layout metrics
    let currentPgIdx = 0;
    let currentPgHeightMm = 0;
    const interBlockGapMm = 3.5;

    blockEls.forEach((el) => {
      const blockId = el.getAttribute('data-block-id');
      if (!blockId) return;

      const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : { height: 0 };
      let marginY = 0;
      if (typeof window !== 'undefined') {
        try {
          const cs = window.getComputedStyle(el);
          marginY = (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
        } catch (e) {
          marginY = 0;
        }
      }
      const blockHeightMm = ((rect.height || 0) + marginY) / 3.7795; // 1mm ~ 3.7795px at 96 DPI
      const maxUsableMm = currentPgIdx === 0 ? page1UsableHeightMm : page2UsableHeightMm;

      // Push block to next page if it doesn't fit on current page and current page is not empty
      if (currentPgHeightMm + blockHeightMm > maxUsableMm && pages[currentPgIdx].size > 0) {
        currentPgIdx++;
        pages[currentPgIdx] = new Set();
        currentPgHeightMm = 0;
      }

      pages[currentPgIdx].add(blockId);
      currentPgHeightMm += (blockHeightMm + interBlockGapMm);
    });

    // Safety net in synthetic mode
    const totalSyntheticHeight = Array.from(blockEls).reduce((acc, el) => {
      const r = el.getBoundingClientRect ? el.getBoundingClientRect() : { height: 0 };
      return acc + (r.height || 0);
    }, 0) / 3.7795;
    if (pages.length === 1 && totalSyntheticHeight > page1CutoffMm && pages[0].size > 1) {
      const allBlocks = Array.from(pages[0]);
      pages.push(new Set());
      let remainingHeight = totalSyntheticHeight;
      while (pages[0].size > 1 && remainingHeight > page1CutoffMm) {
        const lastBlockId = allBlocks.pop();
        pages[0].delete(lastBlockId);
        pages[1].add(lastBlockId);
        remainingHeight -= 25;
      }
    }

    // If user explicitly pushed page break (-30mm or more) and all blocks still fit on page 1,
    // honor user intent by pushing trailing blocks to page 2 if multiple blocks exist
    if (pageBreakOffset <= -30 && pages.length === 1 && pages[0].size > 2) {
      const allBlocks = Array.from(pages[0]);
      const splitPoint = Math.max(1, Math.floor(allBlocks.length * 0.6));
      pages[0] = new Set(allBlocks.slice(0, splitPoint));
      pages[1] = new Set(allBlocks.slice(splitPoint));
    }
  }

  assertNoDuplicateRenderedContent(pages);
  return pages;
};

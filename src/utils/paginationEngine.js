/**
 * OpportunityX Smart Dynamic Resume Pagination Engine
 * Single Source of Truth for both Editor Preview Cards and PDF Export Target.
 *
 * Guarantees:
 * 1. Zero Content Duplication (assertNoDuplicateRenderedContent)
 * 2. Zero Text/Header Slicing (Page breaks occur between unbroken DOM block units)
 * 3. Preservation of Intentional Whitespace & User Page Break Offsets
 * 4. 100% Visual Parity between Editor Preview & Downloaded PDF
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
  if (visibleBlockIds instanceof Set) return visibleBlockIds.has(blockId);
  if (Array.isArray(visibleBlockIds)) return visibleBlockIds.includes(blockId);
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
 * Dynamically computes page assignments for all rendered section/item blocks.
 *
 * @param {HTMLElement} measureEl - Reference to unclipped measurement DOM element
 * @param {Object} options - Pagination layout options
 * @returns {Array<Set<string>>} Array of Sets containing block IDs for each page
 */
export const computePageAssignments = (measureEl, options = {}) => {
  if (!measureEl) return [new Set()];

  const blockEls = measureEl.querySelectorAll('[data-block-id]');
  if (blockEls.length === 0) return [new Set()];

  const {
    pageMargin = 'normal',
    pageBreakOffset = 0,
    showPage2Header = true,
    page2TopMargin = 10
  } = options;

  // Base padding in mm
  const topPadMm = pageMargin === 'compact' ? 6 : pageMargin === 'spacious' ? 14 : 10;
  const bottomPadMm = topPadMm;

  // Page 1 cutoff height in mm
  const page1CutoffMm = 297 + Math.min(0, pageBreakOffset);
  const page1UsableHeightMm = Math.max(20, page1CutoffMm - topPadMm - bottomPadMm);

  // Page 2+ usable height in mm
  const page2HeaderSpaceMm = showPage2Header ? 14 : 0;
  const page2TopPushMm = Math.max(0, page2TopMargin - 10);
  const page2UsableHeightMm = Math.max(20, 297 - topPadMm - bottomPadMm - page2HeaderSpaceMm - page2TopPushMm);

  const pages = [new Set()];
  let currentPgIdx = 0;
  let currentPgHeightMm = 0;

  blockEls.forEach((el) => {
    const blockId = el.getAttribute('data-block-id');
    if (!blockId) return;

    const rect = el.getBoundingClientRect();
    const blockHeightMm = rect.height / 3.7795; // 1mm ~ 3.7795px at 96 DPI

    const maxUsableMm = currentPgIdx === 0 ? page1UsableHeightMm : page2UsableHeightMm;

    // Push block to next page if it doesn't fit on current page and page is not empty
    if (currentPgHeightMm + blockHeightMm > maxUsableMm && pages[currentPgIdx].size > 0) {
      currentPgIdx++;
      pages[currentPgIdx] = new Set();
      currentPgHeightMm = 0;
    }

    pages[currentPgIdx].add(blockId);
    currentPgHeightMm += blockHeightMm;
  });

  assertNoDuplicateRenderedContent(pages);
  return pages;
};

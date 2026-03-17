/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AIG Japan section breaks and section-metadata.
 * Reads sections from payload.template.sections (page-templates.json).
 * Inserts <hr> before each section (except first) and section-metadata blocks
 * for sections with a style property.
 * Runs in afterTransform only (after block parsing).
 *
 * Sections marked with data-section-handled by parsers are skipped to avoid
 * duplicate section breaks and metadata.
 */
const TransformHook = { afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const { template } = payload || {};
  if (!template || !template.sections || template.sections.length < 2) return;

  const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };

  // Process sections in reverse order to avoid position shifts
  const sections = [...template.sections].reverse();

  for (const section of sections) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    let sectionEl = null;

    for (const sel of selectors) {
      try {
        sectionEl = element.querySelector(sel);
      } catch (e) {
        // selector may not be supported, try next
      }
      if (sectionEl) break;
    }

    if (!sectionEl) continue;

    // Skip sections already handled by block parsers (e.g. columns-product-detail)
    if (sectionEl.getAttribute('data-section-handled')) continue;

    // Special handling for archives section: it may be deeply nested inside
    // another section (e.g. the policyholders section or CTA experience fragment).
    // In that case, a simple <hr> before it won't create a section break because
    // the <hr> ends up nested too deep. Instead, extract the archives content
    // and place it at the top level of the DOM tree.
    if (section.id === 'section-6b-archives') {
      // Find the h3 title and list within the archives fragment
      const titleEl = sectionEl.querySelector('.cmp-title__text')
        || sectionEl.querySelector('h3');
      const listEl = sectionEl.querySelector('ul');
      if (!titleEl || !listEl) continue;

      // Clone the archives content
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent;
      const ul = listEl.cloneNode(true);

      // Place archives as a direct child of element (body) to ensure proper section break.
      // Deep nesting prevents <hr> from being recognized as a section boundary.
      // Insert before the approve-no <hr> (appended by cleanup transformer) or at the end.
      const bodyChildren = [...element.children];
      const approveHr = bodyChildren.find(c => c.tagName === 'HR');

      const hr = document.createElement('hr');
      if (approveHr) {
        approveHr.before(hr, h3, ul);
      } else {
        element.append(hr, h3, ul);
      }

      // Add section-metadata if the archives section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        ul.after(metaBlock);
      }

      // Remove the original archives fragment to avoid duplication
      sectionEl.remove();
      continue;
    }

    // Add section-metadata block after section element if section has a style
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(metaBlock);
    }

    // Add <hr> section break before this section (skip for first section)
    if (section.id !== template.sections[0].id) {
      const hr = document.createElement('hr');
      sectionEl.before(hr);
    }
  }
}

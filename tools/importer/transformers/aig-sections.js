/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AIG Japan section breaks and section-metadata.
 * Reads sections from payload.template.sections (page-templates.json).
 * Inserts <hr> before each section (except first) and section-metadata blocks
 * for sections with a style property.
 * Runs in afterTransform only (after block parsing).
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

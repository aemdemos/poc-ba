/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-product-detail
 * Base block: columns
 * Source: https://www.aig.co.jp/sonpo/personal/product
 * Selector: .cmp-section--primary .cmp-columncontainer--2col-1_3:has(.cmp-button-caption)
 *
 * Two-column product section with heading on the left and product card buttons
 * (title + description) on the right. Distinguished from columns-product-nav
 * by the presence of .cmp-button-caption elements.
 *
 * Each product section lives inside an ace-section with either cmp-section--blue
 * (light blue bg) or cmp-section--light-gray (gray bg). The parser emits an <hr>
 * section break before the block and a section-metadata block after it.
 * It marks the parent .ace-section with data-section-handled so the
 * aig-sections transformer skips it (avoids duplicate metadata).
 */
export default function parse(element, { document }) {
  const columnItems = element.querySelectorAll(':scope > .cmp-columncontainer-item');

  // Column 1: heading
  const col1 = document.createElement('div');
  const heading = columnItems[0]?.querySelector('h2.cmp-title__text, h2, h3');
  if (heading) col1.append(heading);

  // Column 2: product card buttons (title + description pairs)
  const col2 = document.createElement('div');
  if (columnItems[1]) {
    const buttons = columnItems[1].querySelectorAll('a.cmp-button');
    buttons.forEach((btn) => {
      const titleEl = btn.querySelector('.cmp-button-main__text');
      const captionEl = btn.querySelector('.cmp-button-caption');

      // Title link
      const titleLink = document.createElement('a');
      titleLink.href = btn.href || btn.getAttribute('href');
      titleLink.textContent = titleEl ? titleEl.textContent.trim() : btn.textContent.trim();
      const titleP = document.createElement('p');
      titleP.append(titleLink);
      col2.append(titleP);

      // Description paragraph (if present)
      if (captionEl) {
        const descP = document.createElement('p');
        descP.textContent = captionEl.textContent.trim();
        col2.append(descP);
      }
    });

    // Preserve footnote lists (e.g., (注) 事業専用車とは...)
    const footnoteLists = columnItems[1].querySelectorAll(':scope > ul, :scope > .aem-Grid > .ace-list ul');
    footnoteLists.forEach((ul) => {
      const newUl = document.createElement('ul');
      ul.querySelectorAll('li').forEach((li) => {
        const newLi = document.createElement('li');
        newLi.textContent = li.textContent.trim();
        newUl.append(newLi);
      });
      col2.append(newUl);
    });
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-product-detail', cells });

  // Detect section background from parent ace-section
  const parentSection = element.closest('.ace-section');
  const isBlue = parentSection?.classList.contains('cmp-section--blue');
  const sectionStyle = isBlue ? 'blue-background' : 'light-gray';

  // Create section-metadata block for the background style
  const sectionMeta = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: { style: sectionStyle },
  });

  // Create a wrapper fragment: <hr> + block + section-metadata
  const fragment = document.createDocumentFragment();
  fragment.append(document.createElement('hr'));
  fragment.append(block);
  fragment.append(sectionMeta);

  element.replaceWith(fragment);

  // Mark parent section as handled so the aig-sections transformer skips it
  if (parentSection) {
    parentSection.setAttribute('data-section-handled', 'true');
  }
}

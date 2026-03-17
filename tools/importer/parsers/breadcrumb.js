/* eslint-disable */
/* global WebImporter */

/**
 * Parser: breadcrumb
 * Base block: breadcrumb
 * Source: https://www.aig.co.jp/sonpo/business
 * Selector: .ace-breadcrumb
 *
 * Breadcrumb block table structure (from hand-authored /sonpo/personal):
 *   Row 1: [linked-item, linked-item, ..., current-page-text]
 *   Each cell = one breadcrumb level.
 *   Linked items: <a href="...">text</a>
 *   Current page (last item): plain text
 *
 * Source DOM: div.ace-breadcrumb > nav.cmp-breadcrumb > ol.cmp-breadcrumb__list
 *   > li.cmp-breadcrumb__item > a (linked) or span/text (current page)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-breadcrumb__item');
  if (!items.length) return;

  const cells = [];

  items.forEach((li, i) => {
    const anchor = li.querySelector('a');
    const row = [];

    if (anchor && i < items.length - 1) {
      const link = document.createElement('a');
      link.href = anchor.href || anchor.getAttribute('href');
      link.textContent = anchor.textContent.trim();
      row.push(link);
    } else {
      row.push(li.textContent.trim());
    }

    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);

  // Section break after breadcrumb (before hero)
  const hr = document.createElement('hr');
  block.after(hr);
}

/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-product-nav
 * Base block: columns
 * Source: https://www.aig.co.jp/sonpo/personal
 * Selector: .cmp-section--light-gray:not(.cmp-section--background-full) .cmp-columncontainer--2col-1_3
 *
 * Columns block table structure (from library):
 *   Row 1+: N cells per row, each cell = one column's content
 *
 * Source DOM: .cmp-columncontainer--2col-1_3 has 2 column items:
 *   Column 1 (1/3 width): h2 heading "個人向け商品一覧"
 *   Column 2 (2/3 width): nested column containers with 6 button links in 3 rows of 2
 */
export default function parse(element, { document }) {
  const columnItems = element.querySelectorAll(':scope > .cmp-columncontainer-item');

  // Column 1: heading
  const col1 = document.createElement('div');
  const heading = columnItems[0]?.querySelector('h2.cmp-title__text, h2, h3');
  if (heading) col1.append(heading);

  // Column 2: all button links extracted into a flat list
  const col2 = document.createElement('div');
  if (columnItems[1]) {
    const buttons = columnItems[1].querySelectorAll('a.cmp-button');
    buttons.forEach((btn) => {
      const text = btn.querySelector('.cmp-button-main__text');
      const link = document.createElement('a');
      link.href = btn.href || btn.getAttribute('href');
      link.textContent = text ? text.textContent.trim() : btn.textContent.trim();
      const p = document.createElement('p');
      p.append(link);
      col2.append(p);
    });
  }

  const cells = [[col1, col2]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-product-nav', cells });
  element.replaceWith(block);
}

/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-cta
 * Base block: columns
 * Source: https://www.aig.co.jp/sonpo/personal
 * Selector: .cmp-experiencefragment--cta-personal-products .cmp-columncontainer--3
 *
 * Columns block table structure (from library):
 *   Row 1+: N cells per row, each cell = one column's content
 *
 * Source DOM: .cmp-columncontainer--3 with 3 columns, each containing an icon button:
 *   a.cmp-button > .cmp-button-main > [.cmp-button-main__icon + .cmp-button-main__text]
 * Icons: icon-office-location, icon-document, icon-contact
 * Texts: お近くのAIG損保, 資料請求, お問い合わせ
 */
export default function parse(element, { document }) {
  const columnItems = element.querySelectorAll(':scope > .cmp-columncontainer-item');

  const cols = [];
  columnItems.forEach((colItem) => {
    const col = document.createElement('div');
    const btn = colItem.querySelector('a.cmp-button');
    if (btn) {
      const text = btn.querySelector('.cmp-button-main__text');
      const link = document.createElement('a');
      link.href = btn.href || btn.getAttribute('href');
      link.textContent = text ? text.textContent.trim() : btn.textContent.trim();

      const p = document.createElement('p');
      p.append(link);
      col.append(p);
    }
    cols.push(col);
  });

  const cells = [cols];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}

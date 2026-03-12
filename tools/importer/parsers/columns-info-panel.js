/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-info-panel
 * Base block: columns
 * Source: https://www.aig.co.jp/sonpo/personal
 * Selector: .cmp-section--background-full .cmp-columncontainer:has(.cmp-section--white)
 *
 * Columns block table structure (from library):
 *   Row 1+: N cells per row, each cell = one column's content
 *
 * Source DOM: 2-column layout inside "ご契約者さま" section.
 * Each column contains a .cmp-section--white card panel with:
 *   - h3 heading with border
 *   - Icon buttons (a.cmp-button with .cmp-button-main__icon and .cmp-button-main__text)
 *   - Optional captions (.cmp-button-caption)
 *   - Text paragraphs and links
 *
 * Left panel: 契約内容の確認・変更が必要なお客さま (contact/service buttons + text)
 * Right panel: ご契約者向け各種情報サービス (service buttons with captions + link list)
 */
export default function parse(element, { document }) {
  const columnItems = element.querySelectorAll(':scope > .cmp-columncontainer-item');

  const cols = [];
  columnItems.forEach((colItem) => {
    const col = document.createElement('div');
    const whiteSection = colItem.querySelector('.cmp-section--white');
    if (!whiteSection) {
      cols.push(col);
      return;
    }

    // Panel heading (h3)
    const heading = whiteSection.querySelector('h3.cmp-section-header__title, h3');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      col.append(h3);
    }

    // Process content in order: buttons with captions, text, and links
    const contentArea = whiteSection.querySelector('.cmp-section-content');
    if (contentArea) {
      const items = contentArea.querySelectorAll(':scope > div');
      items.forEach((item) => {
        // Button link
        const btn = item.querySelector('a.cmp-button');
        if (btn) {
          const text = btn.querySelector('.cmp-button-main__text');
          const caption = btn.querySelector('.cmp-button-caption');
          const link = document.createElement('a');
          link.href = btn.href || btn.getAttribute('href');
          link.textContent = text ? text.textContent.trim() : btn.textContent.trim();
          const p = document.createElement('p');
          p.append(link);
          col.append(p);
          if (caption) {
            const small = document.createElement('p');
            small.textContent = caption.textContent.trim();
            col.append(small);
          }
          return;
        }

        // Text content (paragraphs, links, lists)
        const textDiv = item.querySelector('.cmp-text');
        if (textDiv) {
          const children = textDiv.querySelectorAll('p, ul');
          children.forEach((child) => {
            col.append(child.cloneNode(true));
          });
        }
      });
    }

    cols.push(col);
  });

  const cells = [cols];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info-panel', cells });
  element.replaceWith(block);
}

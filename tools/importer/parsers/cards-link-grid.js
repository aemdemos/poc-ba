/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-link-grid
 * Base block: cards
 * Source: https://www.aig.co.jp/sonpo/personal
 * Selector: .cmp-experiencefragment--utility-personal .cmp-columncontainer--3
 *
 * Cards block table structure (from library):
 *   Each row = 1 card with 2 cells: [image | text content]
 *   For no-image cards: first cell empty, second cell has text/links
 *
 * Source DOM: 2 .cmp-columncontainer--3 elements, each with 3 button links.
 * Total 6 text-only link buttons arranged in a grid.
 * Each button: a.cmp-button > .cmp-button-main > .cmp-button-main__text
 */
export default function parse(element, { document }) {
  // Collect all button links from all .cmp-columncontainer--3 containers
  const buttons = element.querySelectorAll('a.cmp-button');

  const cells = [];
  buttons.forEach((btn) => {
    const text = btn.querySelector('.cmp-button-main__text');
    const link = document.createElement('a');
    link.href = btn.href || btn.getAttribute('href');
    link.textContent = text ? text.textContent.trim() : btn.textContent.trim();

    const p = document.createElement('p');
    p.append(link);

    // Cards: 2 cells per row [image, text]. No image here, so empty first cell.
    cells.push(['', p]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-link-grid', cells });
  element.replaceWith(block);
}

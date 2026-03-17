/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-teaser
 * Base block: cards
 * Source: https://www.aig.co.jp/sonpo/business
 * Selector: .cmp-columncontainer:has(.ace-teaser)
 *
 * Cards block table structure:
 *   Each row = [image, content (title + description)]
 *
 * Source DOM: .cmp-columncontainer containing .cmp-columncontainer-items,
 * each with an .ace-teaser > .cmp-teaser containing:
 *   a.cmp-teaser__link > .cmp-teaser__image > img
 *                       > .cmp-teaser__content > h3.cmp-teaser__title + p.cmp-teaser__description
 */
export default function parse(element, { document }) {
  const teasers = element.querySelectorAll('.ace-teaser .cmp-teaser');
  if (!teasers.length) return;

  const cells = [];
  teasers.forEach((teaser) => {
    const link = teaser.querySelector('a.cmp-teaser__link');
    const img = teaser.querySelector('.cmp-teaser__image img');
    const title = teaser.querySelector('.cmp-teaser__title');
    const desc = teaser.querySelector('.cmp-teaser__description');

    // Image cell
    const imgCell = document.createElement('div');
    if (img) {
      const picture = document.createElement('img');
      picture.src = img.src || img.getAttribute('src') || '';
      picture.alt = img.alt || '';
      imgCell.append(picture);
    }

    // Content cell
    const contentCell = document.createElement('div');
    if (title) {
      const h3 = document.createElement('h3');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href');
        a.textContent = title.textContent.trim();
        h3.append(a);
      } else {
        h3.textContent = title.textContent.trim();
      }
      contentCell.append(h3);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.append(p);
    }

    cells.push([imgCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}

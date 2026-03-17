/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-showcase
 * Base block: columns
 * Source: https://www.aig.co.jp/sonpo/personal
 * Selector: .ace-section.cmp-section--light-gray:not(.cmp-section--primary) .cmp-columncontainer
 *
 * Columns block table structure (from library):
 *   Row 1+: N cells per row, each cell = one column's content
 *
 * Source DOM: 2-column layout inside "もっとAIG" section.
 * Each column contains: h3 title, thumbnail image, description paragraph,
 * and a teaser card (image + heading + tag).
 */
export default function parse(element, { document }) {
  const columnItems = element.querySelectorAll(':scope > .cmp-columncontainer-item');

  const cols = [];
  columnItems.forEach((colItem) => {
    const col = document.createElement('div');

    // Category title (h3)
    const title = colItem.querySelector('h3.cmp-title__text, h3');
    if (title) col.append(title);

    // Thumbnail image
    const thumbImg = colItem.querySelector('.ace-image:not(.ace-teaser .ace-image) img.cmp-image__image, .ace-image > .cmp-image img');
    if (thumbImg) col.append(thumbImg);

    // Description paragraph
    const desc = colItem.querySelector('.ace-text .cmp-text p, .cmp-text p');
    if (desc) col.append(desc);

    // Teaser card: image + heading + tag
    const teaser = colItem.querySelector('.ace-teaser .cmp-teaser');
    if (teaser) {
      const teaserLink = teaser.querySelector('a.cmp-teaser__link');
      const teaserImg = teaser.querySelector('.cmp-teaser__image img');
      const teaserTitle = teaser.querySelector('.cmp-teaser__title');
      const teaserTag = teaser.querySelector('.cmp-teaser__tag span');

      // Build teaser as linked content
      if (teaserLink) {
        const link = document.createElement('a');
        link.href = teaserLink.href || teaserLink.getAttribute('href');
        if (teaserImg) {
          const img = document.createElement('img');
          img.src = teaserImg.src || teaserImg.getAttribute('src');
          img.alt = teaserImg.alt || '';
          link.append(img);
        }
        if (teaserTitle) {
          const h4 = document.createElement('h4');
          h4.textContent = teaserTitle.textContent.trim();
          link.append(h4);
        }
        if (teaserTag) {
          const em = document.createElement('em');
          em.textContent = teaserTag.textContent.trim();
          link.append(em);
        }
        col.append(link);
      }
    }

    cols.push(col);
  });

  const cells = [cols];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-showcase', cells });
  element.replaceWith(block);
}

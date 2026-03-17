/* eslint-disable */
/* global WebImporter */

/**
 * Parser: anchor-nav
 * Source: https://www.aig.co.jp/sonpo/personal/product
 * Selector: .ace-list.cmp-list--anchor
 *
 * Converts the horizontal anchor link list (pill-shaped buttons with down-arrow icons)
 * into an anchor-nav block containing a <ul> with anchor links.
 *
 * NOTE: This parser only matches on product listing pages (e.g. /sonpo/personal/product),
 * not on the main category landing pages.
 */
export default function parse(element, { document }) {
  const links = element.querySelectorAll('a');
  if (!links.length) return;

  const ul = document.createElement('ul');
  links.forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.getAttribute('href') || link.href;
    a.textContent = link.textContent.trim();
    li.append(a);
    ul.append(li);
  });

  const wrapper = document.createElement('div');
  wrapper.append(ul);

  const cells = [[wrapper]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'anchor-nav', cells });
  element.replaceWith(block);
}

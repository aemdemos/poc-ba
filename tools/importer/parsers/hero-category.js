/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-category
 * Base block: hero
 * Source: https://www.aig.co.jp/sonpo/personal
 * Selector: .ace-heroimage.cmp-heroimage--width-full
 *
 * Hero block table structure:
 *   Row 1: PC background image + SP/mobile image (two images)
 *   Row 2: heading and description text
 *
 * Source DOM: .cmp-heroimage contains CSS background images on .cmp-heroimage-image divs
 * (pc-only and sp-only), with overlaid h1 and p content.
 */

function extractBgUrl(el) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const urlMatch = style.match(/background-image:\s*url\(['"]?(.+?)['"]?\)/);
  if (!urlMatch) return null;
  let rawUrl = urlMatch[1];
  // Decode CSS hex escapes like \2f → /
  rawUrl = rawUrl.replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  if (rawUrl.startsWith('/')) {
    rawUrl = `https://www.aig.co.jp${rawUrl}`;
  }
  return rawUrl;
}

export default function parse(element, { document }) {
  // Extract PC (desktop) and SP (mobile) background image URLs
  const pcUrl = extractBgUrl(element.querySelector('.cmp-heroimage-image.pc-only'));
  const spUrl = extractBgUrl(element.querySelector('.cmp-heroimage-image.sp-only'));

  // Build image row with both PC and SP images
  const imgCell = [];
  if (pcUrl) {
    const pcImg = document.createElement('img');
    pcImg.src = pcUrl;
    pcImg.alt = '';
    imgCell.push(pcImg);
  }
  if (spUrl) {
    const spImg = document.createElement('img');
    spImg.src = spUrl;
    spImg.alt = '';
    imgCell.push(spImg);
  }

  // Extract heading and description
  const heading = element.querySelector('h1.cmp-heroimage-content__title, h1, h2');
  const description = element.querySelector('p.cmp-heroimage-content__description, p');

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);

  // Build block rows: row 1 = images, row 2 = content
  const cells = [];
  if (imgCell.length > 0) {
    cells.push([imgCell]);
  }
  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-category', cells });
  element.replaceWith(block);
}

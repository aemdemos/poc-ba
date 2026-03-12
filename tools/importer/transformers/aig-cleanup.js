/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AIG Japan site cleanup.
 * Selectors from captured DOM of https://www.aig.co.jp/sonpo/personal
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove floating CTA overlay (blocks parsing, duplicates CTA section content)
    // Found: div.cmp-float-cta (line 2125 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.cmp-float-cta']);

    // Remove skip-navigation hidden links
    // Found: div.navihidden (lines 19, 1637 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.navihidden']);

    // Resolve lazy-loaded images: data-cmp-src is on parent .cmp-image container,
    // not on the <img> itself. URL contains {.width} responsive template.
    element.querySelectorAll('.cmp-image[data-cmp-src]').forEach((container) => {
      const dataCmpSrc = container.getAttribute('data-cmp-src');
      if (dataCmpSrc) {
        const realSrc = dataCmpSrc.replace('{.width}', '1280');
        const img = container.querySelector('img.cmp-image__image');
        if (img) {
          const src = img.getAttribute('src') || '';
          if (src.includes('blank.gif') || src.includes('spacer.gif')) {
            img.setAttribute('src', realSrc);
          }
        }
      }
    });

    // Remove mobile (SP) duplicate images before parsers run
    // cmp-image__spimage = actual SP/mobile image (REMOVE)
    // cmp-image__setsp = PC image with SP variant flag (KEEP!)
    element.querySelectorAll('img.cmp-image__spimage').forEach((img) => {
      img.remove();
    });

    // Remove tracking pixels before they get into content
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('bat.bing.com') || src.includes('analytics') || src.includes('pixel')
          || src.includes('tracking')) {
        img.remove();
      }
    });
  }

  if (hookName === H.after) {
    // Remove site header experience fragment (non-authorable)
    // Found: div.cmp-experiencefragment--site-header (line 6 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--site-header']);

    // Remove site footer experience fragment (non-authorable)
    // Found: div.cmp-experiencefragment--site-footer (line 2365 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--site-footer']);

    // Remove breadcrumb navigation (non-authorable)
    // Found: div.ace-breadcrumb > nav.cmp-breadcrumb (line 1648 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.ace-breadcrumb']);

    // Remove iframes, link elements, noscript
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);

    // Clean up any remaining unwanted images missed by beforeTransform
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('blank.gif') || src.includes('spacer.gif')
          || src.includes('bat.bing.com') || src.includes('analytics')
          || src.includes('pixel') || src.includes('tracking')) {
        img.remove();
      }
    });
  }
}

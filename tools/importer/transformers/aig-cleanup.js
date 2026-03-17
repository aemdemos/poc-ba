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
        const realSrc = dataCmpSrc.replace('{.width}', '.1280');
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

    // Tag sections with heading text for reliable section matching (survives parser execution)
    element.querySelectorAll('.ace-section .cmp-section-header__title').forEach((heading) => {
      const section = heading.closest('.ace-section');
      if (section) {
        section.setAttribute('data-section-name', heading.textContent.trim());
      }
    });

    // Normalize section headings to h2. Source pages use h1 for some section titles
    // (e.g. ご契約者さま on business page). Hero uses .cmp-heroimage__title (not affected).
    // Skip sub-headings inside white panel sections (.cmp-section--white / .cmp-section--secondary).
    element.querySelectorAll('.cmp-section-header__title').forEach((heading) => {
      if (heading.closest('.cmp-section--white') || heading.closest('.cmp-section--secondary')) return;
      if (heading.closest('.cmp-heroimage')) return; // Hero heading stays h1
      if (heading.tagName !== 'H2') {
        const doc = element.ownerDocument || element.getRootNode();
        const h2 = doc.createElement('h2');
        h2.className = heading.className;
        h2.textContent = heading.textContent;
        heading.replaceWith(h2);
      }
    });
  }

  if (hookName === H.after) {
    // Extract tracking number from footer BEFORE removing footer XF
    const footerApproveNo = element.querySelector('.cmp-experiencefragment--site-footer .cmp-footer-approve-no');
    if (footerApproveNo) {
      const trackingText = footerApproveNo.textContent.trim();
      if (trackingText) {
        const doc = element.ownerDocument || element.getRootNode();
        const hr = doc.createElement('hr');
        const p = doc.createElement('p');
        p.textContent = trackingText;
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: 'approve-no' },
        });
        element.appendChild(hr);
        element.appendChild(p);
        element.appendChild(metaBlock);
      }
    }

    // Remove site header experience fragment (non-authorable)
    // Found: div.cmp-experiencefragment--site-header (line 6 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--site-header']);

    // Remove site footer experience fragment (non-authorable)
    // Found: div.cmp-experiencefragment--site-footer (line 2365 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.cmp-experiencefragment--site-footer']);

    // Breadcrumb is now handled by the breadcrumb parser — no removal needed

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

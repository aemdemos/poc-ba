/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards (no images) block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: cards (no images)
 *
 * Block Structure (from library example):
 * - Row 1: Block name header ("Cards (no images)")
 * - Row 2-N: Each row = single cell with text content (heading, description, CTA)
 *
 * Source HTML Patterns (Vodafone WS10):
 *
 * Pattern 1: Pricing Cards (.ws10-m-card-rate-list containing .ws10-c-label-card)
 * <div class="ws10-m-card-rate-list">
 *   <div class="ws10-m-card-rate-simple">
 *     <section class="ws10-c-label-card">
 *       <div class="ws10-c-label-card__content">
 *         <div>
 *           <p>Badge</p>
 *           <span class="ws10-c-price"><span class="ws10-c-price__amount">39</span></span>
 *         </div>
 *         <ul>Feature list</ul>
 *         <div>
 *           <a class="ws10-c-button--tertiary">Más info</a>
 *           <a class="ws10-c-button--primary">Lo quiero</a>
 *         </div>
 *       </div>
 *     </section>
 *   </div>
 * </div>
 *
 * Pattern 2: Benefit/Addon Cards (.ws10-m-addons containing .ws10-c-card-addons)
 * <a class="ws10-c-card-addons">
 *   <svg>Icon</svg>
 *   <p class="ws10-c-card-addons__title">Title</p>
 *   <p class="ws10-c-card-addons__paragraph">Description</p>
 * </a>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
    const cells = [];

    // Detect pattern: label cards (pricing) or addon cards (benefits)
    const labelCards = element.querySelectorAll('.ws10-c-label-card');
    const addonCards = element.querySelectorAll('.ws10-c-card-addons');

    if (labelCards.length > 0) {
        // Pattern 1: Pricing label cards
        // VALIDATED: ws10-c-label-card found in captured DOM (14 occurrences)
        labelCards.forEach((card) => {
            const contentCell = document.createElement('div');

            // Extract outstanding badge (e.g., "La más vendida")
            // VALIDATED: ws10-c-label-card__outstanding found in captured DOM
            const outstanding = card.querySelector('.ws10-c-label-card__outstanding');
            if (outstanding) {
                const badge = document.createElement('p');
                badge.innerHTML = `<strong>${outstanding.textContent.trim()}</strong>`;
                contentCell.appendChild(badge);
            }

            // Extract offer badge/pill
            // VALIDATED: ws10-c-pill found in captured DOM
            const pill = card.querySelector('.ws10-c-pill');
            if (pill) {
                const pillText = document.createElement('p');
                pillText.innerHTML = `<strong>${pill.textContent.trim()}</strong>`;
                contentCell.appendChild(pillText);
            }

            // Extract inline badge text (e.g., "Tarifa exclusiva web", "Oferta especial")
            const badgeTexts = card.querySelectorAll('.ws10-u--footnote strong');
            badgeTexts.forEach((bt) => {
                if (!bt.closest('.ws10-c-pill') && !bt.closest('.ws10-c-label-card__outstanding')) {
                    const bp = document.createElement('p');
                    bp.innerHTML = `<strong>${bt.textContent.trim()}</strong>`;
                    contentCell.appendChild(bp);
                }
            });

            // Extract price
            // VALIDATED: ws10-c-price found in captured DOM
            const price = card.querySelector('.ws10-c-price');
            if (price) {
                const amount = price.querySelector('.ws10-c-price__amount');
                const recurrence = price.querySelector('.ws10-c-price__recurrence');
                const priceNote = price.querySelector('.ws10-c-price__text');
                if (amount) {
                    const pricePara = document.createElement('p');
                    let priceText = `<strong>${amount.textContent.trim()}</strong>`;
                    if (recurrence) priceText += ` ${recurrence.textContent.trim()}`;
                    if (priceNote) priceText += ` — ${priceNote.textContent.trim()}`;
                    pricePara.innerHTML = priceText;
                    contentCell.appendChild(pricePara);
                }
            }

            // Extract feature list items
            const features = card.querySelectorAll('ul li');
            features.forEach((li) => {
                const featureText = li.textContent.trim();
                if (featureText) {
                    const fp = document.createElement('p');
                    // Preserve bold elements within features
                    const strongEl = li.querySelector('strong');
                    if (strongEl) {
                        const parts = li.textContent.trim();
                        fp.innerHTML = `- ${parts.replace(strongEl.textContent, `<strong>${strongEl.textContent}</strong>`)}`;
                    } else {
                        fp.textContent = `- ${featureText}`;
                    }
                    contentCell.appendChild(fp);
                }
            });

            // Extract CTA buttons
            // VALIDATED: ws10-c-button found in captured DOM
            const ctas = card.querySelectorAll('a[class*="ws10-c-button"]');
            const addedHrefs = new Set();
            ctas.forEach((cta) => {
                const href = cta.getAttribute('href');
                if (href && !addedHrefs.has(href)) {
                    addedHrefs.add(href);
                    const link = document.createElement('a');
                    link.href = href;
                    link.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
                    const p = document.createElement('p');
                    p.appendChild(link);
                    contentCell.appendChild(p);
                }
            });

            cells.push([contentCell]);
        });
    } else if (addonCards.length > 0) {
        // Pattern 2: Addon/benefit cards
        // VALIDATED: ws10-c-card-addons found in captured DOM (21 occurrences)
        addonCards.forEach((card) => {
            const contentCell = document.createElement('div');

            // Extract title
            // VALIDATED: ws10-c-card-addons__title found in captured DOM
            const title = card.querySelector('.ws10-c-card-addons__title');
            if (title) {
                const heading = document.createElement('p');
                heading.innerHTML = `<strong>${title.textContent.trim()}</strong>`;
                contentCell.appendChild(heading);
            }

            // Extract description
            // VALIDATED: ws10-c-card-addons__paragraph found in captured DOM
            const desc = card.querySelector('.ws10-c-card-addons__paragraph');
            if (desc) {
                const p = document.createElement('p');
                p.textContent = desc.textContent.trim();
                contentCell.appendChild(p);
            }

            // Extract CTA link if card is an anchor
            const href = card.getAttribute('href') || card.closest('a')?.getAttribute('href');
            if (href) {
                const linkText = title ? title.textContent.trim() : 'Learn more';
                // Only add explicit CTA if there's a visible CTA text different from title
                const ctaBtn = card.querySelector('a.ws10-c-button, [class*="ws10-c-button"]');
                if (ctaBtn && ctaBtn !== card) {
                    const link = document.createElement('a');
                    link.href = href;
                    link.textContent = ctaBtn.textContent.trim().replace(/\s+/g, ' ');
                    const p = document.createElement('p');
                    p.appendChild(link);
                    contentCell.appendChild(p);
                }
            }

            cells.push([contentCell]);
        });
    }

    if (cells.length === 0) return;

    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards (no images)', cells });
    element.replaceWith(block);
}

/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: carousel
 *
 * Block Structure (from library example):
 * - Row 1: Block name header ("Carousel")
 * - Row 2-N: Each row = one slide with [image, text content]
 *
 * Source HTML Pattern (Vodafone WS10):
 * <section class="ws10-m-cards-discovery-standard-medium-price">
 *   <div class="ws10-c-carousel ws10-c-carousel--overflow-visible">
 *     <ul class="ws10-c-carousel__list">
 *       <li class="ws10-c-carousel__list-element">
 *         <section class="ws10-c-card-discovery-standard-medium-price">
 *           <div class="ws10-c-card-discovery-standard-medium-price__content">
 *             <div class="ws10-c-pill">Badge</div>
 *             <p class="ws10-c-card-discovery-standard-medium-price__title"><strong>Heading</strong></p>
 *             <p class="ws10-c-card-discovery-standard-medium-price__text">Description</p>
 *             <span class="ws10-c-price"><span class="ws10-c-price__amount">39</span></span>
 *           </div>
 *           <div class="ws10-c-card-discovery-standard-medium-price__w-cta">
 *             <a class="ws10-c-button--tertiary">Más info</a>
 *             <a class="ws10-c-button--secondary">Lo quiero</a>
 *           </div>
 *           <picture class="ws10-c-card-discovery-standard-medium-price__picture">
 *             <img src="..." alt="...">
 *           </picture>
 *         </section>
 *       </li>
 *     </ul>
 *   </div>
 * </section>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
    // Find all carousel slides
    // VALIDATED: ws10-c-carousel__list-element found in captured DOM (23 occurrences)
    const slides = element.querySelectorAll('.ws10-c-carousel__list-element');

    const cells = [];

    slides.forEach((slide) => {
        // Extract image from slide
        // VALIDATED: ws10-c-card-discovery-standard-medium-price__picture img found in captured DOM
        const img = slide.querySelector(
            '.ws10-c-card-discovery-standard-medium-price__picture img, .ws10-c-card-discovery-standard-medium-price__image img'
        );

        // Build text content cell
        const contentContainer = document.createElement('div');

        // Extract badge/pill
        // VALIDATED: ws10-c-pill found in captured DOM (8 occurrences)
        const pill = slide.querySelector('.ws10-c-pill');
        if (pill) {
            const badge = document.createElement('p');
            badge.innerHTML = `<strong>${pill.textContent.trim()}</strong>`;
            contentContainer.appendChild(badge);
        }

        // Extract heading/title
        // VALIDATED: ws10-c-card-discovery-standard-medium-price__title found in captured DOM
        const title = slide.querySelector('.ws10-c-card-discovery-standard-medium-price__title');
        if (title) {
            const heading = document.createElement('p');
            heading.innerHTML = `<strong>${title.textContent.trim()}</strong>`;
            contentContainer.appendChild(heading);
        }

        // Extract description text
        // VALIDATED: ws10-c-card-discovery-standard-medium-price__text found in captured DOM
        const texts = slide.querySelectorAll('.ws10-c-card-discovery-standard-medium-price__text');
        texts.forEach((text) => {
            const p = document.createElement('p');
            p.innerHTML = text.innerHTML;
            contentContainer.appendChild(p);
        });

        // Extract price
        // VALIDATED: ws10-c-price found in captured DOM (44 occurrences)
        const price = slide.querySelector('.ws10-c-price');
        if (price) {
            const amount = price.querySelector('.ws10-c-price__amount');
            const recurrence = price.querySelector('.ws10-c-price__recurrence');
            const priceText = price.querySelector('.ws10-c-price__text');
            if (amount) {
                const pricePara = document.createElement('p');
                pricePara.innerHTML = `<strong>${amount.textContent.trim()}</strong>`;
                if (recurrence) {
                    pricePara.innerHTML += ` ${recurrence.textContent.trim()}`;
                }
                contentContainer.appendChild(pricePara);
            }
            if (priceText) {
                const priceNote = document.createElement('p');
                priceNote.innerHTML = `<strong>${priceText.textContent.trim()}</strong>`;
                contentContainer.appendChild(priceNote);
            }
        }

        // Extract CTA buttons
        // VALIDATED: ws10-c-button found in captured DOM (51 occurrences)
        const ctas = slide.querySelectorAll('.ws10-c-card-discovery-standard-medium-price__w-cta a.ws10-c-button, a[class*="ws10-c-button"]');
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
                contentContainer.appendChild(p);
            }
        });

        // Build row: [image cell, content cell]
        if (img) {
            const imgEl = document.createElement('img');
            imgEl.src = img.getAttribute('src') || '';
            imgEl.alt = img.getAttribute('alt') || '';
            cells.push([imgEl, contentContainer]);
        } else {
            cells.push([contentContainer]);
        }
    });

    if (cells.length === 0) return;

    const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel', cells });
    element.replaceWith(block);
}

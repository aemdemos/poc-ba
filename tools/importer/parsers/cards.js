/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block (with images)
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: cards
 *
 * Block Structure (from library example):
 * - Row 1: Block name header ("Cards")
 * - Row 2-N: Each row = [image, text content]
 *
 * Source HTML Pattern (Vodafone WS10):
 * <div class="ws10-m-carousel-secondary">
 *   <div class="ws10-c-carousel ws10-c-carousel--secondary">
 *     <ul class="ws10-c-carousel__list">
 *       <li class="ws10-c-carousel__list-element">
 *         <a class="ws10-c-image-strip-element" href="...">
 *           <picture class="ws10-c-image-strip-element__w-img">
 *             <img class="ws10-c-image-strip-element__img" src="..." alt="...">
 *           </picture>
 *           <span class="ws10-c-image-strip-element__text">Category Name</span>
 *         </a>
 *       </li>
 *     </ul>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
    // Find all card items within the container
    // VALIDATED: ws10-c-image-strip-element found in captured DOM (35 occurrences)
    const items = element.querySelectorAll('.ws10-c-image-strip-element');

    const cells = [];

    items.forEach((item) => {
        // Extract image
        // VALIDATED: ws10-c-image-strip-element__img found in captured DOM
        const img = item.querySelector('.ws10-c-image-strip-element__img, img');

        // Extract text label
        // VALIDATED: ws10-c-image-strip-element__text found in captured DOM
        const textEl = item.querySelector('.ws10-c-image-strip-element__text');
        const text = textEl ? textEl.textContent.trim() : '';

        // Extract link href (the whole element is typically an anchor)
        const href = item.getAttribute('href') || item.closest('a')?.getAttribute('href') || '';

        // Build image cell
        const imageCell = document.createElement('div');
        if (img) {
            const imgEl = document.createElement('img');
            imgEl.src = img.getAttribute('src') || '';
            imgEl.alt = img.getAttribute('alt') || text;
            imageCell.appendChild(imgEl);
        }

        // Build text cell with linked text
        const textCell = document.createElement('div');
        if (href && text) {
            const link = document.createElement('a');
            link.href = href;
            link.textContent = text;
            textCell.appendChild(link);
        } else if (text) {
            textCell.textContent = text;
        }

        cells.push([imageCell, textCell]);
    });

    if (cells.length === 0) return;

    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
    element.replaceWith(block);
}

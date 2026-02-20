/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://www.vodafone.es/c/particulares/es/
 * Base Block: columns
 *
 * Block Structure (from library example):
 * - Row 1: Block name header ("Columns")
 * - Row 2-N: Each row has multiple cells (one per column)
 *
 * Source HTML Patterns (Vodafone WS10):
 *
 * Pattern 1: Banner Slim (.ws10-m-banner-slim)
 * <section class="ws10-m-banner-slim">
 *   <div class="ws10-c-banner-slim">
 *     <svg class="ws10-c-banner-slim__icon">...</svg>
 *     <p class="ws10-c-banner-slim__title"><strong>Title</strong></p>
 *     <span class="ws10-c-banner-slim__text">Description</span>
 *     <a class="ws10-c-button">CTA</a>
 *   </div>
 * </section>
 *
 * Pattern 2: Header Section (.ws10-m-header-section)
 * <section class="ws10-m-header-section">
 *   <div class="ws10-m-header-section__content-text">
 *     <h2>Heading</h2>
 *     <p>Description</p>
 *     <a>CTA</a>
 *   </div>
 *   <div class="ws10-m-header-section__content-image-wrapper">
 *     <img src="..." alt="...">
 *   </div>
 * </section>
 *
 * Generated: 2026-02-19
 */
export default function parse(element, { document }) {
    const cells = [];

    // Detect which pattern we're dealing with
    const isBannerSlim = element.classList.contains('ws10-m-banner-slim') ||
        element.querySelector('.ws10-c-banner-slim');
    const isHeaderSection = element.classList.contains('ws10-m-header-section') ||
        element.querySelector('.ws10-m-header-section__content-text');

    if (isBannerSlim) {
        // Pattern 1: Banner Slim - single row with image/icon + text content
        // VALIDATED: ws10-c-banner-slim__title, ws10-c-banner-slim__text found in captured DOM
        const banner = element.querySelector('.ws10-c-banner-slim') || element;

        const imgEl = banner.querySelector('img');

        const contentCell = document.createElement('div');

        const title = banner.querySelector('.ws10-c-banner-slim__title');
        if (title) {
            const heading = document.createElement('p');
            heading.innerHTML = `<strong>${title.textContent.trim()}</strong>`;
            contentCell.appendChild(heading);
        }

        const text = banner.querySelector('.ws10-c-banner-slim__text');
        if (text) {
            const desc = document.createElement('p');
            desc.textContent = text.textContent.trim();
            contentCell.appendChild(desc);
        }

        // Extract CTA
        const cta = banner.querySelector('a.ws10-c-button, a[class*="ws10-c-button"]');
        if (cta) {
            const link = document.createElement('a');
            link.href = cta.getAttribute('href') || '';
            link.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
            const p = document.createElement('p');
            p.appendChild(link);
            contentCell.appendChild(p);
        }

        if (imgEl) {
            const img = document.createElement('img');
            img.src = imgEl.getAttribute('src') || '';
            img.alt = imgEl.getAttribute('alt') || '';
            cells.push([img, contentCell]);
        } else {
            cells.push([contentCell]);
        }
    } else if (isHeaderSection) {
        // Pattern 2: Header Section - text column + image column
        // VALIDATED: ws10-m-header-section__content-text, ws10-m-header-section__content-image-wrapper found in captured DOM
        const textSection = element.querySelector('.ws10-m-header-section__content-text');
        const imageSection = element.querySelector('.ws10-m-header-section__content-image-wrapper');

        // Build text content cell
        const textCell = document.createElement('div');

        if (textSection) {
            // Extract heading
            const heading = textSection.querySelector('h2, h3, [class*="heading"]');
            if (heading) {
                const h = document.createElement('p');
                h.innerHTML = `<strong>${heading.textContent.trim()}</strong>`;
                textCell.appendChild(h);
            }

            // Extract description paragraphs
            const paragraphs = textSection.querySelectorAll('p[class*="body"], p[class*="ws10-u--body"]');
            paragraphs.forEach((p) => {
                const para = document.createElement('p');
                para.textContent = p.textContent.trim();
                textCell.appendChild(para);
            });
            // Fallback: get all direct p elements if no class-specific ones found
            if (paragraphs.length === 0) {
                const allPs = textSection.querySelectorAll('p');
                allPs.forEach((p) => {
                    if (!p.closest('.ws10-c-price') && !p.closest('.ws10-c-button')) {
                        const para = document.createElement('p');
                        para.textContent = p.textContent.trim();
                        if (para.textContent) textCell.appendChild(para);
                    }
                });
            }

            // Extract price if present
            const price = textSection.querySelector('.ws10-c-price');
            if (price) {
                const amount = price.querySelector('.ws10-c-price__amount');
                const recurrence = price.querySelector('.ws10-c-price__recurrence');
                if (amount) {
                    const pricePara = document.createElement('p');
                    let priceText = amount.textContent.trim();
                    if (recurrence) priceText += ` ${recurrence.textContent.trim()}`;
                    pricePara.innerHTML = `<strong>${priceText}</strong>`;
                    textCell.appendChild(pricePara);
                }
            }

            // Extract CTA links
            const ctas = textSection.querySelectorAll('a.ws10-c-button, a[class*="ws10-c-button"]');
            ctas.forEach((cta) => {
                const link = document.createElement('a');
                link.href = cta.getAttribute('href') || '';
                link.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
                const p = document.createElement('p');
                p.appendChild(link);
                textCell.appendChild(p);
            });
        }

        // Build image cell
        const imageCell = document.createElement('div');
        if (imageSection) {
            const img = imageSection.querySelector('img');
            if (img) {
                const imgEl = document.createElement('img');
                imgEl.src = img.getAttribute('src') || '';
                imgEl.alt = img.getAttribute('alt') || '';
                imageCell.appendChild(imgEl);
            }
        }

        // Check if header-section is reversed (image on right vs left)
        // VALIDATED: ws10-m-header-section--reverse class found in captured DOM
        const isReversed = element.classList.contains('ws10-m-header-section--reverse');
        if (isReversed) {
            // Text on left, image on right
            cells.push([textCell, imageCell]);
        } else {
            // Image on left, text on right (or just text if no image)
            if (imageSection) {
                cells.push([imageCell, textCell]);
            } else {
                cells.push([textCell]);
            }
        }
    } else {
        // Fallback: treat as generic multi-column layout
        const columns = element.querySelectorAll(':scope > div > div, :scope > div');
        const row = [];
        columns.forEach((col) => {
            const cell = document.createElement('div');
            cell.innerHTML = col.innerHTML;
            row.push(cell);
        });
        if (row.length > 0) {
            cells.push(row);
        }
    }

    if (cells.length === 0) return;

    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
    element.replaceWith(block);
}

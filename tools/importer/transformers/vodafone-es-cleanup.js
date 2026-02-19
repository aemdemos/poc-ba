/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Vodafone Spain website cleanup
 * Purpose: Remove non-content elements and fix DOM issues common across all vodafone.es pages
 * Applies to: www.vodafone.es (all templates)
 * Tested: /c/particulares/es/ (homepage)
 * Generated: 2026-02-19
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - WS10 design system class patterns found in source HTML
 */

const TransformHook = {
    beforeTransform: 'beforeTransform',
    afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
        // Remove breadcrumb navigation (not authorable in EDS)
        // EXTRACTED: Found <div class="ws10-m-with-breadcrumb"> in captured DOM
        WebImporter.DOMUtils.remove(element, [
            '.ws10-m-with-breadcrumb',
        ]);

        // Remove carousel UI controls (bullets, play buttons, progress bars)
        // EXTRACTED: Found ws10-c-carousel__bullets, ws10-c-carousel__play,
        // ws10-c-carousel__animated, progress-bar in captured DOM
        WebImporter.DOMUtils.remove(element, [
            '.ws10-c-carousel__bullets',
            '.ws10-c-carousel__play',
            '.ws10-c-carousel__animated',
            '.ws10-c-carousel__animation-menu',
            '.progress-bar',
        ]);

        // Remove empty anchor placeholders
        // EXTRACTED: Found <span id="divBottom"></span> (12 occurrences) in captured DOM
        const divBottoms = element.querySelectorAll('#divBottom, [id^="divBottom"]');
        divBottoms.forEach((el) => el.remove());

        // Remove data-initialized attributes that interfere with parsing
        // EXTRACTED: Found data-initialized="true" on 13 elements in captured DOM
        const initializedEls = element.querySelectorAll('[data-initialized]');
        initializedEls.forEach((el) => el.removeAttribute('data-initialized'));
    }

    if (hookName === TransformHook.afterTransform) {
        // Clean up WS10 tracking data attributes
        // EXTRACTED: Found data-ws10-js, data-ws10-js-point, data-ws10-js-location,
        // data-ws10-js-locsub across 47+ elements in captured DOM
        const allElements = element.querySelectorAll('*');
        allElements.forEach((el) => {
            const attrs = Array.from(el.attributes || []);
            attrs.forEach((attr) => {
                if (attr.name.startsWith('data-ws10-js')) {
                    el.removeAttribute(attr.name);
                }
            });
        });

        // Remove remaining non-content elements
        WebImporter.DOMUtils.remove(element, [
            'noscript',
            'iframe',
            'link',
        ]);
    }
}

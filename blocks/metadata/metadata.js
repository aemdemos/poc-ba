/**
 * Metadata block - reads page metadata from content and applies it.
 * The block is hidden via CSS.
 * @param {Element} block The metadata block element
 */
export default function decorate(block) {
    const rows = block.querySelectorAll(':scope > div');
    rows.forEach((row) => {
        const key = row.children[0]?.textContent?.trim().toLowerCase();
        const value = row.children[1]?.textContent?.trim();
        if (key && value) {
            const existingMeta = document.querySelector(`meta[name="${key}"]`)
                || document.querySelector(`meta[property="og:${key}"]`);
            if (!existingMeta) {
                const meta = document.createElement('meta');
                meta.setAttribute('name', key);
                meta.setAttribute('content', value);
                document.head.appendChild(meta);
            }
        }
    });
}

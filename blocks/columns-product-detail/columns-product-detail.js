export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-product-detail-${cols.length}-cols`);

  // The right column contains alternating: <p><a>title</a></p> + <p>description</p>
  // Merge each pair into a single card link with a caption span
  const rightCol = cols[cols.length - 1];
  if (!rightCol) return;

  const paragraphs = [...rightCol.querySelectorAll(':scope > p')];
  const cards = [];
  let i = 0;

  while (i < paragraphs.length) {
    const p = paragraphs[i];
    const link = p.querySelector('a');

    if (link) {
      // This is a title link paragraph — check if next paragraph is a description
      const next = paragraphs[i + 1];
      if (next && !next.querySelector('a')) {
        // Merge description into the link as a caption
        const caption = document.createElement('span');
        caption.className = 'product-card-caption';
        caption.textContent = next.textContent.trim();
        link.appendChild(caption);
        next.remove();
        i += 2;
      } else {
        i += 1;
      }
      // Wrap the link paragraph in a card container
      const card = document.createElement('div');
      card.className = 'product-card';
      p.before(card);
      card.appendChild(p);
      cards.push(card);
    } else {
      // Standalone text (e.g., footnotes) — leave as-is
      i += 1;
    }
  }
}

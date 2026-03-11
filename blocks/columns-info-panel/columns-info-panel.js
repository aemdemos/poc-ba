export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-info-panel-${cols.length}-cols`);

  // Merge short caption paragraphs into the preceding button
  const MAX_CAPTION_LENGTH = 25;
  block.querySelectorAll('.button-container').forEach((bc) => {
    const next = bc.nextElementSibling;
    if (
      next
      && next.tagName === 'P'
      && !next.classList.contains('button-container')
      && !next.querySelector('a')
      && next.textContent.trim().length <= MAX_CAPTION_LENGTH
    ) {
      const btn = bc.querySelector('a.button');
      if (btn) {
        const caption = document.createElement('span');
        caption.className = 'button-caption';
        caption.textContent = next.textContent.trim();
        btn.appendChild(caption);
        next.remove();
      }
    }
  });
}

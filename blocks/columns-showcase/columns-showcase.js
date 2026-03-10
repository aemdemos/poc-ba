export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-showcase-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-showcase-img-col');
        }
      }

      // Eyebrow tag: duplicate h3 text as overlay on the card image
      const h3 = col.querySelector('h3');
      const cardImageLink = col.querySelector('p > a > img, p > a > picture');
      if (h3 && cardImageLink) {
        const cardPara = cardImageLink.closest('a').closest('p');
        if (cardPara) {
          const tag = document.createElement('span');
          tag.className = 'columns-showcase-tag';
          tag.textContent = h3.textContent;
          cardPara.appendChild(tag);
        }
      }
    });
  });
}

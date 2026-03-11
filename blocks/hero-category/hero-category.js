export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const imageRow = rows[0];
  const contentRow = rows[1];

  // Mark PC and SP images: first img = PC, second img = SP
  const imgs = imageRow.querySelectorAll('img');
  if (imgs.length >= 2) {
    imgs[0].classList.add('hero-pc');
    imgs[0].loading = 'eager';
    imgs[1].classList.add('hero-sp');
    imgs[1].loading = 'eager';
  }

  imageRow.classList.add('hero-category-image');
  contentRow.classList.add('hero-category-content');
}

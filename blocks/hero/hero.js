/**
 * Hero block — responsive desktop / mobile images via CSS toggle.
 *
 * Authoring convention (markdown):
 *   Row 1 – desktop image
 *   Row 2 – mobile image (optional)
 *
 * Both images are loaded eagerly so the browser has them ready.
 * CSS media queries toggle visibility instantly — no download delay
 * when resizing between breakpoints.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const pictures = rows.map((row) => row.querySelector('picture')).filter(Boolean);

  if (pictures.length >= 2) {
    const desktopPic = pictures[0];
    const mobilePic = pictures[1];

    desktopPic.classList.add('hero-desktop');
    mobilePic.classList.add('hero-mobile');

    // Eager-load both so switching is instant
    [desktopPic, mobilePic].forEach((pic) => {
      const img = pic.querySelector('img');
      if (img) img.loading = 'eager';
    });

    // Replace block content with both pictures
    block.textContent = '';
    block.appendChild(desktopPic);
    block.appendChild(mobilePic);
  } else if (pictures.length === 1) {
    const img = pictures[0].querySelector('img');
    if (img) img.loading = 'eager';
  }
}

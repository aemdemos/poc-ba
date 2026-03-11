export default function decorate(block) {
  // Each row has 1 cell with: bare PC image, bare SP image, link text
  // JS wraps images in the link and marks them for responsive show/hide
  [...block.children].forEach((row) => {
    const cell = row.children[0];
    if (!cell) return;

    const imgs = cell.querySelectorAll(':scope img');
    const link = cell.querySelector(':scope a');
    if (imgs.length < 2 || !link) return;

    const { href } = link;

    // Remove the text link paragraph
    const linkPara = link.closest('p');
    if (linkPara) linkPara.remove();

    // Wrap each image's paragraph in an <a> and mark PC/SP
    const pcPara = imgs[0].closest('p') || imgs[0].parentElement;
    const spPara = imgs[1].closest('p') || imgs[1].parentElement;

    const pcLink = document.createElement('a');
    pcLink.href = href;
    pcLink.className = 'banner-pc';
    pcPara.replaceWith(pcLink);
    pcLink.appendChild(pcPara);

    const spLink = document.createElement('a');
    spLink.href = href;
    spLink.className = 'banner-sp';
    spPara.replaceWith(spLink);
    spLink.appendChild(spPara);
  });
}

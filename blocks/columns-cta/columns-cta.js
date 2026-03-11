import { decorateIcons } from '../../scripts/aem.js';

const ICON_MAP = {
  '/sonpo/company/branch': 'office-location',
  '/sonpo/forms/brochure/personal': 'document',
  '/sonpo/contact': 'contact',
};

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-cta-${cols.length}-cols`);

  // Add icons to CTA buttons if not already present from content
  block.querySelectorAll('a').forEach((link) => {
    if (!link.querySelector('.icon')) {
      const url = new URL(link.href, window.location);
      const iconName = ICON_MAP[url.pathname];
      if (iconName) {
        const icon = document.createElement('span');
        icon.className = `icon icon-${iconName}`;
        link.prepend(icon);
      }
    }
  });

  decorateIcons(block);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-cta-img-col');
        }
      }
    });
  });
}

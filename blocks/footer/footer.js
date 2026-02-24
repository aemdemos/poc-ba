import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/* Map category URLs to icon font names */
const NAV_ICON_MAP = [
  { path: '/sonpo/contractor', icon: 'contractor' },
  { path: '/sonpo/personal', icon: 'personal' },
  { path: '/sonpo/business', icon: 'business' },
  { path: '/sonpo/news', icon: 'news' },
  { path: '/sonpo/company', icon: 'company' },
  { path: '/sonpo/recruit', icon: 'recruit' },
];

/**
 * Decorates the back-to-top section with arrow icon and scroll behavior.
 * @param {Element} section The section element
 */
function decorateBackToTop(section) {
  section.classList.add('footer-back-to-top');
  const link = section.querySelector('a');
  if (link) {
    link.setAttribute('aria-label', 'ページトップへ戻る');
    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'footer-arrow-up';
    link.textContent = '';
    link.appendChild(arrowSpan);
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Decorates category navigation links with icon font glyphs.
 * @param {Element} section The section element
 */
function decorateCategoryNav(section) {
  section.classList.add('footer-nav-categories');
  const links = section.querySelectorAll('a');
  links.forEach((link) => {
    try {
      const url = new URL(link.href, window.location);
      const match = NAV_ICON_MAP.find((m) => url.pathname.endsWith(m.path));
      if (match) {
        const text = link.textContent.trim();
        link.textContent = '';
        const iconSpan = document.createElement('span');
        iconSpan.className = `footer-icon footer-icon-${match.icon}`;
        link.appendChild(iconSpan);
        const textSpan = document.createElement('span');
        textSpan.className = 'footer-nav-label';
        textSpan.textContent = text;
        link.appendChild(textSpan);
      }
    } catch (e) {
      // keep link as-is if URL parsing fails
    }
  });
}

/**
 * Decorates SNS section with structured icon + label layout.
 * @param {Element} section The section element
 */
function decorateSns(section) {
  section.classList.add('footer-sns');
  const items = section.querySelectorAll('li');
  items.forEach((item) => {
    const link = item.querySelector('a');
    if (link) {
      const img = link.querySelector('img');
      const text = link.textContent.trim();
      if (img) {
        link.textContent = '';
        const iconDiv = document.createElement('div');
        iconDiv.className = 'footer-sns-icon';
        iconDiv.appendChild(img);
        link.appendChild(iconDiv);
        const titleDiv = document.createElement('div');
        titleDiv.className = 'footer-sns-label';
        titleDiv.textContent = text;
        link.appendChild(titleDiv);
      }
    }
  });
}

/**
 * Loads and decorates the footer.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = [...footer.children];

  // Section 0: Back to top arrow
  if (sections[0]) decorateBackToTop(sections[0]);

  // Section 1: Category navigation with icons
  if (sections[1]) decorateCategoryNav(sections[1]);

  // Section 2: Social media (SNS) links
  if (sections[2]) decorateSns(sections[2]);

  // Section 3: Policy / utility links
  if (sections[3]) sections[3].classList.add('footer-policy-links');

  // Section 4: AIG Group links
  if (sections[4]) sections[4].classList.add('footer-aig-group');

  // Section 5: Copyright
  if (sections[5]) sections[5].classList.add('footer-copyright');

  block.append(footer);
}

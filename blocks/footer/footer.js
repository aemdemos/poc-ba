import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

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
 * Decorates category navigation links.
 * Icons come from the content via :icon: syntax (e.g. :contractor:).
 * This restructures each link to show icon above text label.
 * @param {Element} section The section element
 */
function decorateCategoryNav(section) {
  section.classList.add('footer-nav-categories');
  const links = section.querySelectorAll('a');
  links.forEach((link) => {
    const iconSpan = link.querySelector('.icon');
    if (iconSpan) {
      const text = link.textContent.trim();
      link.textContent = '';
      link.appendChild(iconSpan);
      const textSpan = document.createElement('span');
      textSpan.className = 'footer-nav-label';
      textSpan.textContent = text;
      link.appendChild(textSpan);
    }
  });
}

/**
 * Decorates SNS section with structured icon + label layout.
 * Each li has: <p><a><picture><img></picture></a></p> <p>Label</p>
 * We restructure into: <a><div.icon><img></div><div.label>Label</div></a>
 * @param {Element} section The section element
 */
function decorateSns(section) {
  section.classList.add('footer-sns');
  const items = section.querySelectorAll('li');
  items.forEach((item) => {
    const link = item.querySelector('a');
    if (link) {
      const img = link.querySelector('img');
      if (img) {
        // Get label from sibling <p> text or img alt
        const paragraphs = item.querySelectorAll('p');
        let labelText = '';
        paragraphs.forEach((p) => {
          if (!p.querySelector('a') && !p.querySelector('img') && p.textContent.trim()) {
            labelText = p.textContent.trim();
            p.remove();
          }
        });
        if (!labelText) labelText = img.alt || '';

        const { href } = link;
        // Clear the item and rebuild with a single clean link
        item.textContent = '';
        const newLink = document.createElement('a');
        newLink.href = href;
        newLink.setAttribute('aria-label', labelText);

        const iconDiv = document.createElement('div');
        iconDiv.className = 'footer-sns-icon';
        iconDiv.appendChild(img);
        newLink.appendChild(iconDiv);

        const titleDiv = document.createElement('div');
        titleDiv.className = 'footer-sns-label';
        titleDiv.textContent = labelText;
        newLink.appendChild(titleDiv);

        item.appendChild(newLink);
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

  // Detect optional tracking/approval number section (authored as first section).
  // It contains only a short text paragraph with no links.
  let offset = 0;
  if (sections[0] && !sections[0].querySelector('a') && sections[0].textContent.trim().length < 80) {
    sections[0].classList.add('footer-approve-no');
    offset = 1;
  }

  // Back to top arrow
  if (sections[offset]) decorateBackToTop(sections[offset]);

  // Category navigation with icons
  if (sections[1 + offset]) decorateCategoryNav(sections[1 + offset]);

  // Social media (SNS) links
  if (sections[2 + offset]) decorateSns(sections[2 + offset]);

  // Policy / utility links
  if (sections[3 + offset]) sections[3 + offset].classList.add('footer-policy-links');

  // AIG Group links
  if (sections[4 + offset]) sections[4 + offset].classList.add('footer-aig-group');

  // Copyright
  if (sections[5 + offset]) sections[5 + offset].classList.add('footer-copyright');

  block.append(footer);
}

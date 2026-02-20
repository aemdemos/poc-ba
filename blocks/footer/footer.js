import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Converts pipe-separated links in a paragraph into a proper <ul> list.
 * @param {HTMLParagraphElement} p
 * @returns {HTMLUListElement}
 */
function linksToList(p) {
  const ul = document.createElement('ul');
  p.querySelectorAll('a').forEach((a) => {
    const li = document.createElement('li');
    li.append(a.cloneNode(true));
    ul.append(li);
  });
  return ul;
}

/**
 * Decorates the social section: converts pipe-separated links
 * into a list and adds the Vodafone logo.
 * @param {Element} section
 */
function decorateSocial(section) {
  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  const p = wrapper.querySelector('p');
  if (!p) return;

  const ul = linksToList(p);
  ul.className = 'footer-social-icons';

  // Social label
  const label = document.createElement('span');
  label.className = 'footer-social-label';
  label.textContent = 'Social';

  // Vodafone logo
  const logo = document.createElement('div');
  logo.className = 'footer-logo';
  logo.innerHTML = '<picture><img src="https://www.vodafone.es/c/statics/maestro/logo_vodafone.png?v=20230614045454" alt="Vodafone" loading="lazy" width="40" height="40"></picture>';

  // Build social bar
  const bar = document.createElement('div');
  bar.className = 'footer-social-bar';

  const left = document.createElement('div');
  left.className = 'footer-social-left';
  left.append(label);
  left.append(ul);

  bar.append(left);
  bar.append(logo);

  wrapper.replaceChildren(bar);
}

/**
 * Decorates the legal section: converts pipe-separated links
 * into a nav list and marks the copyright paragraph.
 * @param {Element} section
 */
function decorateLegal(section) {
  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  const paragraphs = [...wrapper.querySelectorAll('p')];
  if (paragraphs.length < 1) return;

  // First paragraph: legal links (separated by |)
  const legalP = paragraphs[0];
  if (legalP.querySelectorAll('a').length > 0) {
    const nav = document.createElement('nav');
    nav.className = 'footer-legal-nav';
    nav.append(linksToList(legalP));
    legalP.replaceWith(nav);
  }

  // Second paragraph: copyright
  if (paragraphs[1]) {
    paragraphs[1].classList.add('footer-copyright');
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Assign semantic classes to sections (matching visual top-to-bottom order)
  // 1. Social bar (dark background with social links + logo)
  // 2. Link columns row 1 (4 cols)
  // 3. Link columns row 2 (4 cols)
  // 4. Legal bar (legal links + copyright)
  const sections = footer.querySelectorAll('.section');
  const roles = ['footer-social', 'footer-links', 'footer-links', 'footer-legal'];
  sections.forEach((s, i) => {
    if (roles[i]) s.classList.add(roles[i]);
  });

  // Decorate special sections
  const socialSection = footer.querySelector('.footer-social');
  if (socialSection) decorateSocial(socialSection);

  const legalSection = footer.querySelector('.footer-legal');
  if (legalSection) decorateLegal(legalSection);

  block.append(footer);
}

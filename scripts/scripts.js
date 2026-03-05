import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  getMetadata,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

function autolinkModals(doc) {
  doc.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');
    if (origin && origin.href && origin.href.includes('/modals/')) {
      e.preventDefault();
      const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
      openModal(origin.href);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Converts :icon-name: text patterns into <span class="icon icon-name"> elements
 * so that decorateIcons() can load the corresponding SVG files.
 * This enables the :icon: authoring convention in markdown.
 * @param {Element} element The container element to process
 */
function convertIconText(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  const nodesToProcess = [];
  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue.match(/:[\w-]+:/)) {
      nodesToProcess.push(walker.currentNode);
    }
  }
  nodesToProcess.forEach((textNode) => {
    const parts = textNode.nodeValue.split(/(:[a-zA-Z][\w-]*:)/g);
    if (parts.length <= 1) return;
    const fragment = document.createDocumentFragment();
    parts.forEach((part) => {
      const iconMatch = part.match(/^:([\w-]+):$/);
      if (iconMatch) {
        const span = document.createElement('span');
        span.className = `icon icon-${iconMatch[1]}`;
        fragment.appendChild(span);
      } else if (part) {
        fragment.appendChild(document.createTextNode(part));
      }
    });
    textNode.parentNode.replaceChild(fragment, textNode);
  });
}

function a11yLinks(main) {
  const links = main.querySelectorAll('a');
  links.forEach((link) => {
    let label = link.textContent;
    if (!label && link.querySelector('span.icon')) {
      const icon = link.querySelector('span.icon');
      label = icon ? icon.classList[1]?.split('-')[1] : label;
    }
    link.setAttribute('aria-label', label);
  });
}

/**
 * Decorates news-list section items: splits "DATE - CATEGORY - TITLE"
 * into separate styled spans for date, category pill, and title.
 * @param {Element} main The main element
 */
function decorateNewsList(main) {
  main.querySelectorAll('.section.news-list ul li a').forEach((link) => {
    const text = link.textContent.trim();
    const parts = text.split(' - ');
    if (parts.length >= 3) {
      const date = parts[0];
      const category = parts[1];
      const title = parts.slice(2).join(' - ');
      link.textContent = '';

      const dateSpan = document.createElement('span');
      dateSpan.className = 'news-date';
      dateSpan.textContent = date;

      const tagSpan = document.createElement('span');
      tagSpan.className = 'news-tag';
      const tagInner = document.createElement('span');
      tagInner.textContent = category;
      tagSpan.appendChild(tagInner);

      const titleSpan = document.createElement('span');
      titleSpan.className = 'news-title';
      titleSpan.textContent = title;

      link.appendChild(dateSpan);
      link.appendChild(tagSpan);
      link.appendChild(titleSpan);
    }
  });
}

/**
 * Decorates digital-links card buttons: wraps text after the first <br>
 * in a <span class="card-caption"> so title and caption can be styled
 * with different font sizes (matching the reference site pattern).
 * @param {Element} main The main element
 */
function decorateDigitalLinksCards(main) {
  main.querySelectorAll('.section.digital-links .columns a').forEach((link) => {
    const br = link.querySelector('br');
    if (!br) return;

    // Collect all nodes after the first <br>
    const captionNodes = [];
    let node = br.nextSibling;
    while (node) {
      captionNodes.push(node);
      node = node.nextSibling;
    }

    if (captionNodes.length === 0) return;

    // Wrap them in a caption span
    const caption = document.createElement('span');
    caption.className = 'card-caption';
    captionNodes.forEach((n) => caption.appendChild(n));
    br.after(caption);
    br.remove();
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  convertIconText(main);
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateNewsList(main);
  decorateDigitalLinksCards(main);
  // add aria-label to links
  a11yLinks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
    doc.body.dataset.breadcrumbs = true;
  }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  autolinkModals(doc);

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

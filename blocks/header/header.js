import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)');

// SVG icons for toolbar
const ICONS = {
  cart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  user: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  phone: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  help: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
};

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('.nav-hamburger button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Decorates the tools section with icon buttons
 */
function decorateTools(navTools) {
  if (!navTools) return;

  const toolsUl = navTools.querySelector('ul');
  if (!toolsUl) return;

  // Add cart button
  const cartLi = document.createElement('li');
  cartLi.className = 'nav-tool-cart';
  cartLi.innerHTML = `<button type="button" aria-label="Carrito">${ICONS.cart}</button>`;
  toolsUl.prepend(cartLi);

  // Add search button
  const searchLi = document.createElement('li');
  searchLi.className = 'nav-tool-search';
  searchLi.innerHTML = `<button type="button" aria-label="Buscar">${ICONS.search}</button>`;
  toolsUl.insertBefore(searchLi, cartLi.nextSibling);

  // Style existing links
  toolsUl.querySelectorAll('li').forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;
    const text = link.textContent.trim();
    if (text.includes('Soy cliente')) {
      li.className = 'nav-tool-client';
      link.innerHTML = `${ICONS.user}<span>${text}</span>`;
    } else if (text.includes('llamamos')) {
      li.className = 'nav-tool-cta';
      // Remove strong wrapper if present
      const strong = li.querySelector('strong');
      if (strong) strong.replaceWith(...strong.childNodes);
      link.innerHTML = `${ICONS.phone}<span>${text}</span>`;
    }
  });

  // Remove any auto-applied button styling
  navTools.querySelectorAll('.button-container').forEach((bc) => {
    bc.classList.remove('button-container');
    const btn = bc.querySelector('.button');
    if (btn) btn.classList.remove('button');
  });
}

/**
 * Decorates the top bar utility section
 */
function decorateTopbar(navTopbar) {
  if (!navTopbar) return;

  // Unwrap <p> tags that the EDS pipeline adds around topbar links
  navTopbar.querySelectorAll(':scope .default-content-wrapper > ul > li > p').forEach((p) => {
    const li = p.parentElement;
    while (p.firstChild) li.insertBefore(p.firstChild, p);
    p.remove();
  });

  const items = navTopbar.querySelectorAll(':scope .default-content-wrapper > ul > li');
  items.forEach((item) => {
    const link = item.querySelector('a');
    const text = link ? link.textContent.trim() : item.textContent.trim();
    if (text === 'Particulares') {
      item.classList.add('nav-segment-active');
    }
    if (item.querySelector('ul')) {
      item.classList.add('nav-topbar-drop');
    }
    if (text === 'Ayuda') {
      item.classList.add('nav-topbar-right-start');
      if (link) link.innerHTML = `${ICONS.help}<span>${text}</span>`;
    }
    if (text === 'Castellano' || item.classList.contains('nav-topbar-drop')) {
      // Add globe icon to language selector (Castellano with dropdown)
      if (text === 'Castellano' && link) {
        link.innerHTML = `${ICONS.globe}<span>${text}</span>`;
      }
    }
    if (item.textContent.includes('Llama gratis')) {
      item.classList.add('nav-phone');
    }
  });

  // Remove auto-applied button styling
  navTopbar.querySelectorAll('.button-container').forEach((bc) => {
    bc.classList.remove('button-container');
    const btn = bc.querySelector('.button');
    if (btn) btn.classList.remove('button');
  });
  // Also remove .button from links that were unwrapped from <p> tags
  navTopbar.querySelectorAll('a.button').forEach((a) => a.classList.remove('button'));
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // assign classes to the 4 nav sections: brand, sections, tools, topbar
  const classes = ['brand', 'sections', 'tools', 'topbar'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // --- Brand setup ---
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container').className = '';
    }
  }

  // --- Sections setup ---
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Unwrap <p> tags that the EDS pipeline adds around nav links
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li > p').forEach((p) => {
      const li = p.parentElement;
      while (p.firstChild) li.insertBefore(p.firstChild, p);
      p.remove();
    });

    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', (e) => {
        // Prevent navigation on dropdown parent links (href="#" becomes "/" in pipeline)
        if (navSection.classList.contains('nav-drop')) {
          const link = navSection.querySelector(':scope > a');
          if (link && (link.getAttribute('href') === '/' || link.getAttribute('href') === '#')) {
            e.preventDefault();
          }
        }
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
    navSections.querySelectorAll('.button-container').forEach((bc) => {
      bc.classList.remove('button-container');
      const btn = bc.querySelector('.button');
      if (btn) btn.classList.remove('button');
    });
    // Also remove .button from links that were unwrapped from <p> tags
    navSections.querySelectorAll('a.button').forEach((a) => a.classList.remove('button'));
  }

  // --- Tools setup ---
  const navTools = nav.querySelector('.nav-tools');
  decorateTools(navTools);

  // --- Topbar setup ---
  const navTopbar = nav.querySelector('.nav-topbar');
  decorateTopbar(navTopbar);

  // --- Build dual-bar DOM ---
  // Save references
  const topbarEl = navTopbar;
  const brandEl = navBrand;
  const sectionsEl = navSections;
  const toolsEl = navTools;

  // Create hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // --- Build mobile green CTA bar ---
  const mobileCta = document.createElement('div');
  mobileCta.className = 'nav-mobile-cta';
  if (topbarEl) {
    // Extract phone number from topbar into its own wrapper
    const phoneItem = topbarEl.querySelector('.nav-phone');
    if (phoneItem) {
      const phoneWrap = document.createElement('div');
      phoneWrap.className = 'nav-mobile-cta-phone';
      const phoneClone = phoneItem.cloneNode(true);
      phoneWrap.appendChild(phoneClone);
      mobileCta.appendChild(phoneWrap);
    }
  }
  if (toolsEl) {
    // Extract "Te llamamos" link into its own wrapper
    const ctaItem = toolsEl.querySelector('.nav-tool-cta a');
    if (ctaItem) {
      const ctaWrap = document.createElement('div');
      ctaWrap.className = 'nav-mobile-cta-action';
      const ctaClone = ctaItem.cloneNode(true);
      ctaClone.className = 'nav-mobile-cta-link';
      ctaWrap.appendChild(ctaClone);
      mobileCta.appendChild(ctaWrap);
    }
  }

  // --- Build mobile segment selector (Particulares dropdown) ---
  const mobileSegment = document.createElement('div');
  mobileSegment.className = 'nav-mobile-segment';
  if (topbarEl) {
    const segmentActive = topbarEl.querySelector('.nav-segment-active');
    const segmentDrop = topbarEl.querySelector('.nav-topbar-drop');
    if (segmentActive) {
      const segLink = segmentActive.querySelector('a');
      const segBtn = document.createElement('button');
      segBtn.className = 'nav-mobile-segment-btn';
      segBtn.textContent = segLink ? segLink.textContent : 'Particulares';
      segBtn.setAttribute('aria-expanded', 'false');
      mobileSegment.appendChild(segBtn);

      // Build dropdown with business segment options
      if (segmentDrop) {
        const dropUl = segmentDrop.querySelector('ul');
        if (dropUl) {
          const dropClone = dropUl.cloneNode(true);
          dropClone.className = 'nav-mobile-segment-menu';
          mobileSegment.appendChild(dropClone);
        }
      }
      segBtn.addEventListener('click', () => {
        const expanded = segBtn.getAttribute('aria-expanded') === 'true';
        segBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    }
  }

  // Clear nav and rebuild with dual-bar structure
  nav.textContent = '';

  // Mobile CTA bar (green bar - mobile only)
  nav.append(mobileCta);

  // Top bar wrapper (dark utility bar - desktop only)
  const topBarWrapper = document.createElement('div');
  topBarWrapper.className = 'nav-topbar-wrapper';
  if (topbarEl) topBarWrapper.append(topbarEl);

  // Main bar wrapper (white nav bar)
  const mainBarWrapper = document.createElement('div');
  mainBarWrapper.className = 'nav-mainbar-wrapper';
  const mainBarInner = document.createElement('div');
  mainBarInner.className = 'nav-mainbar-inner';
  if (brandEl) mainBarInner.append(brandEl);
  mainBarInner.append(mobileSegment);
  if (sectionsEl) mainBarInner.append(sectionsEl);
  if (toolsEl) mainBarInner.append(toolsEl);
  mainBarInner.append(hamburger);
  mainBarWrapper.append(mainBarInner);

  nav.append(topBarWrapper);
  nav.append(mainBarWrapper);

  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}

import { getMetadata } from '../../scripts/aem.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

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
      nav.querySelector('button').focus();
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
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function getDirectTextContent(menuItem) {
  const menuLink = menuItem.querySelector(':scope > :where(a,p)');
  if (menuLink) {
    return menuLink.textContent.trim();
  }
  return Array.from(menuItem.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join(' ');
}

async function buildBreadcrumbsFromNavTree(nav, currentUrl) {
  const crumbs = [];

  const homeUrl = document.querySelector('.nav-brand a[href]').href;

  let menuItem = Array.from(nav.querySelectorAll('a')).find((a) => a.href === currentUrl);
  if (menuItem) {
    do {
      const link = menuItem.querySelector(':scope > a');
      crumbs.unshift({ title: getDirectTextContent(menuItem), url: link ? link.href : null });
      menuItem = menuItem.closest('ul')?.closest('li');
    } while (menuItem);
  } else if (currentUrl !== homeUrl) {
    crumbs.unshift({ title: getMetadata('og:title'), url: currentUrl });
  }

  const placeholders = await fetchPlaceholders();
  const homePlaceholder = placeholders.breadcrumbsHomeLabel || 'Home';

  crumbs.unshift({ title: homePlaceholder, url: homeUrl });

  // last link is current page and should not be linked
  if (crumbs.length > 1) {
    crumbs[crumbs.length - 1].url = null;
  }
  crumbs[crumbs.length - 1]['aria-current'] = 'page';
  return crumbs;
}

async function buildBreadcrumbs() {
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';

  const crumbs = await buildBreadcrumbsFromNavTree(document.querySelector('.nav-sections'), document.location.href);

  const ol = document.createElement('ol');
  ol.append(...crumbs.map((item) => {
    const li = document.createElement('li');
    if (item['aria-current']) li.setAttribute('aria-current', item['aria-current']);
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.append(a);
    } else {
      li.textContent = item.title;
    }
    return li;
  }));

  breadcrumbs.append(ol);
  return breadcrumbs;
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

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Normalize DA output: unwrap <p> wrappers from nav list items
    // DA wraps links in <p> tags (li > p > a) but CSS expects (li > a)
    navSections.querySelectorAll('.default-content-wrapper li > p').forEach((p) => {
      p.replaceWith(...p.childNodes);
    });

    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');

      // Decorate megamenu: wrap category text nodes in <span>, mark bottom links
      const dropdown = navSection.querySelector(':scope > ul');
      if (dropdown) {
        const dropItems = [...dropdown.children];
        dropItems.forEach((li, idx) => {
          // Skip first item (top link) and items that are purely links
          if (idx > 0 && li.querySelector(':scope > ul')) {
            // This is a category item with nested links
            // Wrap direct text content in a <span> for styling as category header
            const textNodes = [...li.childNodes].filter(
              (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
            );
            textNodes.forEach((tn) => {
              const span = document.createElement('span');
              span.textContent = tn.textContent.trim();
              tn.replaceWith(span);
            });
            // If the category has a direct <a> link (e.g. 損害サービス), wrap its text
            const directLink = li.querySelector(':scope > a');
            if (directLink) {
              const span = document.createElement('span');
              span.textContent = directLink.textContent.trim();
              directLink.replaceWith(span);
            }
          } else if (idx > 0 && idx === dropItems.length - 1 && !li.querySelector(':scope > ul') && li.querySelector('a')) {
            // Bottom link ONLY if it's the last item (e.g. よくあるご質問, 保険用語集)
            li.classList.add('megamenu-bottom');
          }
        });

        // Add close chevron
        const closeDiv = document.createElement('div');
        closeDiv.className = 'megamenu-close';
        closeDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          navSection.setAttribute('aria-expanded', 'false');
        });
        dropdown.append(closeDiv);
      }

      navSection.addEventListener('click', (e) => {
        if (isDesktop.matches) {
          // Prevent link navigation for items with dropdowns
          if (navSection.classList.contains('nav-drop')) {
            e.preventDefault();
          }
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');

          // Position dropdown to span full viewport width
          if (!expanded && dropdown) {
            const liRect = navSection.getBoundingClientRect();
            dropdown.style.left = `${-liRect.left}px`;
            dropdown.style.width = `${window.innerWidth}px`;
          }
        }
      });
    });
    navSections.querySelectorAll('.button-container').forEach((buttonContainer) => {
      buttonContainer.classList.remove('button-container');
      buttonContainer.querySelector('.button').classList.remove('button');
    });
  }

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    // Strip button classes from tools links
    navTools.querySelectorAll('.button-container').forEach((bc) => {
      bc.classList.remove('button-container');
      const btn = bc.querySelector('.button');
      if (btn) btn.classList.remove('button');
    });

    // Build search overlay panel
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'nav-search-overlay';
    searchOverlay.innerHTML = `
      <input type="search" placeholder="商品名やキーワードを入力" aria-label="商品名やキーワードを入力">
      <button type="submit">検索</button>
    `;

    // Find search link and wire up toggle
    const searchLink = navTools.querySelector('a');
    const toggleSearch = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = searchLink.classList.toggle('search-active');
      searchOverlay.classList.toggle('active', isActive);
      if (isActive) {
        searchOverlay.querySelector('input').focus();
      }
    };

    if (searchLink) {
      searchLink.setAttribute('aria-label', 'サイト内を検索');
      searchLink.addEventListener('click', toggleSearch);
    }

    // Also allow clicking anywhere on the nav-tools container
    navTools.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-search-overlay')) {
        toggleSearch(e);
      }
    });

    // Submit search
    searchOverlay.querySelector('button').addEventListener('click', () => {
      const query = searchOverlay.querySelector('input').value.trim();
      if (query) {
        window.location.href = `https://www.aig.co.jp/sonpo/search?kw=${encodeURIComponent(query)}`;
      }
    });

    searchOverlay.querySelector('input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchOverlay.querySelector('button').click();
      }
    });

    nav.append(searchOverlay);
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Build sticky header elements (logo + search) for compact mode on scroll
  const navUl = navSections.querySelector('.default-content-wrapper > ul');
  if (navUl) {
    // Sticky logo (first item in UL, hidden by default via CSS)
    const stickyLogoLi = document.createElement('li');
    stickyLogoLi.className = 'sticky-logo';
    const logoHref = navBrand.querySelector('a')?.getAttribute('href') || '/';
    const logoLink = document.createElement('a');
    logoLink.href = logoHref;
    logoLink.textContent = 'AIG損保';
    stickyLogoLi.append(logoLink);
    navUl.prepend(stickyLogoLi);

    // Sticky search icon (last item in UL, hidden by default via CSS)
    const stickySearchLi = document.createElement('li');
    stickySearchLi.className = 'sticky-search';
    const searchBtn = document.createElement('a');
    searchBtn.href = '#';
    searchBtn.setAttribute('aria-label', '検索');
    searchBtn.textContent = '検索';
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const overlay = nav.querySelector('.nav-search-overlay');
      if (overlay) {
        overlay.classList.toggle('active');
        if (overlay.classList.contains('active')) {
          overlay.querySelector('input')?.focus();
        }
      }
    });
    stickySearchLi.append(searchBtn);
    navUl.append(stickySearchLi);
  }

  // Sticky compact header on scroll (desktop only)
  let isSticky = false;
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const headerEl = navWrapper.closest('header');
        const threshold = headerEl ? headerEl.offsetHeight : 160;
        if (window.scrollY > threshold && !isSticky) {
          // Close any open megamenus before switching
          toggleAllNavSections(navSections, false);
          navWrapper.classList.add('sticky-compact');
          isSticky = true;
        } else if (window.scrollY <= threshold && isSticky) {
          toggleAllNavSections(navSections, false);
          navWrapper.classList.remove('sticky-compact');
          isSticky = false;
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  if (isDesktop.matches) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    } else {
      window.removeEventListener('scroll', onScroll);
      navWrapper.classList.remove('sticky-compact');
      isSticky = false;
    }
  });

  if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
    navWrapper.append(await buildBreadcrumbs());
  }
}

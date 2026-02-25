// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

// keep track globally of the number of tab blocks on the page
let tabBlockCnt = 0;

/**
 * Processes inline content in a tab panel, converting links to button elements
 * and bold text to sub-headings. Handles the AIG pattern of:
 *   description text [link1](url) ・ [link2](url) **subheading** [link3](url) **[CTA](url)**
 */
function collectElements(container) {
  const elements = [];
  [...container.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.replace(/・/g, '').trim();
      if (text) elements.push({ type: 'text', content: text });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'A') {
        elements.push({ type: 'link', node: node.cloneNode(true) });
      } else if (node.tagName === 'STRONG') {
        const link = node.querySelector('a');
        if (link) {
          elements.push({ type: 'cta', node: link.cloneNode(true) });
        } else {
          elements.push({ type: 'heading', content: node.textContent.trim() });
        }
      } else if (node.tagName === 'P') {
        // EDS wraps inline content in <p> — recurse into it
        elements.push(...collectElements(node));
      }
    }
  });
  return elements;
}

function decorateTabPanel(panel) {
  const contentDiv = panel.querySelector(':scope > div');
  if (!contentDiv) return;

  const elements = collectElements(contentDiv);

  // Rebuild content with structured elements
  contentDiv.textContent = '';
  let currentGrid = null;

  function flushGrid() {
    if (currentGrid) {
      contentDiv.appendChild(currentGrid);
      currentGrid = null;
    }
  }

  elements.forEach((el) => {
    if (el.type === 'text') {
      flushGrid();
      const p = document.createElement('p');
      p.className = 'tabs-description';
      p.textContent = el.content;
      contentDiv.appendChild(p);
    } else if (el.type === 'heading') {
      flushGrid();
      const h = document.createElement('h3');
      h.className = 'tabs-subheading';
      h.textContent = el.content;
      contentDiv.appendChild(h);
    } else if (el.type === 'link') {
      if (!currentGrid) {
        currentGrid = document.createElement('div');
        currentGrid.className = 'tabs-button-grid';
      }
      const p = document.createElement('p');
      p.className = 'button-container';
      el.node.className = 'button outline';
      el.node.title = el.node.textContent;
      p.appendChild(el.node);
      currentGrid.appendChild(p);
    } else if (el.type === 'cta') {
      flushGrid();
      const p = document.createElement('p');
      p.className = 'button-container cta-container';
      el.node.className = 'button';
      el.node.title = el.node.textContent;
      p.appendChild(el.node);
      contentDiv.appendChild(p);
    }
  });

  flushGrid();
}

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt += 1}`;

  // the first cell of each row is the title of the tab
  const tabHeadings = [...block.children]
    .filter((child) => child.firstElementChild && child.firstElementChild.children.length > 0)
    .map((child) => child.firstElementChild);

  tabHeadings.forEach((tab, i) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${i + 1}`;

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = id;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;

    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    // add the new tab list button, to the tablist
    tablist.append(button);

    // remove the tab heading from the dom, which also removes it from the UE tree
    tab.remove();

    // remove the instrumentation from the button's h1, h2 etc (this removes it from the tree)
    if (button.firstElementChild) {
      moveInstrumentation(button.firstElementChild, null);
    }
  });

  block.prepend(tablist);

  // Decorate tab panel content — convert inline links to styled buttons
  block.querySelectorAll('.tabs-panel').forEach(decorateTabPanel);
}

/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-info-panel
 * Base block: columns
 * Source: https://www.aig.co.jp/sonpo/personal, https://www.aig.co.jp/sonpo/business
 * Selector: .cmp-section--background-full .cmp-columncontainer:has(.cmp-section--white)
 *
 * Produces content matching deployed structure:
 *   Primary button (cmp-button-blue on parent): <p><a>:icon: text</a></p>
 *   Secondary button (no blue class):           <p><em><a>:icon: text</a></em></p>
 *   Text link (non-button link):                <ul><li><a>text</a></li></ul>
 *   Plain text paragraph:                       <p>text</p>
 *   Caption after button:                       <p>caption text</p>
 *   List links (cmp-list):                      <ul><li><a>text</a></li>...</ul>
 *
 * Icons: CSS-class-based (e.g. icon-contact → :contact:, icon-document → :document:)
 */
export default function parse(element, { document }) {
  const columnItems = element.querySelectorAll(':scope > .cmp-columncontainer-item');

  const cols = [];
  columnItems.forEach((colItem) => {
    const col = document.createElement('div');
    const whiteSection = colItem.querySelector('.cmp-section--white');
    if (!whiteSection) {
      cols.push(col);
      return;
    }

    // Panel heading — source uses h1/h2/h3 depending on page, normalize to h3
    const heading = whiteSection.querySelector('.cmp-section-header__title, h1, h2, h3');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      col.append(h3);
    }

    // Process content in DOM order
    const contentArea = whiteSection.querySelector('.cmp-section-content');
    if (contentArea) {
      const items = contentArea.querySelectorAll(':scope > div');
      items.forEach((item) => {
        // Button link
        const btn = item.querySelector('a.cmp-button');
        if (btn) {
          // cmp-button-blue is on the parent div, not the <a>
          const isBlue = item.classList.contains('cmp-button-blue')
            || !!item.querySelector('.cmp-button-blue');
          const text = btn.querySelector('.cmp-button-main__text');
          const caption = btn.querySelector('.cmp-button-caption');

          // Extract icon class (e.g. "icon-contact" → :contact:)
          const iconSpan = btn.querySelector('.cmp-button-main__icon');
          let iconPrefix = '';
          if (iconSpan) {
            const iconClass = [...iconSpan.classList].find((c) => c.startsWith('icon-'));
            if (iconClass) {
              const iconName = iconClass.replace(/^icon-/, '');
              iconPrefix = `:${iconName}: `;
            }
          }

          const link = document.createElement('a');
          link.href = btn.href || btn.getAttribute('href');
          link.textContent = `${iconPrefix}${text ? text.textContent.trim() : btn.textContent.trim()}`;

          const p = document.createElement('p');
          if (isBlue) {
            // Primary button: <p><a>text</a></p>
            p.append(link);
          } else {
            // Secondary button: <p><em><a>text</a></em></p>
            const em = document.createElement('em');
            em.append(link);
            p.append(em);
          }
          col.append(p);

          // Caption as separate paragraph
          if (caption) {
            const captionP = document.createElement('p');
            captionP.textContent = caption.textContent.trim();
            col.append(captionP);
          }
          return;
        }

        // Text content (paragraphs, links, lists)
        const textDiv = item.querySelector('.cmp-text');
        if (textDiv) {
          // Single link in text → convert to <ul><li> text link
          const links = textDiv.querySelectorAll('a');
          const paragraphs = textDiv.querySelectorAll('p');
          if (links.length === 1 && paragraphs.length <= 1 && !textDiv.querySelector('ul')) {
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = links[0].href || links[0].getAttribute('href');
            a.textContent = links[0].textContent.trim();
            li.append(a);
            ul.append(li);
            col.append(ul);
            return;
          }
          // Lists and paragraphs — preserve structure
          const children = textDiv.querySelectorAll('p, ul');
          children.forEach((child) => {
            col.append(child.cloneNode(true));
          });
          return;
        }

        // List component (cmp-list) — convert to <ul><li> text links
        const list = item.querySelector('.cmp-list');
        if (list) {
          const listLinks = list.querySelectorAll('a');
          if (listLinks.length > 0) {
            const ul = document.createElement('ul');
            listLinks.forEach((a) => {
              const li = document.createElement('li');
              const link = document.createElement('a');
              link.href = a.href || a.getAttribute('href');
              link.textContent = a.textContent.trim();
              li.append(link);
              ul.append(li);
            });
            col.append(ul);
          }
        }
      });
    }

    cols.push(col);
  });

  const cells = [cols];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info-panel', cells });
  element.replaceWith(block);
}

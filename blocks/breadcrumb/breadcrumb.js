export default function decorate(block) {
  const items = [];
  // Each row in the block is a breadcrumb item
  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    const text = row.textContent.trim();
    if (text) {
      items.push({ text, link });
    }
  });

  // Build nav > ol structure for semantics and schema.org
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'パンくず');

  const ol = document.createElement('ol');
  ol.setAttribute('itemscope', '');
  ol.setAttribute('itemtype', 'http://schema.org/BreadcrumbList');

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.setAttribute('itemprop', 'itemListElement');
    li.setAttribute('itemscope', '');
    li.setAttribute('itemtype', 'http://schema.org/ListItem');

    if (item.link) {
      const a = document.createElement('a');
      a.href = item.link.href;
      a.setAttribute('itemprop', 'item');
      const span = document.createElement('span');
      span.setAttribute('itemprop', 'name');
      span.textContent = item.text;
      a.appendChild(span);
      li.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.setAttribute('itemprop', 'name');
      span.textContent = item.text;
      li.appendChild(span);
    }

    const meta = document.createElement('meta');
    meta.setAttribute('itemprop', 'position');
    meta.setAttribute('content', String(i + 1));
    li.appendChild(meta);

    if (i === items.length - 1) {
      li.classList.add('breadcrumb-active');
    }

    ol.appendChild(li);
  });

  nav.appendChild(ol);
  block.textContent = '';
  block.appendChild(nav);
}

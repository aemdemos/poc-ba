# Migration Plan

## Revision History

| Date | Change |
|---|---|
| 2026-03-12 | **Major revision:** Re-scoped site templates after visual inspection of 20+ pages across all sections and depths. Discovered that the site uses a **single base full-width layout** — no 2-column sidebar template exists. Previous T3 "Content Page with Sidebar" (830 pages, 67%) was incorrectly classified. What appeared to be sidebar navigation is actually bottom navigation rendered below the main content. Templates are now classified by **content block patterns** rather than layout structure. |
| 2026-03-12 | **T2 scoping complete:** Analyzed 12 candidate pages for T2 Category Landing. Confirmed 8 pages across 4 similarity clusters (A–D). Reclassified 4 pages (contact, contractor, service, totalrisk) to other templates. Documented block reuse matrix, XF class divergence patterns, and recommended migration order. |
| 2026-03-12 | **T2 bulk import complete:** Broadened XF selectors in import script with CSS attribute wildcards (`[class*="cmp-experiencefragment--utility"]`, `[class*="cmp-experiencefragment--cta-"]`). Added 3 new section definitions (main content, local navigation, archive links). Bulk imported all 7 remaining T2 URLs — 7/7 success, 0 failures. All 8 T2 pages now have content files. No new parsers were needed; the existing 6 parsers + 2 transformers handled all pages. |

---

## Sitemap Analysis

- **Sitemap:** https://www.aig.co.jp/sonpo/sitemap.xml
- **Total URLs in sitemap:** ~1,245 unique (1,246 total, 1 duplicate) (as of March 2026)

### Critical Finding: Single Base Layout

After visual inspection of 20+ pages across all URL patterns and depths (personal, business, contractor, service, contact, company/news), the AIG Sonpo site uses **one universal full-width layout**:

- **Every page** has a hero banner at the top (photo or solid-color variants)
- **Every page** uses full-width sections (no 2-column sidebar layout exists)
- **No sidebar navigation** — section/category navigation links render as a **bottom navigation block** below the main content, not as a left sidebar column
- **Standard global chrome** on all pages: Header (mega-nav), Breadcrumb, Footer

The **variation between pages is in the content blocks used** (cards, tabs, accordion, columns, etc.), not in the layout structure. Templates should therefore be classified by **which content blocks they use** (import script compatibility), not by layout.

### Exceptions

- **Micro-sites** (e.g., `/sonpo/personal/product/travel/ota/anshin-guide/**`) have their own standalone header, navigation, and footer — completely separate from the main AIG Sonpo template
- **Landing/Campaign pages** (`/sonpo/lp/**`) may use custom layouts — needs verification
- **Archive/Reference pages** (`/sonpo/eyakkan/**`, `/sonpo/archives/**`) may have minimal content layouts — needs verification
- Some `/sonpo/business/global/**` URLs redirect to `/sonpo/global/**`

---

## Page Templates

> **Classification approach:** Templates are grouped by **content block patterns** (which import script can handle them), not by layout structure (which is the same everywhere).

| #   | Template                       | URL Patterns                                                                                                                                                                               | Est. Count | Status        | Content Pattern                                                         |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------- | ----------------------------------------------------------------------- |
| T1  | **Homepage**                   | `/sonpo`                                                                                                                                                                                   | 1          | **Complete**  | Unique multi-section showcase (tabs, stats, editorial, digital-links)   |
| T2  | **Category Landing**           | `/sonpo/personal`, `/sonpo/business`, `/sonpo/personal/product`, `/sonpo/business/product`, `/sonpo/business/{industry,risk,nzk,hjk}`                                                     | **8**      | **Complete** | Hero (photo) + card grids + columns + CTA + info panels + promo banners |
| T3  | **Product/Section Page**       | `/sonpo/personal/product/{cat}`, `/sonpo/service`, `/sonpo/contact`, `/sonpo/contractor`, `/sonpo/service/claim`                                                                          | ~25        | Needs scoping | Hero (photo) + button grids/anchor nav + accordion + category content + bottom nav |
| T4  | **Product Detail Page**        | `/sonpo/personal/product/{cat}/{sub}`, `/sonpo/business/global/**`, `/sonpo/service/claim/{type}`                                                                                          | ~80        | Needs scoping | Hero (photo) + tabbed content panels + document tables + bottom nav     |
| T5  | **Content/Info Page**          | `/sonpo/company/**`, `/sonpo/contractor/**`, `/sonpo/more-aig/**`, `/sonpo/brand/**`, `/sonpo/faq/**`, `/sonpo/recruit/**`, deeper sub-pages                                              | ~500+      | Needs scoping | Hero (solid-color) + prose content + accordion/FAQ + various blocks     |
| T6  | **News/Editorial**             | `/sonpo/company/news/**`, `/sonpo/company/press/**`, `/sonpo/news`                                                                                                                         | ~100+      | Needs scoping | Hero + news list / article body + year archive links                    |
| T7  | **Landing/Campaign Page**      | `/sonpo/lp/**`, `/sonpo/military/**`                                                                                                                                                       | ~57        | Needs scoping | Custom marketing layouts (forms, promos) — needs verification           |
| T8  | **Archive/Reference**          | `/sonpo/eyakkan/**`, `/sonpo/archives/**`, `/sonpo/mmlp/**`, `/sonpo/term/**`                                                                                                              | ~112       | Needs scoping | Document-style (policy terms, legacy content) — needs verification      |
| T9  | **Micro-site**                 | `/sonpo/personal/product/travel/ota/anshin-guide/**`                                                                                                                                       | ~10        | Needs scoping | Standalone template with own header/nav/footer — separate from main site |

> **Note:** Counts are estimates. Each template needs individual scoping by analyzing sample pages to confirm block patterns and determine the exact URL list. The T5 "Content/Info Page" is the largest bucket and will likely need further sub-classification as pages are analyzed.

### Migration Progress

| Template | Sample Page Migrated | Import Infrastructure | Pages Migrated | Total Pages |
|---|---|---|---|---|
| T1 Homepage | `/sonpo` (index) | Hand-authored (no import script) | **1/1** | **1** |
| T2 Category Landing | `/sonpo/personal` | Yes (6 parsers, 2 transformers) | **8/8** | **8** |
| T3 Product/Section | — | — | 0 | ~25 |
| T4 Product Detail | — | — | 0 | ~80 |
| T5 Content/Info | — | — | 0 | ~500+ |
| T6 News/Editorial | — | — | 0 | ~100+ |
| T7 Landing/Campaign | — | — | 0 | ~57 |
| T8 Archive/Reference | — | — | 0 | ~112 |
| T9 Micro-site | — | — | 0 | ~10 |

### T2 Import Results

All 8 T2 Category Landing pages have been migrated:

| # | Page | Blocks Parsed | Status |
|---|---|---|---|
| 1 | `/sonpo/personal` | hero, prod-nav, showcase, link-grid, cta, info-panel (6/6) | Migrated (initial) |
| 2 | `/sonpo/business` | hero, prod-nav, showcase, link-grid, cta, info-panel (6/6) | **Imported** |
| 3 | `/sonpo/personal/product` | hero, prod-nav, link-grid, cta (4/6) | **Imported** |
| 4 | `/sonpo/business/product` | hero, prod-nav, link-grid, cta (4/6) | **Imported** |
| 5 | `/sonpo/business/industry` | hero, link-grid, cta (3/6) | **Imported** |
| 6 | `/sonpo/business/risk` | hero, link-grid, cta (3/6) | **Imported** |
| 7 | `/sonpo/business/nzk` | hero, link-grid, cta (3/6) | **Imported** |
| 8 | `/sonpo/business/hjk` | hero, link-grid, cta (3/6) | **Imported** |

**Key implementation detail:** The XF selector broadening approach worked — no new parsers were needed. The 6 existing parsers use generic internal DOM selectors (`.cmp-button`, `.cmp-columncontainer-item`, etc.) that match all page variants. Only the block-finding selectors in the import script needed wildcarding.

### Key takeaway

The site is **block-driven, not layout-driven**. All pages share the same full-width layout structure. The migration challenge is mapping the ~30+ distinct content block patterns, not dealing with multiple layout templates. Templates T3–T5 will likely share many blocks with T2, meaning block variants built for Category Landing can be reused.

---

## Reusable Blocks Catalog

> **Note:** The template codes below (T1–T9) reflect the revised classification. Block assignments to T3–T9 are preliminary and will be confirmed as each template is individually scoped.

### Template mapping

| Code | Template              | Est. count | Scoping status |
| ---- | --------------------- | ---------- | -------------- |
| T1   | Homepage              | 1 page     | **Complete**   |
| T2   | Category Landing      | 8 pages    | **Complete**   |
| T3   | Product/Section Page  | ~20 pages  | Needs scoping  |
| T4   | Product Detail Page   | ~80 pages  | Needs scoping  |
| T5   | Content/Info Page     | ~500+ pages| Needs scoping  |
| T6   | News/Editorial        | ~100+ pages| Needs scoping  |
| T7   | Landing/Campaign      | ~57 pages  | Needs scoping  |
| T8   | Archive/Reference     | ~112 pages | Needs scoping  |
| T9   | Micro-site            | ~10 pages  | Needs scoping  |

### Block usage by template (preliminary)

> Columns T3–T9 are **preliminary estimates** based on URL pattern analysis and limited sampling. They will be confirmed during individual template scoping.

| No                             | Category            | Block                            | T1  | T2  | T3  | T4  | T5  | T6  | T7  | T8  | T9  | Description                                                                                            |
| ------------------------------ | ------------------- | -------------------------------- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | ------------------------------------------------------------------------------------------------------ |
| **Global Blocks (every page)** |
| 1                              | Global Blocks       | **Header**                       |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✗  | Global nav with mega dropdown, mobile nav, search, utility links. Condensed sticky nav when scrolling. |
| 2                              |                     | **Breadcrumb**                   |  —  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ?  |  ?  |  ✗  | Path-based breadcrumb navigation (all pages except homepage)                                           |
| 3                              |                     | **Footer**                       |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✗  | Back-to-top, category nav, SNS links, legal links, AIG group links, copyright                          |
| **Content Blocks**             |
| 4                              | Content Blocks      | **Hero Banner (photo)**          |  ✓  |  ✓  |  ✓  |  ✓  |  —  |  ✓  |  ?  |  —  |  ✓  | Full-width image + text overlay (personal, business, product pages)                                    |
| 5                              |                     | **Hero Banner (solid-color)**    |  —  |  —  |  —  |  —  |  ✓  |  —  |  ?  |  ?  |  —  | Blue/navy banner with title only (contractor sub-pages, info pages)                                    |
| 6                              |                     | **Cards**                        |  ✓  |  ✓  |  ?  |  ?  |  ?  |  —  |  ?  |  —  |  ?  | Image + heading cards (various grid layouts: 2-up, 3-up, 4-up)                                         |
| 7                              |                     | **Columns**                      |  ✓  |  ✓  |  ?  |  ?  |  ?  |  —  |  ?  |  —  |  —  | 2-col and 3-col layouts (multiple section styles)                                                      |
| 8                              |                     | **Tabs**                         |  ✓  |  —  |  —  |  ✓  |  ?  |  —  |  —  |  —  |  —  | Tabbed content panels (homepage, product detail pages)                                                 |
| 9                              |                     | **Accordion**                    |  —  |  —  |  ✓  |  ✓  |  ✓  |  —  |  ?  |  —  |  —  | Expandable sections (product index, claims, FAQ, contractor)                                           |
| 10                             |                     | **Bottom Navigation**            |  —  |  —  |  ✓  |  ✓  |  —  |  —  |  —  |  —  |  —  | Section nav links rendered below main content (replaces old "Sidebar Navigation")                      |
| 11                             |                     | **News List**                    |  ✓  |  —  |  —  |  —  |  —  |  ✓  |  —  |  —  |  —  | Dated article links with category tags                                                                 |
| **CTA / Action Blocks**        |
| 12                             | CTA / Action Blocks | **Button Grid / Anchor Nav**     |  ✓  |  ✓  |  ✓  |  —  |  ?  |  —  |  —  |  —  |  —  | Icon + label CTA buttons / in-page jump navigation                                                     |
| 13                             |                     | **CTA Section**                  |  ✓  |  ✓  |  ✓  |  ✓  |  ?  |  —  |  —  |  —  |  —  | 3 icon CTAs (Nearest AIG, Request Materials, Contact)                                                  |
| 14                             |                     | **Sticky Contact Bar**           |  ✓  |  ✓  |  —  |  —  |  —  |  —  |  ?  |  —  |  —  | Floating bottom bar with action buttons                                                                |
| **Editorial / Article Blocks** |
| 15                             | Editorial / Article | **Article Body**                 |  —  |  —  |  —  |  —  |  ✓  |  ✓  |  —  |  ?  |  —  | Prose + inline images + captions                                                                       |
| 16                             |                     | **Year Archive Nav**             |  —  |  —  |  —  |  —  |  —  |  ✓  |  —  |  ?  |  —  | Year-by-year article navigation links                                                                  |
| 17                             |                     | **More AIG Editorial**           |  —  |  ✓  |  —  |  —  |  —  |  —  |  —  |  —  |  —  | 2-column editorial cards with category badge                                                           |
| 18                             |                     | **Pick Up / Promo Banners**      |  —  |  ✓  |  ?  |  —  |  —  |  —  |  —  |  —  |  —  | Promotional image banner links                                                                         |
| **Specialized Blocks**         |
| 19                             | Specialized         | **Phone Contact Block**          |  —  |  —  |  ✓  |  —  |  ✓  |  —  |  —  |  —  |  —  | Phone number + hours + notes                                                                           |
| 20                             |                     | **Archive Links**                |  —  |  ✓  |  ✓  |  ✓  |  ✓  |  —  |  —  |  —  |  —  | Former company product links (旧AIU, 旧富士火災)                                                         |
| 21                             |                     | **Contract Info Grid**           |  —  |  ✓  |  ✓  |  —  |  —  |  —  |  —  |  —  |  —  | Text CTA buttons for legal/info pages                                                                  |
| 22                             |                     | **Document Table**               |  —  |  —  |  —  |  ✓  |  —  |  —  |  —  |  ?  |  —  | Pamphlet/document download links (product detail pages)                                                |
| **Utility Blocks**             |
| 23                             | Utility Blocks      | **Metadata**                     |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  | All pages (hidden page metadata)                                                                       |
| 24                             |                     | **Section Metadata**             |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ?  | Section styling (light-gray, blue-background, etc.)                                                    |
| 25                             |                     | **Fragment**                     |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✗  | Header, Footer (reusable fragment loading)                                                             |

_✓_ = confirmed on this template &nbsp; _?_ = likely but needs verification &nbsp; _✗_ = does not apply (micro-site has own chrome) &nbsp; _—_ = not used

---

## Global Blocks — Reference

These blocks appear on every page (or nearly every page) of the site. They are loaded as fragments or auto-decorated by the EDS pipeline, independent of any specific template.

---

### 1. Header (nav fragment)

**Purpose:** Global site header with two-tier navigation (brand bar + mega-dropdown nav), search overlay, mobile hamburger menu, and sticky compact mode on scroll.

**DA authoring (nav document):**

The header loads its content from the `/nav` fragment page, which has **4 sections** mapped by position:

| Section | Class | Content |
|---|---|---|
| 1. Brand | `nav-brand` | Logo `<a>` with `<picture>` + utility links `<ul>` (お近くのAIG損保, お問い合わせ, もっとAIG) |
| 2. Sections | `nav-sections` | `<ul>` of 7 top-level nav items, each with `:icon:` prefix and nested dropdown `<ul>` |
| 3. Mobile CTA | `nav-mobile-cta` | Emergency contact CTA + resource request links + footer utility links (mobile only) |
| 4. Tools | `nav-tools` | Search link with `:search:` icon |

**Mega-dropdown structure (within each nav item):**

```
- :contractor: ご契約者さま       ← top-level link with icon
  - ご契約者さまトップ             ← first child → full-width header link
  - 事故のご連絡について           ← category header (text node, no link)
    - 事故のご連絡                 ← category link
    - …
  - よくあるご質問                 ← last child (no nested ul) → megamenu-bottom
```

**Implementation notes:**
- Two-tier desktop layout: navy brand bar (90px) + white nav bar (70px) = 160px total height
- Mobile: single navy bar (44px) with hamburger menu expanding to full viewport height
- Uses custom `aig-icons` font for nav item icons (loaded from `/fonts/aig-icons.ttf`)
- Megamenu dropdowns positioned full-viewport-width via JS offset calculation
- Sticky compact mode (desktop only): after scrolling past the header height, brand bar hides and nav becomes `position: fixed` with slide-down animation, showing an inline logo and search icon
- Search overlay: animated panel below brand bar with text input + submit button, redirects to `https://www.aig.co.jp/sonpo/search?kw=<query>`
- Mobile hamburger: CSS-animated three-line → X icon transition; body scroll locked when open
- Responsive breakpoint: `769px` (single breakpoint for mobile vs. desktop)
- DA output normalization: unwraps `<p>` tags inside `<li>` elements, strips `.button` / `.button-container` classes auto-added by AEM

---

### 2. Breadcrumb

**Purpose:** Renders a path-based breadcrumb navigation bar with Schema.org `BreadcrumbList` microdata for SEO. Present on all pages except the homepage.

Two approaches are available — **both produce identical visual output** (same `>` separator, navy links, gray text, 12px font, hidden on mobile <=768px):

**Option A — Auto-generated (recommended for most pages):**

Set the page metadata:
```
| metadata     |           |
| breadcrumbs  | true      |
```

The header automatically builds breadcrumbs by walking the nav tree to find the current page URL and tracing back through parent menu items. No manual authoring needed.

**Option B — Manual block (for custom labels or pages not in the nav tree):**

```
| breadcrumb |                |
| AIG損保     |                |
| 個人向け保険 |                |
```

Each row is one breadcrumb level. The first column is the link text (linked items use `<a>`), plain text for the current/active page. The last item automatically gets the `breadcrumb-active` class.

**Priority logic:** If a manual `breadcrumb` block exists on the page, the auto-generated breadcrumb is suppressed — the manual block always wins.

**Implementation notes:**
- Both approaches produce a semantic `<nav aria-label="パンくず"> > <ol>` structure with Schema.org `BreadcrumbList` microdata (`itemprop="itemListElement"`, `position`) for SEO
- Separator `>` rendered via CSS `::after` pseudo-element
- Hidden on mobile (<=768px) via `display: none` — matching the original site behavior
- Unified CSS styling shared between both approaches (12px font, navy `#001871` links, gray `#7d7d7d` text)
- Auto-generated: built in `header.js`, appended inside the header wrapper; falls back to `og:title` if the current URL isn't found in the nav tree
- Manual block: built in `breadcrumb.js`, rendered in the page content area as the first section
- Some page types (landing pages, brand microsites) intentionally omit breadcrumbs entirely

---

### 3. Footer (footer fragment)

**Purpose:** Shared footer loaded as a fragment from `/footer`. Contains back-to-top arrow, category navigation with icons, SNS links, policy links, AIG group links, and copyright.

**DA authoring (footer document):**

The footer document has 6 required sections (in order), plus an optional tracking number section:

| Section | Content |
|---|---|
| *(optional)* Tracking number | Plain text paragraph (no links), e.g., `25-2F8007, MKT-2025-013` — auto-detected by JS |
| Back to top | `[ページトップへ戻る](#)` |
| Category nav | `<ul>` of links with `:icon-name:` syntax (e.g., `:contractor: ご契約者さま`) |
| SNS | Heading `**公式SNS**` + `<ul>` of links with `<picture>` icon images |
| Policy links | `<ul>` of plain text links |
| AIG Group | Heading `**AIGグループ**` + `<ul>` of links |
| Copyright | `© AIG, Inc.` |

**Implementation notes:**
- The optional tracking number section is auto-detected: if the first section has no links and text < 80 characters, it's classified as `footer-approve-no` and all subsequent section indices shift by 1. This allows backward compatibility with footer documents that don't include a tracking number.
- Category nav icons use the `:icon:` → `<span class="icon">` pipeline; JS restructures each link to show icon above text label
- SNS links are restructured into icon + label layout with accessible aria-labels
- Back-to-top link has `e.preventDefault()` + smooth scroll to top

---

## T1 Homepage — Block Reference

Reference page: `/sonpo` (index)

This section documents every block and section style used in the **Homepage** template. The homepage is a unique, multi-section showcase page that combines blocks with heavily styled default content sections. Most visual variation comes from **section styles** applied to the generic `columns` block rather than from custom block types.

---

### 1. hero

**Purpose:** Full-width responsive hero banner with separate desktop and mobile images.

**DA authoring:**

```
| hero               |
| ![](pc-hero.jpg)   |
| ![](sp-hero.jpg)   |
```

Row 1 is the desktop image, row 2 is the mobile image. The block handles the responsive swap.

**Implementation notes:**
- Fully content-driven — no hardcoded text or URLs
- Both images set to `loading="eager"` for LCP performance
- Full-bleed layout: wrapper has `max-width: unset; padding: 0`
- CSS-only responsive swap at 768px — `.hero-desktop` hidden on mobile, `.hero-mobile` hidden on desktop
- JS strips the row wrappers and appends `<picture>` elements directly

---

### 2. columns (blue-background)

**Purpose:** Contact action buttons on a light-blue background band — "事故等のご連絡" and "商品・ご契約等のお問い合わせ".

**DA authoring:**

```
| columns |   |
| [事故等のご連絡](url) **説明テキスト** | [商品・ご契約等のお問い合わせ](url) **説明テキスト** |
---
style | blue-background
```

Each column has a link followed by a `<strong>` description. The link becomes a button, the bold text becomes the subtitle.

**Implementation notes:**
- Uses the standard `columns` block — no custom JS
- `blue-background` section style sets `background-color: var(--color-light-blue)` (#e0f3fb) with `padding: 54px 0`

---

### 3. Default content (news-list)

**Purpose:** News/announcements list with dated entries, category tags, and article links.

**DA authoring:**

```
## お知らせ

- [2026/02/05 - お知らせ - Article title](url)
- [2026/01/30 - 災害のお見舞い - Article title](url)

[災害に関するお知らせ](url) | [お知らせ一覧](url)
---
style | news-list
```

This is **default content** (no block table), styled entirely by the `news-list` section style. List items are `<ul><li><a>` with date, tag, and title parsed from the link text by CSS. Bottom links are right-aligned with arrow icons.

**Implementation notes:**
- No custom block — uses default EDS section styling
- `news-list` CSS (~120 lines): constrains width to `--content-max-width`, renders `<ul>` as bordered list with per-item `border-bottom`
- Each `<li>` link displays as a flex row: date (bold, fixed-width), tag (pill badge with navy border), title
- Hover highlights the row with light-blue background
- Bottom paragraph links are right-aligned with `::before` arrow-circle icons
- `h2` heading is left-aligned (overrides the default centered style)

---

### 4. Default content (bordered)

**Purpose:** Warning/notice section with bordered list — "ご注意" (attention items).

**DA authoring:**

```
### ご注意

- [当社名を利用する詐欺にご注意ください](url)
- [SNS等を通じた保険金詐欺への関与にご注意ください](url)
---
style | bordered
```

Default content with `<h3>` heading and `<ul>` of links, styled by `bordered` section style.

**Implementation notes:**
- No custom block
- `bordered` CSS: `border: 1px solid var(--color-border)` on inner div, horizontal flex layout
- `h3` styled in red (`var(--color-red)`), non-wrapping, flex-shrunk
- Links prefixed with arrow-circle SVG icon via `::before`
- Collapses to column layout on mobile (<=768px)

---

### 5. cards

**Purpose:** Image + text teaser cards linking to company pages (CEO message, S&P rating, At a Glance) and Hot Topics articles.

**DA authoring:**

```
| cards |
| ![](ceo.png) | **[トップメッセージ 代表取締役社長…](url)** |
| ![](sp-rating.png) | **[S&P グローバル・レーティング AA－](url)** |
| ![](glance.png) | **[At a Glance 2025](url)** |
```

Each row has an image column and a body column. Body contains a `<strong><a>` for the card title/link. Optional `<em>` text becomes an eyebrow tag badge overlaid on the card image (e.g., "Our People", "Business Risk").

**Implementation notes:**
- Fully content-driven
- Converts rows into `<ul>/<li>` card list; classifies children as `cards-card-image` or `cards-card-body`
- `<em>` text is moved to a navy pill-shaped overlay tag (`cards-card-tag`) on the image
- Images optimized via `createOptimizedPicture` at 750px
- CSS Grid: 1 column on mobile, 3 columns at >=768px
- Full-card clickability via `a::before { inset: 0 }` overlay
- Hover: image opacity 0.6, tag fades, link underlines
- Card images forced to `height: 200px` with `object-fit: cover`

---

### 6. cards (underline-heading section)

**Purpose:** Hot Topics cards section with a left-aligned underlined heading.

**DA authoring:**

```
## Hot Topics

| cards |
| ![](img.jpeg) | *Our People* **[Article title](url)** |
| ![](img.jpeg) | *Business Risk* **[Article title](url)** |
---
style | underline-heading
```

Same `cards` block as above, but the section heading uses the `underline-heading` style.

**Implementation notes:**
- `underline-heading` CSS: `h2` left-aligned with `border-bottom: 2px solid var(--color-border)` and a 60px navy accent line via `::after` pseudo-element at bottom-left
- The Hot Topics cards section has 6 cards (2 rows of 3 on desktop)

---

### 7. columns (online-contract)

**Purpose:** Online contract action buttons — links to travel insurance, auto liability, home insurance, and cargo insurance online services.

**DA authoring:**

```
## オンライン契約

| columns |   |
| [:airport: 海外旅行保険　インターネット契約](url) | [:car: 自賠責保険　オンライン手続き](url) |
| [:fire: ホームプロテクト総合保険](url) [オンライン契約](url) | [:cargo-ship: 外航貨物海上保険 Mari Net](url) [インターネット契約](url) |
---
style | light-gray-background, online-contract
```

Each cell has one or two links with `:icon:` syntax. When two links appear in a cell, the first is the main CTA and the second is a subtitle link.

**Implementation notes:**
- Uses standard `columns` block with `online-contract` section style
- `online-contract` CSS: links styled as large blue CTA buttons (`var(--color-blue)`), full-width, `min-height: 80px`, `border-radius: 6px`, white arrow-circle icon on right
- Icons inside buttons inverted to white via CSS filter
- `light-gray-background` adds gray (#eee) background band
- Columns constrained to 1084px

---

### 8. tabs

**Purpose:** Tabbed content switcher for Personal vs. Business insurance products with button grids and CTA links.

**DA authoring:**

```
| tabs |
| 個人向け保険 | まさかの時だけでなく… |
|              | [:airport: 旅行保険](url) ・ [:car: 自動車保険](url) ・ … |
|              | **[資料請求](url)** |
| 法人向け保険 | ビジネス上の様々なリスクに… |
|              | **法人向け保険商品** |
|              | [保険商品一覧](url) ・ [リスクから探す](url) ・ … |
```

Rows with text in the first cell define tab titles + descriptions. Continuation rows (empty first cell) append content to the preceding tab. Content types are differentiated by structure:
- Plain `<a>` links → button grid (3-column)
- `<strong>` text → subheading
- `<strong><a>` → CTA button
- `:icon:` syntax → icons inside buttons

**Implementation notes:**
- Fully content-driven — tab titles, descriptions, and all content come from DA
- Accessible: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-hidden`
- JS merges continuation rows, then parses inline content into structured panels
- "Wings" pattern: `::before` pseudo-element with `inset: 0 -80px` extends gray background beyond panel
- Button grid: 3 columns → 2 columns at <=900px → 1 column at <=600px
- Subheadings have a 60px navy accent underline via `::after`

---

### 9. Default content + columns (about-aig section)

**Purpose:** "AIG損害保険について" section with company description text, a CTA link, and navy stat counter cards (1946年 営業開始, 6,061名 従業員数, etc.).

**DA authoring:**

```
## AIG損害保険について
### AIGグループの一員です

Description paragraph…

[企業情報](url)

| columns |   |   |
| **1946**年 営業開始 | **6,061**名 従業員数 | *国内最大の* *外資系損害保険会社* |
---
style | about-aig, centered-subheading, text-link-cta, navy-stat-counters
```

The section combines default content (heading, subheading, paragraph, CTA link) with a `columns` block for stat counters. Multiple section styles are stacked.

**Implementation notes:**
- `centered-subheading`: centers `h3` at `--heading-font-size-xl`
- `text-link-cta`: converts the `[企業情報]` button into a plain right-aligned text link with arrow-circle icon
- `navy-stat-counters`: styles the 3-column columns block as navy cards with large bold numbers (`<strong>` → `--heading-font-size-xxl`) and `<em>` as de-italicized white labels
- `about-aig`: class is applied but has no CSS rules — serves as a semantic marker with no visual effect

---

### 10. columns (content-1-2, AIG Group section)

**Purpose:** "AIGグループについて" section with a 1:2 image-text layout and stat counters.

**DA authoring:**

```
## AIGグループについて

| columns |   |
| ![](about-aig.png) | Description text… [AIG.com](url) |

| columns |   |   |
| **1919**年 創業 | **200+** 国や地域 | **239**億ドル 損害保険事業… |
---
style | light-gray-background, content-1-2, navy-stat-counters
```

Two columns blocks: a 1:2 image-text layout followed by a 3-column stat counter.

**Implementation notes:**
- `content-1-2`: sets `flex: 1` on image column and `flex: 2` on text column for 1/3–2/3 split
- `navy-stat-counters`: same navy stat cards as above
- `light-gray-background`: gray (#eee) background band
- The last link in the text column is styled as a right-aligned text link with arrow icon

---

### 11. Default content (image-banner, 80th anniversary)

**Purpose:** "AIGは日本に根差して80年" — a full-width image banner with a CTA text link.

**DA authoring:**

```
## AIGは日本に根差して80年

![](aig-80th.png)

[詳しくはこちら](url)
---
style | image-banner, text-link-cta
```

**Implementation notes:**
- `image-banner`: hides the `h2` heading (`display: none`) — the image and link are the visible content
- `text-link-cta`: converts the button into a plain right-aligned text link with arrow icon
- The heading is still present in the DOM for accessibility/SEO

---

### 12. columns (recruitment)

**Purpose:** Recruitment promotion section with text and image in a 2:1 layout.

**DA authoring:**

```
## 採用情報

| columns |   |
| Description text… [詳しくはこちら](url) | ![](recruit-img.png) |
---
style | light-gray-background, recruitment
```

Text column on the left, image column on the right.

**Implementation notes:**
- `recruitment`: text column `flex: 2`, image column `flex: 1`
- Links styled as plain text with arrow-circle icon (no button appearance)
- `light-gray-background`: gray background band

---

### 13. columns (digital-links)

**Purpose:** Digital certificate, e-policy, and document reissue links — the most visually complex section with multiple button types.

**DA authoring:**

```
## デジタル保険証券・e証券・e約款…

| columns |   |
| [:document: e約款](url) [保険の約款…](url) | [控除証明書再発行請求について](url) [インターネットによる…](url) |
| [:document: デジタル保険証券](url) [業務災害総合保険…](url) | [自賠責保険証明書…](url) |
| [:document: e証券](url) [インターネット契約…](url) | *[重要事項説明書の補足事項](url)* |
|   | *[保険料振込猶予期限についてのご案内](url)* |

[お客さまアンケート](url)
---
style | digital-links
```

Each cell can have: a primary CTA link (with optional `:icon:`), a secondary description/subtitle link, or an italic link (rendered as a plain text link). The bottom paragraph is a standalone CTA.

**Implementation notes:**
- The most extensively styled section (~200 lines of CSS)
- `digital-links` CSS: uses `.col-left` / `.col-right` sub-columns in flex layout
- Primary links: large blue CTA buttons (`var(--color-blue)`), `min-height: 100px`, with custom icon font arrow (`\e902` from `aig-icons`)
- Right-column primary links use navy background
- `<em><a>` italic links: rendered as plain text links with `::before` arrow-circle icon (`.text-link` class)
- Card-caption elements provide small descriptive text below button labels
- Bottom CTA button is an outlined white button, centered, `max-width: 450px`

---

### Section Styles Summary

| Style | Purpose |
|---|---|
| `blue-background` | Light-blue (#e0f3fb) full-width background band for contact action buttons |
| `news-list` | Bordered dated news list with tag badges, hover highlights, arrow-icon links |
| `bordered` | Red-headed warning/notice box with bordered flex layout and arrow-icon links |
| `underline-heading` | Left-aligned `h2` with gray bottom border + 60px navy accent underline |
| `light-gray-background` | Gray (#eee) full-width background band |
| `online-contract` | Blue CTA buttons (full-width, 80px min-height, white arrow icon) for online services |
| `centered-subheading` | Centers `h3` at large font size |
| `text-link-cta` | Strips button styling, renders as plain right-aligned text link with arrow icon |
| `navy-stat-counters` | Navy background stat cards with large bold numbers and white text |
| `content-1-2` | 1:2 flex ratio for image-text columns layout |
| `image-banner` | Hides `h2`, shows only image/content (pure banner) |
| `recruitment` | 2:1 text-image layout with plain text link styling |
| `digital-links` | Complex multi-button section with CTA buttons, text links, card captions, icon font arrows |
| `about-aig` | Semantic marker only — no CSS rules defined |

---

## T2 Category Landing — Block Reference (Personal Template)

Reference page: `/sonpo/personal`

This section documents every block and section style used in the **Category Landing** template, as implemented for the `/sonpo/personal` page. Each entry describes what the block does, how authors create content for it in Document Authoring (DA), and any notable implementation details.

---

### 1. hero-category

**Purpose:** Full-width hero banner with responsive desktop/mobile images and an overlaid text card with heading and description.

**DA authoring:**

```
| hero-category   |                                                  |
| ![](pc-img.png) | (heading + description in second column, row 2)  |
| ![](sp-img.png) |                                                  |
```

Row 1 has two columns: the first contains two images (desktop then mobile), the second contains the `<h1>` heading and a `<p>` description. The block classifies the first image as `hero-pc` and the second as `hero-sp` for responsive display.

**Implementation notes:**
- Fully content-driven — no hardcoded text or URLs
- Both images are marked `loading="eager"` for LCP performance
- Desktop: image overflows content wrapper at 1225px width, text overlays with semi-transparent white card
- Mobile: image cropped to 280px height, text below on gray background

---

### 2. columns-product-nav

**Purpose:** Two-column layout with a section heading on the left and a grid of navigation button links on the right.

**DA authoring:**

```
| columns-product-nav |                    |
| ## 個人向け商品一覧   | [自動車保険](url)   |
|                     | [火災保険](url)     |
|                     | ...                |
```

Left column has the `<h2>` heading. Right column has `<p><a>` links, each rendered as a navy pill button. The last link gets an accent blue style automatically.

**Implementation notes:**
- Fully content-driven
- Used inside a section with `light-gray` style
- Heading has a two-tone underline: gray border with a short navy accent via `::after`
- Responsive: stacked → 2-col grid → side-by-side at 900px

---

### 3. pickup-banners

**Purpose:** Promotional image banners with responsive desktop/mobile images that link to campaign pages.

**DA authoring:**

Each row in the block is one banner with three elements:
```
| pickup-banners       |
| ![](pc-banner.jpg)   |
| ![](sp-banner.jpg)   |
| [Banner title](url)  |
```

The first image is desktop, the second is mobile, and the link provides both the destination URL and the accessible text.

**Implementation notes:**
- Fully content-driven
- JS wraps each image in an `<a>` with the link's href, assigns `banner-pc` / `banner-sp` classes
- The text link paragraph is removed (its href and text are transferred to the image links)
- Simple responsive toggle at 768px

---

### 4. columns-showcase

**Purpose:** Two-column editorial cards with category badge, thumbnail image, description text, and a featured article link.

**DA authoring:**

```
| columns-showcase |                   |
| ### Personal Risk | ### Our People    |
| ![](thumb.jpg)   | ![](thumb.jpg)    |
| Description text  | Description text  |
| [![](img)](url)   | [![](img)](url)   |
| #### [Title](url) | #### [Title](url) |
```

Each column contains: `<h3>` (category name, becomes eyebrow badge), thumbnail image, description paragraph, linked card image, and `<h4>` with the article title link.

**Implementation notes:**
- Fully content-driven
- JS duplicates the `<h3>` text into a `<span class="columns-showcase-tag">` positioned as a pill badge over the card image
- Card images forced to `aspect-ratio: 2/1` on desktop for consistent height

---

### 5. cards-link-grid

**Purpose:** Grid of text CTA button links for navigating to related legal/informational pages.

**DA authoring:**

```
| cards-link-grid |                                    |
|                 | [損害保険の契約をお考えの皆さま](url)  |
|                 | [ご契約の保護制度](url)               |
|                 | [付随的な保険金のご説明](url)          |
```

Each row has two columns: an empty image column (hidden by CSS) and a body column with the link text. Multiple `cards-link-grid` blocks can be stacked for grouped rows (consecutive blocks get reduced spacing).

**Implementation notes:**
- Fully content-driven
- Converts rows into `<ul>/<li>` card list
- Links styled as white outlined buttons with gray border, 80px min-height, and gray arrow circle icon
- Grid: 1 column on mobile, 3 columns at >=600px

---

### 6. columns-cta

**Purpose:** Row of 3 large icon CTA buttons for primary contact actions (Nearest AIG, Request Materials, Contact).

**DA authoring:**

```
| columns-cta                            |                          |                       |
| [:office-location: お近くのAIG損保](url) | [:document: 資料請求](url) | [:contact: お問い合わせ](url) |
```

Each column contains a single link with an `:icon-name:` prefix for the icon. The `:icon:` syntax is converted to `<span class="icon">` elements by the EDS decoration pipeline, and icons are loaded from `/icons/{name}.svg`.

**Implementation notes:**
- Content-driven with fallback — if the author includes `:icon:` syntax, those icons are used; otherwise, a JS `ICON_MAP` injects icons based on URL pathname as a fallback
- Used inside a section with `light-gray` style
- The `light-gray` background uses a `::before` pseudo-element capped at `--content-max-width` (not full-width)
- Navy buttons with white text and icons, 80px min-height

---

### 7. columns-info-panel

**Purpose:** Two-column white information panels containing a mix of primary buttons, secondary buttons, text links, and descriptive text for policyholder services.

**DA authoring:**

The block uses three authoring conventions to control button variants:

| Convention | Rendered as | Example |
|---|---|---|
| `<p><a>` (regular link) | Blue primary button | `[：contact: 商品・ご契約等のお問い合わせ窓口](url)` |
| `<p><em><a>` (italic link) | White/outline secondary button | `*[:office-location: お近くのAIG損保](url)*` |
| `<ul><li><a>` (list item link) | Text link with arrow icon | `- [耳や言葉の不自由なお客さま](url)` |

Icons are authored using `:icon-name:` syntax inside the link text (e.g., `:contact:`, `:document:`, `:corporation:`). A short text paragraph (<=25 characters) immediately following a button is automatically merged as a caption inside the button.

```
| columns-info-panel |                          |
| ### 契約内容の確認…  | ### ご契約者向け各種情報…   |
| [:contact: お問い合わせ窓口](url) | [:document: e約款](url) |
| - [耳や言葉の…](url)  | 保険の約款、ご契約のしおり    |
| *[:office-location: お近くの…](url)* | [:document: e証券](url) |
| 説明テキスト…        | インターネット契約内容…      |
```

**Implementation notes:**
- Fully content-driven — all button variants, icons, and text links are controlled by the author in DA
- JS only does column counting and caption merging (no hardcoded URL maps or icon injection)
- Most extensively styled block (~280 lines of CSS)
- White card panels on flex layout, side-by-side at >=768px
- `<h3>` headings are centered with a bottom border
- Icon colors: white filter for primary buttons, gray filter for secondary buttons
- Also styles a follow-up default-content-wrapper for the 旧AIU / 旧富士火災 subsection (horizontal flex row with arrow-icon links)
- Used inside a section with `light-gray` style

---

### Section Styles

| Style | Purpose | CSS effect |
|---|---|---|
| `light-gray` | Gray background section | Background `#f5f5f5` applied to section, used by columns-product-nav, columns-cta, and columns-info-panel sections |
| `approve-no` | Tracking/approval number (承認番号) | Small (12px), right-aligned, gray (#575757) text at the bottom of the page. Displays the regulatory compliance code required on Japanese insurance pages (e.g., "25-2F8007, MKT-2025-013"). Content-driven — the author adds a paragraph with the tracking text and sets the section style to `approve-no`; if removed, nothing displays. Each page can have its own unique approval number. |

---

## T2 Category Landing — Scoping Results

### Analysis methodology

Visual inspection + DOM analysis of 12 candidate pages using Playwright. For each page, checked all 6 existing personal parser selectors, business-variant selectors, and mapped the full section structure to identify new content patterns.

### Existing import infrastructure (from `/sonpo/personal`)

| # | Parser | CSS Selector |
|---|---|---|
| 1 | hero-category | `.ace-heroimage.cmp-heroimage--width-full` |
| 2 | columns-product-nav | `.cmp-section--light-gray:not(.cmp-section--background-full) .cmp-columncontainer--2col-1_3` |
| 3 | columns-showcase | `.ace-section.cmp-section--light-gray:not(.cmp-section--primary) .cmp-columncontainer` |
| 4 | cards-link-grid | `.cmp-experiencefragment--utility-personal .cmp-columncontainer--3` |
| 5 | columns-cta | `.cmp-experiencefragment--cta-personal-products .cmp-columncontainer--3` |
| 6 | columns-info-panel | `.cmp-section--background-full .cmp-columncontainer:has(.cmp-section--white)` |

### Block reuse matrix (all 12 T2 candidates)

| Page | hero-category | col-product-nav | col-showcase | cards-link-grid | columns-cta | col-info-panel | Match |
|---|:-:|:-:|:-:|:-:|:-:|:-:|---|
| `/sonpo/personal` *(migrated)* | ✓ | ✓ | ✓ | ✓ (personal) | ✓ (personal) | ✓ | **6/6** |
| `/sonpo/business` | ✓ | ✓ | ✓ | ✗ (biz XF) | ✗ (biz XF) | ✓ | **4/6** |
| `/sonpo/personal/product` | ✓ | ✓ | — | ✓ (personal) | ✓ (personal) | — | **4/6** |
| `/sonpo/business/product` | ✓ | ✓ | — | ✗ (biz XF) | ✗ (biz XF) | — | **2/6** |
| `/sonpo/business/industry` | ✓ | — | — | ✗ (biz XF) | ✗ (biz XF) | — | **1/6** |
| `/sonpo/business/risk` | ✓ | — | — | ✗ (biz XF) | ✗ (biz XF) | — | **1/6** |
| `/sonpo/business/nzk` | ✓ | — | — | — | ✗ (nzk XF) | — | **1/6** |
| `/sonpo/business/hjk` | ✓ | — | — | — | ✗ (hjk XF) | — | **1/6** |
| `/sonpo/business/totalrisk` | ✓ | — | — | — | — | — | **1/6** |
| `/sonpo/service` | ✓ | — | — | — | — | — | **1/6** |
| `/sonpo/contact` | ✓ | — | — | — | — | — | **1/6** |
| `/sonpo/contractor` | ✓ | — | — | — | — | — | **1/6** |

### Key finding: Experience Fragment class divergence

The main blocker for parser reuse is that the site uses **page-specific Experience Fragment (XF) class names**. The internal content structure is often identical, but the wrapper class differs:

| XF Purpose | Personal variant | Business variant | Nzk/Hjk variant |
|---|---|---|---|
| Contract info links | `--utility-personal` (3-col, 6 items) | `--utility-business` (2-col, 2 items) | `--utility-business` (same) |
| CTA buttons | `--cta-personal-products` (3-col) | `--cta-business-products` (3-col) | `--cta-business-nzk` / `--cta-business-hjk` (3-col) |
| Disclaimer guard | *(none)* | `--guard-products` | `--guard-business-hjk-nzk` |
| Archive links | *(inline section)* | `--link-to-archives` | *(none)* |
| Local nav | *(none)* | `--localnav-business` | *(none)* |
| Contact accordion | *(none)* | *(none)* | *(none, on contact/contractor only)* |

**Recommendation:** Broaden parser selectors to match XF classes with wildcards (e.g., `[class*="cmp-experiencefragment--cta-"]`) rather than targeting specific page variants.

### Page similarity clusters

**Cluster A — Closest to `/sonpo/personal` (highest reuse, migrate first)**

| Page | Similarity | Existing parsers reusable | New parsers needed |
|---|---|---|---|
| `/sonpo/business` | **HIGH** | hero-category, columns-product-nav, columns-showcase, columns-info-panel | Broaden XF selectors for cards-link-grid + columns-cta; new: solution-cards (海外/国内ソリューション), image-banners (standalone promo images) |

**Cluster B — Product index pages (share hero + footer XFs, need product-accordion parser)**

| Page | Similarity | Existing parsers reusable | New parsers needed |
|---|---|---|---|
| `/sonpo/personal/product` | **MEDIUM** | hero-category, columns-product-nav, cards-link-grid, columns-cta | product-accordion (alternating blue/gray sections with expandable items), anchor-nav (top jump links), disclaimer-section |
| `/sonpo/business/product` | **MEDIUM** | hero-category, columns-product-nav | Same as above + broaden XF selectors |

**Cluster C — Business category landings (share business XF set)**

| Page | Similarity | Existing parsers reusable | New parsers needed |
|---|---|---|---|
| `/sonpo/business/industry` | **LOW-MED** | hero-category | icon-button-grid (industry/risk selection), guard-products XF, link-to-archives XF, localnav-business XF |
| `/sonpo/business/risk` | **LOW-MED** | hero-category | Same as industry (structurally identical) |

**Cluster D — Business association pages (simplified business template)**

| Page | Similarity | Existing parsers reusable | New parsers needed |
|---|---|---|---|
| `/sonpo/business/nzk` | **LOW** | hero-category | nav-button-grid, guard-business-hjk-nzk XF, cta-business-nzk XF variant |
| `/sonpo/business/hjk` | **LOW** | hero-category | Same as nzk (structurally identical) |

**Cluster E — Should be reclassified (too different from T2)**

These pages share only the hero with T2. Their content patterns are fundamentally different and belong to other templates:

| Page | Reason to reclassify | Suggested template |
|---|---|---|
| `/sonpo/contact` | 34 accordion elements, contact-accordion XFs, unique phone/email layout (49 sections) | T3 (Product/Section) or new "Contact Hub" template |
| `/sonpo/contractor` | Identical accordion zone as contact + unique button grids, procedure sections, dispute resolution (60 sections) | T3 or new "Contractor Hub" template |
| `/sonpo/service` | Plain content-card sections, no XFs besides header/footer, unique layout (17 sections) | T3 (Service Hub) |
| `/sonpo/business/totalrisk` | Informational content page, no business XF set, unique contact XF (11 sections) | T5 (Content/Info Page) |

### Recommended T2 migration order

Based on parser reuse potential, the recommended order is:

| Priority | Page(s) | Effort | Why |
|---|---|---|---|
| **1** | `/sonpo/business` | Low — broaden 2 XF selectors, add 2 new parsers | Closest sibling to `/sonpo/personal`. 4/6 parsers reusable. |
| **2** | `/sonpo/personal/product` + `/sonpo/business/product` | Medium — 1 major new parser (product-accordion) | Share hero + footer XFs. Product-accordion parser unlocks both pages. |
| **3** | `/sonpo/business/industry` + `/sonpo/business/risk` | Medium — icon-button-grid + 3 business XF parsers | Identical structure. Business XF parsers reusable by cluster D. |
| **4** | `/sonpo/business/nzk` + `/sonpo/business/hjk` | Low — reuse business XF parsers from priority 3 | Simplified version of cluster C. |

### Revised T2 page count

After reclassifying 4 pages out of T2 (contact, contractor, service, totalrisk), the confirmed T2 Category Landing pages are:

| # | URL | Cluster | Status |
|---|---|---|---|
| 1 | `/sonpo/personal` | A | **Migrated** (initial) |
| 2 | `/sonpo/business` | A | **Imported** |
| 3 | `/sonpo/personal/product` | B | **Imported** |
| 4 | `/sonpo/business/product` | B | **Imported** |
| 5 | `/sonpo/business/industry` | C | **Imported** |
| 6 | `/sonpo/business/risk` | C | **Imported** |
| 7 | `/sonpo/business/nzk` | D | **Imported** |
| 8 | `/sonpo/business/hjk` | D | **Imported** |

**Total: 8/8 T2 pages imported.**

> **Note:** `/sonpo/business/riskappetite` was not analyzed but based on URL pattern it likely belongs to cluster C or D. Needs verification.

### T2 import implementation notes

The bulk import used the broadened selector approach (Option 1 from scoping):

1. **No new parsers needed** — the 6 existing parsers all use generic internal DOM selectors (`.cmp-button`, `.cmp-columncontainer-item`, etc.) that matched across all page variants
2. **XF selectors broadened with CSS attribute wildcards:**
   - `cards-link-grid`: `[class*="cmp-experiencefragment--utility"]` (was `--utility-personal`)
   - `columns-cta`: `[class*="cmp-experiencefragment--cta-"]` (was `--cta-personal-products`)
   - Section 5 (contract info) and Section 6 (CTA) selectors broadened with array fallbacks
   - Section 7 (policyholders) archive link selector broadened to `[class*="cmp-experiencefragment--link-to-archives"]`
3. **3 new sections added** to handle content that appears on business pages but not personal:
   - `section-8-content` — main content areas not matching any other section
   - `section-9-localnav` — local navigation Experience Fragments
   - `section-10-archives` — archive links Experience Fragments
4. **Content not captured by existing parsers** flows through as default content (headings, links, images, text) — this is by design. The business pages have additional content patterns (solution cards, icon grids, product accordions) that could benefit from dedicated parsers in the future but render acceptably as default content for now.

---

## Next Steps

### Immediate (T2 refinement)

1. **Visual QA** — Compare each imported page side-by-side with the original to identify content gaps and styling issues. The business page has several content sections (海外/国内ソリューション, 法人会・納税協会制度商品) that imported as default content and may need dedicated blocks for better visual fidelity.

2. **Block CSS refinement** — The 6 block variants (hero-category, columns-product-nav, columns-showcase, cards-link-grid, columns-cta, columns-info-panel) were styled for `/sonpo/personal`. Verify they look correct on business pages and adjust CSS if needed.

3. **Verify `/sonpo/business/riskappetite`** — This URL appeared in earlier analysis but wasn't included in the T2 scope. Check if it should be added as a 9th T2 page.

### Next template (recommended: T3 Product/Section Page)

T3 is the natural next target because it **shares the most blocks with T2**:
- Reusable from T2: hero-category, cards-link-grid, columns-cta (3/6 parsers)
- New blocks needed: accordion, anchor-nav, button-grid, phone-contact, bottom-navigation
- Estimated ~25 pages
- Representative pages to analyze first: `/sonpo/personal/product/auto/aap`, `/sonpo/service/claim`

**Migration order recommendation for remaining templates:**

| Priority | Template | Est. Pages | Shared blocks with prior | New blocks needed |
|---|---|---|---|---|
| **Next** | T3 Product/Section | ~25 | 3 from T2 | accordion, anchor-nav, button-grid, bottom-nav |
| 3 | T4 Product Detail | ~80 | Many from T2+T3 | tabs, document-table |
| 4 | T6 News/Editorial | ~100+ | hero, metadata | news-list, year-archive, article-body |
| 5 | T5 Content/Info | ~500+ | hero, many from T3-T4 | Mostly default content + FAQ accordion |
| 6 | T7 Landing/Campaign | ~57 | Unknown | Needs scoping — custom marketing layouts |
| 7 | T8 Archive/Reference | ~112 | Minimal | Needs scoping — document-style pages |
| 8 | T1 Homepage | 1 | — | **Already complete** (hand-authored) |
| 9 | T9 Micro-site | ~10 | None | Standalone template, separate chrome |


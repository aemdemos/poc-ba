# AIG Japan Navigation (Header Block)

This document explains how the navigation is authored and how the header block works for the AIG Japan (aig.co.jp/sonpo) Edge Delivery Services site.

## File Structure

```
blocks/header/
  header.js       # Block JavaScript (decoration, accordion, megamenu, sticky, search)
  header.css      # Block CSS (mobile, desktop, sticky, search overlay)

content/
  nav.md          # Navigation content (authored in Markdown)

fonts/
  aig-icons.ttf   # Custom icon font for nav icons
```

## Authoring the Navigation (`nav.md`)

The navigation is authored in `content/nav.md`. It is divided into **4 sections** separated by horizontal rules (`---`). Each section maps to a specific area of the header.

### Section 1: Brand (Navy Bar)

The first section contains the logo and utility links displayed in the navy blue top bar.

```markdown
[![AIG損保](https://www.aig.co.jp/.../aig-logo-full-white.svg)](/)

- [お近くのAIG損保](https://www.aig.co.jp/sonpo/company/branch)
- [お問い合わせ](https://www.aig.co.jp/sonpo/contact)
- [もっとAIG](https://www.aig.co.jp/sonpo/more-aig)
```

**How it renders:**
- The image/link becomes the site logo (white SVG on navy background)
- The unordered list items become utility links
- On **mobile**: The first two items show as icon-only buttons (using the `aig-icons` font); the third item is hidden
- On **desktop**: All three items show as text links to the right of the logo

### Section 2: Main Navigation (White Bar)

The second section is the main nav bar with 7 top-level items, each having a megamenu dropdown with up to 3 levels of nesting.

```markdown
- [:contractor: ご契約者さま](https://www.aig.co.jp/sonpo/contractor)
  - [ご契約者さまトップ](https://www.aig.co.jp/sonpo/contractor)
  - 事故のご連絡について
    - [事故のご連絡](https://www.aig.co.jp/sonpo/service/contact)
    - [耳や言葉の不自由なお客さま専用のご連絡](https://www.aig.co.jp/sonpo/service/handicap)
  - [よくあるご質問](https://www.aig.co.jp/sonpo/faq)
```

**Navigation hierarchy (3 levels):**

| Level | Markdown | Example | Renders as |
|-------|----------|---------|------------|
| 1 - Top item | `- [:icon: Label](url)` | `:contractor: ご契約者さま` | Nav bar item with icon + chevron |
| 2 - Submenu link | `  - [Label](url)` | `ご契約者さまトップ` | Clickable link in dropdown |
| 2 - Category header | `  - Plain text` | `事故のご連絡について` | Bold text header (not a link) |
| 3 - Child link | `    - [Label](url)` | `事故のご連絡` | Indented link under category |

**Icons:** Each top-level item has an icon using the `:iconname:` syntax. Available icons:

| Icon syntax | Item | Font codepoint |
|-------------|------|----------------|
| `:contractor:` | ご契約者さま | `\e912` |
| `:personal:` | 個人向け保険 | `\e923` |
| `:business:` | 法人向け保険 | `\e90f` |
| `:news:` | ニュース | `\e912` |
| `:company:` | 企業情報 | `\e906` |
| `:recruit:` | 採用情報 | `\e93d` |

**Special item types in the dropdown:**
- **First item** (e.g., `ご契約者さまトップ`): Renders as a top link with a circle-arrow icon. It spans the full width of the megamenu.
- **Category headers** (plain text with nested list): Render as bold text headers with a border-bottom, followed by their child links in a column.
- **Last standalone link** (e.g., `よくあるご質問`): Renders as a "bottom link" spanning the full width, with a circle-arrow icon.
- **Standalone links** in the middle (e.g., `個人向け商品一覧`): Render with a circle-arrow icon in their own column.

### Section 3: Mobile CTA

The third section only appears in the mobile hamburger menu, below the main navigation accordion. It contains quick-access links and footer links.

```markdown
- [事故・病気・ケガ・災害時のご連絡](https://www.aig.co.jp/sonpo/service/contact)

資料のご請求、ご相談・お申込み

- [お近くのAIG損保](https://www.aig.co.jp/sonpo/company/branch)
- [個人の資料請求](https://www.aig.co.jp/sonpo/forms/brochure/personal)
- [法人の資料請求](https://www.aig.co.jp/sonpo/forms/brochure/business)
- [よくある質問](https://www.aig.co.jp/sonpo/faq)

[採用情報](https://www.aig.co.jp/sonpo/recruit) | [ICA社員募集](https://www.aig.co.jp/sonpo/recruit/ica) | [不動産代理店募集](https://www.aig.co.jp/sonpo/recruit/agency)
```

**How it renders:**
- **First list** (`ul:first-child`): Emergency CTA button - white rounded pill with circle-arrow icon
- **Paragraph text**: Section title ("資料のご請求、ご相談・お申込み") rendered as bold heading
- **Second list** (`ul:nth-of-type(2)`): Resource links - each item is an individual white rounded pill with `border-radius: 6px` and 8px gap between them
- **Last paragraph**: Footer links in a 2-column grid layout. Pipe characters (`|`) are stripped by JavaScript.

### Section 4: Search

The fourth section contains the search trigger.

```markdown
[:search: 検索](#)
```

This renders as a search icon button. On mobile it appears in the top bar; on desktop it appears as a 90x90px button in the navy bar. Clicking it opens a search overlay with a text input and submit button.

## How the Header Block Works

### CSS Class Mapping

The JavaScript assigns CSS classes to each `<div>` section from the nav fragment:

| Section index | CSS class | Grid area | Content |
|---------------|-----------|-----------|---------|
| 0 | `.nav-brand` | `brand` | Logo + utility links |
| 1 | `.nav-sections` | `sections` | Main navigation |
| 2 | `.nav-mobile-cta` | `mobile-cta` | Mobile-only CTA links |
| 3 | `.nav-tools` | `tools` | Search button |

### Mobile Behavior (< 769px)

- **Layout**: CSS Grid with named areas (`brand`, `tools`, `hamburger`, `sections`, `mobile-cta`)
- **Hamburger menu**: Tapping the hamburger button toggles `aria-expanded` on the `<nav>` element
- **Accordion**: Top-level nav items expand/collapse as accordions (one at a time). Clicking a top-level item collapses all others.
- **Body scroll lock**: When the mobile menu is open, `document.body` and `document.documentElement` overflow is set to `hidden`
- **Full-height menu**: `min-height: 100dvh` with `align-content: start` to pack content at the top
- **Slide-down animation**: The sections and CTA slide in with a 0.3s ease-out animation
- **Hover effect**: All interactive items (parent items, submenu links, category headers, child links, CTA pills) have a hover state of `background: #e6e6e6` and `color: #001871`

### Desktop Behavior (>= 769px)

- **Two-tier layout**: Flexbox column - navy brand bar (90px) on top, white nav bar (70px) below
- **Megamenu**: Clicking a top-level item opens a full-width dropdown positioned absolutely below the nav bar. The dropdown uses `flex-wrap: wrap` to lay out categories in columns.
- **Close chevron**: Each megamenu has a close button at the bottom (up-pointing chevron)
- **Blue underline**: Top-level items have a blue underline animation on hover (`transform: scaleX` transition)
- **Vertical separators**: Thin gray lines between nav items (including a left-edge separator via `::before` on the `<ul>`)
- **Responsive scaling**: Font sizes and icon sizes scale across three breakpoints:
  - 769px–920px: 12px text, 18px icons
  - 921px–1080px: 14px text, 22px icons
  - 1081px+: 16px text, 26px icons

### Sticky Compact Header (Desktop Only)

When the user scrolls past the header height, the nav bar becomes a fixed compact header:

- **Brand bar and tools hidden**: Only the nav items bar is visible
- **Sticky logo**: An `AIG損保` text link with the blue SVG logo is prepended to the nav `<ul>` (hidden by default, shown in sticky mode via `.sticky-logo`)
- **Sticky search**: A search icon is appended to the nav `<ul>` (hidden by default, shown in sticky mode via `.sticky-search`)
- **Slide-in animation**: 0.5s ease slide-down from top
- **Icons and chevrons hidden**: Only text labels are shown in sticky mode
- **Height**: 77px (vs 70px normal)

### Search Overlay

- Positioned absolutely below the nav bar (`top: 90px` normal, `top: 77px` sticky)
- Animated open/close with `max-height` and `opacity` transitions
- Contains a text input and submit button
- Submits to `https://www.aig.co.jp/sonpo/search?kw={query}`
- Closes on: clicking outside, pressing Escape, or clicking the search icon again
- When active, the search icon switches to an X icon via the `.search-active` class

### JavaScript Decoration Details

The `header.js` file performs these key decorations:

1. **Section assignment**: Assigns `.nav-brand`, `.nav-sections`, `.nav-mobile-cta`, `.nav-tools` to the four `<div>` sections
2. **P-tag unwrapping**: Strips `<p>` wrappers from nav list items (DA compatibility)
3. **Button class removal**: Removes `.button` and `.button-container` classes added by auto-decoration
4. **Category detection**: Items at level 2 that have a nested `<ul>` get:
   - `.nav-category` class on the `<li>`
   - Direct text nodes wrapped in `<span>` for styling
   - Direct `<a>` links converted to `<span>` (category headers are not clickable)
5. **Bottom link detection**: The last item in a dropdown that has no nested `<ul>` gets `.megamenu-bottom`
6. **Close chevron**: A `.megamenu-close` div is appended to each dropdown
7. **Pipe removal**: Pipe characters (`|`) between footer links in the mobile CTA are removed
8. **Sticky elements**: `.sticky-logo` and `.sticky-search` list items are created and injected into the nav `<ul>`

### Breadcrumbs

If a page has `breadcrumbs: true` in its metadata, a breadcrumb trail is generated by traversing the nav tree to find the current URL. The breadcrumb bar appears below the nav on desktop only (32px height).

## Key CSS Variables Used

| Variable | Purpose |
|----------|---------|
| `--nav-height` | Mobile nav bar height (44px) |
| `--nav-height-desktop` | Desktop brand bar height (defined elsewhere) |
| `--color-navy` | Navy blue (`#001871`) for brand bar |
| `--color-white` | White text |
| `--color-blue` | Search button background |
| `--background-color` | White background for nav bar |
| `--body-font-family` | Primary font family |
| `--heading-font-family` | Heading font (used for brand link) |
| `--text-color` | Default text color |

## Adding a New Top-Level Nav Item

1. In `nav.md`, add a new level-1 list item in Section 2:
   ```markdown
   - [:iconname: New Item](https://www.aig.co.jp/sonpo/new-page)
     - [New Item Top](https://www.aig.co.jp/sonpo/new-page)
     - Category Name
       - [Child Link](https://www.aig.co.jp/sonpo/new-page/child)
   ```

2. If using a new icon, add the icon font mapping in `header.css`:
   ```css
   header nav .icon-iconname::before {
     content: '\eXXX';  /* codepoint from the aig-icons font */
   }
   ```

## Adding a New Mobile CTA Item

In `nav.md` Section 3, add an item to the second unordered list:

```markdown
- [New CTA Link](https://www.aig.co.jp/sonpo/new-cta)
```

Each item renders as an individual white pill button with a circle-arrow icon.

## Reference

- **Original site**: https://www.aig.co.jp/sonpo
- **Breakpoint**: 769px (mobile/desktop boundary)
- **Icon font**: `/fonts/aig-icons.ttf` (custom TrueType font)
- **Hover color**: `#e6e6e6` background, `#001871` text (consistent across all interactive items)
- **Circle-arrow SVG**: Inline data URI used throughout for link indicators

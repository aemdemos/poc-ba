# Migration Plan

## Sitemap Analysis

- **Sitemap:** https://www.aig.co.jp/sonpo/sitemap.xml
- **Total URLs found:** 1,246 across 25 distinct URL patterns.

---

## Page Templates

| #   | Template                      | URL Patterns                                                                                                                                                                                             | Count | %       | Layout Structure                                 |
| --- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------- | ------------------------------------------------ |
| 1   | **Homepage**                  | `/sonpo`                                                                                                                                                                                                 | 1     | < 1%    | Multi-section showcase (unique)                  |
| 2   | **Category Landing**          | `/sonpo/personal`, `/sonpo/business`, `/sonpo/personal/product/{cat}`, `/sonpo/business/{section}`                                                                                                       | 16    | 1%      | Hero banner + multi-section content (no sidebar) |
| 3   | **Content Page with Sidebar** | `/sonpo/company/news/**`, `/sonpo/company/press/**`, `/sonpo/personal/product/{cat}/{sub}/**`, `/sonpo/global/**`, `/sonpo/service/**`, `/sonpo/company/**`, `/sonpo/contractor/**`, `/sonpo/contact/**` | 830   | **67%** | 2-column: main content + sidebar navigation      |
| 4   | **Simple Content Page**       | `/sonpo/brand/**`, `/sonpo/faq/**`, `/sonpo/recruit/**`, `/sonpo/aignext/**`, `/sonpo/more-aig/**`, `/sonpo/{top-level-page}`                                                                            | 230   | 18%     | Single-column, no sidebar                        |
| 5   | **Landing/Campaign Page**     | `/sonpo/lp/**`, `/sonpo/military/**`                                                                                                                                                                     | 57    | 5%      | Custom marketing layout (forms, promos)          |
| 6   | **Archive/Reference**         | `/sonpo/eyakkan/**`, `/sonpo/archives/**`, `/sonpo/mmlp/**`, `/sonpo/term/**`                                                                                                                            | 112   | 9%      | Document-style (policy terms, legacy content)    |

### Key takeaway

**Template 3** (Content Page with Sidebar) alone covers **67%** of the site. Together with **Template 4** (Simple Content Page), that's **85%** of all pages using just two layout structures.

---

## Reusable Blocks Catalog

### Template mapping

| Code | Template                  | Page count       |
| ---- | ------------------------- | ---------------- |
| T1   | Homepage                  | 1 page           |
| T2   | Category Landing          | ~16 pages        |
| T3   | Content Page with Sidebar | ~830 pages (67%) |
| T4   | Simple Content Page       | ~230 pages (18%) |
| T5   | Landing/Campaign          | ~57 pages (5%)   |
| T6   | Archive/Reference         | ~112 pages (9%)  |

### Block usage by template

| No                             | Category            | Block                            | T1  | T2  | T3  | T4  | T5  | T6  | Description                                                                                            |
| ------------------------------ | ------------------- | -------------------------------- | :-: | :-: | :-: | :-: | :-: | :-: | ------------------------------------------------------------------------------------------------------ |
| **Global Blocks (every page)** |
| 1                              | Global Blocks       | **Header**                       |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  | Global nav with mega dropdown, mobile nav, search, utility links. Condensed sticky nav when scrolling. |
| 2                              |                     | **Breadcrumb**                   |  —  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  | Path-based breadcrumb navigation (all pages except homepage)                                           |
| 3                              |                     | **Footer**                       |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  | Back-to-top, category nav, SNS links, legal links, AIG group links, copyright                          |
| **Content Blocks**             |
| 4                              | Content Blocks      | **Hero Banner**                  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  | Homepage, Personal, Business (full-width image + text overlay)                                         |
| 5                              |                     | **Cards**                        |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  —  | Homepage, Personal, Business (image + heading, various grid layouts: 2-up, 3-up, 4-up)                 |
| 6                              |                     | **Columns**                      |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  —  | Homepage, multiple pages (2-col and 3-col layouts)                                                     |
| 7                              |                     | **Tabs**                         |  ✓  |  —  |  ✓  |  —  |  —  |  —  | Homepage (tabbed content switcher — Personal/Business)                                                 |
| 8                              |                     | **Accordion**                    |  —  | ✓\* |  ✓  |  ✓  |  ✓  |  —  | Contractor, Contact (expandable DT/DD sections for claim categories)                                   |
| 9                              |                     | **Sidebar Navigation**           |  —  |  —  |  ✓  |  —  |  ✓  |  ✓  | Product, News, Press, Company, Contact pages                                                           |
| 10                             |                     | **News List**                    |  ✓  |  —  |  ✓  |  —  |  —  |  ✓  | Homepage (dated article links with category tags)                                                      |
| **CTA / Action Blocks**        |
| 11                             | CTA / Action Blocks | **Button Grid**                  |  ✓  |  ✓  |  ✓  |  ✓  |  —  |  —  | Homepage, Personal, Business, Contractor (icon + label CTA buttons in grid)                            |
| 12                             |                     | **CTA Section**                  |  ✓  |  ✓  |  ✓  |  ✓  |  —  |  —  | Personal, Business, Travel (3 icon CTAs: Nearest AIG, Request Materials, Contact)                      |
| 13                             |                     | **Sticky Contact Bar**           |  ✓  |  ✓  |  —  |  —  |  ✓  |  —  | Homepage (floating bottom bar with action buttons)                                                     |
| 14                             |                     | **Quick Action Buttons**         |  ✓  |  —  |  —  |  —  |  —  |  —  | Homepage (expandable CTA buttons in hero area)                                                         |
| **Editorial / Article Blocks** |
| 15                             | Editorial / Article | **Article Body**                 |  —  |  —  |  ✓  |  ✓  |  —  |  ✓  | News, Press Release (prose + inline images + captions)                                                 |
| 16                             |                     | **Year Archive Nav**             |  —  |  —  |  ✓  |  —  |  —  |  ✓  | News, Press Release (sidebar year-by-year links)                                                       |
| 17                             |                     | **More AIG Editorial**           |  —  |  ✓  |  —  |  —  |  —  |  —  | Personal, Business (2-column layout with featured article + category badge)                            |
| 18                             |                     | **Pick Up / Promo Banners**      |  —  |  ✓  |  ✓  |  —  |  —  |  —  | Personal, Business (promotional image banner links)                                                    |
| **Data / Stats Blocks**        |
| 19                             | Data / Stats        | **Stats Counter**                |  ✓  |  —  |  —  |  —  |  —  |  —  | Homepage (number + label: "1946 年 営業開始", "6,061 名")                                              |
| 20                             |                     | **Company Info Prose**           |  ✓  |  —  |  —  |  ✓  |  —  |  —  | Homepage (text block + CTA link about AIG)                                                             |
| **Specialized Blocks**         |
| 21                             | Specialized         | **Alert/Warning Box**            |  ✓  |  —  |  —  |  —  |  —  |  —  | Homepage (bordered notice list)                                                                        |
| 22                             |                     | **Product Description Card**     |  —  |  —  |  ✓  |  —  |  ✓  |  —  | Travel (H2 + description + CTA per product)                                                            |
| 23                             |                     | **Solution Cards**               |  —  |  ✓  |  —  |  —  |  —  |  —  | Business (image + H3 + description)                                                                    |
| 24                             |                     | **Anchor Link List**             |  —  | ✓\* |  —  |  ✓  |  —  |  —  | Contractor (in-page jump navigation)                                                                   |
| 25                             |                     | **Phone Contact Block**          |  —  | ✓\* |  ✓  |  ✓  |  —  |  —  | Contractor (phone number + hours + notes)                                                              |
| 26                             |                     | **Dispute Resolution**           |  —  | ✓\* |  —  |  —  |  —  |  —  | Contractor (complex expandable legal sections)                                                         |
| 27                             |                     | **Archive Links**                |  —  |  ✓  |  ✓  |  —  |  —  |  ✓  | Personal, Business, Company, Contractor (former company links)                                         |
| 28                             |                     | **Contract Info Grid**           |  —  |  ✓  |  —  |  —  |  —  |  —  | Personal, Business (text CTA buttons for legal pages)                                                  |
| 29                             |                     | **Document/Certificate Section** |  ✓  |  —  |  ✓  |  —  |  —  |  ✓  | Homepage (e-policy, digital certificate grid)                                                          |
| 30                             |                     | **Recruitment Promo**            |  ✓  |  —  |  —  |  —  |  —  |  —  | Homepage (image + text + CTA)                                                                          |
| 31                             |                     | **Claim Guide Links**            |  —  | ✓\* |  ✓  |  ✓  |  —  |  —  | Contact (category-specific link list)                                                                  |
| **Utility Blocks**             |
| 32                             | Utility Blocks      | **Metadata**                     |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  | All pages (hidden page metadata)                                                                       |
| 33                             |                     | **Section Metadata**             |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  | Multiple pages (section styling: blue-background, news-list, bordered, etc.)                           |
| 34                             |                     | **Fragment**                     |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  | Header, Footer (reusable fragment loading)                                                             |
| 35                             |                     | **Modal**                        |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  | Various (modal dialog support via /modals/ links)                                                      |

_✓_ = used in some pages of this template type

_Blocks marked ✓\* on T2 appear specifically on the Contractors sub-type of Category Landing._

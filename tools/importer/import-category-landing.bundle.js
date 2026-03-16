var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-category-landing.js
  var import_category_landing_exports = {};
  __export(import_category_landing_exports, {
    default: () => import_category_landing_default
  });

  // tools/importer/parsers/breadcrumb.js
  function parse(element, { document }) {
    const items = element.querySelectorAll(".cmp-breadcrumb__item");
    if (!items.length) return;
    const cells = [];
    items.forEach((li, i) => {
      const anchor = li.querySelector("a");
      const row = [];
      if (anchor && i < items.length - 1) {
        const link = document.createElement("a");
        link.href = anchor.href || anchor.getAttribute("href");
        link.textContent = anchor.textContent.trim();
        row.push(link);
      } else {
        row.push(li.textContent.trim());
      }
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "breadcrumb", cells });
    element.replaceWith(block);
    const hr = document.createElement("hr");
    block.after(hr);
  }

  // tools/importer/parsers/hero-category.js
  function extractBgUrl(el) {
    if (!el) return null;
    const style = el.getAttribute("style") || "";
    const urlMatch = style.match(/background-image:\s*url\(['"]?(.+?)['"]?\)/);
    if (!urlMatch) return null;
    let rawUrl = urlMatch[1];
    rawUrl = rawUrl.replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    if (rawUrl.startsWith("/")) {
      rawUrl = `https://www.aig.co.jp${rawUrl}`;
    }
    return rawUrl;
  }
  function parse2(element, { document }) {
    const pcUrl = extractBgUrl(element.querySelector(".cmp-heroimage-image.pc-only"));
    const spUrl = extractBgUrl(element.querySelector(".cmp-heroimage-image.sp-only"));
    const imgCell = [];
    if (pcUrl) {
      const pcImg = document.createElement("img");
      pcImg.src = pcUrl;
      pcImg.alt = "";
      imgCell.push(pcImg);
    }
    if (spUrl) {
      const spImg = document.createElement("img");
      spImg.src = spUrl;
      spImg.alt = "";
      imgCell.push(spImg);
    }
    const heading = element.querySelector("h1.cmp-heroimage-content__title, h1, h2");
    const description = element.querySelector("p.cmp-heroimage-content__description, p");
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    const cells = [];
    if (imgCell.length > 0) {
      cells.push([imgCell]);
    }
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/anchor-nav.js
  function parse3(element, { document }) {
    const links = element.querySelectorAll("a");
    if (!links.length) return;
    const ul = document.createElement("ul");
    links.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.getAttribute("href") || link.href;
      a.textContent = link.textContent.trim();
      li.append(a);
      ul.append(li);
    });
    const wrapper = document.createElement("div");
    wrapper.append(ul);
    const cells = [[wrapper]];
    const block = WebImporter.Blocks.createBlock(document, { name: "anchor-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-product-detail.js
  function parse4(element, { document }) {
    const columnItems = element.querySelectorAll(":scope > .cmp-columncontainer-item");
    const col1 = document.createElement("div");
    const heading = columnItems[0]?.querySelector("h2.cmp-title__text, h2, h3");
    if (heading) col1.append(heading);
    const col2 = document.createElement("div");
    if (columnItems[1]) {
      const buttons = columnItems[1].querySelectorAll("a.cmp-button");
      buttons.forEach((btn) => {
        const titleEl = btn.querySelector(".cmp-button-main__text");
        const captionEl = btn.querySelector(".cmp-button-caption");
        const titleLink = document.createElement("a");
        titleLink.href = btn.href || btn.getAttribute("href");
        titleLink.textContent = titleEl ? titleEl.textContent.trim() : btn.textContent.trim();
        const titleP = document.createElement("p");
        titleP.append(titleLink);
        col2.append(titleP);
        if (captionEl) {
          const descP = document.createElement("p");
          descP.textContent = captionEl.textContent.trim();
          col2.append(descP);
        }
      });
      const footnoteLists = columnItems[1].querySelectorAll(":scope > ul, :scope > .aem-Grid > .ace-list ul");
      footnoteLists.forEach((ul) => {
        const newUl = document.createElement("ul");
        ul.querySelectorAll("li").forEach((li) => {
          const newLi = document.createElement("li");
          newLi.textContent = li.textContent.trim();
          newUl.append(newLi);
        });
        col2.append(newUl);
      });
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-product-detail", cells });
    const parentSection = element.closest(".ace-section");
    const isBlue = parentSection?.classList.contains("cmp-section--blue");
    const sectionStyle = isBlue ? "blue-background" : "light-gray";
    const sectionMeta = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: { style: sectionStyle }
    });
    const fragment = document.createDocumentFragment();
    fragment.append(document.createElement("hr"));
    fragment.append(block);
    fragment.append(sectionMeta);
    element.replaceWith(fragment);
    if (parentSection) {
      parentSection.setAttribute("data-section-handled", "true");
    }
  }

  // tools/importer/parsers/columns-product-nav.js
  function parse5(element, { document }) {
    const columnItems = element.querySelectorAll(":scope > .cmp-columncontainer-item");
    const col1 = document.createElement("div");
    const heading = columnItems[0]?.querySelector("h2.cmp-title__text, h2, h3");
    if (heading) col1.append(heading);
    const col2 = document.createElement("div");
    if (columnItems[1]) {
      const buttons = columnItems[1].querySelectorAll("a.cmp-button");
      buttons.forEach((btn) => {
        const text = btn.querySelector(".cmp-button-main__text");
        const link = document.createElement("a");
        link.href = btn.href || btn.getAttribute("href");
        link.textContent = text ? text.textContent.trim() : btn.textContent.trim();
        const p = document.createElement("p");
        p.append(link);
        col2.append(p);
      });
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-product-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-showcase.js
  function parse6(element, { document }) {
    const columnItems = element.querySelectorAll(":scope > .cmp-columncontainer-item");
    const cols = [];
    columnItems.forEach((colItem) => {
      const col = document.createElement("div");
      const title = colItem.querySelector("h3.cmp-title__text, h3");
      if (title) col.append(title);
      const thumbImg = colItem.querySelector(".ace-image:not(.ace-teaser .ace-image) img.cmp-image__image, .ace-image > .cmp-image img");
      if (thumbImg) col.append(thumbImg);
      const desc = colItem.querySelector(".ace-text .cmp-text p, .cmp-text p");
      if (desc) col.append(desc);
      const teaser = colItem.querySelector(".ace-teaser .cmp-teaser");
      if (teaser) {
        const teaserLink = teaser.querySelector("a.cmp-teaser__link");
        const teaserImg = teaser.querySelector(".cmp-teaser__image img");
        const teaserTitle = teaser.querySelector(".cmp-teaser__title");
        const teaserTag = teaser.querySelector(".cmp-teaser__tag span");
        if (teaserLink) {
          const link = document.createElement("a");
          link.href = teaserLink.href || teaserLink.getAttribute("href");
          if (teaserImg) {
            const img = document.createElement("img");
            img.src = teaserImg.src || teaserImg.getAttribute("src");
            img.alt = teaserImg.alt || "";
            link.append(img);
          }
          if (teaserTitle) {
            const h4 = document.createElement("h4");
            h4.textContent = teaserTitle.textContent.trim();
            link.append(h4);
          }
          if (teaserTag) {
            const em = document.createElement("em");
            em.textContent = teaserTag.textContent.trim();
            link.append(em);
          }
          col.append(link);
        }
      }
      cols.push(col);
    });
    const cells = [cols];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-showcase", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-teaser.js
  function parse7(element, { document }) {
    const teasers = element.querySelectorAll(".ace-teaser .cmp-teaser");
    if (!teasers.length) return;
    const cells = [];
    teasers.forEach((teaser) => {
      const link = teaser.querySelector("a.cmp-teaser__link");
      const img = teaser.querySelector(".cmp-teaser__image img");
      const title = teaser.querySelector(".cmp-teaser__title");
      const desc = teaser.querySelector(".cmp-teaser__description");
      const imgCell = document.createElement("div");
      if (img) {
        const picture = document.createElement("img");
        picture.src = img.src || img.getAttribute("src") || "";
        picture.alt = img.alt || "";
        imgCell.append(picture);
      }
      const contentCell = document.createElement("div");
      if (title) {
        const h3 = document.createElement("h3");
        if (link) {
          const a = document.createElement("a");
          a.href = link.href || link.getAttribute("href");
          a.textContent = title.textContent.trim();
          h3.append(a);
        } else {
          h3.textContent = title.textContent.trim();
        }
        contentCell.append(h3);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.append(p);
      }
      cells.push([imgCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-link-grid.js
  function parse8(element, { document }) {
    const buttons = element.querySelectorAll("a.cmp-button");
    const cells = [];
    buttons.forEach((btn) => {
      const text = btn.querySelector(".cmp-button-main__text");
      const linkText = text ? text.textContent.trim() : btn.textContent.trim();
      const iconImg = btn.querySelector(".cmp-button-main__icon-image img");
      let iconPrefix = "";
      if (iconImg) {
        const src = iconImg.getAttribute("src") || "";
        const filename = src.split("/").pop().replace(/\.[^.]+$/, "");
        const iconName = filename.replace(/^icon_/, "");
        if (iconName) iconPrefix = `:${iconName}: `;
      }
      const link = document.createElement("a");
      link.href = btn.href || btn.getAttribute("href");
      link.textContent = `${iconPrefix}${linkText}`;
      const p = document.createElement("p");
      p.append(link);
      cells.push(["", p]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-link-grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse9(element, { document }) {
    const columnItems = element.querySelectorAll(":scope > .cmp-columncontainer-item");
    const cols = [];
    columnItems.forEach((colItem) => {
      const col = document.createElement("div");
      const btn = colItem.querySelector("a.cmp-button");
      if (btn) {
        const text = btn.querySelector(".cmp-button-main__text");
        const linkText = text ? text.textContent.trim() : btn.textContent.trim();
        const iconSpan = btn.querySelector(".cmp-button-main__icon");
        let iconPrefix = "";
        if (iconSpan) {
          const iconClass = [...iconSpan.classList].find((c) => c.startsWith("icon-"));
          if (iconClass) {
            const iconName = iconClass.replace(/^icon-/, "");
            iconPrefix = `:${iconName}: `;
          }
        }
        const link = document.createElement("a");
        link.href = btn.href || btn.getAttribute("href");
        link.textContent = `${iconPrefix}${linkText}`;
        const p = document.createElement("p");
        p.append(link);
        col.append(p);
      }
      cols.push(col);
    });
    const cells = [cols];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-info-panel.js
  function parse10(element, { document }) {
    const columnItems = element.querySelectorAll(":scope > .cmp-columncontainer-item");
    const cols = [];
    columnItems.forEach((colItem) => {
      const col = document.createElement("div");
      const whiteSection = colItem.querySelector(".cmp-section--white");
      if (!whiteSection) {
        cols.push(col);
        return;
      }
      const heading = whiteSection.querySelector(".cmp-section-header__title, h1, h2, h3");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        col.append(h3);
      }
      const contentArea = whiteSection.querySelector(".cmp-section-content");
      if (contentArea) {
        const items = contentArea.querySelectorAll(":scope > div");
        items.forEach((item) => {
          const btn = item.querySelector("a.cmp-button");
          if (btn) {
            const isBlue = item.classList.contains("cmp-button-blue") || !!item.querySelector(".cmp-button-blue");
            const text = btn.querySelector(".cmp-button-main__text");
            const caption = btn.querySelector(".cmp-button-caption");
            const iconSpan = btn.querySelector(".cmp-button-main__icon");
            let iconPrefix = "";
            if (iconSpan) {
              const iconClass = [...iconSpan.classList].find((c) => c.startsWith("icon-"));
              if (iconClass) {
                const iconName = iconClass.replace(/^icon-/, "");
                iconPrefix = `:${iconName}: `;
              }
            }
            const link = document.createElement("a");
            link.href = btn.href || btn.getAttribute("href");
            link.textContent = `${iconPrefix}${text ? text.textContent.trim() : btn.textContent.trim()}`;
            const p = document.createElement("p");
            if (isBlue) {
              p.append(link);
            } else {
              const em = document.createElement("em");
              em.append(link);
              p.append(em);
            }
            col.append(p);
            if (caption) {
              const captionP = document.createElement("p");
              captionP.textContent = caption.textContent.trim();
              col.append(captionP);
            }
            return;
          }
          const textDiv = item.querySelector(".cmp-text");
          if (textDiv) {
            const links = textDiv.querySelectorAll("a");
            const paragraphs = textDiv.querySelectorAll("p");
            if (links.length === 1 && paragraphs.length <= 1 && !textDiv.querySelector("ul")) {
              const ul = document.createElement("ul");
              const li = document.createElement("li");
              const a = document.createElement("a");
              a.href = links[0].href || links[0].getAttribute("href");
              a.textContent = links[0].textContent.trim();
              li.append(a);
              ul.append(li);
              col.append(ul);
              return;
            }
            const children = textDiv.querySelectorAll("p, ul");
            children.forEach((child) => {
              col.append(child.cloneNode(true));
            });
            return;
          }
          const list = item.querySelector(".cmp-list");
          if (list) {
            const listLinks = list.querySelectorAll("a");
            if (listLinks.length > 0) {
              const ul = document.createElement("ul");
              listLinks.forEach((a) => {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.href = a.href || a.getAttribute("href");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-info-panel", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/aig-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".cmp-float-cta"]);
      WebImporter.DOMUtils.remove(element, [".navihidden"]);
      element.querySelectorAll(".cmp-image[data-cmp-src]").forEach((container) => {
        const dataCmpSrc = container.getAttribute("data-cmp-src");
        if (dataCmpSrc) {
          const realSrc = dataCmpSrc.replace("{.width}", ".1280");
          const img = container.querySelector("img.cmp-image__image");
          if (img) {
            const src = img.getAttribute("src") || "";
            if (src.includes("blank.gif") || src.includes("spacer.gif")) {
              img.setAttribute("src", realSrc);
            }
          }
        }
      });
      element.querySelectorAll("img.cmp-image__spimage").forEach((img) => {
        img.remove();
      });
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("bat.bing.com") || src.includes("analytics") || src.includes("pixel") || src.includes("tracking")) {
          img.remove();
        }
      });
      element.querySelectorAll(".ace-section .cmp-section-header__title").forEach((heading) => {
        const section = heading.closest(".ace-section");
        if (section) {
          section.setAttribute("data-section-name", heading.textContent.trim());
        }
      });
      element.querySelectorAll(".cmp-section-header__title").forEach((heading) => {
        if (heading.closest(".cmp-section--white") || heading.closest(".cmp-section--secondary")) return;
        if (heading.closest(".cmp-heroimage")) return;
        if (heading.tagName !== "H2") {
          const doc = element.ownerDocument || element.getRootNode();
          const h2 = doc.createElement("h2");
          h2.className = heading.className;
          h2.textContent = heading.textContent;
          heading.replaceWith(h2);
        }
      });
    }
    if (hookName === H.after) {
      const footerApproveNo = element.querySelector(".cmp-experiencefragment--site-footer .cmp-footer-approve-no");
      if (footerApproveNo) {
        const trackingText = footerApproveNo.textContent.trim();
        if (trackingText) {
          const doc = element.ownerDocument || element.getRootNode();
          const hr = doc.createElement("hr");
          const p = doc.createElement("p");
          p.textContent = trackingText;
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: "approve-no" }
          });
          element.appendChild(hr);
          element.appendChild(p);
          element.appendChild(metaBlock);
        }
      }
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--site-header"]);
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--site-footer"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("blank.gif") || src.includes("spacer.gif") || src.includes("bat.bing.com") || src.includes("analytics") || src.includes("pixel") || src.includes("tracking")) {
          img.remove();
        }
      });
    }
  }

  // tools/importer/transformers/aig-sections.js
  var TransformHook = { afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook.afterTransform) return;
    const { template } = payload || {};
    if (!template || !template.sections || template.sections.length < 2) return;
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
    const sections = [...template.sections].reverse();
    for (const section of sections) {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        try {
          sectionEl = element.querySelector(sel);
        } catch (e) {
        }
        if (sectionEl) break;
      }
      if (!sectionEl) continue;
      if (sectionEl.getAttribute("data-section-handled")) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.after(metaBlock);
      }
      if (section.id !== template.sections[0].id) {
        const hr = document.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-category-landing.js
  var parsers = {
    "breadcrumb": parse,
    "hero-category": parse2,
    "anchor-nav": parse3,
    "columns-product-detail": parse4,
    "columns-product-nav": parse5,
    "columns-showcase": parse6,
    "cards-teaser": parse7,
    "cards-link-grid": parse8,
    "columns-cta": parse9,
    "columns-info-panel": parse10
  };
  var PAGE_TEMPLATE = {
    name: "category-landing",
    description: "Category landing page for insurance product categories (personal, business). Features product listings, promotional banners, and category navigation.",
    urls: [
      "https://www.aig.co.jp/sonpo/personal",
      "https://www.aig.co.jp/sonpo/business",
      "https://www.aig.co.jp/sonpo/personal/product",
      "https://www.aig.co.jp/sonpo/business/product",
      "https://www.aig.co.jp/sonpo/business/industry",
      "https://www.aig.co.jp/sonpo/business/risk",
      "https://www.aig.co.jp/sonpo/business/nzk",
      "https://www.aig.co.jp/sonpo/business/hjk"
    ],
    blocks: [
      {
        name: "breadcrumb",
        instances: [".ace-breadcrumb"]
      },
      {
        name: "hero-category",
        instances: [".ace-heroimage.cmp-heroimage--width-full"]
      },
      {
        name: "anchor-nav",
        instances: [".ace-list.cmp-list--anchor"]
      },
      {
        name: "columns-product-detail",
        instances: [".cmp-section--primary .cmp-columncontainer--2col-1_3:has(.cmp-button-caption)"]
      },
      {
        name: "columns-product-nav",
        instances: [".cmp-section--light-gray:not(.cmp-section--background-full) .cmp-columncontainer--2col-1_3:not(:has(.cmp-button-caption))"]
      },
      {
        name: "columns-showcase",
        instances: [".ace-section.cmp-section--light-gray:not(.cmp-section--primary) .cmp-columncontainer"]
      },
      {
        name: "cards-teaser",
        instances: [".cmp-section--primary:not(.cmp-section--light-gray) .cmp-columncontainer:has(.ace-teaser)"]
      },
      {
        name: "cards-link-grid",
        instances: [
          '[class*="cmp-experiencefragment--utility"] .cmp-columncontainer--3',
          '[class*="cmp-experiencefragment--utility"] .cmp-columncontainer--2col-1_1',
          '[data-section-name="\u56FD\u5185\u5411\u3051\u30BD\u30EA\u30E5\u30FC\u30B7\u30E7\u30F3"] .button',
          '[data-section-name="\u6CD5\u4EBA\u4F1A\u30FB\u7D0D\u7A0E\u5354\u4F1A\u5236\u5EA6\u5546\u54C1"] .cmp-columncontainer'
        ]
      },
      {
        name: "columns-cta",
        instances: ['[class*="cmp-experiencefragment--cta-"] .cmp-columncontainer--3']
      },
      {
        name: "columns-info-panel",
        instances: [".cmp-section--background-full .cmp-columncontainer:has(.cmp-section--white)"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero",
        selector: ".ace-heroimage.cmp-heroimage--width-full",
        style: null,
        blocks: ["hero-category"],
        defaultContent: []
      },
      {
        id: "section-2-product-listing",
        name: "Product Listing",
        selector: ".ace-section.cmp-section--primary.cmp-section--light-gray:not(.cmp-section--background-full)",
        style: "light-gray",
        blocks: ["columns-product-nav"],
        defaultContent: []
      },
      {
        id: "section-3-pickup",
        name: "Pick Up",
        selector: ".ace-section.cmp-section--primary:not(.cmp-section--light-gray):has(.cmp-image__link)",
        style: null,
        blocks: [],
        defaultContent: [".cmp-section-header__title", ".cmp-image__link"]
      },
      {
        id: "section-4-more-aig",
        name: "More AIG",
        selector: ".ace-section.cmp-section--primary:not(.cmp-section--light-gray):has(.ace-teaser)",
        style: null,
        blocks: ["columns-showcase"],
        defaultContent: [".cmp-section-header__title"]
      },
      {
        id: "section-4a-global-solutions",
        name: "Global Solutions",
        selector: '[data-section-name="\u6D77\u5916\u5411\u3051\u30BD\u30EA\u30E5\u30FC\u30B7\u30E7\u30F3"]',
        style: null,
        blocks: ["cards-teaser"],
        defaultContent: [".cmp-section-header__title", ".ace-image"]
      },
      {
        id: "section-4b-domestic-solutions",
        name: "Domestic Solutions",
        selector: '[data-section-name="\u56FD\u5185\u5411\u3051\u30BD\u30EA\u30E5\u30FC\u30B7\u30E7\u30F3"]',
        style: null,
        blocks: ["cards-link-grid"],
        defaultContent: [".cmp-section-header__title"]
      },
      {
        id: "section-4c-association-products",
        name: "Association Products",
        selector: '[data-section-name="\u6CD5\u4EBA\u4F1A\u30FB\u7D0D\u7A0E\u5354\u4F1A\u5236\u5EA6\u5546\u54C1"]',
        style: null,
        blocks: ["cards-link-grid"],
        defaultContent: [".cmp-section-header__title"]
      },
      {
        id: "section-5-contract-info",
        name: "Contract Information",
        selector: [
          '[class*="cmp-experiencefragment--utility"] .ace-section.cmp-section--primary',
          '[class*="cmp-experiencefragment--guard"] + [class*="cmp-experiencefragment--utility"] .ace-section'
        ],
        style: null,
        blocks: ["cards-link-grid"],
        defaultContent: [".cmp-section-header__title"]
      },
      {
        id: "section-6-cta",
        name: "Request Materials CTA",
        selector: [
          '[class*="cmp-experiencefragment--cta-"] .ace-section.cmp-section--primary.cmp-section--light-gray',
          '[class*="cmp-experiencefragment--cta-"] .ace-section.cmp-section--primary'
        ],
        style: "light-gray",
        blocks: ["columns-cta"],
        defaultContent: []
      },
      {
        id: "section-7-contractors",
        name: "For Policyholders",
        selector: ".ace-section.cmp-section--primary.cmp-section--light-gray.cmp-section--background-full",
        style: "light-gray",
        blocks: ["columns-info-panel"],
        defaultContent: [".cmp-section-header__title", '[class*="cmp-experiencefragment--link-to-archives"]']
      },
      {
        id: "section-8-content",
        name: "Main Content",
        selector: ".ace-section:not(.cmp-section--primary):not(.cmp-section--light-gray):not(.cmp-section--background-full)",
        style: null,
        blocks: [],
        defaultContent: [".cmp-section-header__title", ".cmp-columncontainer", ".cmp-text", ".cmp-image"]
      }
      // section-9-localnav and section-10-archives REMOVED:
      // Archive links (旧AIU) are defaultContent of section-7-contractors (For Policyholders)
      // and must NOT be in a separate section. Local nav is handled by EDS navigation.
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          if (elements.length === 0) {
            console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
          }
          elements.forEach((element) => {
            pageBlocks.push({
              name: blockDef.name,
              selector,
              element,
              section: blockDef.section || null
            });
          });
        } catch (e) {
          console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`, e);
        }
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_category_landing_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_category_landing_exports);
})();

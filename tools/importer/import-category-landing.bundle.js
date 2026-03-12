var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
  function parse(element, { document }) {
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

  // tools/importer/parsers/columns-product-nav.js
  function parse2(element, { document }) {
    var _a;
    const columnItems = element.querySelectorAll(":scope > .cmp-columncontainer-item");
    const col1 = document.createElement("div");
    const heading = (_a = columnItems[0]) == null ? void 0 : _a.querySelector("h2.cmp-title__text, h2, h3");
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
  function parse3(element, { document }) {
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

  // tools/importer/parsers/cards-link-grid.js
  function parse4(element, { document }) {
    const buttons = element.querySelectorAll("a.cmp-button");
    const cells = [];
    buttons.forEach((btn) => {
      const text = btn.querySelector(".cmp-button-main__text");
      const link = document.createElement("a");
      link.href = btn.href || btn.getAttribute("href");
      link.textContent = text ? text.textContent.trim() : btn.textContent.trim();
      const p = document.createElement("p");
      p.append(link);
      cells.push(["", p]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-link-grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse5(element, { document }) {
    const columnItems = element.querySelectorAll(":scope > .cmp-columncontainer-item");
    const cols = [];
    columnItems.forEach((colItem) => {
      const col = document.createElement("div");
      const btn = colItem.querySelector("a.cmp-button");
      if (btn) {
        const text = btn.querySelector(".cmp-button-main__text");
        const link = document.createElement("a");
        link.href = btn.href || btn.getAttribute("href");
        link.textContent = text ? text.textContent.trim() : btn.textContent.trim();
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
  function parse6(element, { document }) {
    const columnItems = element.querySelectorAll(":scope > .cmp-columncontainer-item");
    const cols = [];
    columnItems.forEach((colItem) => {
      const col = document.createElement("div");
      const whiteSection = colItem.querySelector(".cmp-section--white");
      if (!whiteSection) {
        cols.push(col);
        return;
      }
      const heading = whiteSection.querySelector("h3.cmp-section-header__title, h3");
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
            const text = btn.querySelector(".cmp-button-main__text");
            const caption = btn.querySelector(".cmp-button-caption");
            const link = document.createElement("a");
            link.href = btn.href || btn.getAttribute("href");
            link.textContent = text ? text.textContent.trim() : btn.textContent.trim();
            const p = document.createElement("p");
            p.append(link);
            col.append(p);
            if (caption) {
              const small = document.createElement("p");
              small.textContent = caption.textContent.trim();
              col.append(small);
            }
            return;
          }
          const textDiv = item.querySelector(".cmp-text");
          if (textDiv) {
            const children = textDiv.querySelectorAll("p, ul");
            children.forEach((child) => {
              col.append(child.cloneNode(true));
            });
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
          const realSrc = dataCmpSrc.replace("{.width}", "1280");
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
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--site-header"]);
      WebImporter.DOMUtils.remove(element, [".cmp-experiencefragment--site-footer"]);
      WebImporter.DOMUtils.remove(element, [".ace-breadcrumb"]);
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
    "hero-category": parse,
    "columns-product-nav": parse2,
    "columns-showcase": parse3,
    "cards-link-grid": parse4,
    "columns-cta": parse5,
    "columns-info-panel": parse6
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
        name: "hero-category",
        instances: [".ace-heroimage.cmp-heroimage--width-full"]
      },
      {
        name: "columns-product-nav",
        instances: [".cmp-section--light-gray:not(.cmp-section--background-full) .cmp-columncontainer--2col-1_3"]
      },
      {
        name: "columns-showcase",
        instances: [".ace-section.cmp-section--light-gray:not(.cmp-section--primary) .cmp-columncontainer"]
      },
      {
        name: "cards-link-grid",
        instances: [
          '[class*="cmp-experiencefragment--utility"] .cmp-columncontainer--3',
          '[class*="cmp-experiencefragment--utility"] .cmp-columncontainer--2col-1_1'
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
      },
      {
        id: "section-9-localnav",
        name: "Local Navigation",
        selector: '[class*="cmp-experiencefragment--localnav"] .ace-section',
        style: null,
        blocks: [],
        defaultContent: []
      },
      {
        id: "section-10-archives",
        name: "Archive Links",
        selector: '[class*="cmp-experiencefragment--link-to-archives"] .ace-section',
        style: null,
        blocks: [],
        defaultContent: [".cmp-section-header__title", "a"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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

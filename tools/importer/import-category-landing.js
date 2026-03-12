/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCategoryParser from './parsers/hero-category.js';
import columnsProductNavParser from './parsers/columns-product-nav.js';
import columnsShowcaseParser from './parsers/columns-showcase.js';
import cardsLinkGridParser from './parsers/cards-link-grid.js';
import columnsCtaParser from './parsers/columns-cta.js';
import columnsInfoPanelParser from './parsers/columns-info-panel.js';

// TRANSFORMER IMPORTS
import aigCleanupTransformer from './transformers/aig-cleanup.js';
import aigSectionsTransformer from './transformers/aig-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-category': heroCategoryParser,
  'columns-product-nav': columnsProductNavParser,
  'columns-showcase': columnsShowcaseParser,
  'cards-link-grid': cardsLinkGridParser,
  'columns-cta': columnsCtaParser,
  'columns-info-panel': columnsInfoPanelParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'category-landing',
  description: 'Category landing page for insurance product categories (personal, business). Features product listings, promotional banners, and category navigation.',
  urls: [
    'https://www.aig.co.jp/sonpo/personal',
    'https://www.aig.co.jp/sonpo/business',
    'https://www.aig.co.jp/sonpo/personal/product',
    'https://www.aig.co.jp/sonpo/business/product',
    'https://www.aig.co.jp/sonpo/business/industry',
    'https://www.aig.co.jp/sonpo/business/risk',
    'https://www.aig.co.jp/sonpo/business/nzk',
    'https://www.aig.co.jp/sonpo/business/hjk'
  ],
  blocks: [
    {
      name: 'hero-category',
      instances: ['.ace-heroimage.cmp-heroimage--width-full']
    },
    {
      name: 'columns-product-nav',
      instances: ['.cmp-section--light-gray:not(.cmp-section--background-full) .cmp-columncontainer--2col-1_3']
    },
    {
      name: 'columns-showcase',
      instances: ['.ace-section.cmp-section--light-gray:not(.cmp-section--primary) .cmp-columncontainer']
    },
    {
      name: 'cards-link-grid',
      instances: [
        '[class*="cmp-experiencefragment--utility"] .cmp-columncontainer--3',
        '[class*="cmp-experiencefragment--utility"] .cmp-columncontainer--2col-1_1'
      ]
    },
    {
      name: 'columns-cta',
      instances: ['[class*="cmp-experiencefragment--cta-"] .cmp-columncontainer--3']
    },
    {
      name: 'columns-info-panel',
      instances: ['.cmp-section--background-full .cmp-columncontainer:has(.cmp-section--white)']
    }
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero',
      selector: '.ace-heroimage.cmp-heroimage--width-full',
      style: null,
      blocks: ['hero-category'],
      defaultContent: []
    },
    {
      id: 'section-2-product-listing',
      name: 'Product Listing',
      selector: '.ace-section.cmp-section--primary.cmp-section--light-gray:not(.cmp-section--background-full)',
      style: 'light-gray',
      blocks: ['columns-product-nav'],
      defaultContent: []
    },
    {
      id: 'section-3-pickup',
      name: 'Pick Up',
      selector: '.ace-section.cmp-section--primary:not(.cmp-section--light-gray):has(.cmp-image__link)',
      style: null,
      blocks: [],
      defaultContent: ['.cmp-section-header__title', '.cmp-image__link']
    },
    {
      id: 'section-4-more-aig',
      name: 'More AIG',
      selector: '.ace-section.cmp-section--primary:not(.cmp-section--light-gray):has(.ace-teaser)',
      style: null,
      blocks: ['columns-showcase'],
      defaultContent: ['.cmp-section-header__title']
    },
    {
      id: 'section-5-contract-info',
      name: 'Contract Information',
      selector: [
        '[class*="cmp-experiencefragment--utility"] .ace-section.cmp-section--primary',
        '[class*="cmp-experiencefragment--guard"] + [class*="cmp-experiencefragment--utility"] .ace-section'
      ],
      style: null,
      blocks: ['cards-link-grid'],
      defaultContent: ['.cmp-section-header__title']
    },
    {
      id: 'section-6-cta',
      name: 'Request Materials CTA',
      selector: [
        '[class*="cmp-experiencefragment--cta-"] .ace-section.cmp-section--primary.cmp-section--light-gray',
        '[class*="cmp-experiencefragment--cta-"] .ace-section.cmp-section--primary'
      ],
      style: 'light-gray',
      blocks: ['columns-cta'],
      defaultContent: []
    },
    {
      id: 'section-7-contractors',
      name: 'For Policyholders',
      selector: '.ace-section.cmp-section--primary.cmp-section--light-gray.cmp-section--background-full',
      style: 'light-gray',
      blocks: ['columns-info-panel'],
      defaultContent: ['.cmp-section-header__title', '[class*="cmp-experiencefragment--link-to-archives"]']
    },
    {
      id: 'section-8-content',
      name: 'Main Content',
      selector: '.ace-section:not(.cmp-section--primary):not(.cmp-section--light-gray):not(.cmp-section--background-full)',
      style: null,
      blocks: [],
      defaultContent: ['.cmp-section-header__title', '.cmp-columncontainer', '.cmp-text', '.cmp-image']
    },
    {
      id: 'section-9-localnav',
      name: 'Local Navigation',
      selector: '[class*="cmp-experiencefragment--localnav"] .ace-section',
      style: null,
      blocks: [],
      defaultContent: []
    },
    {
      id: 'section-10-archives',
      name: 'Archive Links',
      selector: '[class*="cmp-experiencefragment--link-to-archives"] .ace-section',
      style: null,
      blocks: [],
      defaultContent: ['.cmp-section-header__title', 'a']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  aigCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [aigSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
            section: blockDef.section || null,
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

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    // Skip transformBackgroundImages — hero parser handles background images manually
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

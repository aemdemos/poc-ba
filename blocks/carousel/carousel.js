import { moveInstrumentation } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';

const AUTOPLAY_INTERVAL = 5000;

function updateArrowVisibility(block) {
  const slideIndex = parseInt(block.dataset.activeSlide, 10);
  const slides = block.querySelectorAll('.carousel-slide');
  const prevBtn = block.querySelector('.slide-prev');
  const nextBtn = block.querySelector('.slide-next');
  if (!prevBtn || !nextBtn) return;

  // First slide: hide prev
  prevBtn.classList.toggle('hidden', slideIndex === 0);
  // Last slide: hide next
  nextBtn.classList.toggle('hidden', slideIndex === slides.length - 1);
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');
  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });

  updateArrowVisibility(block);
}

export function showSlide(block, slideIndex = 0, behavior = 'smooth') {
  const slides = block.querySelectorAll('.carousel-slide');
  // Clamp to valid range (no wrapping for conditional arrows)
  let realSlideIndex = slideIndex;
  if (realSlideIndex < 0) realSlideIndex = 0;
  if (realSlideIndex >= slides.length) realSlideIndex = slides.length - 1;

  // Update arrow visibility BEFORE scrolling so layout settles first
  const prevBtn = block.querySelector('.slide-prev');
  const nextBtn = block.querySelector('.slide-next');
  if (prevBtn) prevBtn.classList.toggle('hidden', realSlideIndex === 0);
  if (nextBtn) nextBtn.classList.toggle('hidden', realSlideIndex === slides.length - 1);

  const activeSlide = slides[realSlideIndex];
  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior,
  });
}

function restartLoadingAnimation(block) {
  const activeBtn = block.querySelector('.carousel-slide-indicator button:disabled');
  if (activeBtn) {
    activeBtn.removeAttribute('disabled');
    // eslint-disable-next-line no-unused-expressions
    activeBtn.offsetHeight;
    activeBtn.setAttribute('disabled', 'true');
  }
}

function startAutoplay(block) {
  if (block.autoplayTimer) return;
  if (!block.autoplayDirection) block.autoplayDirection = 1;
  block.classList.remove('carousel-paused');
  restartLoadingAnimation(block);
  block.autoplayTimer = setInterval(() => {
    const current = parseInt(block.dataset.activeSlide, 10);
    const slides = block.querySelectorAll('.carousel-slide');
    // Bounce: reverse direction at first/last slide
    if (current >= slides.length - 1) block.autoplayDirection = -1;
    if (current <= 0) block.autoplayDirection = 1;
    showSlide(block, current + block.autoplayDirection);
  }, AUTOPLAY_INTERVAL);
}

function stopAutoplay(block) {
  if (block.autoplayTimer) {
    clearInterval(block.autoplayTimer);
    block.autoplayTimer = null;
  }
}

function resetAutoplay(block) {
  if (block.autoplayTimer) {
    stopAutoplay(block);
    startAutoplay(block);
  }
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
      resetAutoplay(block);
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
    resetAutoplay(block);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    resetAutoplay(block);
  });

  // Play/Pause button
  const playPauseBtn = block.querySelector('.carousel-playpause');
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      const isPlaying = !playPauseBtn.classList.contains('paused');
      if (isPlaying) {
        stopAutoplay(block);
        playPauseBtn.classList.add('paused');
        playPauseBtn.setAttribute('aria-label', 'Play');
        block.classList.add('carousel-paused');
      } else {
        playPauseBtn.classList.remove('paused');
        playPauseBtn.setAttribute('aria-label', 'Pause');
        block.classList.remove('carousel-paused');
        startAutoplay(block);
      }
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  // Extract inline links from content paragraph and create a CTA container
  const content = slide.querySelector('.carousel-slide-content');
  if (content) {
    const links = content.querySelectorAll('p a');
    if (links.length > 0) {
      const ctaContainer = document.createElement('div');
      ctaContainer.classList.add('carousel-cta-container');
      links.forEach((link) => {
        link.classList.remove('button');
        ctaContainer.append(link);
      });
      content.append(ctaContainer);
    }

    // Extract price (e.g. "39 €/mes") into a dedicated price block
    const p = content.querySelector('p');
    if (p) {
      const priceMatch = p.innerHTML.match(/<strong>(\d+)\s*€\/mes<\/strong>/);
      if (priceMatch) {
        const idx = p.innerHTML.indexOf(priceMatch[0]);
        const afterPrice = p.innerHTML.substring(idx + priceMatch[0].length).trim();
        p.innerHTML = p.innerHTML.substring(0, idx).trim();

        const priceBlock = document.createElement('div');
        priceBlock.classList.add('carousel-price-block');
        priceBlock.innerHTML = `<span class="carousel-price-amount">${priceMatch[1]}</span>`
          + '<span class="carousel-price-unit">€/mes</span>';

        const noteMatch = afterPrice.match(/^<em>(.*?)<\/em>/);
        if (noteMatch) {
          const priceNote = document.createElement('div');
          priceNote.classList.add('carousel-price-note');
          priceNote.innerHTML = `<strong>${noteMatch[1]}</strong>`;
          priceBlock.append(priceNote);
        }

        p.after(priceBlock);
      }
    }
  }

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');

  let slideIndicators;
  let navPrevBtn;
  let navNextBtn;
  let controlsDiv;
  if (!isSingleSlide) {
    controlsDiv = document.createElement('div');
    controlsDiv.classList.add('carousel-controls');

    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    controlsDiv.append(slideIndicatorsNav);

    // Play/Pause button
    const playPauseBtn = document.createElement('button');
    playPauseBtn.classList.add('carousel-playpause');
    playPauseBtn.setAttribute('type', 'button');
    playPauseBtn.setAttribute('aria-label', 'Pause');
    controlsDiv.append(playPauseBtn);

    // Navigation arrows (added to DOM after container is prepended)
    navPrevBtn = document.createElement('button');
    navPrevBtn.type = 'button';
    navPrevBtn.classList.add('slide-prev', 'hidden');
    navPrevBtn.setAttribute('aria-label', placeholders.previousSlide || 'Previous Slide');

    navNextBtn = document.createElement('button');
    navNextBtn.type = 'button';
    navNextBtn.classList.add('slide-next');
    navNextBtn.setAttribute('aria-label', placeholders.nextSlide || 'Next Slide');
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  // Insert navigation arrows flanking the slides container for flex layout
  if (navPrevBtn) {
    block.prepend(navPrevBtn);
    block.append(navNextBtn);
  }

  // Insert controls as a direct child of the carousel (after container, before next arrow)
  if (controlsDiv) {
    container.after(controlsDiv);
  }

  if (!isSingleSlide) {
    block.style.setProperty('--autoplay-interval', `${AUTOPLAY_INTERVAL}ms`);
    bindEvents(block);
    // Start autoplay by default
    startAutoplay(block);
  }
}

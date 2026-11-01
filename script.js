/**
 * Pizza Express Chauvin - 193 Frames Cinema Scroll Engine & Store Interactive System
 */

// ==========================================================================
// 1. Frame Animation Setup (193 Frames)
// ==========================================================================
const TOTAL_FRAMES = 193;
const FRAME_PATH = (index) => `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

const images = [];
let loadedCount = 0;
let currentFrame = 1;
let targetFrame = 1;

// Selected Pizza Crust Sizes State
const selectedSizes = {
  'Meat Lovers': { size: 'Medium', price: 17.75 },
  'Taco Pizza': { size: 'Medium', price: 19.30 },
  'Supreme Pizza': { size: 'Medium', price: 19.30 },
  'BBQ Pizza': { size: 'Medium', price: 17.75 },
  'Shrimp Pizza': { size: 'Medium', price: 14.00 },
  'Hawaiian Pizza': { size: 'Medium', price: 14.00 }
};

// DOM Elements
const canvas = document.getElementById('pizza-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const scrollTrack = document.getElementById('scroll-hero');
const loader = document.getElementById('loader');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');
const progressFrames = document.getElementById('progress-frames');
const heroTitleOverlay = document.getElementById('hero-title-overlay');
const scrollPrompt = document.getElementById('scroll-prompt');
const scrollTimeline = document.getElementById('scroll-timeline');
const scrubStatus = document.getElementById('scrub-status');
const scrubBar = document.getElementById('scrub-bar');
const mainHeader = document.getElementById('main-header');
const mobileNavPanel = document.getElementById('mobile-nav-panel');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');

function preloadImages() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.src = FRAME_PATH(i);

    img.onload = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressPercent) progressPercent.textContent = `${percent}%`;
      if (progressFrames) progressFrames.textContent = `${loadedCount} / ${TOTAL_FRAMES} Frames`;

      if (i === 1 && currentFrame === 1) {
        resizeCanvas();
        drawFrame(1);
      }

      if (loadedCount === TOTAL_FRAMES) {
        setTimeout(onPreloadComplete, 250);
      }
    };

    img.onerror = () => {
      loadedCount++;
      if (loadedCount === TOTAL_FRAMES) {
        setTimeout(onPreloadComplete, 250);
      }
    };

    images[i] = img;
  }
}

function onPreloadComplete() {
  if (loader) loader.classList.add('fade-out');
  resizeCanvas();
  drawFrame(1);
  updateScrollProgress();
}

// Crisp High-DPI Retina Canvas Buffer
function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  drawFrame(currentFrame);
}

window.addEventListener('resize', resizeCanvas);

// High-Quality Motion-Interpolated Frame Renderer (Alpha Cross-Fading for 120fps Cinema)
function drawFrame(frameValue) {
  if (!ctx || !canvas) return;

  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, frameValue));
  const baseFrame = Math.floor(clamped);
  const nextFrame = Math.min(TOTAL_FRAMES, baseFrame + 1);
  const blendAlpha = clamped - baseFrame; // Fractional delta for silky cross-fade

  const img1 = images[baseFrame];
  if (!img1 || !img1.complete || img1.naturalWidth === 0) return;

  const cWidth = canvas.width;
  const cHeight = canvas.height;

  // Aspect ratio calculation to fill the viewport
  const imgAspect = img1.naturalWidth / img1.naturalHeight;
  const screenAspect = cWidth / cHeight;

  let drawW, drawH, offX, offY;

  if (screenAspect > imgAspect) {
    drawW = cWidth;
    drawH = cWidth / imgAspect;
    offX = 0;
    offY = (cHeight - drawH) / 2;
  } else {
    drawH = cHeight;
    drawW = cHeight * imgAspect;
    offX = (cWidth - drawW) / 2;
    offY = 0;
  }

  // Clear canvas
  ctx.clearRect(0, 0, cWidth, cHeight);

  // Maximum clarity and high quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw primary base frame
  ctx.globalAlpha = 1.0;
  ctx.drawImage(img1, offX, offY, drawW, drawH);

  // Sub-pixel frame interpolation: blend next frame for buttery fluid motion
  if (blendAlpha > 0.02 && baseFrame !== nextFrame) {
    const img2 = images[nextFrame];
    if (img2 && img2.complete && img2.naturalWidth > 0) {
      ctx.globalAlpha = blendAlpha;
      ctx.drawImage(img2, offX, offY, drawW, drawH);
      ctx.globalAlpha = 1.0;
    }
  }
}

// ==========================================================================
// 2. Scroll Scrubbing Loop & Hero Fade (30% Scroll Fade)
// ==========================================================================
function updateScrollProgress() {
  if (!scrollTrack) return;

  const rect = scrollTrack.getBoundingClientRect();
  const maxScroll = rect.height - window.innerHeight;

  if (maxScroll <= 0) return;

  // Progress from 0 (top of page) to 1 (passed scroll hero track)
  const progress = Math.max(0, Math.min(1, -rect.top / maxScroll));
  targetFrame = 1 + progress * (TOTAL_FRAMES - 1);

  // Fade title away at 30% of scroll animation section
  updateHeroTitleOpacity(progress);

  // Fade out scroll prompt prompt as user begins scrolling
  if (scrollPrompt) {
    if (progress > 0.02) {
      scrollPrompt.style.opacity = '0';
    } else {
      scrollPrompt.style.opacity = '1';
    }
  }

  // Update Cinema Scrubber Status Bar
  if (scrollTimeline && scrubBar && scrubStatus) {
    if (progress > 0.02 && progress < 0.98) {
      scrollTimeline.style.opacity = '1';
      scrollTimeline.style.transform = 'translate(-50%, 0)';
      const percent = Math.round(progress * 100);
      scrubBar.style.width = `${percent}%`;
      scrubStatus.textContent = percent >= 96 ? 'Bake Complete: 100%' : `Baking Pie: ${percent}%`;
    } else {
      scrollTimeline.style.opacity = '0';
      scrollTimeline.style.transform = 'translate(-50%, 15px)';
    }
  }

  // Update navbar background blur & active links
  updateHeaderAppearance();
  updateScrollSpy();
}

function updateHeroTitleOpacity(progress) {
  if (!heroTitleOverlay) return;
  const fadeThreshold = 0.30;
  if (progress <= 0) {
    heroTitleOverlay.style.opacity = '1';
    heroTitleOverlay.style.transform = 'translate(-50%, 0)';
    heroTitleOverlay.style.pointerEvents = 'none';
  } else if (progress >= fadeThreshold) {
    heroTitleOverlay.style.opacity = '0';
    heroTitleOverlay.style.transform = 'translate(-50%, -25px)';
  } else {
    const ratio = 1 - (progress / fadeThreshold);
    heroTitleOverlay.style.opacity = String(ratio);
    heroTitleOverlay.style.transform = `translate(-50%, ${-(1 - ratio) * 25}px)`;
  }
}

function renderLoop() {
  const diff = targetFrame - currentFrame;
  if (Math.abs(diff) > 0.005) {
    currentFrame += diff * 0.14; // Ultra-smooth cinematic damping
    drawFrame(currentFrame);
  }
  requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ==========================================================================
// 3. Transparent Navbar Scroll Styling & Navigation
// ==========================================================================
function updateHeaderAppearance() {
  if (!mainHeader) return;
  if (window.scrollY > 40) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
}

// Smooth scroll to element with fixed header offset
function smoothScrollTo(selector, event) {
  if (event) event.preventDefault();
  closeMobileNav();

  const targetEl = document.querySelector(selector);
  if (!targetEl) return;

  const headerOffset = 64;
  const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = Math.max(0, elementPosition - headerOffset);

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Navbar Category Navigation (Scrolls to Menu and Selects Category Filter)
function navigateToCategory(category, event) {
  if (event) event.preventDefault();
  closeMobileNav();

  filterMenu(category);
  smoothScrollTo('#menu-section');
}

// ScrollSpy Active Link Update
function updateScrollSpy() {
  const scrollPos = window.scrollY + 120;
  const sections = [
    { id: 'scroll-hero', link: document.querySelector('nav a[href="#scroll-hero"]') },
    { id: 'menu-section', link: document.querySelector('nav a[href="#menu-section"]') },
    { id: 'location-section', link: document.querySelector('nav a[href="#location-section"]') }
  ];

  for (let i = sections.length - 1; i >= 0; i--) {
    const s = sections[i];
    const el = document.getElementById(s.id);
    if (el) {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('#desktop-nav .nav-link').forEach(l => l.classList.remove('active'));
        if (s.link) s.link.classList.add('active');
        break;
      }
    }
  }
}

// Mobile Menu Controls
function toggleMobileNav() {
  if (!mobileNavPanel) return;
  const isHidden = mobileNavPanel.classList.contains('hidden');
  if (isHidden) {
    mobileNavPanel.classList.remove('hidden');
    if (mobileMenuIcon) mobileMenuIcon.textContent = 'close';
  } else {
    mobileNavPanel.classList.add('hidden');
    if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
  }
}

function closeMobileNav() {
  if (!mobileNavPanel) return;
  mobileNavPanel.classList.add('hidden');
  if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
}

// ==========================================================================
// 4. Scroll Reveal Animations (IntersectionObserver)
// ==========================================================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ==========================================================================
// 5. Menu Filtering
// ==========================================================================
function filterMenu(category) {
  // Update Filter Tabs active style
  document.querySelectorAll('.menu-filter-btn').forEach(btn => {
    btn.classList.remove('bg-primary', 'text-on-primary');
    btn.classList.add('bg-surface-container-high', 'text-on-surface-variant');
  });

  const activeBtn = document.querySelector(`.menu-filter-btn[data-category="${category}"]`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
    activeBtn.classList.add('bg-primary', 'text-on-primary');
  }

  // Filter Items
  const items = document.querySelectorAll('.menu-item');
  items.forEach(item => {
    if (category === 'all' || item.classList.contains(category)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// ==========================================================================
// 6. Crust Size Selection & Cart System
// ==========================================================================

// Pizza Crust Size Selector (Small, Med, Large)
function selectPizzaSize(pizzaName, sizeName, price, clickedBtn) {
  selectedSizes[pizzaName] = { size: sizeName, price: parseFloat(price) };

  // Highlight selected button inside this card
  const group = clickedBtn.closest('.size-selector-group');
  if (group) {
    group.querySelectorAll('.size-btn').forEach(btn => {
      btn.classList.remove('bg-secondary', 'text-on-secondary', 'font-bold');
      btn.classList.add('bg-surface-container-high', 'text-on-surface-variant');
    });
    clickedBtn.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
    clickedBtn.classList.add('bg-secondary', 'text-on-secondary', 'font-bold');
  }

  // Update price display on card
  const priceId = `price-${pizzaName.replace(/\s+/g, '-')}`;
  const priceDisplay = document.getElementById(priceId);
  if (priceDisplay) {
    priceDisplay.textContent = `$${parseFloat(price).toFixed(2)}`;
    priceDisplay.classList.add('scale-110');
    setTimeout(() => priceDisplay.classList.remove('scale-110'), 200);
  }
}

// Add the selected size & price to cart
function addSelectedPizzaToCart(pizzaName) {
  const current = selectedSizes[pizzaName] || { size: 'Medium', price: 17.75 };
  addToCart(pizzaName, current.price, current.size);
}

// Cart Data State
let cart = [];

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.toggle('translate-x-full');
    renderCart();
  }
}

function addToCart(name, price, size = 'Standard') {
  const existing = cart.find(item => item.name === name && item.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price: parseFloat(price), size, qty: 1 });
  }
  updateCartBadge();
  renderCart();
  
  // Open cart drawer so user sees updated total and Call to Pay button
  const drawer = document.getElementById('cart-drawer');
  if (drawer && drawer.classList.contains('translate-x-full')) {
    drawer.classList.remove('translate-x-full');
  }
}

function updateQty(index, change) {
  if (!cart[index]) return;
  cart[index].qty += change;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.0945;
  const total = subtotal + tax;

  // Update top transparent navbar badge
  const navCount = document.querySelector('.cart-nav-count');
  const navTotal = document.querySelector('.cart-nav-total');
  if (navCount) navCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
  if (navTotal) navTotal.textContent = `$${total.toFixed(0)}`;

  // Update drawer count
  const drawerCount = document.getElementById('cart-count');
  if (drawerCount) drawerCount.textContent = totalCount;
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-body-md text-outline text-center py-8">Your cart is empty.</p>';
    updateCartTotals(0);
    return;
  }

  cart.forEach((item, index) => {
    container.innerHTML += `
      <div class="flex items-center justify-between bg-surface p-3.5 rounded-xl border border-outline-variant/10 shadow-sm">
        <div>
          <h4 class="text-title-md text-on-surface font-semibold">${item.name}</h4>
          <p class="text-body-sm text-outline">${item.size} • $${item.price.toFixed(2)}</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="updateQty(${index}, -1)" class="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-bright font-bold cursor-pointer transition-colors">-</button>
          <span class="text-label-md text-on-surface font-bold px-1.5">${item.qty}</span>
          <button onclick="updateQty(${index}, 1)" class="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-bright font-bold cursor-pointer transition-colors">+</button>
        </div>
      </div>
    `;
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  updateCartTotals(subtotal);
}

function updateCartTotals(subtotal) {
  const tax = subtotal * 0.0945;
  const total = subtotal + tax;

  const subtotalEl = document.getElementById('cart-subtotal');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-total');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Delivery Zone Checker
function checkDelivery() {
  const zipInput = document.getElementById('zip-input');
  const res = document.getElementById('delivery-result');
  if (!zipInput || !res) return;

  const zip = zipInput.value.trim().toLowerCase();
  if (zip === '70344' || zip === '70353' || zip.includes('chauvin') || zip.includes('cocodrie') || zip === '') {
    res.textContent = '✓ Wood-fired delivery available in your Chauvin area! Estimated 25-35 mins.';
    res.className = 'text-body-sm text-secondary font-bold mt-2';
  } else {
    res.textContent = '✕ Outside normal delivery radius, but hot curbside pickup is available at 5534 LA-56!';
    res.className = 'text-body-sm text-error font-bold mt-2';
  }
}

// ==========================================================================
// 7. Initialization on Page Load
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  preloadImages();
  updateCartBadge();
  renderCart();
  initScrollReveal();
  updateHeaderAppearance();
});

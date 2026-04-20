/* ═══════════════════════════════════════════════════
   WOODWORK WELDERS — Views
   views.js: NavView · CartView · ProductView · GalleryView · CustomiserView · ContactView · HeritageView · PromotionsView
═══════════════════════════════════════════════════ */

'use strict';

/* ─── SVG ICONS (centralised) ───────────────────── */

/*
 * CartSVG — the uploaded shopping-cart-svgrepo-com.svg, scaled via class.
 * Three state variants are exposed:
 *   CartSVG.default  – neutral amber fill, used in nav + empty state
 *   CartSVG.added    – green fill + animated bounce, shown after "Add to Cart"
 *   CartSVG.removed  – red fill + shake, shown after item removal
 */
const CartSVG = {
  _path: `<path d="M161.593,329.399h253.478c6.97,0,13.021-4.801,14.606-11.587l47.604-203.77
    c1.042-4.459-0.01-9.148-2.855-12.735c-2.845-3.587-7.173-5.678-11.751-5.678h-335.54
    l-16.121-71.66c-1.355-6.024-6.202-10.642-12.285-11.705L29.884,0.231
    C21.566-1.224,13.644,4.342,12.19,12.66c-1.454,8.318,4.11,16.239,12.429,17.693
    l58.8,10.277l59.043,262.449c-19.143,7.632-32.716,26.34-32.716,48.175
    c0,28.592,23.259,51.854,51.847,51.854h298.186c8.284,0,15-6.716,15-15
    c0-8.284-6.716-15-15-15H161.593c-12.047,0-21.847-9.804-21.847-21.854
    C139.746,339.204,149.546,329.399,161.593,329.399z
    M273.163,299.399h-30.78l-16.059-71.885h46.838V299.399z
    M403.504,125.629h40.263l-16.794,71.885h-39.527L403.504,125.629z
    M419.964,227.515l-16.793,71.885h-38.486l16.059-71.885H419.964z
    M303.163,125.629h69.602l-16.059,71.885h-53.544V125.629z
    M303.163,227.515h46.842l-16.059,71.885h-30.783V227.515z
    M273.163,125.629v71.885h-53.54l-16.059-71.885H273.163z
    M211.643,299.399h-38.494l-16.343-71.885h38.778L211.643,299.399z
    M172.824,125.629l16.059,71.885h-38.826l-16.172-71.885H172.824z"/>
  <path d="M231.152,457.117c0,17.953-14.541,32.518-32.502,32.518
    c-17.96,0-32.526-14.565-32.526-32.518c0-17.96,14.566-32.514,32.526-32.514
    C216.611,424.603,231.152,439.157,231.152,457.117z"/>
  <path d="M409.88,457.117c0,17.953-14.549,32.518-32.51,32.518
    c-17.961,0-32.525-14.565-32.525-32.518c0-17.96,14.565-32.514,32.525-32.514
    C395.331,424.603,409.88,439.157,409.88,457.117z"/>`,

  _wrap(cls, fill, extraStyle = '') {
    return `<svg class="${cls}" style="${extraStyle}" viewBox="0 0 489.635 489.635"
      xmlns="http://www.w3.org/2000/svg" fill="${fill}">${this._path}</svg>`;
  },

  /* Nav bar icon — small, amber */
  nav(cls = 'w-5 h-5') {
    return this._wrap(cls, 'currentColor');
  },

  /* Default button state */
  default(cls = 'w-5 h-5 inline-block') {
    return this._wrap(cls, 'currentColor');
  },

  /* Added to cart — green, bounce keyframe triggered via class */
  added(cls = 'w-5 h-5 inline-block cart-bounce') {
    return this._wrap(cls, '#15803d');
  },

  /* Removed from cart — red, shake */
  removed(cls = 'w-4 h-4 inline-block cart-shake') {
    return this._wrap(cls, '#dc2626');
  },

  /* Empty cart illustration (large, muted) */
  empty(cls = 'w-14 h-14 opacity-30') {
    return this._wrap(cls, '#78716c');
  }
};

const Icons = {
  search:   `<svg class="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22" stroke-linecap="round"/></svg>`,
  cart:     CartSVG.nav(),
  close:    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  menu:     `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  chevron:  `<svg class="w-4 h-4 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`,
  shield:   `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
  lock:     `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
  leaf:     `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`,
  share:    `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  download: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  phone:    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.06 3.18a1 1 0 01-.23 1.05L7.68 9.29A16 16 0 0014.7 16.3l1.38-1.38a1 1 0 011.05-.23l3.18 1.06A1 1 0 0121 16.72V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 6V5z"/></svg>`,
  email:    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  pin:      `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  clock:    `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  upload:   `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>`,
  trash:    `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path stroke-linecap="round" stroke-linejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4h4v2"/></svg>`,
  fb:       `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`,
  ig:       `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  yt:       `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12z"/></svg>`,
  x:        `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
};

/* ─── NAV VIEW ──────────────────────────────────── */
class NavView extends BaseView {
  constructor(activePage, variant = 'main') {
    super('header');
    this.activePage = activePage;
    this.variant = variant;
  }
  renderInto(container) {
    const isGallery = this.variant === 'gallery';
    const links = isGallery
      ? [['Woodwork Gallery','Woodwork Gallery.html'],['Heritage Profile','Heritage Profile.html'],['Make Your Own Wears','Make Your Own Wears.html']]
      : [['Home','Welcome Area.html'],['Promotions','Traditional Product Promotion.html'],['Contact','Contact Us.php']];

    container.innerHTML = `
    <header class="site-header sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm" id="site-header">
      <nav class="max-w-6xl mx-auto px-6 h-[70px] flex items-center">
        <a href="${isGallery ? 'Woodwork Gallery.html' : 'Welcome Area.html'}" class="logo-link flex items-center shrink-0 mr-auto no-underline" aria-label="Woodwork Welders Home">
          <div class="w-[66px] h-[66px] border-2 border-amber-400 rounded-[10px] bg-amber-50 flex flex-col items-center justify-center p-1 gap-0.5 shrink-0">
            <span class="text-xl leading-none">🪚</span>
            <span class="font-serif text-[6.5px] font-bold text-amber-950 text-center uppercase tracking-[0.8px] leading-[1.3]">WOODWORK<br>WELDERS</span>
          </div>
        </a>

        <!-- Desktop nav -->
        <ul class="hidden md:flex list-none gap-7 mx-8 items-center">
          ${links.map(([label, href]) => `
            <li><a href="${href}" class="text-sm font-semibold no-underline transition-colors duration-200 ${
              label.toLowerCase().includes(this.activePage.toLowerCase())
                ? 'text-amber-800 border-b-2 border-amber-600 pb-0.5'
                : 'text-stone-700 hover:text-amber-800'
            }">${label}</a></li>
          `).join('')}
        </ul>

        <div class="flex items-center gap-3">
          <button id="nav-search-btn" class="p-1.5 text-stone-600 hover:text-amber-800 transition-colors" aria-label="Search">
            ${Icons.search}
          </button>
          <button id="nav-cart-btn" class="relative p-1.5 text-stone-600 hover:text-amber-800 transition-colors" aria-label="Cart">
            ${Icons.cart}
            <span id="cart-badge" class="hidden absolute -top-1 -right-1 bg-amber-700 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"></span>
          </button>
          ${isGallery
            ? `<a href="contact.html" class="hidden sm:inline-block border border-stone-300 text-stone-700 hover:border-amber-700 hover:text-amber-800 font-semibold text-sm px-5 py-2 rounded-lg transition-colors">Contact</a>`
            : `<a href="contact.html" class="hidden sm:inline-block bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors">Contact Us</a>`
          }
          <button id="mobile-menu-btn" class="md:hidden p-1.5 text-stone-600" aria-label="Menu">${Icons.menu}</button>
        </div>
      </nav>

      <!-- Mobile menu -->
      <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-stone-100 px-6 py-4 flex flex-col gap-3">
        ${links.map(([label, href]) => `
          <a href="${href}" class="text-sm font-semibold text-stone-700 hover:text-amber-800 py-1 transition-colors">${label}</a>
        `).join('')}
        <a href="contact.html" class="mt-2 bg-amber-800 text-white text-sm font-semibold text-center py-2.5 rounded-lg">Contact Us</a>
      </div>

      <!-- Search bar (revealed) -->
      <div id="search-bar" class="hidden border-t border-stone-100 px-6 py-3 bg-white">
        <div class="max-w-xl mx-auto flex items-center gap-3 border border-stone-300 rounded-lg px-4 py-2 focus-within:border-amber-600">
          ${Icons.search}
          <input id="global-search-input" type="text" placeholder="Search products, materials, styles…"
            class="flex-1 bg-transparent outline-none text-sm text-stone-800 placeholder:text-stone-400"/>
          <button id="search-close" class="text-stone-400 hover:text-stone-600">${Icons.close}</button>
        </div>
      </div>
    </header>`;
  }
}

/* ─── CART DRAWER VIEW ──────────────────────────── */
class CartView extends BaseView {
  renderDrawer(container) {
    const d = document.createElement('div');
    d.id = 'cart-drawer';
    d.className = 'fixed inset-0 z-[200] pointer-events-none';
    d.innerHTML = `
      <div id="cart-overlay" class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 pointer-events-none"></div>
      <aside id="cart-panel" class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl
        translate-x-full transition-transform duration-300 flex flex-col pointer-events-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 class="font-serif text-lg font-bold text-stone-900">Your Cart</h2>
          <button id="cart-close-btn" class="p-1 text-stone-500 hover:text-stone-800 transition-colors">${Icons.close}</button>
        </div>
        <div id="cart-items" class="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4"></div>
        <div id="cart-footer" class="border-t border-stone-200 px-6 py-5"></div>
      </aside>`;
    container.appendChild(d);
  }
  updateItems(items, total) {
    const el = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    if (!el) return;
    if (items.length === 0) {
      el.innerHTML = `<div class="flex flex-col items-center justify-center h-full gap-4 text-stone-400">
        ${CartSVG.empty()}
        <p class="text-sm font-semibold text-stone-500">Your basket is empty</p>
        <a href="gallery.html" class="text-amber-800 text-sm font-semibold underline hover:text-amber-900 transition-colors">Browse the gallery</a>
      </div>`;
      footer.innerHTML = '';
      return;
    }
    el.innerHTML = items.map(item => `
      <div class="flex gap-4 items-start group/item" data-item-id="${item.id}">
        <div class="w-16 h-16 rounded-lg bg-amber-50 border border-amber-100 shrink-0 flex items-center justify-center">
          ${CartSVG._wrap('w-7 h-7 opacity-40', '#92400e')}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-stone-800 leading-snug">${item.name}</p>
          <p class="text-xs text-stone-500 mt-0.5">${item.wood} · ${item.finish}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-sm font-bold text-amber-800">$${(item.price * item.qty).toFixed(2)}</span>
            <button class="cart-remove-btn flex items-center gap-1.5 text-stone-300 hover:text-red-600 transition-colors group/rm" data-id="${item.id}" title="Remove from basket">
              ${CartSVG.removed('w-4 h-4 opacity-50 group-hover/rm:opacity-100 transition-opacity')}
            </button>
          </div>
        </div>
      </div>`).join('');
    footer.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <span class="font-semibold text-stone-800">Total</span>
        <span class="font-bold text-lg text-amber-800">$${total.toFixed(2)}</span>
      </div>
      <button class="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
        Proceed to Checkout
      </button>
      <p class="text-xs text-center text-stone-400 mt-2">Secure checkout · Free shipping over $500</p>`;
  }
}

/* ─── PRODUCT DETAIL VIEW ───────────────────────── */
class ProductDetailView extends BaseView {
  renderMain(data) {
    const { thumbGradients, activeThumb, woodOptions, finishOptions,
            selectedWood, selectedFinish, quantity, price, name, description, category } = data;
    /* Table SVG illustration */
    const tableSVG = `<svg width="100%" height="100%" viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="dg${activeThumb}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#e8d8b8"/><stop offset="50%" style="stop-color:#c4a070"/><stop offset="100%" style="stop-color:#8a6040"/>
      </linearGradient></defs>
      <rect width="480" height="360" fill="url(#dg${activeThumb})"/>
      <rect x="0" y="260" width="480" height="100" fill="rgba(200,180,140,.3)"/>
      <rect x="40" y="160" width="400" height="28" rx="4" fill="rgba(180,130,60,.55)"/>
      <rect x="40" y="160" width="400" height="10" rx="4" fill="rgba(200,160,80,.4)"/>
      <path d="M90 188 L80 256 L96 256 L100 188Z" fill="rgba(160,110,40,.5)"/>
      <path d="M390 188 L384 256 L400 256 L410 188Z" fill="rgba(160,110,40,.5)"/>
      <path d="M130 188 L120 256 L136 256 L140 188Z" fill="rgba(140,100,35,.45)"/>
      <path d="M350 188 L344 256 L360 256 L370 188Z" fill="rgba(140,100,35,.45)"/>
      <rect x="55" y="120" width="70" height="8" rx="3" fill="rgba(160,120,60,.3)"/>
      <line x1="65" y1="128" x2="60" y2="165" stroke="rgba(160,120,60,.3)" stroke-width="4" stroke-linecap="round"/>
      <line x1="115" y1="128" x2="120" y2="165" stroke="rgba(160,120,60,.3)" stroke-width="4" stroke-linecap="round"/>
      <rect x="400" y="200" width="4" height="56" fill="rgba(80,60,30,.3)"/>
      <ellipse cx="402" cy="196" rx="18" ry="22" fill="rgba(80,120,60,.4)"/>
      <text x="50%" y="86%" text-anchor="middle" fill="rgba(255,255,255,.35)" font-size="11" font-family="sans-serif" letter-spacing="2">MIRI</text>
    </svg>`;

    return `
    <main class="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

      <!-- Images -->
      <div data-reveal>
        <div class="w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 relative shadow-md transition-all duration-500" id="main-img-wrap"
          style="background:${thumbGradients[activeThumb]}">
          ${tableSVG}
          <span class="absolute bottom-3 right-3 text-white/60 text-xs italic tracking-widest">MIRI</span>
        </div>
        <div class="grid grid-cols-4 gap-2.5" id="thumb-row">
          ${thumbGradients.map((g, i) => `
            <button class="thumb-btn aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200
              ${i === activeThumb ? 'border-amber-700 scale-105' : 'border-transparent hover:border-amber-300'}"
              data-thumb="${i}" style="background:${g}" aria-label="View ${i+1}"></button>
          `).join('')}
        </div>
      </div>

      <!-- Info -->
      <div data-reveal class="flex flex-col gap-5">
        <div>
          <h1 class="font-serif text-3xl font-black text-stone-900 leading-tight mb-2">${name}</h1>
          <p class="text-sm text-stone-500">Category: <a href="#" class="text-amber-800 hover:underline">${category}</a></p>
        </div>

        <div class="text-3xl font-bold text-amber-700" id="pd-price">$${price.toFixed(2)}</div>

        <p class="text-sm text-stone-600 leading-relaxed border-b border-stone-100 pb-6">${description}</p>

        <!-- Wood Type -->
        <div>
          <span class="block text-sm font-bold text-stone-800 mb-2.5">Wood Type: <span class="font-normal text-amber-800" id="selected-wood-label">${selectedWood}</span></span>
          <div class="flex gap-2 flex-wrap" id="wood-options">
            ${woodOptions.map(w => `
              <button class="opt-btn px-4 py-2 rounded-lg text-sm font-semibold border-[1.5px] transition-all duration-150
                ${w === selectedWood ? 'bg-amber-800 text-white border-amber-800' : 'border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-800'}"
                data-group="wood" data-value="${w}">${w}</button>
            `).join('')}
          </div>
        </div>

        <!-- Finish -->
        <div>
          <span class="block text-sm font-bold text-stone-800 mb-2.5">Finish: <span class="font-normal text-amber-800" id="selected-finish-label">${selectedFinish}</span></span>
          <div class="flex gap-2 flex-wrap" id="finish-options">
            ${finishOptions.map(f => `
              <button class="opt-btn px-4 py-2 rounded-lg text-sm font-semibold border-[1.5px] transition-all duration-150
                ${f === selectedFinish ? 'bg-amber-800 text-white border-amber-800' : 'border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-800'}"
                data-group="finish" data-value="${f}">${f}</button>
            `).join('')}
          </div>
        </div>

        <!-- Quantity -->
        <div>
          <span class="block text-sm font-bold text-stone-800 mb-2.5">Quantity:</span>
          <div class="flex items-center">
            <button id="qty-dec" class="w-10 h-10 border border-stone-300 rounded-l-lg flex items-center justify-center text-lg font-bold hover:bg-stone-50 transition-colors">−</button>
            <input id="qty-input" type="number" value="${quantity}" min="1"
              class="w-14 h-10 border-y border-stone-300 text-center text-sm font-semibold outline-none bg-white" readonly/>
            <button id="qty-inc" class="w-10 h-10 border border-stone-300 rounded-r-lg flex items-center justify-center text-lg font-bold hover:bg-stone-50 transition-colors">+</button>
          </div>
        </div>

        <button id="add-to-cart-btn"
          class="w-full bg-amber-800 hover:bg-amber-900 active:scale-[0.99] text-white font-bold py-4 rounded-xl text-sm
          transition-all duration-150 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5">
          <span id="cart-btn-icon">${CartSVG.default('w-5 h-5 inline-block')}</span>
          <span id="cart-btn-label">Add to Basket — $<span id="cart-total-price">${(price * quantity).toFixed(2)}</span></span>
        </button>

        <!-- Trust badges -->
        <div class="flex items-center gap-4 border border-stone-100 rounded-xl px-5 py-3.5 bg-stone-50 flex-wrap">
          <div class="flex items-center gap-1.5 text-xs text-stone-500">${Icons.shield}<span>Handcrafted Quality</span></div>
          <div class="w-px h-4 bg-stone-200"></div>
          <div class="flex items-center gap-1.5 text-xs text-stone-500">${Icons.lock}<span>Secure Payment</span></div>
          <div class="w-px h-4 bg-stone-200"></div>
          <div class="flex items-center gap-1.5 text-xs text-stone-500">${Icons.leaf}<span>Eco-Friendly</span></div>
        </div>
      </div>
    </main>`;
  }
  updatePrice(price, quantity) {
    const el = document.getElementById('cart-total-price');
    if (el) el.textContent = (price * quantity).toFixed(2);
    const qEl = document.getElementById('qty-input');
    if (qEl) qEl.value = quantity;
  }
  updateOptions(group, selected) {
    document.querySelectorAll(`[data-group="${group}"]`).forEach(btn => {
      const isActive = btn.dataset.value === selected;
      btn.className = btn.className
        .replace(/bg-amber-800\s*text-white\s*border-amber-800/g, 'border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-800')
        .replace(/border-stone-300\s*text-stone-700\s*hover:border-amber-600\s*hover:text-amber-800/g, 'border-stone-300 text-stone-700 hover:border-amber-600 hover:text-amber-800');
      if (isActive) {
        btn.classList.remove('border-stone-300','text-stone-700','hover:border-amber-600','hover:text-amber-800');
        btn.classList.add('bg-amber-800','text-white','border-amber-800');
      } else {
        btn.classList.remove('bg-amber-800','text-white','border-amber-800');
        btn.classList.add('border-stone-300','text-stone-700','hover:border-amber-600','hover:text-amber-800');
      }
    });
    const lbl = document.getElementById(`selected-${group}-label`);
    if (lbl) lbl.textContent = selected;
  }
  updateThumb(thumbGradients, activeThumb) {
    document.querySelectorAll('.thumb-btn').forEach((btn, i) => {
      const active = i === activeThumb;
      btn.classList.toggle('border-amber-700', active);
      btn.classList.toggle('scale-105', active);
      btn.classList.toggle('border-transparent', !active);
    });
    const wrap = document.getElementById('main-img-wrap');
    if (wrap) wrap.style.background = thumbGradients[activeThumb];
  }
}

/* ─── GALLERY VIEW ──────────────────────────────── */
class GalleryView extends BaseView {
  renderProducts(products) {
    const el = document.getElementById('gallery-grid');
    if (!el) return;
    if (!products.length) {
      el.innerHTML = `<div class="col-span-full text-center py-20 text-stone-400">
        <p class="text-4xl mb-3">🔍</p><p class="font-semibold">No products found</p>
      </div>`;
      return;
    }
    el.innerHTML = products.map((p, i) => `
      <div class="group relative bg-white border border-stone-200 rounded-xl overflow-hidden
        hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col"
        data-reveal style="animation-delay:${i * 60}ms">
        <div class="relative h-44 overflow-hidden cursor-pointer" style="background:${p.gradient}">
          ${p.badge ? `<span class="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
            ${['Sale','Limited'].includes(p.badge) ? 'bg-red-600 text-white' : 'bg-amber-700 text-white'}">${p.badge}</span>` : ''}
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <button class="quick-view-btn text-white text-xs font-semibold underline" data-id="${p.id}">Quick View</button>
          </div>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="font-bold text-stone-800 text-sm mb-1 leading-snug">${p.name}</h3>
          <p class="text-xs text-stone-500 flex-1">${p.category}</p>
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
            <span class="font-bold text-amber-700 text-sm">$${p.price.toLocaleString()}</span>
            <a href="product.html" class="text-xs font-semibold text-stone-600 border border-stone-200
              hover:border-amber-600 hover:text-amber-800 px-3 py-1.5 rounded-lg transition-colors">View Details</a>
          </div>
        </div>
      </div>`).join('');
    ScrollReveal.init();
  }
  updateFilter(active) {
    document.querySelectorAll('.filter-tab').forEach(btn => {
      const isActive = btn.textContent.trim() === active;
      btn.classList.toggle('bg-amber-800', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('border-amber-800', isActive);
      btn.classList.toggle('text-stone-600', !isActive);
      btn.classList.toggle('border-stone-200', !isActive);
      btn.classList.toggle('hover:border-amber-600', !isActive);
    });
  }
}

/* ─── CUSTOMISER VIEW ───────────────────────────── */
class CustomiserView extends BaseView {
  renderPricing(pricing) {
    const rows = [
      ['Base Item', pricing.base],
      ['Material Selection', pricing.material],
      ['Dimensions Adjustment', pricing.dimensions],
      ['Finish Option', pricing.finish],
      ['Accessories', pricing.accessories],
    ];
    const el = document.getElementById('pricing-rows');
    const tot = document.getElementById('pricing-total');
    if (el) el.innerHTML = rows.map(([label, val]) => `
      <div class="flex justify-between items-center py-2.5 px-5 text-sm border-b border-stone-100 last:border-0">
        <span class="text-stone-600">${label}:</span>
        <span class="font-semibold text-stone-800">$${val.toFixed(2)}</span>
      </div>`).join('');
    if (tot) tot.textContent = `$${pricing.total.toFixed(2)}`;
  }
  updateAccordion(n, open) {
    const acc = document.getElementById(`acc-${n}`);
    if (!acc) return;
    const body = acc.querySelector('.acc-body');
    const chev = acc.querySelector('.acc-chevron');
    if (body) body.classList.toggle('hidden', !open);
    if (chev) chev.classList.toggle('rotate-180', open);
  }
  updateSlider(input, active) {
    const val = parseInt(input.value);
    input.style.background = `linear-gradient(to right,#92400e 0%,#92400e ${val}%,#e7e5e4 ${val}%,#e7e5e4 100%)`;
    const status = input.closest('.slider-row')?.querySelector('.slider-status');
    if (status) {
      status.textContent = active ? 'Active' : 'Inactive';
      status.className = `slider-status text-[11px] font-semibold min-w-[44px] text-right ${active ? 'text-amber-700' : 'text-stone-400'}`;
    }
  }
}

/* ─── CONTACT VIEW ──────────────────────────────── */
class ContactView extends BaseView {
  showErrors(errors) {
    document.querySelectorAll('.field-error').forEach(e => e.remove());
    Object.entries(errors).forEach(([key, msg]) => {
      const input = document.getElementById(`contact-${key}`);
      if (!input) return;
      input.classList.add('border-red-400');
      const err = document.createElement('p');
      err.className = 'field-error text-xs text-red-600 mt-1';
      err.textContent = msg;
      input.parentElement.appendChild(err);
    });
  }
  clearErrors() {
    document.querySelectorAll('.field-error').forEach(e => e.remove());
    document.querySelectorAll('.border-red-400').forEach(e => e.classList.remove('border-red-400'));
  }
  setSubmitting(loading) {
    const btn = document.getElementById('contact-submit-btn');
    if (!btn) return;
    btn.disabled = loading;
    btn.innerHTML = loading
      ? `<span class="flex items-center gap-2 justify-center"><svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending…</span>`
      : 'Submit Inquiry';
  }
  showSuccess() {
    const panel = document.getElementById('contact-form-panel');
    if (!panel) return;
    panel.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full py-20 gap-5 text-center">
        <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl animate-bounce">✓</div>
        <h3 class="font-serif text-xl font-bold text-stone-800">Message Sent!</h3>
        <p class="text-sm text-stone-500 max-w-xs">We'll be in touch within 24 hours. Thank you for reaching out!</p>
      </div>`;
  }
}

/* ─── FOOTER VIEW ───────────────────────────────── */
class FooterView {
  static render(variant = 'main') {
    const cols = variant === 'gallery'
      ? [['Services',['Custom Woodwork','Welding Fabrication','Heritage Restoration']],
         ['Support',['FAQ','Shipping & Returns','Privacy Policy']]]
      : [['Company',['About Us','Services','Our Work']],['Support',['FAQ','Shipping','Returns']]];
    return `
    <footer class="bg-stone-50 border-t border-stone-200 pt-14 pb-0">
      <div class="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-8 h-8 bg-amber-800 rounded-lg flex items-center justify-center text-base">🪚</div>
            <span class="font-serif font-bold text-amber-900 text-base">Woodwork Welders</span>
          </div>
          <p class="text-xs text-stone-500 leading-relaxed max-w-[220px]">Crafting bespoke woodworking products and providing expert welding services. Quality and precision in every project.</p>
        </div>
        ${cols.map(([title, links]) => `
          <div>
            <h4 class="text-sm font-bold text-stone-800 mb-4">${title}</h4>
            <ul class="flex flex-col gap-2.5">
              ${links.map(l => `<li><a href="#" class="text-sm text-stone-500 hover:text-amber-800 transition-colors">${l}</a></li>`).join('')}
            </ul>
          </div>`).join('')}
        <div>
          <h4 class="text-sm font-bold text-stone-800 mb-4">Contact Us</h4>
          <div class="flex flex-col gap-2">
            <div class="flex items-start gap-2 text-xs text-stone-500">${Icons.phone}<span>(123) 456-7890</span></div>
            <div class="flex items-start gap-2 text-xs text-stone-500">${Icons.email}<span>info@woodworkwelders.com</span></div>
            <div class="flex items-start gap-2 text-xs text-stone-500">${Icons.pin}<span>123 Workshop Lane, Craftsville, USA</span></div>
          </div>
          <div class="flex gap-3 mt-4">
            <a href="#" class="text-stone-400 hover:text-amber-800 transition-colors">${Icons.fb}</a>
            <a href="#" class="text-stone-400 hover:text-amber-800 transition-colors">${Icons.ig}</a>
            <a href="#" class="text-stone-400 hover:text-amber-800 transition-colors">${Icons.yt}</a>
            <a href="#" class="text-stone-400 hover:text-amber-800 transition-colors">${Icons.x}</a>
          </div>
        </div>
      </div>
      <div class="border-t border-stone-200 py-4 px-6 text-center">
        <p class="text-xs text-stone-400">&copy; 2026 Woodwork Welders. All rights reserved.</p>
      </div>
    </footer>`;
  }
}

/* ─── NEWSLETTER VIEW ───────────────────────────── */
class NewsletterView {
  static render() {
    return `
    <section class="max-w-5xl mx-auto px-6 pb-20">
      <div class="border border-stone-200 rounded-2xl bg-white p-12 text-center shadow-sm" data-reveal>
        <h2 class="font-serif text-2xl font-bold text-stone-800 mb-3">Join Our Community</h2>
        <p class="text-sm text-stone-500 mb-7 max-w-md mx-auto leading-relaxed">Stay up-to-date with our latest projects, exclusive promotions, and workshops.</p>
        <div class="flex max-w-md mx-auto" id="newsletter-form">
          <input type="email" placeholder="Enter your email" id="newsletter-email"
            class="flex-1 px-4 py-3 border border-stone-300 rounded-l-lg text-sm outline-none focus:border-amber-600 transition-colors"/>
          <button id="newsletter-btn" class="bg-amber-800 hover:bg-amber-900 text-white px-5 py-3 rounded-r-lg text-sm font-semibold transition-colors">Subscribe</button>
        </div>
      </div>
    </section>`;
  }
}

/* ─── EXPORTS ───────────────────────────────────── */
Object.assign(window, {
  CartSVG, Icons, NavView, CartView, ProductDetailView, GalleryView,
  CustomiserView, ContactView, FooterView, NewsletterView
});

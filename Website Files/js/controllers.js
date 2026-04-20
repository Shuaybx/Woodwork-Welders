/* ═══════════════════════════════════════════════════
   WOODWORK WELDERS — Controllers
   controllers.js: NavController · CartController · ProductController · GalleryController · CustomiserController · ContactController
═══════════════════════════════════════════════════ */

'use strict';

/* ─── NAV + CART CONTROLLER ─────────────────────── */
class NavController extends BaseController {
  constructor() { super(null, new NavView()); }
  init(activePage, variant = 'main') {
    const navView = new NavView(activePage, variant);
    const headerContainer = document.getElementById('nav-container');
    if (!headerContainer) return;
    navView.renderInto(headerContainer);

    /* Mobile menu */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    /* Search bar */
    const searchBtn = document.getElementById('nav-search-btn');
    const searchBar = document.getElementById('search-bar');
    const searchClose = document.getElementById('search-close');
    if (searchBtn && searchBar) {
      searchBtn.addEventListener('click', () => {
        searchBar.classList.toggle('hidden');
        if (!searchBar.classList.contains('hidden')) {
          document.getElementById('global-search-input')?.focus();
        }
      });
    }
    if (searchClose) searchClose.addEventListener('click', () => searchBar.classList.add('hidden'));

    /* Cart badge update */
    this.subscribe('cart:updated', () => this._updateBadge());

    /* Cart open */
    const cartBtn = document.getElementById('nav-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        window.Cart.set('open', true);
        EventBus.emit('cart:open');
      });
    }

    /* Sticky shrink */
    window.addEventListener('scroll', () => {
      const header = document.getElementById('site-header');
      if (!header) return;
      if (window.scrollY > 40) header.classList.add('shadow-md');
      else header.classList.remove('shadow-md');
    });
  }
  _updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = window.Cart.count;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
    badge.classList.toggle('flex', count > 0);
  }
}

/* ─── CART CONTROLLER ───────────────────────────── */
class CartController extends BaseController {
  constructor() {
    super(window.Cart, new CartView());
  }
  init() {
    this.view.renderDrawer(document.body);
    const panel   = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('cart-close-btn');

    const open = () => {
      panel?.classList.remove('translate-x-full');
      overlay?.classList.add('opacity-100', 'pointer-events-auto');
      overlay?.classList.remove('opacity-0');
      document.getElementById('cart-drawer')?.classList.add('pointer-events-auto');
      this._refresh();
    };
    const close = () => {
      panel?.classList.add('translate-x-full');
      overlay?.classList.remove('opacity-100', 'pointer-events-auto');
      overlay?.classList.add('opacity-0');
    };

    EventBus.on('cart:open', open);
    closeBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', close);

    /* Delegate remove buttons — shake animation then remove */
    document.getElementById('cart-items')?.addEventListener('click', e => {
      const btn = e.target.closest('.cart-remove-btn');
      if (!btn) return;
      const svgEl = btn.querySelector('svg');
      if (svgEl) {
        svgEl.classList.remove('cart-shake');
        void svgEl.offsetWidth;
        svgEl.classList.add('cart-shake');
      }
      const row = btn.closest('[data-item-id]');
      if (row) row.style.cssText = 'opacity:0.4;transition:opacity 0.3s ease';
      setTimeout(() => {
        window.Cart.removeItem(btn.dataset.id);
        this._refresh();
        Toast.show('Item removed from basket', 'info');
      }, 380);
    });

    this.subscribe('cart:updated', () => this._refresh());
  }
  _refresh() {
    this.view.updateItems(window.Cart.get('items'), window.Cart.total);
  }
}

/* ─── PRODUCT CONTROLLER ────────────────────────── */
class ProductController extends BaseController {
  constructor() {
    super(new ProductModel(), new ProductDetailView());
  }
  init(container) {
    container.innerHTML = this.view.renderMain(this.model.get());
    ScrollReveal.init();

    /* Thumb clicks */
    document.getElementById('thumb-row')?.addEventListener('click', e => {
      const btn = e.target.closest('.thumb-btn');
      if (!btn) return;
      const i = parseInt(btn.dataset.thumb);
      this.model.setActiveThumb(i);
      this.view.updateThumb(this.model.get('thumbGradients'), i);
    });

    /* Wood options */
    document.getElementById('wood-options')?.addEventListener('click', e => {
      const btn = e.target.closest('.opt-btn');
      if (!btn) return;
      this.model.selectWood(btn.dataset.value);
      this.view.updateOptions('wood', this.model.get('selectedWood'));
      this._refreshPrice();
    });

    /* Finish options */
    document.getElementById('finish-options')?.addEventListener('click', e => {
      const btn = e.target.closest('.opt-btn');
      if (!btn) return;
      this.model.selectFinish(btn.dataset.value);
      this.view.updateOptions('finish', this.model.get('selectedFinish'));
    });

    /* Quantity */
    document.getElementById('qty-dec')?.addEventListener('click', () => {
      this.model.decrementQty();
      this._refreshPrice();
    });
    document.getElementById('qty-inc')?.addEventListener('click', () => {
      this.model.incrementQty();
      this._refreshPrice();
    });

    /* Add to cart */
    document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
      window.Cart.addItem(this.model.toCartItem());
      Toast.show(`${this.model.get('selectedWood')} table added to basket!`);

      const btn      = document.getElementById('add-to-cart-btn');
      const iconSlot = document.getElementById('cart-btn-icon');
      const lblSlot  = document.getElementById('cart-btn-label');
      if (!btn || !iconSlot || !lblSlot) return;

      /* ── ADDED state ── */
      btn.classList.remove('bg-amber-800','hover:bg-amber-900');
      btn.classList.add('bg-green-700','hover:bg-green-800');
      iconSlot.innerHTML = CartSVG.added('w-5 h-5 inline-block cart-bounce');
      lblSlot.innerHTML  = '✓ Added to Basket!';

      setTimeout(() => {
        /* ── RESET to default ── */
        btn.classList.remove('bg-green-700','hover:bg-green-800');
        btn.classList.add('bg-amber-800','hover:bg-amber-900');
        iconSlot.innerHTML = CartSVG.default('w-5 h-5 inline-block');
        lblSlot.innerHTML  = `Add to Basket — $<span id="cart-total-price">${(this.model.get('price') * this.model.get('quantity')).toFixed(2)}</span>`;
      }, 2200);
    });
  }
  _refreshPrice() {
    this.view.updatePrice(this.model.get('price'), this.model.get('quantity'));
  }
}

/* ─── GALLERY CONTROLLER ────────────────────────── */
class GalleryController extends BaseController {
  constructor() {
    super(new GalleryModel(), new GalleryView());
  }
  init() {
    this._render();

    /* Filter tabs */
    document.querySelector('.filter-tabs')?.addEventListener('click', e => {
      const btn = e.target.closest('.filter-tab');
      if (!btn) return;
      this.model.setFilter(btn.textContent.trim());
      this.view.updateFilter(this.model.get('activeFilter'));
      this._render();
    });

    /* Search */
    let debounce;
    document.getElementById('gallery-search')?.addEventListener('input', e => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        this.model.setSearch(e.target.value);
        this._render();
      }, 280);
    });

    /* Sort */
    document.getElementById('gallery-sort')?.addEventListener('change', e => {
      this.model.setSort(e.target.value);
      this._render();
    });
  }
  _render() { this.view.renderProducts(this.model.filtered); }
}

/* ─── CUSTOMISER CONTROLLER ─────────────────────── */
class CustomiserController extends BaseController {
  constructor() {
    super(new CustomiserModel(), new CustomiserView());
  }
  init() {
    this._refreshPricing();

    /* Accordion toggles */
    document.querySelectorAll('.acc-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const n = parseInt(hdr.closest('[data-acc]').dataset.acc);
        this.model.toggleAccordion(n);
        this.view.updateAccordion(n, this.model.get('accordions')[n]);
      });
    });

    /* Material select */
    document.getElementById('material-select')?.addEventListener('change', e => {
      this.model.setMaterial(e.target.value);
      this._refreshPricing();
      this._updateCanvasColor(e.target.value);
    });

    /* Finish select */
    document.getElementById('finish-select')?.addEventListener('change', e => {
      this.model.setFinish(e.target.value);
      this._refreshPricing();
    });

    /* Dimension inputs */
    ['width','height','depth'].forEach(dim => {
      document.getElementById(`dim-${dim}`)?.addEventListener('input', e => {
        this.model.setDimension(dim, e.target.value);
        this._refreshPricing();
        this._updateCanvasDimensions();
      });
    });

    /* Accessory sliders */
    document.querySelectorAll('.acc-slider').forEach(input => {
      this.view.updateSlider(input, parseInt(input.value) > 50);
      input.addEventListener('input', () => {
        const key = input.dataset.acc;
        const active = parseInt(input.value) > 50;
        this.model.set(key, active);
        this.view.updateSlider(input, active);
        this._refreshPricing();
      });
    });

    /* Action buttons */
    document.getElementById('btn-save-design')?.addEventListener('click', () => {
      Toast.show('Design saved to your profile!');
    });
    document.getElementById('btn-share-design')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(window.location.href);
      Toast.show('Design link copied to clipboard!', 'info');
    });
    document.getElementById('btn-add-to-cart-custom')?.addEventListener('click', () => {
      const pricing = this.model.pricing;
      window.Cart.addItem({
        id: `custom-${Date.now()}`,
        name: `Custom ${this.model.get('material')} Piece`,
        wood: this.model.get('material'),
        finish: this.model.get('finish'),
        qty: 1,
        price: pricing.total
      });
      Toast.show('Custom piece added to basket!');

      const btn      = document.getElementById('btn-add-to-cart-custom');
      const iconSlot = document.getElementById('custom-cart-icon');
      if (!btn) return;

      /* ── ADDED state ── */
      if (iconSlot) iconSlot.innerHTML = CartSVG.added('w-4 h-4 inline-block cart-bounce');
      const labelSpan = btn.querySelector('span:last-child');
      if (labelSpan) labelSpan.textContent = 'Added to Basket!';
      btn.classList.remove('bg-amber-800','hover:bg-amber-900');
      btn.classList.add('bg-green-700','hover:bg-green-800');

      setTimeout(() => {
        /* ── RESET ── */
        if (iconSlot) iconSlot.innerHTML = CartSVG.default('w-4 h-4 inline-block');
        if (labelSpan) labelSpan.textContent = 'Add to Basket';
        btn.classList.remove('bg-green-700','hover:bg-green-800');
        btn.classList.add('bg-amber-800','hover:bg-amber-900');
      }, 2200);
    });
  }
  _refreshPricing() {
    this.view.renderPricing(this.model.pricing);
  }
  _updateCanvasColor(material) {
    const colors = {
      'Solid Oak': '#d4a55a', 'Black Walnut': '#5a3a1a',
      'Maple': '#e8c890', 'Reclaimed Pine': '#c8a060',
      'Wrought Iron': '#484040', 'Brass': '#c8a020'
    };
    const canvas = document.getElementById('customiser-canvas');
    if (canvas) canvas.style.setProperty('--canvas-color', colors[material] || '#d4a55a');
  }
  _updateCanvasDimensions() {
    const w = this.model.get('width');
    const h = this.model.get('height');
    const d = this.model.get('depth');
    const el = document.getElementById('canvas-dims-label');
    if (el) el.textContent = `${w} × ${h} × ${d} cm`;
  }
}

/* ─── CONTACT CONTROLLER ────────────────────────── */
class ContactController extends BaseController {
  constructor() {
    super(new ContactModel(), new ContactView());
  }
  init() {
    /* Live field binding */
    ['name','email','phone','subject','message'].forEach(key => {
      const el = document.getElementById(`contact-${key}`);
      if (!el) return;
      el.addEventListener('input', e => {
        this.model.setField(key, e.target.value);
        if (Object.keys(this.model.get('errors')).length) this.view.clearErrors();
      });
    });

    /* File browse */
    document.getElementById('browse-btn')?.addEventListener('click', () => {
      const fi = document.getElementById('hidden-file-input');
      fi?.click();
    });
    document.getElementById('hidden-file-input')?.addEventListener('change', e => {
      const name = e.target.files[0]?.name || '';
      const label = document.getElementById('attachment-label');
      if (label) label.value = name;
      this.model.set('attachment', name);
    });

    /* Submit */
    document.getElementById('contact-submit-btn')?.addEventListener('click', async () => {
      this.view.clearErrors();
      this.view.setSubmitting(true);
      const ok = await this.model.submit();
      if (ok) {
        this.view.showSuccess();
        Toast.show('Message sent successfully!');
      } else {
        this.view.setSubmitting(false);
        this.view.showErrors(this.model.get('errors'));
      }
    });
  }
}

/* ─── NEWSLETTER CONTROLLER ─────────────────────── */
class NewsletterController extends BaseController {
  init() {
    document.getElementById('newsletter-btn')?.addEventListener('click', () => {
      const email = document.getElementById('newsletter-email')?.value || '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Toast.show('Please enter a valid email', 'error');
        return;
      }
      const btn = document.getElementById('newsletter-btn');
      if (btn) {
        btn.textContent = '✓ Subscribed!';
        btn.classList.add('bg-green-700');
        btn.disabled = true;
        Toast.show('Successfully subscribed to our newsletter!');
      }
    });
  }
}

/* ─── PROMOTIONS CONTROLLER ─────────────────────── */
class PromotionsController extends BaseController {
  constructor() {
    super(new PromotionsModel(), null);
  }
  init() {
    this._renderGrid();

    document.querySelector('.promo-filter-tabs')?.addEventListener('click', e => {
      const btn = e.target.closest('.promo-filter-tab');
      if (!btn) return;
      this.model.setFilter(btn.textContent.trim());
      this._updateFilterUI();
      this._renderGrid();
    });

    document.getElementById('promo-sort')?.addEventListener('change', e => {
      this.model.setSort(e.target.value);
      this._renderGrid();
    });

    document.getElementById('promo-grid')?.addEventListener('click', e => {
      const btn = e.target.closest('.promo-add-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      const product = this.model.get('products').find(p => p.id === id);
      if (product) {
        window.Cart.addItem({ id: product.id, name: product.name, wood: 'Default', finish: 'Default', qty: 1, price: product.price });
        Toast.show(`${product.name} added to cart!`);
      }
    });
  }
  _renderGrid() {
    const el = document.getElementById('promo-grid');
    if (!el) return;
    const products = this.model.filtered;
    const badgeColor = badge => ['Sale','Limited'].includes(badge) ? 'bg-red-600 text-white' : 'bg-amber-700 text-white';
    el.innerHTML = products.map((p, i) => `
      <div class="group bg-white border border-stone-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl
        transition-all duration-300 flex flex-col" data-reveal style="animation-delay:${i * 50}ms">
        <div class="relative h-40 overflow-hidden" style="background:${p.gradient}">
          ${p.badge ? `<span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${badgeColor(p.badge)}">${p.badge}</span>` : ''}
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="font-bold text-sm text-stone-800 mb-1 leading-snug">${p.name}</h3>
          <p class="text-xs text-stone-500 flex-1 leading-relaxed">${p.desc}</p>
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
            <span class="font-bold text-amber-700 text-sm">$${p.price.toLocaleString()}</span>
            <button class="promo-add-btn text-xs font-semibold border border-stone-200 hover:border-amber-600 hover:text-amber-800
              px-3 py-1.5 rounded-lg transition-colors text-stone-600" data-id="${p.id}">Add to Cart</button>
          </div>
        </div>
      </div>`).join('');
    ScrollReveal.init();
  }
  _updateFilterUI() {
    const active = this.model.get('activeFilter');
    document.querySelectorAll('.promo-filter-tab').forEach(btn => {
      const isActive = btn.textContent.trim() === active;
      btn.classList.toggle('bg-amber-800', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('border-amber-800', isActive);
      btn.classList.toggle('border-stone-200', !isActive);
      btn.classList.toggle('text-stone-600', !isActive);
    });
  }
}

/* ─── EXPORTS ───────────────────────────────────── */
Object.assign(window, {
  NavController, CartController, ProductController,
  GalleryController, CustomiserController,
  ContactController, NewsletterController, PromotionsController
});

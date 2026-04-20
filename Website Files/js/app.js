/* ═══════════════════════════════════════════════════
   WOODWORK WELDERS — MVC Core Framework
   app.js: EventBus · Router · BaseModel · BaseView · BaseController
═══════════════════════════════════════════════════ */

'use strict';

/* ─── EVENT BUS ─────────────────────────────────── */
const EventBus = (() => {
  const listeners = {};
  return {
    on(event, fn) {
      (listeners[event] = listeners[event] || []).push(fn);
      return () => this.off(event, fn);
    },
    off(event, fn) {
      listeners[event] = (listeners[event] || []).filter(f => f !== fn);
    },
    emit(event, data) {
      (listeners[event] || []).forEach(fn => fn(data));
    }
  };
})();

/* ─── BASE MODEL ────────────────────────────────── */
class BaseModel {
  constructor(data = {}) {
    this._data = { ...data };
    this._listeners = [];
  }
  get(key) { return key ? this._data[key] : { ...this._data }; }
  set(key, value) {
    const prev = this._data[key];
    this._data[key] = value;
    if (prev !== value) this._notify({ key, value, prev });
    return this;
  }
  update(obj) {
    Object.entries(obj).forEach(([k, v]) => this.set(k, v));
    return this;
  }
  onChange(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(f => f !== fn); };
  }
  _notify(change) {
    this._listeners.forEach(fn => fn(change));
    EventBus.emit(`model:change`, { model: this, ...change });
  }
}

/* ─── BASE VIEW ─────────────────────────────────── */
class BaseView {
  constructor(selector) {
    this.el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    this._bindings = [];
  }
  $(sel) { return this.el ? this.el.querySelector(sel) : null; }
  $$(sel) { return this.el ? [...this.el.querySelectorAll(sel)] : []; }
  on(el, event, fn) {
    const target = typeof el === 'string' ? this.$(el) : el;
    if (!target) return;
    target.addEventListener(event, fn);
    this._bindings.push({ target, event, fn });
  }
  delegate(event, sel, fn) {
    if (!this.el) return;
    const handler = e => {
      const match = e.target.closest(sel);
      if (match && this.el.contains(match)) fn(e, match);
    };
    this.el.addEventListener(event, handler);
    this._bindings.push({ target: this.el, event, fn: handler });
  }
  render(html) { if (this.el) this.el.innerHTML = html; }
  show() { this.el && this.el.classList.remove('hidden'); }
  hide() { this.el && this.el.classList.add('hidden'); }
  destroy() {
    this._bindings.forEach(({ target, event, fn }) =>
      target.removeEventListener(event, fn));
    this._bindings = [];
  }
}

/* ─── BASE CONTROLLER ───────────────────────────── */
class BaseController {
  constructor(model, view) {
    this.model = model;
    this.view  = view;
    this._unsubs = [];
  }
  subscribe(event, fn) {
    const unsub = EventBus.on(event, fn);
    this._unsubs.push(unsub);
    return unsub;
  }
  init() {}
  destroy() {
    this._unsubs.forEach(fn => fn());
    this.view && this.view.destroy();
  }
}

/* ─── CART MODEL (global singleton) ─────────────── */
class CartModel extends BaseModel {
  constructor() {
    super({ items: [], open: false });
  }
  addItem(product) {
    const items = [...this.get('items')];
    const idx = items.findIndex(i => i.id === product.id && i.wood === product.wood && i.finish === product.finish);
    if (idx > -1) {
      items[idx] = { ...items[idx], qty: items[idx].qty + product.qty };
    } else {
      items.push({ ...product });
    }
    this.set('items', items);
    EventBus.emit('cart:updated', { items });
    this.set('open', true);
  }
  removeItem(id) {
    this.set('items', this.get('items').filter(i => i.id !== id));
    EventBus.emit('cart:updated', { items: this.get('items') });
  }
  get total() {
    return this.get('items').reduce((s, i) => s + i.price * i.qty, 0);
  }
  get count() {
    return this.get('items').reduce((s, i) => s + i.qty, 0);
  }
}

/* ─── TOAST ─────────────────────────────────────── */
const Toast = {
  show(msg, type = 'success') {
    const t = document.createElement('div');
    const colors = { success: 'bg-amber-800', error: 'bg-red-700', info: 'bg-stone-700' };
    t.className = `fixed bottom-6 right-6 z-[9999] ${colors[type]} text-white text-sm font-semibold
      px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3
      translate-y-16 opacity-0 transition-all duration-300`;
    t.innerHTML = `<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 12 4 9"/></svg><span>${msg}</span>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => {
      t.classList.remove('translate-y-16','opacity-0');
    }); });
    setTimeout(() => {
      t.classList.add('translate-y-16','opacity-0');
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }
};

/* ─── CART SVG ANIMATIONS ───────────────────────── */
(function injectCartStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cart-bounce {
      0%   { transform: scale(1) translateY(0); }
      25%  { transform: scale(1.25) translateY(-4px); }
      50%  { transform: scale(0.95) translateY(0px); }
      70%  { transform: scale(1.1) translateY(-2px); }
      100% { transform: scale(1) translateY(0); }
    }
    @keyframes cart-shake {
      0%,100% { transform: translateX(0) rotate(0deg); }
      15%      { transform: translateX(-4px) rotate(-8deg); }
      35%      { transform: translateX(4px) rotate(8deg); }
      55%      { transform: translateX(-3px) rotate(-5deg); }
      75%      { transform: translateX(3px) rotate(5deg); }
    }
    @keyframes cart-pop {
      0%   { transform: scale(0.7); opacity: 0; }
      60%  { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .cart-bounce { animation: cart-bounce 0.55s cubic-bezier(.36,.07,.19,.97) both; }
    .cart-shake  { animation: cart-shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
    .cart-pop    { animation: cart-pop 0.35s ease-out both; }
  `;
  document.head.appendChild(style);
})();

/* ─── SCROLL REVEAL ─────────────────────────────── */
const ScrollReveal = {
  init() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('ww-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }
};

/* ─── EXPORTS (attach to window for multi-file use) */
Object.assign(window, {
  EventBus, BaseModel, BaseView, BaseController,
  CartModel, Toast, ScrollReveal
});

/* Global cart instance */
window.Cart = new CartModel();

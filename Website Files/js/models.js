/* ═══════════════════════════════════════════════════
   WOODWORK WELDERS — Models
   models.js: ProductModel · ContactModel · CustomiserModel · GalleryModel
═══════════════════════════════════════════════════ */

'use strict';

/* ─── PRODUCT MODEL ─────────────────────────────── */
class ProductModel extends BaseModel {
  constructor() {
    super({
      id: 'oak-dining-001',
      name: 'Handcrafted Rustic Oak Dining Table',
      category: 'Dining Room Furniture',
      price: 1299.99,
      description: `Experience the timeless elegance of our Handcrafted Rustic Oak Dining Table.
        Made from sustainably sourced solid oak, this table features a robust construction and
        a natural oil finish that highlights the unique grain patterns. Perfect for family
        gatherings and intimate dinners, it's a piece that will last for generations.`,
      woodOptions: ['Oak', 'Maple', 'Walnut'],
      finishOptions: ['Natural Oil', 'Dark Stain', 'Matte Black'],
      selectedWood: 'Oak',
      selectedFinish: 'Natural Oil',
      quantity: 1,
      activeThumb: 0,
      thumbGradients: [
        'linear-gradient(145deg,#e0c890,#b88840,#7a5020)',
        'linear-gradient(145deg,#c8a860,#9a7030,#6a4818)',
        'linear-gradient(145deg,#c8b890,#b09060,#886838)',
        'linear-gradient(145deg,#f0e8d0,#d0b880,#a08040)',
      ]
    });
  }
  incrementQty() { this.set('quantity', Math.max(1, this.get('quantity') + 1)); }
  decrementQty() { this.set('quantity', Math.max(1, this.get('quantity') - 1)); }
  selectWood(w)   { this.set('selectedWood', w); }
  selectFinish(f) { this.set('selectedFinish', f); }
  setActiveThumb(i) { this.set('activeThumb', i); }
  toCartItem() {
    return {
      id: this.get('id'),
      name: this.get('name'),
      wood: this.get('selectedWood'),
      finish: this.get('selectedFinish'),
      qty: this.get('quantity'),
      price: this.get('price')
    };
  }
}

/* ─── GALLERY MODEL ─────────────────────────────── */
class GalleryModel extends BaseModel {
  constructor() {
    super({
      activeFilter: 'All',
      searchQuery: '',
      sortBy: 'Newest',
      filters: ['All','Wood Type','Style','Finish','Material'],
      products: [
        { id:'g1', name:'Oak Dining Table',      category:'Wood Type', price:1250, badge:'',        gradient:'linear-gradient(160deg,#e8e0d0,#d0c0a0,#a08060)' },
        { id:'g2', name:'Steel Frame Bookshelf', category:'Style',     price: 890, badge:'New',      gradient:'linear-gradient(160deg,#2a2010,#5a4820,#9a8040)' },
        { id:'g3', name:'Maple Side Table',      category:'Wood Type', price: 450, badge:'Best',     gradient:'linear-gradient(160deg,#f0e8d0,#d8c090,#b09050)' },
        { id:'g4', name:'Walnut Shelf Unit',     category:'Finish',    price: 720, badge:'',        gradient:'linear-gradient(160deg,#5a4020,#8a6030,#c09050)' },
        { id:'g5', name:'Iron Gate Panel',       category:'Material',  price:1100, badge:'Custom',   gradient:'linear-gradient(160deg,#282018,#484030,#383028)' },
        { id:'g6', name:'Pine Farmhouse Table',  category:'Style',     price: 680, badge:'Sale',     gradient:'linear-gradient(160deg,#f0ead8,#c8a058,#906828)' },
        { id:'g7', name:'Brass Accent Chair',    category:'Material',  price: 995, badge:'Limited',  gradient:'linear-gradient(160deg,#a06030,#783818,#5a2808)' },
        { id:'g8', name:'Butcher Block Counter', category:'Finish',    price: 540, badge:'',        gradient:'linear-gradient(160deg,#f0e0b8,#d4b878,#b89038)' },
      ]
    });
  }
  setFilter(f)  { this.set('activeFilter', f); }
  setSearch(q)  { this.set('searchQuery', q); }
  setSort(s)    { this.set('sortBy', s); }
  get filtered() {
    let items = this.get('products');
    const f = this.get('activeFilter');
    const q = this.get('searchQuery').toLowerCase();
    const s = this.get('sortBy');
    if (f !== 'All') items = items.filter(p => p.category === f);
    if (q) items = items.filter(p => p.name.toLowerCase().includes(q));
    if (s === 'Price: Low to High') items = [...items].sort((a,b) => a.price - b.price);
    if (s === 'Price: High to Low') items = [...items].sort((a,b) => b.price - a.price);
    return items;
  }
}

/* ─── CUSTOMISER MODEL ──────────────────────────── */
class CustomiserModel extends BaseModel {
  static PRICES = {
    base: 250,
    materials: { 'Solid Oak':150,'Black Walnut':220,'Maple':180,'Reclaimed Pine':120,'Wrought Iron':200,'Brass':280 },
    finishes:  { 'Natural Oil Finish':30,'Dark Stain':45,'Matte Black':60,'Whitewash':35,'Raw / Unfinished':0 },
    accessories: { led: 85, engraving: 60, drawers: 120 },
    dimensionBase: 225,
  };
  constructor() {
    super({
      material: 'Solid Oak',
      finish: 'Natural Oil Finish',
      width: 120, height: 75, depth: 45,
      led: false, engraving: false, drawers: false,
      accordions: { 1:true, 2:true, 3:true, 4:true },
    });
  }
  toggleAccordion(n) {
    const a = { ...this.get('accordions') };
    a[n] = !a[n];
    this.set('accordions', a);
  }
  setMaterial(m)   { this.set('material', m); }
  setFinish(f)     { this.set('finish', f); }
  setDimension(k, v) { this.set(k, Math.max(0, parseInt(v)||0)); }
  toggleAccessory(k) { this.set(k, !this.get(k)); }
  get pricing() {
    const P = CustomiserModel.PRICES;
    const matCost  = P.materials[this.get('material')] || 0;
    const finCost  = P.finishes[this.get('finish')]    || 0;
    const accCost  = (this.get('led') ? P.accessories.led : 0)
                   + (this.get('engraving') ? P.accessories.engraving : 0)
                   + (this.get('drawers')   ? P.accessories.drawers   : 0);
    return {
      base:       P.base,
      material:   matCost,
      dimensions: P.dimensionBase,
      finish:     finCost,
      accessories: accCost,
      total:      P.base + matCost + P.dimensionBase + finCost + accCost
    };
  }
}

/* ─── CONTACT MODEL ─────────────────────────────── */
class ContactModel extends BaseModel {
  constructor() {
    super({
      name: '', email: '', phone: '', subject: '', message: '',
      attachment: null, submitting: false, submitted: false, errors: {}
    });
  }
  setField(key, value) { this.set(key, value); }
  validate() {
    const errors = {};
    const d = this._data;
    if (!d.name.trim())    errors.name    = 'Name is required';
    if (!d.email.trim())   errors.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errors.email = 'Invalid email';
    if (!d.message.trim()) errors.message = 'Message is required';
    this.set('errors', errors);
    return Object.keys(errors).length === 0;
  }
  async submit() {
    if (!this.validate()) return false;
    this.set('submitting', true);
    await new Promise(r => setTimeout(r, 1400));
    this.set('submitting', false);
    this.set('submitted', true);
    return true;
  }
}

/* ─── HERITAGE MODEL ────────────────────────────── */
class HeritageModel extends BaseModel {
  constructor() {
    super({
      product: {
        name: 'Artisan Walnut Coffee Table',
        description: `A handcrafted coffee table embodying timeless design and sustainable craftsmanship,
          meticulously built with responsibly sourced American Black Walnut. Each piece showcases unique
          grain patterns and exceptional joinery, designed to be a centrepiece for generations.`,
      },
      metadata: [
        { key:'Species',            value:'Black Walnut (Juglans nigra)' },
        { key:'Region',             value:'Appalachian Mountains, USA' },
        { key:'Certification',      value:'FSC Certified', badge:'Verified' },
        { key:'Harvest Date',       value:'October 2022' },
        { key:'Sustainability',     value:'A+' },
        { key:'Management Plan',    value:'Continuous Cover Forestry' },
      ],
      artisan: {
        name: 'Elias Vance',
        title: 'Master Woodworker & Founder',
        bio: `With over two decades of experience, Elias Vance brings passion and precision to every piece.
          His dedication to sustainable practices ensures that each creation tells a story of ethical artistry,
          blending traditional techniques with modern design principles.`,
        online: true,
      }
    });
  }
}

/* ─── PROMOTIONS MODEL ──────────────────────────── */
class PromotionsModel extends BaseModel {
  constructor() {
    super({
      activeFilter: 'All',
      sortBy: 'Newest',
      filters: ['All','Woodwork','Welding','Furniture','Decor','Custom Services'],
      products: [
        { id:'p1', name:'Hand-Turned Coffee Table', cat:'Woodwork',  price:680,  badge:'New',     gradient:'linear-gradient(145deg,#f0e8d8,#c8a860,#a07838)', desc:'Artisan oak with natural oil finish' },
        { id:'p2', name:'Steel Wall Sculpture',     cat:'Welding',   price:420,  badge:'',        gradient:'linear-gradient(145deg,#e8e8e8,#c0c0c0,#909090)', desc:'Precision welded decorative panel' },
        { id:'p3', name:'Floating Shelving System', cat:'Furniture', price:550,  badge:'Best',    gradient:'linear-gradient(145deg,#f0ead8,#c8a058,#906828)', desc:'Walnut veneer with steel brackets' },
        { id:'p4', name:'Reclaimed Pine Chair',     cat:'Woodwork',  price:340,  badge:'Sale',    gradient:'linear-gradient(145deg,#a06030,#783818,#5a2808)', desc:'Rustic pine with dark stain finish' },
        { id:'p5', name:'Forged Iron Gate',         cat:'Welding',   price:1200, badge:'Custom',  gradient:'linear-gradient(145deg,#282018,#484030,#383028)', desc:'Bespoke driveway gate with scroll work' },
        { id:'p6', name:'Butcher Block Island',     cat:'Furniture', price:890,  badge:'',        gradient:'linear-gradient(145deg,#f0e0b8,#d4b878,#b89038)', desc:'End-grain maple with satin finish' },
        { id:'p7', name:'Brass Pendant Lamp',       cat:'Decor',     price:285,  badge:'Limited', gradient:'linear-gradient(145deg,#e8d090,#c8a840,#a08020)', desc:'Hand-formed brass with Edison bulb' },
        { id:'p8', name:'Custom Welding Service',   cat:'Custom Services', price:150, badge:'',  gradient:'linear-gradient(145deg,#303030,#505050,#707060)', desc:'Per hour, minimum 4 hour booking' },
      ]
    });
  }
  setFilter(f) { this.set('activeFilter', f); }
  setSort(s)   { this.set('sortBy', s); }
  get filtered() {
    let items = this.get('products');
    const f = this.get('activeFilter');
    const s = this.get('sortBy');
    if (f !== 'All') items = items.filter(p => p.cat === f);
    if (s === 'Price: Low to High') items = [...items].sort((a,b) => a.price - b.price);
    if (s === 'Price: High to Low') items = [...items].sort((a,b) => b.price - a.price);
    return items;
  }
}

/* ─── EXPORTS ───────────────────────────────────── */
Object.assign(window, {
  ProductModel, GalleryModel, CustomiserModel,
  ContactModel, HeritageModel, PromotionsModel
});

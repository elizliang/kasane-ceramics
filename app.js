/* ============================================================
   STORE SETTINGS: edit these to make the site yours
   ============================================================ */
const STORE = {
  name: "KASANE",
  currency: "USD",
  freeShippingThreshold: 200,
  // Optional fixed payment link. It cannot receive exact cart contents or
  // service credit. Leave empty to keep checkout as a local simulation.
  checkoutUrl: "",
};

// Glaze colors used to draw each piece (and shown as swatches).
const GLAZES = {
  oatmeal:    { name: "Ivory ash",      color: "#e7dfcf", speck: "#8e8578" },
  terracotta: { name: "Oxide red",     color: "#a75843", speck: "#633f34" },
  seaglass:   { name: "Celadon",       color: "#a4b4a6", speck: "#647a6c" },
  sage:       { name: "Moss matte",    color: "#858d7c", speck: "#4c5549" },
  cream:      { name: "Porcelain",     color: "#f0eee8", speck: "#aaa395" },
  charcoal:   { name: "Iron black",    color: "#333735", speck: "#8a8072" },
  rose:       { name: "Rose ash",      color: "#bc9d92", speck: "#79655c" },
  honey:      { name: "Amber glaze",   color: "#af8960", speck: "#725941" },
  ink:        { name: "Indigo",        color: "#3d4d58", speck: "#8f9fa4" },
};

// Your products. `shape` is one of: mug, bowl, plate, vase, bottle, planter, pitcher.
// When you have real photos, add `image: "images/morning-mug.jpg"` to a product
// and it will be used instead of the illustration.
const PRODUCTS = [
  { id: "morning-mug", name: "Asa Tea Cup", category: "mugs", shape: "mug", glaze: "oatmeal", price: 78, stock: 14, badge: "Signature",
    size: "12 oz · 3.75\" tall", description: "A softly rounded cup with a generous handle. Ivory ash glaze settles into the turning lines, leaving the foot quietly exposed." },
  { id: "ember-mug", name: "Oxide Cup", category: "mugs", shape: "mug", glaze: "terracotta", price: 82, stock: 9,
    size: "12 oz · 3.75\" tall", description: "An everyday cup in deep oxide red. Its clear silhouette brings warmth to a considered table." },
  { id: "tide-mug", name: "Celadon Cup", category: "mugs", shape: "mug", glaze: "seaglass", price: 86, stock: 2,
    size: "14 oz · 4\" tall", description: "A taller form in translucent celadon, with subtle depth where the glaze gathers." },
  { id: "everyday-bowl", name: "Moss Rice Bowl", category: "bowls", shape: "bowl", glaze: "sage", price: 96, stock: 11, badge: "New form",
    size: "6\" wide · 2.75\" tall", description: "An open, balanced bowl with a soft moss surface. Designed to sit comfortably in two hands." },
  { id: "ramen-bowl", name: "Iron Noodle Bowl", category: "bowls", shape: "bowl", glaze: "charcoal", price: 138, stock: 6,
    size: "7.5\" wide · 3.5\" tall", description: "A deep bowl for noodles and broth. Iron black glaze reveals small variations in light." },
  { id: "serving-bowl", name: "Ivory Serving Bowl", category: "bowls", shape: "bowl", glaze: "cream", price: 220, stock: 3,
    size: "10\" wide · 4\" tall", description: "A generous centerpiece with a calm porcelain surface and a defined foot ring." },
  { id: "dinner-plate", name: "Ash Dinner Plate", category: "plates", shape: "plate", glaze: "oatmeal", price: 112, stock: 18,
    size: "10.5\" wide", description: "A wide plane and gently raised edge frame the meal without competing with it." },
  { id: "side-plate", name: "Indigo Side Plate", category: "plates", shape: "plate", glaze: "ink", price: 88, stock: 12, badge: "New form",
    size: "7.5\" wide", description: "A smaller plate in deep indigo, made for the first course or a quiet afternoon sweet." },
  { id: "bud-vase", name: "Rose Bud Vase", category: "vases", shape: "vase", glaze: "rose", price: 118, stock: 7,
    size: "5\" tall", description: "A compact form for a single stem, finished in a muted rose ash glaze." },
  { id: "bottle-vase", name: "Amber Bottle Vase", category: "vases", shape: "bottle", glaze: "honey", price: 245, stock: 0,
    size: "9\" tall", description: "An elongated neck and quiet shoulder create a sculptural presence with or without flowers." },
  { id: "little-planter", name: "Oxide Planter", category: "home", shape: "planter", glaze: "terracotta", price: 128, stock: 8,
    size: "4.5\" wide · includes saucer", description: "A restrained planter and matching saucer for a small living arrangement." },
  { id: "pour-pitcher", name: "Porcelain Pourer", category: "home", shape: "pitcher", glaze: "cream", price: 178, stock: 4,
    size: "32 oz · 7\" tall", description: "A clean pouring line, balanced handle, and softly luminous porcelain glaze." },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "mugs", label: "Cups" },
  { id: "bowls", label: "Bowls" },
  { id: "plates", label: "Plates" },
  { id: "vases", label: "Vases" },
  { id: "home", label: "Objects" },
];

const TILES = ["#e9e6dd", "#e5e0d5", "#e3e8e1", "#deded4", "#eae5de", "#e1e0da"];

/* ============================================================
   Helpers
   ============================================================ */
const $ = (sel, el = document) => el.querySelector(sel);
const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const money = n => new Intl.NumberFormat("en-US", {
  style: "currency", currency: STORE.currency,
  minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
}).format(n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tileFor = p => TILES[PRODUCTS.indexOf(p) % TILES.length];

/* ============================================================
   Pottery illustrations (hand-drawn style SVG)
   ============================================================ */
const CLAY = "#bca997";
let uid = 0;

function hash(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
function rng(seed) { let s = seed || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) + 0x6d2b79f5 >>> 0) % 10000) / 10000; }
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(v + amt * (amt < 0 ? v : 255 - v))));
  return "#" + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, "0")).join("");
}

const SHAPES = {
  mug: {
    body: "M58 62 H138 V140 Q138 164 114 164 H82 Q58 164 58 140 Z",
    behind: g => `<path d="M136 82 C172 80 172 134 136 132" fill="none" stroke="${g}" stroke-width="13" stroke-linecap="round"/>`,
    rim: [98, 62, 40, 7], dip: 146, ground: 166,
  },
  bowl: {
    body: "M28 92 Q28 148 78 161 Q100 166 122 161 Q172 148 172 92 Z",
    rim: [100, 92, 72, 15], dip: 146, ground: 166,
  },
  plate: {
    body: "M18 116 A82 30 0 0 0 182 116 A82 30 0 0 0 18 116 Z",
    behind: () => `<ellipse cx="100" cy="124" rx="80" ry="30" fill="${shade(CLAY, -.12)}"/>`,
    front: g => `<ellipse cx="100" cy="116" rx="54" ry="18" fill="${shade(g, -.07)}"/><ellipse cx="100" cy="117" rx="52" ry="16.5" fill="${shade(g, -.02)}"/>`,
    dip: 999, ground: 158,
  },
  vase: {
    body: "M88 50 H112 V62 Q112 74 124 86 Q146 108 142 136 Q138 164 100 164 Q62 164 58 136 Q54 108 76 86 Q88 74 88 62 Z",
    rim: [100, 50, 12, 3.5], dip: 146, ground: 166,
    front: () => `<path d="M100 52 C96 30 84 22 76 14" fill="none" stroke="#6f805f" stroke-width="2.4" stroke-linecap="round"/><path d="M100 52 C104 34 116 26 128 22" fill="none" stroke="#6f805f" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="74" cy="13" rx="6" ry="4.5" fill="#e9b8a2"/><ellipse cx="129" cy="21" rx="5" ry="4" fill="#f1d2a6"/><path d="M92 36 q-10 -4 -14 2 q8 4 14 -2z" fill="#8a9a74"/>`,
  },
  bottle: {
    body: "M91 24 H109 V58 Q109 70 123 80 Q140 92 140 120 V146 Q140 166 100 166 Q60 166 60 146 V120 Q60 92 77 80 Q91 70 91 58 Z",
    rim: [100, 24, 9, 2.8], dip: 152, ground: 168,
  },
  planter: {
    body: "M46 62 H154 V80 H146 L134 148 Q132 158 122 158 H78 Q68 158 66 148 L54 80 H46 Z",
    behind: () => `<g fill="#7d9468"><path d="M100 62 C84 40 70 34 58 36 C64 52 80 60 100 62Z"/><path d="M100 62 C116 38 132 30 146 32 C140 50 122 60 100 62Z"/><path d="M100 62 C94 36 100 20 108 12 C116 30 112 50 100 62Z" fill="#94aa7c"/></g>`,
    front: g => `<path d="M54 80 H146" stroke="${shade(g, -.18)}" stroke-width="2" opacity=".6"/><ellipse cx="100" cy="161" rx="48" ry="7" fill="${shade(CLAY, -.05)}"/>`,
    rim: [100, 62, 54, 6], rimFill: "#5b4130", dip: 128, ground: 168,
  },
  pitcher: {
    body: "M72 48 H124 L138 40 Q132 54 128 62 Q122 78 130 98 Q144 126 136 146 Q130 164 100 164 Q70 164 64 146 Q56 126 70 98 Q78 78 72 62 Z",
    behind: g => `<path d="M70 70 C36 72 38 128 64 130" fill="none" stroke="${g}" stroke-width="12" stroke-linecap="round"/>`,
    rim: [100, 48, 28, 5], dip: 148, ground: 166,
  },
};

function potSVG(p, { label = "" } = {}) {
  const shape = SHAPES[p.shape] || SHAPES.mug;
  const glaze = GLAZES[p.glaze] || GLAZES.oatmeal;
  const g = glaze.color;
  const id = `pc${++uid}`;
  const r = rng(hash(p.id));

  // Wavy glaze edge revealing raw clay at the foot.
  let drip = "";
  if (shape.dip < 999) {
    let d = `M0 ${shape.dip}`;
    for (let x = 0; x <= 200; x += 16) {
      const y = shape.dip + (r() - .35) * 12;
      d += ` Q${x + 8} ${y + (r() > .7 ? 9 : 0)} ${x + 16} ${shape.dip + (r() - .5) * 5}`;
    }
    drip = `<path d="${d} L200 200 L0 200 Z" fill="${CLAY}"/>`;
  }

  let specks = "";
  for (let i = 0; i < 46; i++) {
    specks += `<circle cx="${(20 + r() * 160).toFixed(1)}" cy="${(20 + r() * 150).toFixed(1)}" r="${(.5 + r() * 1.3).toFixed(2)}" fill="${glaze.speck}" opacity="${(.35 + r() * .45).toFixed(2)}"/>`;
  }

  const rim = shape.rim
    ? `<ellipse cx="${shape.rim[0]}" cy="${shape.rim[1]}" rx="${shape.rim[2]}" ry="${shape.rim[3]}" fill="${shade(g, -.1)}"/>
       <ellipse cx="${shape.rim[0]}" cy="${shape.rim[1] + .8}" rx="${shape.rim[2] - 3.5}" ry="${Math.max(1.2, shape.rim[3] - 2)}" fill="${shape.rimFill || shade(g, -.32)}"/>`
    : "";

  return `<svg viewBox="0 0 200 200" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>
    <defs><clipPath id="${id}"><path d="${shape.body}"/></clipPath>
      <linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient></defs>
    <ellipse cx="100" cy="${shape.ground}" rx="62" ry="7" fill="#3f2c20" opacity=".1"/>
    ${shape.behind ? shape.behind(g) : ""}
    <g clip-path="url(#${id})">
      <rect width="200" height="200" fill="${g}"/>
      ${specks}
      ${drip}
      <rect width="200" height="200" fill="url(#${id}s)"/>
    </g>
    ${rim}
    ${shape.front ? shape.front(g) : ""}
  </svg>`;
}

function mediaFor(p, label) {
  return p.image
    ? `<img src="${esc(p.image)}" alt="${esc(label || p.name)}" style="width:100%;height:100%;object-fit:cover">`
    : potSVG(p, { label });
}

/* ============================================================
   Cart state (saved in this browser)
   ============================================================ */
const CART_KEY = "storefront-cart-v1";
let cart = loadCart();
let applyCartHours = false;

function recordedServiceHours() {
  try {
    const saved = JSON.parse(localStorage.getItem(MEMBERSHIP_STORAGE_KEY)) || {};
    return MEMBERSHIP.shifts.reduce((total, shift) => total + (saved.shifts?.[shift.id] === "recorded" ? shift.hours : 0), 0);
  } catch { return 0; }
}
function cartEstimate() {
  const subtotal = cartTotal();
  const hours = recordedServiceHours();
  const credit = applyCartHours ? Math.min(subtotal, hours * MEMBERSHIP.hourlyCredit) : 0;
  return { subtotal, hours, credit, due: subtotal - credit };
}

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY)) || {};
    const clean = {};
    for (const [id, q] of Object.entries(raw)) {
      const p = byId[id];
      const qty = Math.min(Math.floor(Number(q)) || 0, p ? p.stock : 0);
      if (p && qty > 0) clean[id] = qty;
    }
    return clean;
  } catch { return {}; }
}
function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ } }

const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
const cartTotal = () => Object.entries(cart).reduce((sum, [id, q]) => sum + byId[id].price * q, 0);

function setQty(id, qty) {
  const p = byId[id];
  qty = Math.max(0, Math.min(qty, p.stock));
  if (qty === 0) delete cart[id]; else cart[id] = qty;
  saveCart();
  renderCart();
}
function addToCart(id, qty = 1) {
  const p = byId[id];
  const current = cart[id] || 0;
  if (current >= p.stock) { toast(`That's all the ${p.name}s we have right now`); return false; }
  setQty(id, current + qty);
  const badge = $("#cartCount");
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 250);
  toast(`Added ${p.name} to your cart`, { label: "View cart", action: openCart });
  return true;
}

/* ============================================================
   Rendering
   ============================================================ */
let activeCategory = "all";

function renderFilters() {
  $("#filters").innerHTML = CATEGORIES
    .filter(c => c.id === "all" || PRODUCTS.some(p => p.category === c.id))
    .map(c => `<button class="chip" data-cat="${c.id}" aria-pressed="${c.id === activeCategory}">${esc(c.label)}</button>`)
    .join("");
}

function badgeFor(p) {
  if (p.stock === 0) return `<span class="badge sold">Sold out</span>`;
  if (p.stock <= 3) return `<span class="badge low">Only ${p.stock} left</span>`;
  if (p.badge) return `<span class="badge">${esc(p.badge)}</span>`;
  return "";
}

function renderGrid() {
  const list = PRODUCTS.filter(p => activeCategory === "all" || p.category === activeCategory);
  $("#productGrid").innerHTML = list.length ? list.map(p => {
    const glaze = GLAZES[p.glaze];
    const sold = p.stock === 0;
    return `<article class="card">
      <button class="card-media" style="--tile:${tileFor(p)}" data-open="${p.id}" aria-label="View details for ${esc(p.name)}">
        ${badgeFor(p)}
        ${mediaFor(p)}
      </button>
      <div class="card-body">
        <div class="card-row">
          <h3><button data-open="${p.id}">${esc(p.name)}</button></h3>
          <span class="price">${money(p.price)}</span>
        </div>
        <p class="glaze"><span class="swatch" style="background:${glaze.color}"></span>${esc(glaze.name)}</p>
        <button class="btn btn-add" data-add="${p.id}" ${sold ? "disabled" : ""}>${sold ? "Sold out" : "Add to cart"}</button>
      </div>
    </article>`;
  }).join("") : `<p class="empty-state">Nothing here yet. New pieces are coming out of the kiln soon.</p>`;
}

function renderCart() {
  const count = cartCount();
  const countEl = $("#cartCount");
  countEl.textContent = count;
  countEl.classList.toggle("empty", count === 0);
  $("#cartOpen").setAttribute("aria-label", `Open cart, ${count} item${count === 1 ? "" : "s"}`);

  const total = cartTotal();
  const remaining = STORE.freeShippingThreshold - total;
  const pct = Math.min(100, (total / STORE.freeShippingThreshold) * 100);
  $("#shipProgress").innerHTML = (remaining > 0
    ? `You're <strong>${money(remaining)}</strong> away from free shipping`
    : `<strong>You've unlocked free shipping!</strong>`) + `<div class="bar"><span style="width:${pct}%"></span></div>`;

  const items = Object.entries(cart);
  $("#cartFoot").hidden = items.length === 0;
  $("#shipProgress").hidden = items.length === 0;
  $("#cartSubtotal").textContent = money(total);
  const estimate = cartEstimate();
  $("#cartApplyHours").disabled = estimate.hours === 0;
  $("#cartApplyHours").checked = applyCartHours && estimate.hours > 0;
  $("#cartHoursAvailable").textContent = estimate.hours ? `${estimate.hours} recorded hours available · ${money(estimate.hours * MEMBERSHIP.hourlyCredit)} sample credit` : "No recorded hours yet.";
  $("#cartCredit").textContent = `−${money(estimate.credit)}`;
  $("#cartAmountDue").textContent = money(estimate.due);
  $("#cartCheckoutMessage").textContent = "";
  $("#checkoutBtn").textContent = STORE.checkoutUrl ? "Checkout" : "Simulate checkout";

  $("#cartItems").innerHTML = items.length ? items.map(([id, q]) => {
    const p = byId[id];
    return `<div class="line-item">
      <div class="line-thumb" style="--tile:${tileFor(p)}">${mediaFor(p)}</div>
      <div>
        <h3>${esc(p.name)}</h3>
        <p class="glaze"><span class="swatch" style="background:${GLAZES[p.glaze].color}"></span>${esc(GLAZES[p.glaze].name)}</p>
        <div class="qty">
          <button data-dec="${id}" aria-label="Decrease quantity of ${esc(p.name)}">−</button>
          <output aria-label="Quantity">${q}</output>
          <button data-inc="${id}" aria-label="Increase quantity of ${esc(p.name)}" ${q >= p.stock ? "disabled" : ""}>+</button>
        </div>
      </div>
      <div class="line-right">
        <span class="price">${money(p.price * q)}</span>
        <button class="link-btn" data-remove="${id}">Remove</button>
      </div>
    </div>`;
  }).join("") : `<div class="cart-empty">
      ${potSVG({ id: "empty", shape: "bowl", glaze: "cream" })}
      <p>Your collection is waiting.</p>
      <a href="#shop" class="btn btn-ghost" data-close-cart>Browse the shop</a>
    </div>`;
}

function renderArt() {
  $("#heroArt").innerHTML = `
    <div class="shelf"></div>
    <div class="hero-pot p1">${potSVG({ id: "hero-a", shape: "bottle", glaze: "charcoal" })}</div>
    <div class="hero-pot p2">${potSVG({ id: "hero-b", shape: "bowl", glaze: "oatmeal" })}</div>
    <div class="hero-pot p3">${potSVG({ id: "hero-c", shape: "vase", glaze: "rose" })}</div>`;
  $("#aboutArt").innerHTML = `
    ${potSVG({ id: "about", shape: "pitcher", glaze: "cream" })}
    <div class="caption"><strong>A study in form</strong>Objects designed to be present in daily life.</div>`;
}

/* ============================================================
   Product modal
   ============================================================ */
const modal = $("#productModal");
let lastFocus = null;
let modalQty = 1;

function openProduct(id) {
  const p = byId[id];
  if (!p) return;
  const glaze = GLAZES[p.glaze];
  const sold = p.stock === 0;
  const inCart = cart[id] || 0;
  const available = p.stock - inCart;
  modalQty = 1;
  lastFocus = document.activeElement;

  $("#modalArt").style.setProperty("--tile", tileFor(p));
  $("#modalArt").innerHTML = mediaFor(p, `${p.name} in ${glaze.name}`);
  $("#modalInfo").innerHTML = `
    <div>
      <p class="eyebrow">${esc(CATEGORIES.find(c => c.id === p.category)?.label || "")}</p>
      <h2 id="modalTitle">${esc(p.name)}</h2>
    </div>
    <span class="price">${money(p.price)}</span>
    <p class="desc">${esc(p.description)}</p>
    <ul class="spec">
      <li><span>Glaze</span><span><span class="swatch" style="background:${glaze.color};display:inline-block;vertical-align:-2px;margin-right:6px"></span>${esc(glaze.name)}</span></li>
      <li><span>Size</span><span>${esc(p.size)}</span></li>
      <li><span>Availability</span><span>${sold ? "Sold out" : p.stock <= 3 ? `Only ${p.stock} left` : "Available"}</span></li>
    </ul>
    ${sold
      ? `<a class="btn btn-ghost" href="#contact" data-close-modal>Get notified when it's back</a>`
      : `<div class="buy-row">
          <div class="qty">
            <button data-mq="-1" aria-label="Decrease quantity">−</button>
            <output id="modalQty" aria-label="Quantity">1</output>
            <button data-mq="1" aria-label="Increase quantity" ${available <= 1 ? "disabled" : ""}>+</button>
          </div>
          <button class="btn btn-primary" id="modalAdd" ${available <= 0 ? "disabled" : ""}>${available <= 0 ? "All in your cart" : `Add to cart · ${money(p.price)}`}</button>
        </div>`}
    <p class="handmade-note">Each piece is handmade, so yours may vary slightly in size and glaze from the one pictured. That's part of the charm.</p>`;
  modal.dataset.id = id;
  modal.hidden = false;
  document.body.classList.add("locked");
  requestAnimationFrame(() => modal.classList.add("show"));
  $(".modal-card", modal).focus();
}

function updateModalQty(delta) {
  const p = byId[modal.dataset.id];
  const available = p.stock - (cart[p.id] || 0);
  modalQty = Math.max(1, Math.min(modalQty + delta, available));
  $("#modalQty").textContent = modalQty;
  $('[data-mq="-1"]', modal).disabled = modalQty <= 1;
  $('[data-mq="1"]', modal).disabled = modalQty >= available;
  $("#modalAdd").textContent = `Add to cart · ${money(p.price * modalQty)}`;
}

function closeProduct() {
  if (modal.hidden) return;
  modal.classList.remove("show");
  setTimeout(() => { modal.hidden = true; }, 250);
  if (!drawer.classList.contains("open")) document.body.classList.remove("locked");
  lastFocus?.focus?.();
}

/* ============================================================
   Cart drawer
   ============================================================ */
const drawer = $("#cartDrawer");
const overlay = $("#overlay");
let drawerReturnFocus = null;

function openCart() {
  closeProduct();
  renderCart();
  drawerReturnFocus = document.activeElement;
  overlay.hidden = false;
  requestAnimationFrame(() => { overlay.classList.add("show"); drawer.classList.add("open"); });
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  setTimeout(() => drawer.focus(), 50);
}
function closeCart() {
  if (!drawer.classList.contains("open")) return;
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
  setTimeout(() => { overlay.hidden = true; }, 300);
  document.body.classList.remove("locked");
  drawerReturnFocus?.focus?.();
}

/* ============================================================
   Toast
   ============================================================ */
let toastTimer;
function toast(msg, action) {
  const el = $("#toast");
  el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button>${esc(action.label)}</button>` : ""}`;
  if (action) $("button", el).addEventListener("click", () => { el.classList.remove("show"); action.action(); });
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

/* ============================================================
   Events
   ============================================================ */
document.addEventListener("click", e => {
  const t = e.target.closest("button, a");
  if (!t) return;
  const d = t.dataset;

  if (d.cat) {
    activeCategory = d.cat;
    renderFilters();
    renderGrid();
  } else if (d.open) {
    openProduct(d.open);
  } else if (d.add) {
    if (addToCart(d.add)) {
      t.classList.add("added");
      t.textContent = "Added ✓";
      setTimeout(() => { t.classList.remove("added"); t.textContent = "Add to cart"; }, 1400);
    }
  } else if (d.inc) {
    setQty(d.inc, (cart[d.inc] || 0) + 1);
  } else if (d.dec) {
    setQty(d.dec, (cart[d.dec] || 0) - 1);
  } else if (d.remove) {
    const name = byId[d.remove].name;
    setQty(d.remove, 0);
    toast(`Removed ${name}`);
  } else if (d.mq) {
    updateModalQty(Number(d.mq));
  } else if (t.id === "modalAdd") {
    const id = modal.dataset.id;
    if (addToCart(id, modalQty)) closeProduct();
  } else if (d.closeCart !== undefined) {
    closeCart();
  } else if (d.closeModal !== undefined) {
    closeProduct();
  }
});

$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
$("#modalClose").addEventListener("click", closeProduct);
modal.addEventListener("click", e => { if (e.target === modal) closeProduct(); });

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!modal.hidden) closeProduct();
  else closeCart();
  closeMenu();
});

$("#checkoutBtn").addEventListener("click", () => {
  if (cartCount() === 0) return;
  const { subtotal, hours, credit, due } = cartEstimate();
  if (STORE.checkoutUrl && !credit) {
    window.location.href = STORE.checkoutUrl;
  } else {
    const used = credit / MEMBERSHIP.hourlyCredit;
    const unused = Math.max(0, hours - used);
    $("#cartCheckoutMessage").textContent = `Sample checkout: ${money(subtotal)} − ${money(credit)} service credit = ${money(due)} before taxes and shipping. ${Number(used.toFixed(2))} hours applied; ${Number(unused.toFixed(2))} hours unused. No payment is made or hours deducted.${STORE.checkoutUrl && credit ? " The payment link cannot apply this credit." : ""}`;
  }
});
$("#cartApplyHours").addEventListener("change", event => { applyCartHours = event.target.checked; renderCart(); });
document.addEventListener("membership:updated", renderCart);

// Mobile menu
const nav = $("#nav");
const menuBtn = $("#menuToggle");
function closeMenu() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });

// Newsletter (front-end only. Connect to Mailchimp, ConvertKit, Buttondown, etc.)
$("#signupForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#email");
  const msg = $("#signupMsg");
  if (!input.checkValidity() || !input.value.trim()) {
    msg.textContent = "Please enter a valid email address.";
    input.focus();
    return;
  }
  msg.textContent = "Thanks for your interest. Newsletter signup will be available soon.";
  e.target.reset();
});

/* ============================================================
   Init
   ============================================================ */
document.querySelectorAll("[data-store-name]").forEach(el => { el.textContent = STORE.name; });
document.querySelectorAll("[data-free-ship]").forEach(el => { el.textContent = money(STORE.freeShippingThreshold); });
document.title = `${STORE.name} · Japanese Ceramics`;
$("#year").textContent = new Date().getFullYear();
renderArt();
renderFilters();
renderGrid();
renderCart();

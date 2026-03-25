// app.js — PUBLIC SITE (same Firebase logic, beautiful new UI)
import { db } from "./firebase.js";
import { collection, getDocs }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let allProducts = [];

// ── Toast helper ──────────────────────────────────────────────────
function showToast(msg, type = "info") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => { t.className = "toast"; }, 3000);
}

// ── Stock badge helper ────────────────────────────────────────────
function stockBadge(stock) {
  if (stock <= 0)  return `<span class="stock-badge out">Out of Stock</span>`;
  if (stock < 10)  return `<span class="stock-badge low">Low Stock</span>`;
  return `<span class="stock-badge in">In Stock</span>`;
}

// ── Render product cards ──────────────────────────────────────────
function displayProducts(products) {
  const container = document.getElementById("products");
  const countEl   = document.getElementById("productCount");

  if (products.length === 0) {
    countEl.textContent = "0 items";
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏗️</div>
        <p>No products found.</p>
      </div>`;
    return;
  }

  countEl.textContent = `${products.length} item${products.length !== 1 ? "s" : ""}`;

  container.innerHTML = products.map((p, i) => `
    <div class="card" style="animation-delay:${i * 0.05}s">
      <div class="card-img-wrap">
        <img src="${p.image || 'https://via.placeholder.com/300x200/1f1f1f/f97316?text=No+Image'}"
             alt="${p.name}"
             onerror="this.src='https://via.placeholder.com/300x200/1f1f1f/f97316?text=No+Image'">
        ${stockBadge(Number(p.stock))}
      </div>
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-meta">
          <div class="card-price">₹${p.price}<span> /unit</span></div>
          <div class="card-stock">📦 ${p.stock} left</div>
        </div>
        <button class="btn btn-whatsapp"
          onclick="orderNow('${p.name}', '${p.price}')">
          💬 Order on WhatsApp
        </button>
      </div>
    </div>
  `).join("");
}

// ── Load from Firebase (unchanged logic) ─────────────────────────
async function loadProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    allProducts = [];
    snapshot.forEach(doc => allProducts.push(doc.data()));
    displayProducts(allProducts);
  } catch (err) {
    console.error(err);
    document.getElementById("products").innerHTML =
      `<div class="empty-state"><p>Error loading products. Check Firebase config.</p></div>`;
    document.getElementById("productCount").textContent = "Error";
  }
}

// ── Search filter (unchanged logic) ──────────────────────────────
document.getElementById("search").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(val)
  );
  displayProducts(filtered);
});

// ── WhatsApp order (unchanged logic) ─────────────────────────────
window.orderNow = function(name, price) {
  const msg = `Hi! I want to order *${name}* (₹${price}/unit) from Builder's Store.`;
  window.open(`https://wa.me/91YOURNUMBER?text=${encodeURIComponent(msg)}`, "_blank");
};

// ── Init ──────────────────────────────────────────────────────────
loadProducts();
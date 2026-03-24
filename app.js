import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const container = document.getElementById("products");

async function loadProducts() {
  container.innerHTML = "Loading...";

  try {
    const snapshot = await getDocs(collection(db, "products"));

    container.innerHTML = "";

    snapshot.forEach(doc => {
      const p = doc.data();

      container.innerHTML += `
        <div class="card">
          <img src="${p.image}" width="100%">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
          <p>Stock: ${p.stock}</p>
          <button onclick="orderNow('${p.name}')">Order on WhatsApp</button>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "Error loading products";
  }
}

window.orderNow = function(name) {
  const msg = `I want to order ${name}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
};

loadProducts();
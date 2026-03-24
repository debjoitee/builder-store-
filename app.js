import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let allProducts = [];

async function loadProducts() {
    console.log("Fetching data...");

    const querySnapshot = await async function loadProducts() {
  const res = await fetch("/api/getProducts");
  const products = await res.json();

  console.log(products);

  // render products here
}

    console.log("Docs:", querySnapshot.docs.length);

    const container = document.getElementById("products");
    container.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const p = doc.data();
        console.log("Product:", p);

        container.innerHTML += `
            <div class="card">
                <img src="${p.image}" />
                <h3>${p.name}</h3>
                <p>₹${p.price}</p>
                <p>Stock: ${p.stock}</p>

                <a href="https://wa.me/91YOURNUMBER?text=I want ${p.name}" target="_blank">
                    <button>Order on WhatsApp</button>
                </a>
            </div>
        `;
    });
}

loadProducts();
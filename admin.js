// admin.js — same Firebase logic, beautiful new UI rendering
import { db, auth, storage } from "./firebase.js";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytesResumable, getDownloadURL }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Auth guard (unchanged logic) ─────────────────────────────────
onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Access denied. Please login.");
    window.location.href = "login.html";
  } else {
    loadAdminProducts();
  }
});

// ── Logout ────────────────────────────────────────────────────────
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

// ── Toast helper ──────────────────────────────────────────────────
function showToast(msg, type = "info") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => { t.className = "toast"; }, 3000);
}

// ── Add Product (unchanged logic) ─────────────────────────────────
window.addProduct = async function () {
  const name  = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);
  const stock = Number(document.getElementById("stock").value);
  const file  = document.getElementById("imageFile").files[0];

  if (!name || !price || !stock) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  if (!file) {
    showToast("Please select a product image.", "error");
    return;
  }

  // Show upload progress bar
  const progress = document.getElementById("uploadProgress");
  const bar      = document.getElementById("uploadBar");
  progress.style.display = "block";

  try {
    const storageRef  = ref(storage, "products/" + Date.now() + "_" + file.name);
    const uploadTask  = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      snap => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        bar.style.width = pct + "%";
      },
      err => {
        showToast("Upload failed: " + err.message, "error");
        progress.style.display = "none";
      },
      async () => {
        const imageURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "products"), { name, price, stock, image: imageURL });
        showToast("Product added successfully!", "success");

        // Reset form
        document.getElementById("name").value  = "";
        document.getElementById("price").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("imageFile").value = "";
        bar.style.width = "0%";
        progress.style.display = "none";

        loadAdminProducts();
      }
    );
  } catch (err) {
    showToast("Error: " + err.message, "error");
    progress.style.display = "none";
  }
};

// ── Load products (unchanged logic, new UI) ───────────────────────
async function loadAdminProducts() {
  const container = document.getElementById("adminProducts");
  container.innerHTML = `<div class="loading-state"><div class="spinner"></div><div>Loading...</div></div>`;

  const snapshot = await getDocs(collection(db, "products"));
  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = `<div class="empty-state"><p>No products yet. Add one from the form.</p></div>`;
    return;
  }

  snapshot.forEach((docSnap, i) => {
    const p  = docSnap.data();
    const id = docSnap.id;
    const row = document.createElement("div");
    row.className = "admin-product-row";
    row.style.animationDelay = `${i * 0.05}s`;
    row.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/56x56/1f1f1f/f97316?text=?'}"
           alt="${p.name}"
           onerror="this.src='https://via.placeholder.com/56x56/1f1f1f/f97316?text=?'">
      <div class="admin-product-info">
        <div class="admin-product-name">${p.name}</div>
        <div class="admin-product-meta">
          <strong>₹${p.price}</strong> &nbsp;·&nbsp; ${p.stock} units in stock
        </div>
      </div>
      <div class="admin-actions">
        <button class="btn-edit" onclick="editProduct('${id}', ${p.price}, ${p.stock})">Edit</button>
        <button class="btn-delete" onclick="deleteProduct('${id}', '${p.name}')">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });
}

// ── Delete product (unchanged logic) ──────────────────────────────
window.deleteProduct = async function (id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  await deleteDoc(doc(db, "products", id));
  showToast(`"${name}" deleted.`, "error");
  loadAdminProducts();
};

// ── Edit product (unchanged logic) ────────────────────────────────
window.editProduct = async function (id, oldPrice, oldStock) {
  const newPrice = prompt("Enter new price (₹):", oldPrice);
  const newStock = prompt("Enter new stock (units):", oldStock);
  if (newPrice !== null && newStock !== null) {
    await updateDoc(doc(db, "products", id), {
      price: Number(newPrice),
      stock: Number(newStock)
    });
    showToast("Product updated!", "success");
    loadAdminProducts();
  }
};

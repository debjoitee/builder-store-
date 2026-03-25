import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOK66hRh1s6U4P8xuuim9zup6tr7maaV8",
  authDomain: "builder-store-19a9f.firebaseapp.com",
  projectId: "builder-store-19a9f",
  storageBucket: "builder-store-19a9f.firebasestorage.app",
  messagingSenderId: "1004045770027",
  appId: "1:1004045770027:web:ba140763bda6ab007cf96e"
};

const app     = initializeApp(firebaseConfig);
const db      = getFirestore(app);
const auth    = getAuth(app);
const storage = getStorage(app);
// 🔹 Add Product with Image Upload
window.addProduct = async function () {

    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const stock = Number(document.getElementById("stock").value);
    const file = document.getElementById("imageFile").files[0];

    if (!file) {
        alert("Please select image!");
        return;
    }

    // Upload to Firebase Storage
    const storageRef = ref(storage, "products/" + file.name);

    await uploadBytes(storageRef, file);

    const imageURL = await getDownloadURL(storageRef);

    // Save to Firestore
    await addDoc(collection(db, "products"), {
        name,
        price,
        stock,
        image: imageURL
    });

    alert("Product Added with Image!");
    loadAdminProducts();
};

// 🔹 Load Products
async function loadAdminProducts() {
    const snapshot = await getDocs(collection(db, "products"));
    const container = document.getElementById("adminProducts");

    container.innerHTML = "";

    snapshot.forEach((docSnap) => {
        const p = docSnap.data();
        const id = docSnap.id;

        container.innerHTML += `
            <div style="border:1px solid black; padding:10px; margin:10px;">
                <img src="${p.image}" width="100"><br>
                <h3>${p.name}</h3>
                <p>₹${p.price}</p>
                <p>Stock: ${p.stock}</p>

                <button onclick="editProduct('${id}', ${p.price}, ${p.stock})">Edit</button>
                <button onclick="deleteProduct('${id}')">Delete</button>
            </div>
        `;
    });
}

// 🔹 Delete
window.deleteProduct = async function (id) {
    await deleteDoc(doc(db, "products", id));
    alert("Deleted!");
    loadAdminProducts();
};

// 🔹 Edit
window.editProduct = async function (id, oldPrice, oldStock) {
    const newPrice = prompt("New price:", oldPrice);
    const newStock = prompt("New stock:", oldStock);

    if (newPrice && newStock) {
        await updateDoc(doc(db, "products", id), {
            price: Number(newPrice),
            stock: Number(newStock)
        });

        alert("Updated!");
        loadAdminProducts();
    }
};

loadAdminProducts();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut }
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

    try {
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

        alert("Product Added successfully!");
        // Clear the form fields
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("imageFile").value = "";
        
        loadAdminProducts();
    } catch (error) {
        alert("Error adding product: " + error.message);
    }
};

// 🔹 Load Products
window.loadAdminProducts = async function() {
    const snapshot = await getDocs(collection(db, "products"));
    const container = document.getElementById("adminProducts");

    container.innerHTML = "";

    snapshot.forEach((docSnap) => {
        const p = docSnap.data();
        const id = docSnap.id;

        container.innerHTML += `
            <div style="border:1px solid black; padding:10px; margin:10px; display:inline-block; width: 200px;">
                <img src="${p.image}" width="100" style="display:block; margin:auto;"><br>
                <h3 style="text-align:center;">${p.name}</h3>
                <p><strong>Price:</strong> ₹${p.price}</p>
                <p><strong>Stock:</strong> ${p.stock}</p>
                <button onclick="editProduct('${id}', ${p.price}, ${p.stock})" style="width:45%; margin-right:5%;">Edit</button>
                <button onclick="deleteProduct('${id}')" style="width:45%;">Delete</button>
            </div>
        `;
    });
};

// 🔹 Delete
window.deleteProduct = async function (id) {
    if(confirm("Are you sure you want to delete this product?")) {
        try {
            await deleteDoc(doc(db, "products", id));
            alert("Product Deleted!");
            loadAdminProducts();
        } catch (error) {
            alert("Error deleting product: " + error.message);
        }
    }
};

// 🔹 Edit
window.editProduct = async function (id, oldPrice, oldStock) {
    const newPrice = prompt("Enter new price:", oldPrice);
    const newStock = prompt("Enter new stock level:", oldStock);

    if (newPrice !== null && newStock !== null) {
        try {
            await updateDoc(doc(db, "products", id), {
                price: Number(newPrice),
                stock: Number(newStock)
            });
            alert("Product Updated!");
            loadAdminProducts();
        } catch (error) {
            alert("Error updating product: " + error.message);
        }
    }
};

// 🔹 Secure Admin Login Check
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Logged in!
        console.log("Logged in successfully as:", user.email);
        loadAdminProducts(); 
    } else {
        // Not logged in! Show prompts to secure the page
        const email = prompt("Enter Admin Email:");
        const password = prompt("Enter Admin Password:");

        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert("Login Successful! You can now manage the store.");
                    loadAdminProducts(); // Load products immediately after login
                })
                .catch((error) => {
                    alert("Login Failed: " + error.message);
                    console.error("Auth Error:", error);
                });
        } else {
            alert("Login required to access the Admin panel.");
        }
    }
  // 🔹 Logout Function
  window.logout = async function() {
      if(confirm("Are you sure you want to log out?")) {
          try {
              await signOut(auth);
              alert("You have been successfully logged out.");
              window.location.reload(); 
          } catch (error) {
              alert("Error logging out: " + error.message);
          }
      }
  };
});

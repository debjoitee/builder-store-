import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOK66hRh1s6U4P8xuuim9zup6tr7maaV8",
  authDomain: "builder-store-19a9f.firebaseapp.com",
  projectId: "builder-store-19a9f",
  storageBucket: "builder-store-19a9f.firebasestorage.app",
  messagingSenderId: "1004045770027",
  appId: "1:1004045770027:web:ba140763bda6ab007cf96e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// const firebaseConfig = {
//   apiKey: "AIzaSyCOK66hRh1s6U4P8xuuim9zup6tr7maaV8",
//   authDomain: "builder-store-19a9f.firebaseapp.com",
//   projectId: "builder-store-19a9f",
//   storageBucket: "builder-store-19a9f.firebasestorage.app",
//   messagingSenderId: "1004045770027",
//   appId: "1:1004045770027:web:ba140763bda6ab007cf96e"
// };
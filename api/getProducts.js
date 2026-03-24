import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "builder-store-19a9f.firebaseapp.com",
  projectId: "builder-store-19a9f",
  storageBucket: "builder-store-19a9f.appspot.com",
  messagingSenderId: "1004045770027",
  appId: "1:1004045770027:web:xxxx"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  const snapshot = await getDocs(collection(db, "products"));

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.status(200).json(data);
}
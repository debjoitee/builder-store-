import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!global._firebaseApp) {
  global._firebaseApp = initializeApp({
    credential: cert({
      projectId: "builder-store-19a9f",
      clientEmail: "your-service-account-email",
      privateKey: "your-private-key".replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}npm init -y
npm install firebase-admin
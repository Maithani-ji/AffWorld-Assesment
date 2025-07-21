import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// ⚠️ REPLACE THESE VALUES WITH YOUR OWN FIREBASE CONFIG
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MSG_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE",
}


const app = initializeApp(firebaseConfig)

// ✅ Basic Firestore without offline caching (more stable)
export const db = getFirestore(app)

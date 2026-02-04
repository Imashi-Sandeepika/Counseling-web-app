import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnv7ruwXY28wLAitMHPHiQIQIPVrdDWf8",
    authDomain: "mentel-health-da97b.firebaseapp.com",
    projectId: "mentel-health-da97b",
    storageBucket: "mentel-health-da97b.firebasestorage.app",
    messagingSenderId: "759245451678",
    appId: "1:759245451678:web:86edf9246fd446e748a68f",
    measurementId: "G-2Q9MLYNG7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };

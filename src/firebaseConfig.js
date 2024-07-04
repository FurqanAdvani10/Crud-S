// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDlBUTQ6_g6ork5wKZyOMvjfpBrq38mi20",
    authDomain: "crud-6644a.firebaseapp.com",
    projectId: "crud-6644a",
    storageBucket: "crud-6644a.appspot.com",
    messagingSenderId: "307719011691",
    appId: "1:307719011691:web:243fb611ad8b352dee602e",
    measurementId: "G-45X8PW68S0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };

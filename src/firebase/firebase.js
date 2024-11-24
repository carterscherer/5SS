// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ_75kTUU1BSv0dCCgYaTnzFQEtAz293Q",
  authDomain: "fivess-d8683.firebaseapp.com",
  projectId: "fivess-d8683",
  storageBucket: "fivess-d8683.appspot.com",
  messagingSenderId: "558676785988",
  appId: "1:558676785988:web:21e085b31e85fba9fbf511",
  measurementId: "G-2CMH12ZYEW"
};

// Initialize Firebase
// const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

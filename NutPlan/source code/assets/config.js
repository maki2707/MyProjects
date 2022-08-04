// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6S1vh8GZesElZC0l8mgDo7DA1PQmBwMs",
  authDomain: "nutplan-5258e.firebaseapp.com",
  projectId: "nutplan-5258e",
  storageBucket: "nutplan-5258e.appspot.com",
  messagingSenderId: "673514617062",
  appId: "1:673514617062:web:ad6860e4a5dcf17bd92327",
  measurementId: "G-EENGSML0MY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = app.database();
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB6S1vh8GZesElZC0l8mgDo7DA1PQmBwMs",
  authDomain: "nutplan-5258e.firebaseapp.com",
  projectId: "nutplan-5258e",
  storageBucket: "nutplan-5258e.appspot.com",
  messagingSenderId: "673514617062",
  appId: "1:673514617062:web:ad6860e4a5dcf17bd92327",
  measurementId: "G-EENGSML0MY"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export {firebase};

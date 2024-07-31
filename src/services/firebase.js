// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import 'firebase/combat/firestore';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcqp6cmTsfpm6_S5kYfH6quX4ypdN-_f4",
  authDomain: "image-to-pdf-converter-51741.firebaseapp.com",
  projectId: "image-to-pdf-converter-51741",
  storageBucket: "image-to-pdf-converter-51741.appspot.com",
  messagingSenderId: "1065184988658",
  appId: "1:1065184988658:web:92cd10dfd495127778af6b"
};

// Initialize Firebase
// const firebaseApp = firebase.initialzeApp(firebaseConfig)

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, collection, getDocs, Timestamp, addDoc };
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, addDoc, Timestamp, doc, setDoc, deleteDoc } from "firebase/firestore";
import 'dotenv/config'

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
const db = getFirestore(app);
export { storage, db, uploadBytes, getDownloadURL, ref, collection, getDocs, Timestamp, addDoc, doc, setDoc, deleteDoc, deleteObject, getStorage };
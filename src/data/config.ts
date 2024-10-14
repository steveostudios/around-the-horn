import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzqZc0XrJpT02CHOhfGYsEPsi7TPIA0vs",
  authDomain: "around-the-horn-6cf7b.firebaseapp.com",
  projectId: "around-the-horn-6cf7b",
  storageBucket: "around-the-horn-6cf7b.appspot.com",
  messagingSenderId: "914238648437",
  appId: "1:914238648437:web:ff2175da9601c74ac8483c",
  measurementId: "G-W0J345ZC62",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const col = "684affab-2083-4d81-8b85-23dad6e2f40a";

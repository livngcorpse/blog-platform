// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDRv2nr_ZMgKEe2gj959Ad63X6hXtoovQ",
  authDomain: "blog-platform-42749.firebaseapp.com",
  projectId: "blog-platform-42749",
  storageBucket: "blog-platform-42749.firebasestorage.app",
  messagingSenderId: "377172609842",
  appId: "1:377172609842:web:90b12979c36de0821fe52b",
  measurementId: "G-09NS82TJL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
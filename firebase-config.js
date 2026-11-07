// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9QTNQpXmOjfPJ4VZ2-ti-v7x4wfvBUWI",
  authDomain: "simply-serials.firebaseapp.com",
  projectId: "simply-serials",
  storageBucket: "simply-serials.firebasestorage.app",
  messagingSenderId: "85310866918",
  appId: "1:85310866918:web:0f0fc4adacd475c6168227",
  measurementId: "G-F2LLNVJLWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

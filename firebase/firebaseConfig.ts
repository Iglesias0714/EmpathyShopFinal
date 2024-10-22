// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6qgptwHD8OeWn090ehS-t2r9dZQLUUiM",
  authDomain: "empathyshop-5749f.firebaseapp.com",
  projectId: "empathyshop-5749f",
  storageBucket: "empathyshop-5749f.appspot.com",
  messagingSenderId: "849308039313",
  appId: "1:849308039313:web:052138c02e5b833a27e730",
  measurementId: "G-HY5J8CH7XG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
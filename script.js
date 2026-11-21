// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2wlnF8xt0mg9xu0-5-MK3tFWNrnSnZ6s",
  authDomain: "islampur-high-school.firebaseapp.com",
  projectId: "islampur-high-school",
  storageBucket: "islampur-high-school.firebasestorage.app",
  messagingSenderId: "297154458391",
  appId: "1:297154458391:web:e61260601c332647f3bd52",
  measurementId: "G-0JN0NZ0LEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

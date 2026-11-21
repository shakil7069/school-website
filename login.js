
import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

function showMessage(text) {
  message.textContent = text;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists() &&
        ["admin", "teacher"].includes(snap.data().role) &&
        snap.data().active === true) {
      location.replace("dashboard.html");
    }
  } catch (error) {
    console.error(error);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  loginBtn.disabled = true;
  showMessage("লগইন হচ্ছে...");

  try {
    const credential = await signInWithEmailAndPassword(
      auth, email, password
    );

    const snap = await getDoc(
      doc(db, "users", credential.user.uid)
    );

    if (!snap.exists() ||
        !["admin", "teacher"].includes(snap.data().role) ||
        snap.data().active !== true) {

      await auth.signOut();
      showMessage("আপনার অ্যাকাউন্ট অনুমোদিত নয়।");
      return;
    }

    location.replace("dashboard.html");

  } catch (error) {
    console.error(error);
    showMessage("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
  } finally {
    loginBtn.disabled = false;
  }
});

document.getElementById("resetBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    showMessage("আগে আপনার ইমেইল লিখুন।");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showMessage("পাসওয়ার্ড রিসেটের নির্দেশনা ইমেইলে পাঠানো হয়েছে।");
  } catch (error) {
    showMessage("রিসেট করা যায়নি। ইমেইলটি পরীক্ষা করুন।");
  }
});

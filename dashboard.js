
import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const $ = id => document.getElementById(id);

let currentUser = null;
let currentRole = null;

function message(text) {
  $("statusMessage").textContent = text;
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[c]);
}

// Check authentication and role
onAuthStateChanged(auth, async user => {
  if (!user) {
    location.replace("login.html");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await signOut(auth);
      location.replace("login.html");
      return;
    }

    const profile = userSnap.data();

    if (
      !["admin", "teacher"].includes(profile.role) ||
      profile.active !== true
    ) {
      await signOut(auth);
      location.replace("login.html");
      return;
    }

    currentUser = user;
    currentRole = profile.role;

    $("userName").textContent =
      profile.name || user.displayName || "ব্যবহারকারী";

    $("userEmail").textContent = user.email;

    $("userRole").textContent =
      currentRole === "admin"
        ? "ভূমিকা: প্রধান অ্যাডমিন"
        : "ভূমিকা: শিক্ষক";

    if (currentRole === "admin") {
      $("adminTools").hidden = false;
      await loadUsers();
    }

    await loadNotices();

  } catch (error) {
    console.error(error);
    message("ডাটা লোড করা যায়নি। অনুমতি ও সংযোগ পরীক্ষা করুন।");
  }
});

// Submit notice
$("noticeForm").addEventListener("submit", async e => {
  e.preventDefault();

  if (!currentUser) return;

  const title = $("noticeTitle").value.trim();
  const description = $("noticeDescription").value.trim();

  if (!title || !description) return;

  try {
    await addDoc(collection(db, "notices"), {
      title,
      description,
      createdBy: currentUser.uid,
      published: currentRole === "admin",
      createdAt: serverTimestamp()
    });

    $("noticeForm").reset();

    message(
      currentRole === "admin"
        ? "নোটিশ প্রকাশ করা হয়েছে।"
        : "নোটিশ অ্যাডমিনের অনুমোদনের জন্য জমা হয়েছে।"
    );

    await loadNotices();

  } catch (error) {
    console.error(error);
    message("নোটিশ জমা দেওয়া যায়নি।");
  }
});

// Load notices
async function loadNotices() {
  const list = $("noticeList");

  const q = query(
    collection(db, "notices"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    list.innerHTML = '<p class="empty">এখনো কোনো নোটিশ নেই।</p>';
    return;
  }

  list.innerHTML = snapshot.docs.map(item => {
    const data = item.data();

    const controls = currentRole === "admin"
      ? `
        <button class="admin-btn"
          data-action="publish"
          data-id="${safeText(item.id)}"
          data-value="${data.published ? "false" : "true"}">
          ${data.published ? "প্রকাশ বন্ধ" : "প্রকাশ করুন"}
        </button>
        <button class="delete-btn"
          data-action="delete"
          data-id="${safeText(item.id)}">
          মুছে ফেলুন
        </button>
      `
      : `<small>অ্যাডমিনের অনুমোদনাধীন</small>`;

    return `
      <div class="admin-item">
        <h3>${safeText(data.title)}</h3>
        <p>${safeText(data.description)}</p>
        <p>অবস্থা: ${data.published ? "প্রকাশিত" : "অপ্রকাশিত"}</p>
        ${controls}
      </div>
    `;
  }).join("");
}

// Admin notice controls
$("noticeList").addEventListener("click", async e => {
  const button = e.target.closest("button[data-action]");

  if (!button || currentRole !== "admin") return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  try {
    const ref = doc(db, "notices", id);

    if (action === "publish") {
      await updateDoc(ref, {
        published: button.dataset.value === "true"
      });
    }

    if (action === "delete") {
      if (!confirm("নোটিশটি মুছে ফেলবেন?")) return;
      await deleteDoc(ref);
    }

    await loadNotices();

  } catch (error) {
    console.error(error);
    message("কাজটি সম্পন্ন হয়নি।");
  }
});

// Admin user list
async function loadUsers() {
  if (currentRole !== "admin") return;

  const snapshot = await getDocs(collection(db, "users"));

  $("userList").innerHTML = snapshot.docs.map(item => {
    const data = item.data();

    return `
      <div class="admin-item">
        <strong>${safeText(data.name || "নাম নেই")}</strong>
        <p>${safeText(data.email || "")}</p>
        <p>ভূমিকা: ${safeText(data.role)}</p>
        <p>অবস্থা: ${data.active ? "সক্রিয়" : "বন্ধ"}</p>
      </div>
    `;
  }).join("") || '<p class="empty">কোনো ব্যবহারকারী নেই।</p>';
}

// Logout
$("logoutBtn").addEventListener("click", async e => {
  e.preventDefault();

  try {
    await signOut(auth);
    location.replace("login.html");
  } catch (error) {
    message("লগআউট করা যায়নি।");
  }
});

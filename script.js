
// Mobile menu
function toggleMenu() {
  const nav = document.getElementById("navigation");

  if (nav) {
    nav.classList.toggle("show");
  }
}

// Data storage
const STORAGE_KEY = "islampur_school_data";

const defaultData = {
  teachers: [],
  notices: [],
  results: [],
  gallery: []
};

function getData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && typeof saved === "object") {
      return {
        teachers: Array.isArray(saved.teachers) ? saved.teachers : [],
        notices: Array.isArray(saved.notices) ? saved.notices : [],
        results: Array.isArray(saved.results) ? saved.results : [],
        gallery: Array.isArray(saved.gallery) ? saved.gallery : []
      };
    }
  } catch (error) {
    console.error("Data loading error:", error);
  }

  return { ...defaultData };
}

// Prevent HTML injection
function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function safeImageURL(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol)
      ? safeText(url.href)
      : "";
  } catch {
    return "";
  }
}

// Render teachers
function renderTeachers(data) {
  const list = document.getElementById("teacherList");
  if (!list) return;

  if (!data.teachers.length) {
    list.innerHTML = '<p class="empty">শিক্ষকদের তথ্য শীঘ্রই যুক্ত করা হবে।</p>';
    return;
  }

  list.innerHTML = data.teachers.map(teacher => {
    const image = safeImageURL(teacher.image);

    return `
      <article class="card">
        ${image ? `<img src="${image}" alt="শিক্ষকের ছবি">` : '<div class="emoji">👨‍🏫</div>'}
        <h3>${safeText(teacher.name)}</h3>
        <p>${safeText(teacher.designation)}</p>
      </article>
    `;
  }).join("");
}

// Render notices
function renderNotices(data) {
  const list = document.getElementById("noticeList");
  if (!list) return;

  if (!data.notices.length) {
    list.innerHTML = '<p class="empty">বর্তমানে কোনো নোটিশ নেই।</p>';
    return;
  }

  list.innerHTML = data.notices.map(notice => `
    <div class="notice-item">
      <h3>${safeText(notice.title)}</h3>
      <p>${safeText(notice.description)}</p>
      <small>${safeText(notice.date)}</small>
    </div>
  `).join("");
}

// Render results
function renderResults(data) {
  const list = document.getElementById("resultList");
  if (!list) return;

  if (!data.results.length) {
    list.innerHTML = '<p class="empty">ফলাফল শীঘ্রই প্রকাশ করা হবে।</p>';
    return;
  }

  list.innerHTML = data.results.map(result => `
    <article class="card">
      <div class="emoji">📊</div>
      <h3>${safeText(result.title)}</h3>
      <p>${safeText(result.description)}</p>
      ${safeText(result.date)}
    </article>
  `).join("");
}

// Render gallery
function renderGallery(data) {
  const list = document.getElementById("galleryList");
  if (!list) return;

  const images = data.gallery.filter(item => safeImageURL(item.url));

  if (!images.length) {
    list.innerHTML = '<p class="empty">ছবি শীঘ্রই যুক্ত করা হবে।</p>';
    return;
  }

  list.innerHTML = images.map(item => `
    <img
      src="${safeImageURL(item.url)}"
      alt="${safeText(item.title || "বিদ্যালয়ের ছবি")}"
      loading="lazy">
  `).join("");
}

// Start website
document.addEventListener("DOMContentLoaded", function() {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const data = getData();

  renderTeachers(data);
  renderNotices(data);
  renderResults(data);
  renderGallery(data);

  // Close mobile menu after clicking a link
  document.querySelectorAll("#navigation a").forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("navigation")?.classList.remove("show");
    });
  });
});

// Update page when admin changes data in another tab
window.addEventListener("storage", function(event) {
  if (event.key === STORAGE_KEY) {
    const data = getData();

    renderTeachers(data);
    renderNotices(data);
    renderResults(data);
    renderGallery(data);
  }
});

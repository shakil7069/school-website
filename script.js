
const KEY = "islampur_school_data";

const defaults = {
  notices: [],
  teachers: [],
  results: [],
  gallery: []
};

function getData() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return {
      ...defaults,
      ...(saved && typeof saved === "object" ? saved : {})
    };
  } catch {
    return { ...defaults };
  }
}

function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function validImage(url) {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

function toggleMenu() {
  document.getElementById("navigation")?.classList.toggle("show");
}

function renderHome() {
  const data = getData();

  const noticeList = document.getElementById("noticeList");
  const teacherList = document.getElementById("teacherList");
  const resultList = document.getElementById("resultList");
  const galleryList = document.getElementById("galleryList");

  if (noticeList) {
    noticeList.innerHTML = data.notices.length
      ? data.notices.map(n => `
        <div class="notice-item">
          <h3>📢 ${safe(n.title)}</h3>
          <p>${safe(n.text).replace(/\n/g, "<br>")}</p>
          <small>${safe(n.date)}</small>
        </div>
      `).join("")
      : '<p class="empty">বর্তমানে কোনো নোটিশ প্রকাশিত হয়নি।</p>';
  }

  if (teacherList) {
    teacherList.innerHTML = data.teachers.length
      ? data.teachers.map(t => `
        <article class="card">
          ${t.image && validImage(t.image)
            ? `<img src="${safe(t.image)}" alt="${safe(t.name)}" style="width:100%;height:180px;object-fit:cover;border-radius:8px">`
            : '<div class="emoji">👨‍🏫</div>'}
          <h3>${safe(t.name)}</h3>
          <p>${safe(t.subject)}</p>
        </article>
      `).join("")
      : '<p class="empty">শিক্ষকদের তথ্য শীঘ্রই প্রকাশ করা হবে।</p>';
  }

  if (resultList) {
    resultList.innerHTML = data.results.length
      ? data.results.map(r => `
        <article class="card">
          <div class="emoji">📊</div>
          <h3>${safe(r.title)}</h3>
          ${r.link && validImage(r.link)
            ? `<a class="btn" href="${safe(r.link)}" target="_blank" rel="noopener">ফলাফল দেখুন</a>`
            : "<p>ফলাফল সংক্রান্ত তথ্য</p>"}
        </article>
      `).join("")
      : '<p class="empty">ফলাফল এখনো প্রকাশিত হয়নি।</p>';
  }

  if (galleryList) {
    galleryList.innerHTML = data.gallery.length
      ? data.gallery.map(g => `
        <div>
          <img src="${safe(g.image)}" alt="${safe(g.caption)}" loading="lazy">
          <p>${safe(g.caption)}</p>
        </div>
      `).join("")
      : '<p class="empty">গ্যালারিতে এখনো ছবি যোগ করা হয়নি।</p>';
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

function renderAdmin() {
  const data = getData();

  const sections = [
    ["notices", "adminNotices", "title"],
    ["teachers", "adminTeachers", "name"],
    ["results", "adminResults", "title"],
    ["gallery", "adminGallery", "caption"]
  ];

  sections.forEach(([key, elementId, field]) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.innerHTML = data[key].map((item, index) => `
      <div class="admin-item">
        <strong>${safe(item[field] || "ছবি")}</strong>
        <br>
        <button class="delete-btn" data-delete="${key}" data-index="${index}">
          মুছে ফেলুন
        </button>
      </div>
    `).join("");
  });
}

function addItem(formId, collection, getItem) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const item = getItem();
    if (!item) return;

    const data = getData();
    data[collection].unshift(item);
    saveData(data);

    form.reset();
    renderAdmin();
    alert("সফলভাবে সংরক্ষণ করা হয়েছে।");
  });
}

if (document.body.dataset.page === "home") {
  renderHome();
  window.addEventListener("storage", renderHome);
}

if (document.body.dataset.page === "admin") {
  addItem("noticeForm", "notices", () => ({
    title: document.getElementById("noticeTitle").value.trim(),
    text: document.getElementById("noticeText").value.trim(),
    date: new Date().toLocaleDateString("bn-BD")
  }));

  addItem("teacherForm", "teachers", () => {
    const image = document.getElementById("teacherImage").value.trim();
    if (image && !validImage(image)) {
      alert("সঠিক ছবির URL দিন।");
      return null;
    }

    return {
      name: document.getElementById("teacherName").value.trim(),
      subject: document.getElementById("teacherSubject").value.trim(),
      image
    };
  });

  addItem("resultForm", "results", () => {
    const link = document.getElementById("resultLink").value.trim();
    if (link && !validImage(link)) {
      alert("সঠিক ফলাফলের URL দিন।");
      return null;
    }

    return {
      title: document.getElementById("resultTitle").value.trim(),
      link
    };
  });

  addItem("galleryForm", "gallery", () => {
    const image = document.getElementById("galleryImage").value.trim();
    if (!validImage(image)) {
      alert("সঠিক ছবির URL দিন।");
      return null;
    }

    return {
      image,
      caption: document.getElementById("galleryCaption").value.trim()
    };
  });

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;

    const { delete: collection, index } = button.dataset;
    if (!confirm("আপনি কি এটি মুছে ফেলতে চান?")) return;

    const data = getData();
    data[collection].splice(Number(index), 1);
    saveData(data);
    renderAdmin();
  });

  document.getElementById("resetData")?.addEventListener("click", () => {
    if (!confirm("সব নোটিশ, শিক্ষক, ফলাফল ও ছবি মুছে যাবে। নিশ্চিত?")) return;

    localStorage.removeItem(KEY);
    renderAdmin();
    alert("স্থানীয় তথ্য মুছে ফেলা হয়েছে।");
  });

  renderAdmin();
}

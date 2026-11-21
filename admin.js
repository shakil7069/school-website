
const STORAGE_KEY = "islampur_school_data";

function getData() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return {
      teachers: Array.isArray(data?.teachers) ? data.teachers : [],
      notices: Array.isArray(data?.notices) ? data.notices : [],
      results: Array.isArray(data?.results) ? data.results : [],
      gallery: Array.isArray(data?.gallery) ? data.gallery : []
    };
  } catch {
    return {
      teachers: [],
      notices: [],
      results: [],
      gallery: []
    };
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function validURL(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function showMessage(message) {
  alert(message);
}

// Display all admin data
function renderAdmin() {
  const data = getData();

  document.getElementById("adminTeachers").innerHTML =
    data.teachers.map((item, index) => `
      <div class="admin-item">
        <strong>${escapeHTML(item.name)}</strong>
        <p>${escapeHTML(item.designation)}</p>
        <button class="delete-btn"
          data-type="teachers" data-index="${index}">
          মুছে ফেলুন
        </button>
      </div>
    `).join("") || '<p class="empty">কোনো শিক্ষক যুক্ত করা হয়নি।</p>';

  document.getElementById("adminNotices").innerHTML =
    data.notices.map((item, index) => `
      <div class="admin-item">
        <strong>${escapeHTML(item.title)}</strong>
        <p>${escapeHTML(item.description)}</p>
        <small>${escapeHTML(item.date)}</small>
        <br>
        <button class="delete-btn"
          data-type="notices" data-index="${index}">
          মুছে ফেলুন
        </button>
      </div>
    `).join("") || '<p class="empty">কোনো নোটিশ নেই।</p>';

  document.getElementById("adminResults").innerHTML =
    data.results.map((item, index) => `
      <div class="admin-item">
        <strong>${escapeHTML(item.title)}</strong>
        <p>${escapeHTML(item.description)}</p>
        <small>${escapeHTML(item.date)}</small>
        <br>
        <button class="delete-btn"
          data-type="results" data-index="${index}">
          মুছে ফেলুন
        </button>
      </div>
    `).join("") || '<p class="empty">কোনো ফলাফল নেই।</p>';

  document.getElementById("adminGallery").innerHTML =
    data.gallery.map((item, index) => `
      <div class="admin-item">
        <strong>${escapeHTML(item.title)}</strong>
        <p>${escapeHTML(item.url)}</p>
        <button class="delete-btn"
          data-type="gallery" data-index="${index}">
          মুছে ফেলুন
        </button>
      </div>
    `).join("") || '<p class="empty">কোনো ছবি নেই।</p>';
}

// Add teacher
document.getElementById("teacherForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const data = getData();

  const image = document.getElementById("teacherImage").value.trim();

  if (image && !validURL(image)) {
    showMessage("সঠিক ছবির URL দিন।");
    return;
  }

  data.teachers.push({
    name: document.getElementById("teacherName").value.trim(),
    designation: document.getElementById("teacherDesignation").value.trim(),
    image: image
  });

  saveData(data);
  this.reset();
  renderAdmin();

  showMessage("শিক্ষকের তথ্য যুক্ত হয়েছে।");
});

// Add notice
document.getElementById("noticeForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const data = getData();

  data.notices.push({
    title: document.getElementById("noticeTitle").value.trim(),
    description: document.getElementById("noticeDescription").value.trim(),
    date: document.getElementById("noticeDate").value
  });

  saveData(data);
  this.reset();
  renderAdmin();

  showMessage("নোটিশ প্রকাশ করা হয়েছে।");
});

// Add result
document.getElementById("resultForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const data = getData();

  data.results.push({
    title: document.getElementById("resultTitle").value.trim(),
    description: document.getElementById("resultDescription").value.trim(),
    date: document.getElementById("resultDate").value
  });

  saveData(data);
  this.reset();
  renderAdmin();

  showMessage("ফলাফল যুক্ত হয়েছে।");
});

// Add gallery image
document.getElementById("galleryForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const data = getData();
  const url = document.getElementById("galleryURL").value.trim();

  if (!validURL(url)) {
    showMessage("সঠিক ছবির URL দিন।");
    return;
  }

  data.gallery.push({
    title: document.getElementById("galleryTitle").value.trim(),
    url: url
  });

  saveData(data);
  this.reset();
  renderAdmin();

  showMessage("গ্যালারিতে ছবি যুক্ত হয়েছে।");
});

// Delete individual items
document.addEventListener("click", function(e) {
  const button = e.target.closest(".delete-btn");

  if (!button) return;

  const type = button.dataset.type;
  const index = Number(button.dataset.index);

  const data = getData();

  if (!Array.isArray(data[type]) || !Number.isInteger(index)) return;

  if (index < 0 || index >= data[type].length) return;

  if (confirm("আপনি কি নিশ্চিতভাবে মুছে ফেলতে চান?")) {
    data[type].splice(index, 1);
    saveData(data);
    renderAdmin();

    showMessage("তথ্য মুছে ফেলা হয়েছে।");
  }
});

// Clear all data
document.getElementById("clearData").addEventListener("click", function() {
  if (confirm("সতর্কতা! সব শিক্ষক, নোটিশ, ফলাফল ও গ্যালারির তথ্য মুছে যাবে। আপনি কি নিশ্চিত?")) {
    localStorage.removeItem(STORAGE_KEY);
    renderAdmin();

    showMessage("সব ডাটা মুছে ফেলা হয়েছে।");
  }
});

// Initial load
document.addEventListener("DOMContentLoaded", renderAdmin);

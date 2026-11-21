const isLoggedIn = sessionStorage.getItem("adminLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}

const userName = document.getElementById("userName");
const userRole = document.getElementById("userRole");
const userEmail = document.getElementById("userEmail");
const statusMessage = document.getElementById("statusMessage");

if (userName) {
    userName.textContent = "অ্যাডমিন";
}

if (userRole) {
    userRole.textContent = "ভূমিকা: প্রধান অ্যাডমিন";
}

if (userEmail) {
    userEmail.textContent = "User ID: admin";
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();

        sessionStorage.removeItem("adminLoggedIn");

        window.location.href = "login.html";
    });
}

const noticeForm = document.getElementById("noticeForm");
const noticeTitle = document.getElementById("noticeTitle");
const noticeDescription = document.getElementById("noticeDescription");
const noticeList = document.getElementById("noticeList");

function getNotices() {
    const savedNotices = localStorage.getItem("schoolNotices");

    if (!savedNotices) {
        return [];
    }

    try {
        return JSON.parse(savedNotices);
    } catch (error) {
        return [];
    }
}

function saveNotices(notices) {
    localStorage.setItem(
        "schoolNotices",
        JSON.stringify(notices)
    );
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function displayNotices() {

    if (!noticeList) {
        return;
    }

    const notices = getNotices();

    noticeList.innerHTML = "";

    if (notices.length === 0) {

        noticeList.innerHTML = `
            <div class="notice">
                <p>এখনো কোনো নোটিশ প্রকাশ করা হয়নি।</p>
            </div>
        `;

        return;
    }

    notices.forEach(function (notice, index) {

        const noticeBox = document.createElement("div");

        noticeBox.className = "notice";

        noticeBox.innerHTML = `
            <h3>
                📢 ${escapeHTML(notice.title)}
            </h3>

            <p>
                ${escapeHTML(notice.description)}
            </p>

            <small>
                প্রকাশের তারিখ: ${escapeHTML(notice.date)}
            </small>

            <br><br>

            <button
                type="button"
                class="delete-notice"
                data-index="${index}">
                🗑️ নোটিশ মুছুন
            </button>
        `;

        noticeList.appendChild(noticeBox);
    });

    const deleteButtons =
        document.querySelectorAll(".delete-notice");

    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const index =
                Number(button.dataset.index);

            const confirmDelete = confirm(
                "আপনি কি এই নোটিশটি মুছে ফেলতে চান?"
            );

            if (!confirmDelete) {
                return;
            }

            const notices = getNotices();

            notices.splice(index, 1);

            saveNotices(notices);

            displayNotices();

            if (statusMessage) {
                statusMessage.textContent =
                    "নোটিশ সফলভাবে মুছে ফেলা হয়েছে।";
            }
        });
    });
}

if (noticeForm) {

    noticeForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const title =
                noticeTitle.value.trim();

            const description =
                noticeDescription.value.trim();

            if (!title || !description) {

                alert(
                    "নোটিশের শিরোনাম এবং বিস্তারিত লিখুন।"
                );

                return;
            }

            const notices = getNotices();

            const now = new Date();

            const date =
                now.toLocaleDateString(
                    "bn-BD",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );

            const newNotice = {
                title: title,
                description: description,
                date: date
            };

            notices.unshift(newNotice);

            saveNotices(notices);

            noticeForm.reset();

            displayNotices();

            if (statusMessage) {
                statusMessage.textContent =
                    "✅ নোটিশ সফলভাবে প্রকাশ করা হয়েছে।";
            }
        }
    );
}

displayNotices();

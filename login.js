// ===== ADMIN LOGIN =====

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "123456";

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const userId = document.getElementById("userId").value.trim();
        const password = document.getElementById("password").value;

        if (userId === ADMIN_USER && password === ADMIN_PASSWORD) {

            // Login successful
            sessionStorage.setItem("adminLoggedIn", "true");

            window.location.href = "dashboard.html";

        } else {

            document.getElementById("loginMessage").textContent =
                "User ID অথবা Password ভুল।";

        }
    });
}

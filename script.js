
const authForm = document.getElementById("authForm");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const switchBtn = document.getElementById("switchBtn");
const switchText = document.getElementById("switchText");
const message = document.getElementById("message");

let isSignup = false;

switchBtn.addEventListener("click", function(e) {
    e.preventDefault();

    isSignup = !isSignup;
    authForm.reset();
    message.textContent = "";

    if (isSignup) {
        formTitle.textContent = "Create Account";
        formSubtitle.textContent = "Join Us Today!";
        nameInput.hidden = false;
        nameInput.required = true;
        submitBtn.textContent = "Sign Up";
        switchText.textContent = "Already have an account?";
        switchBtn.textContent = "Login";
    } else {
        formTitle.textContent = "Login";
        formSubtitle.textContent = "Welcome Back!";
        nameInput.hidden = true;
        nameInput.required = false;
        submitBtn.textContent = "Login";
        switchText.textContent = "Don't have an account?";
        switchBtn.textContent = "Sign Up";
    }
});

document.getElementById("togglePassword")
.addEventListener("click", function() {
    const show = passwordInput.type === "password";
    passwordInput.type = show ? "text" : "password";
    this.textContent = show ? "Hide" : "Show";
});

authForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (password.length < 6) {
        message.style.color = "red";
        message.textContent = "Password must be at least 6 characters!";
        return;
    }

    message.style.color = "green";

    if (isSignup) {
        message.textContent = "Signup demo successful! Connect a secure backend to create your account.";
    } else {
        message.textContent = "Login demo only. Connect a secure backend to authenticate.";
    }
});

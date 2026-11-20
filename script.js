
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", function() {
    navMenu.classList.toggle("active");

    menuBtn.textContent =
        navMenu.classList.contains("active") ? "✕" : "☰";
});

// Close mobile menu after clicking a link
document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", function() {
        navMenu.classList.remove("active");
        menuBtn.textContent = "☰";
    });
});

// Contact form demo
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    document.getElementById("formMessage").textContent =
        "Thank you! Your message is ready.";

    contactForm.reset();
});

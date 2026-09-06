/* =========================================================
   JASMINE FLORA PORTFOLIO - JAVASCRIPT
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (navMenu.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
            menuToggle.setAttribute("aria-label", "Close menu");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
            menuToggle.setAttribute("aria-label", "Open menu");
        }
    });

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

            menuToggle.setAttribute("aria-label", "Open menu");
        });
    });
}


/* =========================================================
   DARK / LIGHT MODE
========================================================= */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        const isLight =
            document.body.classList.contains("light-mode");

        if (isLight) {
            themeToggle.innerHTML =
                '<i class="fas fa-sun"></i>';

            localStorage.setItem(
                "portfolio-theme",
                "light"
            );
        } else {
            themeToggle.innerHTML =
                '<i class="fas fa-moon"></i>';

            localStorage.setItem(
                "portfolio-theme",
                "dark"
            );
        }
    });
}


/* =========================================================
   SCROLL REVEAL
========================================================= */

/*
   IMPORTANT:
   Show all content immediately.
   This prevents the portfolio from becoming blank
   if the animation fails.
*/

const revealElements =
    document.querySelectorAll(".reveal");

revealElements.forEach((element) => {
    element.classList.add("active");
});


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

const navbar =
    document.querySelector(".navbar");

function updateNavbar() {
    if (!navbar) return;

    if (window.scrollY > 30) {
        navbar.style.boxShadow =
            "0 8px 30px rgba(0, 0, 0, 0.18)";
    } else {
        navbar.style.boxShadow = "none";
    }
}

window.addEventListener(
    "scroll",
    updateNavbar
);

updateNavbar();


/* =========================================================
   ACTIVE NAVIGATION LINK
========================================================= */

const sections =
    document.querySelectorAll("main section[id]");

const navigationLinks =
    document.querySelectorAll("nav a");

function updateActiveLink() {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop =
            section.offsetTop - 160;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
                sectionTop + sectionHeight
        ) {
            currentSection =
                section.getAttribute("id");
        }
    });

    navigationLinks.forEach((link) => {
        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {
            link.classList.add("active");
        }
    });
}

window.addEventListener(
    "scroll",
    updateActiveLink
);

updateActiveLink();


/* =========================================================
   PROFILE IMAGE CHECK
========================================================= */

const profileImage =
    document.querySelector(".profile-image");

if (profileImage) {
    profileImage.addEventListener(
        "error",
        () => {
            console.error(
                "Profile image not found. Make sure profile.jpeg is in the same folder as index.html."
            );
        }
    );
}
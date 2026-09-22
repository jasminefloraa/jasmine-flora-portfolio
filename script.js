/* =========================================================
   JASMINE FLORA PORTFOLIO
   INTERACTIONS + THEME + PREMIUM SCROLL ANIMATIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const navbar = document.getElementById("navbar");
    const themeToggle = document.getElementById("themeToggle");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const revealElements = document.querySelectorAll(".reveal");

    /* Tell CSS that JavaScript is available */
    body.classList.add("js-ready");


    /* =========================================================
       THEME TOGGLE
       ========================================================= */

    if (themeToggle) {

        const themeIcon = themeToggle.querySelector("i");

        function setTheme(theme) {

            if (theme === "dark") {

                body.classList.add("dark-theme");

                if (themeIcon) {
                    themeIcon.classList.remove("fa-moon");
                    themeIcon.classList.add("fa-sun");
                }

                themeToggle.setAttribute(
                    "aria-label",
                    "Switch to light mode"
                );

                themeToggle.setAttribute(
                    "title",
                    "Switch to light mode"
                );

                localStorage.setItem("theme", "dark");

            } else {

                body.classList.remove("dark-theme");

                if (themeIcon) {
                    themeIcon.classList.remove("fa-sun");
                    themeIcon.classList.add("fa-moon");
                }

                themeToggle.setAttribute(
                    "aria-label",
                    "Switch to dark mode"
                );

                themeToggle.setAttribute(
                    "title",
                    "Switch to dark mode"
                );

                localStorage.setItem("theme", "light");
            }
        }


        /* Load saved theme */

        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            setTheme("dark");
        } else {
            setTheme("light");
        }


        /* Change theme when button is clicked */

        themeToggle.addEventListener("click", () => {

            const isDark =
                body.classList.contains("dark-theme");

            setTheme(isDark ? "light" : "dark");

        });

    }


    /* =========================================================
       MOBILE MENU
       ========================================================= */

    function closeMenu() {

        if (!navMenu) return;

        navMenu.classList.remove("open");

        body.classList.remove("no-scroll");


        if (menuToggle) {

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            const icon =
                menuToggle.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");

            }
        }
    }


    function openMenu() {

        if (!navMenu) return;

        navMenu.classList.add("open");

        body.classList.add("no-scroll");


        if (menuToggle) {

            menuToggle.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

            const icon =
                menuToggle.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-bars");

                icon.classList.add("fa-xmark");

            }
        }
    }


    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                navMenu.classList.contains("open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });

    }


    /* =========================================================
       SMOOTH NAVIGATION
       ========================================================= */

    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                !targetId.startsWith("#")
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);

            if (!target) return;


            event.preventDefault();

            closeMenu();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            history.replaceState(
                null,
                "",
                targetId
            );

        });

    });


    /* =========================================================
       NAVBAR SCROLL EFFECT
       ========================================================= */

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 20) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }
    }


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );


    /* =========================================================
       PREMIUM SECTION REVEAL
       ========================================================= */

    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "-8% 0px -12% 0px"
            }
        );


    sections.forEach(section => {

        sectionObserver.observe(section);

    });


    /* =========================================================
       ELEMENT REVEAL
       ========================================================= */

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "active"
                        );


                        /*
                         * Stop observing once the
                         * animation has happened.
                         */

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.10,

                rootMargin:
                    "0px 0px -60px 0px"
            }
        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });


    /* =========================================================
       HERO ANIMATION
       ========================================================= */

    const heroReveal =
        document.querySelector(
            "#home .reveal"
        );


    if (heroReveal) {

        setTimeout(() => {

            heroReveal.classList.add("active");

        }, 120);

    }


    /* =========================================================
       ACTIVE NAVIGATION LINK
       ========================================================= */

    const activeSectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const id =
                        entry.target.getAttribute(
                            "id"
                        );


                    navLinks.forEach(link => {

                        link.classList.toggle(
                            "active",

                            link.getAttribute("href")
                                === `#${id}`
                        );

                    });

                });

            },
            {
                threshold: 0.35,

                rootMargin:
                    "-20% 0px -45% 0px"
            }
        );


    sections.forEach(section => {

        activeSectionObserver.observe(
            section
        );

    });


    /* =========================================================
       CLOSE MOBILE MENU AFTER RESIZE
       ========================================================= */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 760) {

                closeMenu();

            }

        }
    );


    /* =========================================================
       ESCAPE KEY
       ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );


    /* =========================================================
       INITIAL SECTION STATE
       ---------------------------------------------------------
       Makes sections that are already visible when the page
       loads appear immediately instead of waiting for scrolling.
       ========================================================= */

    requestAnimationFrame(() => {

        sections.forEach(section => {

            const rect =
                section.getBoundingClientRect();


            const visible =
                rect.top <
                    window.innerHeight * 0.85 &&
                rect.bottom > 0;


            if (visible) {

                section.classList.add(
                    "visible"
                );

            }

        });

    });

});
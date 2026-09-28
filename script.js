/* =========================================================
   JASMINE FLORA PORTFOLIO — ONE FILE
   1) Site behaviour: theme, menu, navigation, pop-in flow, contact form
   2) Page-wide connected dots (follow you down the whole page)
   3) Hero: robot hand + human hand meeting, with the spark line
   ========================================================= */

/* ---------------------------------------------------------
   1) SITE BEHAVIOUR
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const navbar = document.getElementById("navbar");
    const themeToggle = document.getElementById("themeToggle");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const revealElements = document.querySelectorAll(".reveal");

    body.classList.add("js-ready");

    /* ---------- THEME (dark by default) ---------- */
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector("i");

        const setTheme = theme => {
            const dark = theme === "dark";
            body.classList.toggle("dark-theme", dark);
            if (themeIcon) {
                themeIcon.classList.toggle("fa-sun", dark);
                themeIcon.classList.toggle("fa-moon", !dark);
            }
            const label = dark ? "Switch to light mode" : "Switch to dark mode";
            themeToggle.setAttribute("aria-label", label);
            themeToggle.setAttribute("title", label);
            try { localStorage.setItem("theme", theme); } catch (e) {}
        };

        let saved = null;
        try { saved = localStorage.getItem("theme"); } catch (e) {}
        setTheme(saved === "light" ? "light" : "dark");

        themeToggle.addEventListener("click", () => {
            setTheme(body.classList.contains("dark-theme") ? "light" : "dark");
        });
    }

    /* ---------- MOBILE MENU ---------- */
    const setMenu = open => {
        if (!navMenu) return;
        navMenu.classList.toggle("open", open);
        body.classList.toggle("no-scroll", open);
        if (menuToggle) {
            menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-xmark", open);
                icon.classList.toggle("fa-bars", !open);
            }
        }
    };
    const closeMenu = () => setMenu(false);

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
    }

    /* ---------- SMOOTH NAVIGATION ---------- */
    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");
            if (!targetId || !targetId.startsWith("#")) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            closeMenu();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", targetId);
        });
    });

    /* ---------- NAVBAR SCROLL EFFECT ---------- */
    const updateNavbar = () => {
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 20);
    };
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    /* ---------- SECTION POP-IN (one after another) ---------- */
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.12, rootMargin: "-8% 0px -12% 0px" });

    sections.forEach(section => sectionObserver.observe(section));

    /* ---------- ELEMENT REVEAL ---------- */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.10, rootMargin: "0px 0px -60px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ---------- HERO ENTRANCE ---------- */
    const heroReveal = document.querySelector("#home .reveal");
    if (heroReveal) setTimeout(() => heroReveal.classList.add("active"), 120);

    /* ---------- ACTIVE NAV LINK ---------- */
    const activeSectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("id");
            navLinks.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
        });
    }, { threshold: 0.35, rootMargin: "-20% 0px -45% 0px" });

    sections.forEach(section => activeSectionObserver.observe(section));

    /* ---------- RESIZE + ESCAPE ---------- */
    window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

    /* ---------- SECTIONS ALREADY ON SCREEN AT LOAD ---------- */
    requestAnimationFrame(() => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
                section.classList.add("visible");
            }
        });
    });

    /* ---------- CONTACT FORM: delivered straight to your Gmail inbox ----------
       Recommended (most reliable): Web3Forms. Get a free key at https://web3forms.com
       (type your Gmail, they email you an Access Key) and paste it below.
       If WEB3FORMS_KEY is empty, FormSubmit is used instead (needs one-time activation). */
    const CONTACT_EMAIL = "jasmineflora2006@gmail.com";
    const WEB3FORMS_KEY = "";   // <- paste your Web3Forms Access Key here

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        const formStatus = document.getElementById("formStatus");
        const sendBtn = document.getElementById("sendBtn");

        const showStatus = (text, ok) => {
            formStatus.textContent = text;
            formStatus.className = "form-status " + (ok ? "ok" : "err");
        };

        contactForm.addEventListener("submit", async event => {
            event.preventDefault();

            const data = new FormData(contactForm);
            const name = (data.get("name") || "").toString().trim();
            const email = (data.get("email") || "").toString().trim();
            const message = (data.get("message") || "").toString().trim();

            if (data.get("website")) return; /* spam trap */

            if (!name || !message) {
                showStatus("Please enter your name and a message.", false);
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showStatus("Please enter a valid email address.", false);
                return;
            }

            if (sendBtn) sendBtn.disabled = true;
            showStatus("Sending...", true);

            const useWeb3 = WEB3FORMS_KEY.trim() !== "";
            const url = useWeb3 ? "https://api.web3forms.com/submit" : "https://formsubmit.co/ajax/" + CONTACT_EMAIL;

            const payload = useWeb3
                ? { access_key: WEB3FORMS_KEY.trim(), name: name, email: email, message: message,
                    subject: "New portfolio message from " + name, from_name: "Portfolio Website" }
                : { name: name, email: email, message: message, _replyto: email,
                    _subject: "New portfolio message from " + name, _template: "table", _captcha: "false" };

            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify(payload)
                });

                let result = {};
                try { result = await res.json(); } catch (e) {}

                if (!res.ok || result.success === "false" || result.success === false) {
                    throw new Error(result.message || "Server error " + res.status);
                }

                contactForm.reset();
                showStatus("Thanks " + name + "! Your message has been sent.", true);

            } catch (err) {
                console.error("Contact form error:", err);
                showStatus("Message not sent: " + err.message + " (If this is the site owner: open the site from your live link, not a local file, and finish the one-time activation.)", false);
            } finally {
                if (sendBtn) sendBtn.disabled = false;
            }
        });
    }
});


/* ---------------------------------------------------------
   2) PAGE-WIDE CONNECTED DOTS
   A fixed canvas behind everything, so the dots stay with you
   as you scroll through every section.
   --------------------------------------------------------- */
(function () {

    const cv = document.createElement("canvas");
    cv.id = "bgDots";
    cv.setAttribute("aria-hidden", "true");
    document.body.insertBefore(cv, document.body.firstChild);

    const ctx = cv.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1, pts = [];
    const mouse = { x: -999, y: -999 };

    const makePoints = () => {
        const n = Math.round(Math.min(110, (W * H) / 15000));
        pts = Array.from({ length: n }, () => {
            const vx = (Math.random() - 0.5) * 0.35, vy = (Math.random() - 0.5) * 0.35;
            return { x: Math.random() * W, y: Math.random() * H, vx, vy, bx: vx, by: vy, r: 1 + Math.random() * 1.4 };
        });
    };

    const resize = () => {
        const oldW = W, oldH = H;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        cv.width = W * dpr;
        cv.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!pts.length) {
            makePoints();
        } else if (oldW && oldH) {
            pts.forEach(p => { p.x *= W / oldW; p.y *= H / oldH; });
        }
        if (still) draw();
    };

    window.addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.documentElement.addEventListener("mouseleave", () => { mouse.x = mouse.y = -999; });

    /* used by the hero spark line to push dots away */
    window.__bgDots = {
        burst(cx, cy) {
            pts.forEach(p => {
                const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1;
                if (d < 260) {
                    const f = (1 - d / 260) * 5;
                    p.vx += (dx / d) * f;
                    p.vy += (dy / d) * f;
                }
            });
        }
    };

    function draw() {
        ctx.clearRect(0, 0, W, H);

        const dark = document.body.classList.contains("dark-theme");
        const col = dark ? "255,255,255" : "0,0,0";
        const L = Math.min(140, Math.max(90, W / 9));

        if (!still) {
            for (const p of pts) {
                p.vx += (p.bx - p.vx) * 0.02;
                p.vy += (p.by - p.vy) * 0.02;
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            }
        }

        for (let i = 0; i < pts.length; i++) {
            const a = pts[i];

            for (let j = i + 1; j < pts.length; j++) {
                const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < L) {
                    ctx.strokeStyle = "rgba(" + col + "," + ((1 - d / L) * 0.28) + ")";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
            if (md < L * 1.4) {
                ctx.strokeStyle = "rgba(" + col + "," + ((1 - md / (L * 1.4)) * 0.5) + ")";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            ctx.fillStyle = "rgba(" + col + ",0.5)";
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, 6.283);
            ctx.fill();
        }
    }

    const loop = () => { draw(); requestAnimationFrame(loop); };

    window.addEventListener("resize", resize);
    resize();
    if (!still) requestAnimationFrame(loop);

})();


/* ---------------------------------------------------------
   3) HERO: ROBOT HAND + HUMAN HAND (Three.js) + SPARK LINE
   Tune the look with the numbers just below.
   --------------------------------------------------------- */
(function () {

    const HAND_SIZE    = 1.2;    // bigger = bigger hands
    const LIFT         = 24;     // pixels of empty space under the hands (bigger = hands sit higher)
    const GAP          = 0.55;   // space between the fingertips
    const HAND_OPACITY = 0.92;   // 0 to 1
    const ACCENT       = "232,117,61";  // orange used for the spark line
    const TEXT_HALO    = true;   // soft glow behind hero text so it stays readable

    const hero = document.getElementById("home");
    if (!hero) return;

    /* keep the hero text above the canvases */
    [...hero.children].forEach(el => {
        if (el.classList.contains("hero-decoration")) return;
        if (getComputedStyle(el).position === "static") el.style.position = "relative";
        el.style.zIndex = 2;
    });

    if (TEXT_HALO) {
        const st = document.createElement("style");
        st.textContent = "#home .hero-content h1,#home .hero-content h2,#home .hero-content p,#home .hero-content .hero-label{text-shadow:0 0 18px var(--background),0 0 8px var(--background)}";
        document.head.appendChild(st);
    }

    const mk = z => {
        const c = document.createElement("canvas");
        c.setAttribute("aria-hidden", "true");
        c.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:" + z;
        hero.insertBefore(c, hero.firstChild);
        return c;
    };

    const handCanvas = mk(1);
    const fxCanvas = mk(2);
    handCanvas.style.opacity = HAND_OPACITY;

    const fc = fxCanvas.getContext("2d");
    let W = 0, H = 0, dark = document.body.classList.contains("dark-theme");

    /* ---- spark line between the hands ---- */
    const SP = { x0: -999, x1: -999, y: -999, ready: false, over: false, h: 0, bolt: 0, zone: 60, t0: -1 };
    let bits = [], VY = -1.8;

    const hit = e => {
        const b = hero.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top;
        /* anywhere over the two hands counts */
        return SP.ready && px > b.width * 0.1 && px < b.width * 0.9 && Math.abs(py - SP.y) < SP.zone;
    };

    const boom = () => {
        if (SP.t0 >= 0) return;          /* wave already running */
        SP.t0 = performance.now();        /* start the shockwave */
        SP.arrived = false;
        burstBits(SP.x1, 14);             /* sparks leave the human fingertip */
        if (window.__bgDots) {
            const hb = hero.getBoundingClientRect();
            window.__bgDots.burst(hb.left + (SP.x0 + SP.x1) / 2, hb.top + SP.y);
        }
    };

    hero.addEventListener("pointermove", e => {
        SP.over = hit(e);
        hero.style.cursor = SP.over ? "pointer" : "";
    });
    hero.addEventListener("pointerleave", () => { SP.over = false; });
    hero.addEventListener("pointerdown", e => { if (hit(e)) boom(); });

    const WAVE_MS = 2600;

    const burstBits = (x, n) => {
        for (let i = 0; i < n; i++) {
            bits.push({
                x: x, y: SP.y,
                vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 4,
                r: 0.8 + Math.random() * 1.4, l: 1
            });
        }
    };

    /* 0 to 1 amount of "robot is processing" for a given time */
    const procAmount = now => {
        if (SP.t0 < 0) return 0;
        const p = (now - SP.t0) / WAVE_MS;
        if (p < 0.2 || p >= 1) return 0;
        return Math.min(1, (p - 0.2) / 0.06) * Math.min(1, (1 - p) / 0.25);
    };

    /* the shockwave: human fingertip -> robot fingertip */
    const drawWave = now => {
        if (SP.t0 < 0) return;
        const p = (now - SP.t0) / WAVE_MS;
        if (p >= 1) { SP.t0 = -1; return; }

        const y = SP.y, ax = SP.x1, bx = SP.x0;   /* ax = human tip, bx = robot tip */

        const ring = (x, r, a, w) => {
            if (a <= 0) return;
            fc.strokeStyle = "rgba(" + ACCENT + "," + a + ")";
            fc.lineWidth = w;
            fc.beginPath(); fc.ellipse(x, y, r, r * 0.6, 0, 0, 6.283); fc.stroke();
        };

        fc.save();
        fc.shadowColor = "rgba(" + ACCENT + ",.95)";
        fc.shadowBlur = 16;

        /* rings spreading from the human fingertip */
        if (p < 0.34) {
            const q = p / 0.34;
            ring(ax, 6 + q * 120, (1 - q) * 0.95, 2.4);
            ring(ax, 4 + q * 70, (1 - q) * 0.7, 1.6);
        }

        /* bright pulse flying across the gap */
        if (p < 0.24) {
            const q = Math.min(1, p / 0.2), e = 1 - Math.pow(1 - q, 2.2);
            const px = ax + (bx - ax) * e;
            const tail = ax + (bx - ax) * Math.max(0, e - 0.35);

            fc.strokeStyle = "rgba(" + ACCENT + ",.95)";
            fc.lineWidth = 2.6;
            fc.beginPath();
            fc.moveTo(tail, y);
            const steps = 8;
            for (let i = 1; i <= steps; i++) {
                const x = tail + (px - tail) * i / steps;
                fc.lineTo(x, y + (i === steps ? 0 : (Math.random() - 0.5) * 12));
            }
            fc.stroke();

            fc.fillStyle = "rgba(255,255,255,.95)";
            fc.beginPath(); fc.arc(px, y, 4.5, 0, 6.283); fc.fill();
        }

        /* impact at the robot fingertip */
        if (p >= 0.2) {
            if (!SP.arrived) { SP.arrived = true; burstBits(bx, 26); }
            const q = Math.min(1, (p - 0.2) / 0.4);
            ring(bx, 6 + q * 130, (1 - q) * 0.95, 2.4);
            ring(bx, 4 + q * 80, (1 - q) * 0.7, 1.6);
            ring(bx, 3 + q * 40, (1 - q) * 0.6, 1.2);
        }

        fc.restore();
    };

    const zig = (col, a, w, amp) => {
        fc.strokeStyle = "rgba(" + col + "," + a + ")";
        fc.lineWidth = w;
        fc.beginPath();
        for (let i = 0; i <= 14; i++) {
            const x = SP.x0 + (SP.x1 - SP.x0) * i / 14;
            const y = SP.y + (i === 0 || i === 14 ? 0 : (Math.random() - 0.5) * 2 * amp);
            if (i) fc.lineTo(x, y); else fc.moveTo(x, y);
        }
        fc.stroke();
    };

    const drawFx = col => {
        if (SP.ready) {
            if (SP.h > 0.03 || SP.bolt > 0.03) {
                const amp = 2 + SP.h * 5 + SP.bolt * 16;
                fc.shadowColor = "rgba(" + ACCENT + ",.9)";
                fc.shadowBlur = 8 + SP.bolt * 18;
                zig(col, 0.3 + SP.h * 0.5 + SP.bolt * 0.5, 1 + SP.h * 0.8 + SP.bolt * 1.6, amp);
                if (SP.bolt > 0.2) zig(col, SP.bolt * 0.6, 1, amp * 1.5);
                fc.shadowBlur = 0;
            } else {
                fc.setLineDash([6, 8]);
                fc.strokeStyle = "rgba(" + ACCENT + ",.3)";
                fc.lineWidth = 1;
                fc.beginPath(); fc.moveTo(SP.x0, SP.y); fc.lineTo(SP.x1, SP.y); fc.stroke();
                fc.setLineDash([]);
            }
            const u = (Math.sin(performance.now() * 0.0016) + 1) / 2;
            fc.fillStyle = "rgba(" + ACCENT + ",.7)";
            [[SP.x0, 2.5], [SP.x1, 2.5], [SP.x0 + (SP.x1 - SP.x0) * u, 2]].forEach(([x, r]) => {
                fc.beginPath(); fc.arc(x, SP.y, r, 0, 6.283); fc.fill();
            });
        }
        SP.bolt *= 0.9;
        bits.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.95; p.l -= 0.03;
            fc.fillStyle = "rgba(" + ACCENT + "," + Math.max(0, p.l) + ")";
            fc.fillRect(p.x, p.y, p.r * 2.4, p.r * 0.8);
        });
        bits = bits.filter(p => p.l > 0);
    };

    /* ---- follow the light / dark toggle ---- */
    let SKIN, PLATE, CHROME, CABLE, NAIL, EYE;

    const applyTheme = () => {
        if (!SKIN) return;
        SKIN.color.set(dark ? 0xf2f2f2 : 0x9c9c9c);
        PLATE.color.set(dark ? 0x4a4a4a : 0x262626);
    };

    new MutationObserver(() => {
        dark = document.body.classList.contains("dark-theme");
        applyTheme();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    /* ---- 3D hands ---- */
    function boot() {

        const R = new THREE.WebGLRenderer({ canvas: handCanvas, alpha: true, antialias: true });
        R.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(32, 2, 0.1, 100);
        cam.position.z = 10;

        scene.add(new THREE.AmbientLight(0xffffff, 0.2));
        const key = new THREE.DirectionalLight(0xffffff, 0.95); key.position.set(2, 4, 5); scene.add(key);
        const rim = new THREE.DirectionalLight(0xffffff, 0.6); rim.position.set(-4, 1, -3); scene.add(rim);

        /* reflection environment so the metal looks like chrome */
        const pm = new THREE.PMREMGenerator(R), es = new THREE.Scene();
        const sg = new THREE.SphereGeometry(50, 32, 16), cl = [], pp = sg.attributes.position;
        for (let i = 0; i < pp.count; i++) {
            const v = 0.06 + Math.min(1, Math.max(0, 0.5 + pp.getY(i) / 90)) * 0.5;
            cl.push(v, v, v);
        }
        sg.setAttribute("color", new THREE.Float32BufferAttribute(cl, 3));
        es.add(new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));
        [[30, 30, 30, 26], [-42, 8, 22, 14], [8, -6, 44, 10], [-20, 40, -10, 20]].forEach(([x, y, z, w]) => {
            const p = new THREE.Mesh(new THREE.BoxGeometry(w, w * 0.6, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            p.position.set(x, y, z); p.lookAt(0, 0, 0); es.add(p);
        });
        scene.environment = pm.fromScene(es, 0.04).texture;

        SKIN   = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.5, metalness: 0, envMapIntensity: 0.7 });
        PLATE  = new THREE.MeshStandardMaterial({ color: 0x262626, roughness: 0.34, metalness: 0.85, envMapIntensity: 1.1 });
        CHROME = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.12, metalness: 1, envMapIntensity: 1.3 });
        CABLE  = new THREE.MeshStandardMaterial({ color: 0x0e0e0e, roughness: 0.5, metalness: 0.3 });
        NAIL   = new THREE.MeshStandardMaterial({ color: 0xe6e6e6, roughness: 0.25, metalness: 0 });
        applyTheme();

        function finger(lens, r, curls, robot, nail) {
            const root = new THREE.Group();
            let par = root, off = 0;
            lens.forEach((L, i) => {
                const rr = r * (1 - i * 0.14), j = new THREE.Group();
                j.position.x = off; j.rotation.z = curls[i]; par.add(j);
                const geo = robot ? new THREE.CylinderGeometry(rr * 0.8, rr, L * 0.92, 6) : new THREE.CylinderGeometry(rr * 0.85, rr, L, 20);
                geo.rotateZ(-Math.PI / 2); geo.translate(L / 2, 0, 0);
                j.add(new THREE.Mesh(geo, robot ? PLATE : SKIN));
                j.add(new THREE.Mesh(new THREE.SphereGeometry(rr * (robot ? 1.12 : 1.02), 16, 12), robot ? CHROME : SKIN));
                if (robot) {
                    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, L * 0.95, 6), CHROME);
                    rod.rotation.z = Math.PI / 2; rod.position.set(L / 2, rr * 1.15, 0); j.add(rod);
                }
                if (i === lens.length - 1) {
                    const t = new THREE.Mesh(new THREE.SphereGeometry(rr * 0.85, 16, 12), robot ? CABLE : SKIN);
                    t.position.x = L * (robot ? 0.92 : 1); j.add(t);
                    if (nail) {
                        const n = new THREE.Mesh(new THREE.SphereGeometry(rr * 0.8, 14, 10), NAIL);
                        n.scale.set(1.3, 0.32, 0.85); n.position.set(L * 0.6, rr * 0.62, 0); j.add(n);
                    }
                }
                par = j; off = L;
            });
            return root;
        }

        function hand(robot) {
            const g = new THREE.Group(), M = robot ? PLATE : SKIN, side = robot ? 1 : -1;
            const palm = new THREE.Mesh(robot ? new THREE.BoxGeometry(1.1, 0.3, 1) : new THREE.SphereGeometry(0.6, 32, 20), M);
            if (!robot) palm.scale.set(1, 0.42, 0.85);
            palm.position.x = 0.5; g.add(palm);
            if (robot) {
                const tp = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.8), CHROME);
                tp.position.set(0.5, 0.17, 0); g.add(tp);
            }
            const zs = [0.36, 0.12, -0.12, -0.34];
            const P = robot
                ? [[[.5, .32, .24], .07, [-.25, -.75, -.65]], [[.56, .36, .26], .075, [-.5, -.9, -.7]], [[.5, .32, .24], .07, [-.55, -.95, -.7]], [[.38, .24, .2], .06, [-.6, -1, -.7]]]
                : [[[.5, .3, .24], .085, [.06, -.05, -.1]], [[.55, .34, .26], .09, [-.15, -.3, -.3]], [[.5, .31, .24], .082, [-.3, -.5, -.4]], [[.38, .23, .2], .07, [-.45, -.6, -.45]]];
            P.forEach(([l, r, c], i) => {
                const f = finger(l, r, c, robot, !robot);
                f.position.set(1.02, 0, side * zs[i]);
                f.rotation.y = side * (i - 1.5) * 0.06;
                g.add(f);
            });
            const th = robot ? finger([.4, .3, .24], .075, [.1, .4, .5], true, false) : finger([.4, .32, .26], .09, [.1, -.15, -.2], false, true);
            th.position.set(0.3, -0.06, side * 0.44); th.rotation.y = -side * 0.5; th.rotation.z = -0.45; g.add(th);

            const fa = new THREE.CylinderGeometry(robot ? 0.3 : 0.29, robot ? 0.48 : 0.5, 9, robot ? 8 : 24);
            fa.rotateZ(-Math.PI / 2); fa.translate(-4.5, 0, 0);
            g.add(new THREE.Mesh(fa, M));

            if (robot) {
                const wj = new THREE.CylinderGeometry(0.34, 0.34, 0.34, 22); wj.rotateZ(Math.PI / 2);
                const w = new THREE.Mesh(wj, CHROME); w.position.x = -0.1; g.add(w);
                const eye = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), new THREE.MeshBasicMaterial({ color: 0xe8753d }));
                eye.position.set(-0.1, 0, 0.351); g.add(eye); EYE = eye;
                const rg2 = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 10, 28), CHROME);
                rg2.position.set(-0.1, 0, 0.35); g.add(rg2);
                [-0.7, -1.6, -2.8, -4.2].forEach(x => {
                    const rg = new THREE.CylinderGeometry(0.4 + (-x) * 0.03, 0.4 + (-x) * 0.03, 0.16, 8);
                    rg.rotateZ(Math.PI / 2);
                    const m = new THREE.Mesh(rg, CHROME); m.position.x = x; g.add(m);
                });
                for (let k = 0; k < 8; k++) {
                    const q = [];
                    for (let i = 0; i <= 9; i++) {
                        q.push(new THREE.Vector3(0.2 - i * 0.9, Math.sin(i * 1.3 + k) * 0.18 + (k - 3.5) * 0.05, Math.cos(i * 1.1 + k * 2) * 0.26 + 0.02 * k));
                    }
                    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(q), 44, 0.018, 5), CABLE));
                }
            } else {
                const w = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), SKIN);
                w.scale.set(0.7, 0.95, 0.95); w.position.x = -0.05; g.add(w);
            }
            g.position.x = -2.05;
            return g;
        }

        const robotRig = new THREE.Group(), humanRig = new THREE.Group();
        robotRig.add(hand(true)); humanRig.add(hand(false));
        humanRig.rotation.y = Math.PI;
        scene.add(robotRig, humanRig);

        let S = 1;
        const resize = () => {
            const w = handCanvas.clientWidth, h = handCanvas.clientHeight;
            if (!w || !h) return;
            R.setSize(w, h, false);
            cam.aspect = w / h; cam.updateProjectionMatrix();
            S = HAND_SIZE * Math.min(1, Math.max(0.5, (w / h) / 1.7));
            robotRig.scale.setScalar(S); humanRig.scale.setScalar(S);

            /* place the hands so they are always fully inside the hero, above its bottom edge */
            const pu0 = h / 5.735;
            const yPx = h - (0.85 * S * pu0 + LIFT);
            VY = (0.5 - yPx / h) * 5.735;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = w; H = h;
            fxCanvas.width = w * dpr; fxCanvas.height = h * dpr;
            fc.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        window.addEventListener("resize", resize);
        resize();

        /* only render while the hero is on screen */
        let visible = true;
        new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(hero);

        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const t0 = performance.now(), ease = p => 1 - Math.pow(1 - p, 3);

        const frame = now => {
            requestAnimationFrame(frame);
            if (!visible) return;

            const t = (now - t0) / 1000;
            const eR = ease(Math.min(Math.max(t / 3.4, 0), 1));
            const eH = ease(Math.min(Math.max((t - 0.3) / 3.4, 0), 1));
            const a = still ? 1 : eR, b = still ? 1 : eH, idle = still ? 0 : 1;

            robotRig.position.set(-(GAP * S / 2 + (1 - a) * 20), VY + Math.sin(t * 0.9) * 0.07 * a * idle - 0.05, 0);
            humanRig.position.set(GAP * S / 2 + (1 - b) * 20, VY + Math.sin(t * 0.8 + 1.5) * 0.07 * b * idle + 0.12, 0);
            robotRig.rotation.x = (1 - a) * 1.4 + Math.sin(t * 0.55) * 0.22 * a * idle;
            robotRig.rotation.y = Math.sin(t * 0.45) * 0.22 * a * idle;
            robotRig.rotation.z = 0.16 + Math.sin(t * 0.7) * 0.04 * a * idle ;
            humanRig.rotation.x = -(1 - b) * 1.4 + Math.sin(t * 0.5 + 1) * 0.22 * b * idle;
            humanRig.rotation.y = Math.PI + Math.sin(t * 0.4 + 2) * 0.22 * b * idle;
            humanRig.rotation.z = 0.16 + Math.sin(t * 0.65 + 1) * 0.04 * b * idle;

            const k = Math.max(0, (Math.min(a, b) - 0.92) / 0.08);
            SP.h += ((SP.over ? 1 : 0) - SP.h) * 0.12;

            const cw = handCanvas.clientWidth, ch = handCanvas.clientHeight;
            const pu = ch / 5.735, hw = (GAP * S / 2 + 0.12 * S) * pu;
            SP.x0 = cw / 2 - hw; SP.x1 = cw / 2 + hw;
            SP.y = (0.5 - (VY + 0.03) / 5.735) * ch;
            SP.ready = k > 0.6;
            SP.zone = 0.95 * S * pu;

            /* robot "processing": orange glow flickers through its plates, joints and eye */
            const proc = procAmount(now);
            const flick = 0.55 + 0.45 * Math.sin(now * 0.032) * Math.sin(now * 0.011 + 1);
            PLATE.emissive.setHex(0xe8753d);  PLATE.emissiveIntensity  = proc * (0.35 + 0.5 * flick);
            CHROME.emissive.setHex(0xe8753d); CHROME.emissiveIntensity = proc * (0.15 + 0.3 * flick);
            if (EYE) EYE.scale.setScalar(1 + proc * (0.4 + 0.7 * flick));

            R.render(scene, cam);

            if (!still) {
                fc.clearRect(0, 0, W, H);
                drawFx(dark ? "255,255,255" : "0,0,0");
                drawWave(now);
            }
        };
        requestAnimationFrame(frame);
    }

    const start = () => { try { boot(); } catch (err) { console.warn("Hero hands could not start:", err); } };

    if (window.THREE) {
        start();
    } else {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        s.onload = start;
        document.head.appendChild(s);
    }

})();
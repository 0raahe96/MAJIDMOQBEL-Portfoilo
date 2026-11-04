


"use strict";

/* =========================================
   1. SELECT ELEMENTS
========================================= */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelectorAll(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

const starsContainer = document.getElementById("stars");
const shootingStarsContainer = document.querySelector(".shooting-stars");

const universe = document.querySelector(".universe");
const mainPlanet = document.querySelector(".planet-main");
const moons = document.querySelectorAll(".moon");

const backToTop = document.getElementById("backToTop");
const yearElement = document.getElementById("year");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================
   2. GLOBAL SETTINGS
========================================= */

const settings = {
    starsCount: 130,
    shootingStarsCount: 5,
    revealThreshold: 0.12,
    parallaxStrength: 12,
    lastScrollY: 0,

    planetProximityDistance: 240,
    planetMaxRotation: 12,
    planetGlowIntensity: 1
};


/* =========================================
   3. CREATE DYNAMIC ANIMATION STYLES
========================================= */

function createAnimationStyles() {
    if (document.getElementById("dynamic-animation-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "dynamic-animation-styles";

    style.textContent = `

        /* Moon orbital tracks */

        .moon-orbit-track {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;

            border: 1px solid rgba(158, 130, 255, 0.12);
            border-radius: 50%;

            pointer-events: none;
            transform-origin: center;
            will-change: transform;
            z-index: 2;
        }

        .moon-orbit-track:nth-of-type(even) {
            border-color: rgba(90, 220, 255, 0.13);
        }

        .moon-orbit-track .moon {
            position: absolute !important;
            left: 100% !important;
            top: 50% !important;

            margin: 0 !important;

            transform: translate(-50%, -50%) !important;

            pointer-events: auto;
            will-change: transform;
            z-index: 5;
        }


        /* Moon interactions */

        .moon {
            transition:
                filter 0.3s ease,
                box-shadow 0.3s ease;
        }

        .moon:hover {
            filter: brightness(1.5);

            box-shadow:
                0 0 15px rgba(130, 100, 255, 0.8),
                0 0 35px rgba(70, 210, 255, 0.5);

            z-index: 20 !important;
        }


        /* Shooting stars */

        .shooting-star-particle {
            position: absolute;
            display: block;

            width: 100px;
            height: 2px;

            border-radius: 50%;

            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.95),
                rgba(130, 170, 255, 0.6),
                transparent
            );

            opacity: 0;
            transform: rotate(-35deg);

            animation: dynamicShootingStar 4s linear infinite;

            pointer-events: none;
        }

        @keyframes dynamicShootingStar {
            0% {
                opacity: 0;
                transform: translate(0, 0) rotate(-35deg);
            }

            8% {
                opacity: 1;
            }

            35% {
                opacity: 0;
                transform: translate(-260px, 180px) rotate(-35deg);
            }

            100% {
                opacity: 0;
                transform: translate(-260px, 180px) rotate(-35deg);
            }
        }


        /* Stars */

        .star {
            animation:
                starTwinkle var(--twinkle-duration, 3s)
                ease-in-out infinite alternate;

            animation-delay: var(--twinkle-delay, 0s);
        }

        @keyframes starTwinkle {
            from {
                opacity: 0.2;
                transform: scale(0.7);
            }

            to {
                opacity: 1;
                transform: scale(1.5);
            }
        }


        /* Universe mouse-following light */

        .universe {
            --mouse-x: 50%;
            --mouse-y: 50%;
        }

        .universe::before {
            content: "";

            position: absolute;
            inset: 0;

            z-index: 1;
            pointer-events: none;

            background: radial-gradient(
                circle 190px at var(--mouse-x) var(--mouse-y),
                rgba(103, 232, 249, 0.15),
                rgba(167, 139, 250, 0.08) 45%,
                transparent 75%
            );

            opacity: 0;

            transition: opacity 0.4s ease;
        }

        .universe.mouse-active::before {
            opacity: 1;
        }


        /* Main planet */

        .planet-main {
            transform-style: preserve-3d;
            will-change: transform, filter;

            --planet-rotate-x: 0deg;
            --planet-rotate-y: 0deg;

            transform:
                translate(-50%, -50%)
                perspective(700px)
                rotateX(var(--planet-rotate-x))
                rotateY(var(--planet-rotate-y));

            transition:
                box-shadow 0.4s ease,
                filter 0.4s ease;
        }


        /* Planet outer energy ring */

        .planet-main::after {
            content: "";

            position: absolute;
            inset: -12%;

            border-radius: 50%;
            border: 1px solid rgba(151, 125, 255, 0.22);

            box-shadow:
                0 0 25px rgba(120, 100, 255, 0.12),
                inset 0 0 20px rgba(90, 210, 255, 0.08);

            pointer-events: none;

            animation: planetRingPulse 4s ease-in-out infinite;
        }

        @keyframes planetRingPulse {
            0%, 100% {
                opacity: 0.3;
                transform: scale(0.98);
            }

            50% {
                opacity: 0.9;
                transform: scale(1.06);
            }
        }


        /* Planet atmosphere */

        .planet-atmosphere {
            animation: atmosphereGlow 5s ease-in-out infinite alternate;
        }

        @keyframes atmosphereGlow {
            from {
                filter: brightness(0.9);
            }

            to {
                filter: brightness(1.35);
            }
        }


        /* Planet proximity effect */

        .planet-main.planet-near {
            filter: brightness(1.3) saturate(1.4);

            box-shadow:
                inset -18px -15px 35px rgba(0, 0, 0, 0.5),
                inset 8px 8px 20px rgba(255, 255, 255, 0.25),
                0 0 45px rgba(139, 92, 246, 0.8),
                0 0 100px rgba(103, 232, 249, 0.55),
                0 0 160px rgba(192, 132, 252, 0.35);
        }

        .planet-main.planet-near .planet-atmosphere {
            border-color: rgba(103, 232, 249, 0.85);

            box-shadow:
                0 0 35px rgba(103, 232, 249, 0.7),
                0 0 70px rgba(192, 132, 252, 0.5),
                inset 0 0 35px rgba(103, 232, 249, 0.5);
        }

        .planet-main.planet-near .planet-land {
            filter: brightness(1.5) saturate(1.4);
        }

        .planet-main.planet-near .planet-rift {
            filter: blur(1px);
            opacity: 1;
        }

        .planet-main.planet-near .planet-shine {
            animation-duration: 2.5s;
        }


        /* Planet hover state */

        .planet-main.planet-hovered {
            filter: brightness(1.15);
        }


        /* Cards */

        .info-item,
        .detail-card,
        .skill-card,
        .project-card {
            will-change: transform;
        }

        .skill-card,
        .detail-card {
            transition:
                transform 0.4s cubic-bezier(.2,.8,.2,1),
                border-color 0.4s ease,
                box-shadow 0.4s ease;
        }

        .skill-card:hover,
        .detail-card:hover {
            transform: translateY(-9px);
        }

        .project-card {
            transform-style: preserve-3d;

            transition:
                transform 0.35s ease,
                box-shadow 0.35s ease;
        }

        .project-card:hover {
            z-index: 3;
        }


        /* Scroll reveal */

        .reveal {
            opacity: 0;
            transform: translateY(35px);

            transition:
                opacity 0.8s ease,
                transform 0.8s cubic-bezier(.2,.8,.2,1);
        }

        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }

        .reveal-delay-1 {
            transition-delay: 0.1s;
        }

        .reveal-delay-2 {
            transition-delay: 0.2s;
        }

        .reveal-delay-3 {
            transition-delay: 0.3s;
        }


        /* Hero and universe optimization */

        .hero-heading,
        .universe {
            will-change: transform;
        }


        /* Reduced motion */

        @media (prefers-reduced-motion: reduce) {

            .star,
            .shooting-star-particle,
            .planet-main::after,
            .planet-atmosphere {
                animation: none !important;
            }

            .universe::before {
                display: none !important;
            }

            .planet-main {
                transform: translate(-50%, -50%) !important;
            }

            .reveal {
                opacity: 1 !important;
                transform: none !important;
                transition: none !important;
            }

            .moon-orbit-track {
                transform: translate(-50%, -50%) !important;
            }
        }

    `;

    document.head.appendChild(style);
}


/* =========================================
   4. CREATE BACKGROUND STARS
========================================= */

function createStars() {
    if (!starsContainer) return;

    starsContainer.innerHTML = "";

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < settings.starsCount; i++) {
        const star = document.createElement("span");

        const size = Math.random() * 2.5 + 0.5;
        const duration = Math.random() * 4 + 2;
        const delay = Math.random() * 5;

        star.className = "star";

        star.style.position = "absolute";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.borderRadius = "50%";
        star.style.background = "#ffffff";

        star.style.boxShadow =
            `0 0 ${size * 3}px rgba(255,255,255,0.8)`;

        star.style.setProperty(
            "--twinkle-duration",
            `${duration}s`
        );

        star.style.setProperty(
            "--twinkle-delay",
            `${delay}s`
        );

        fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
}


/* =========================================
   5. CREATE SHOOTING STARS
========================================= */

function createShootingStars() {
    if (!shootingStarsContainer) return;

    shootingStarsContainer.innerHTML = "";

    for (let i = 0; i < settings.shootingStarsCount; i++) {
        const shootingStar = document.createElement("span");

        shootingStar.className = "shooting-star-particle";

        shootingStar.style.top = `${Math.random() * 65}%`;
        shootingStar.style.left = `${Math.random() * 100}%`;

        shootingStar.style.animationDelay =
            `${Math.random() * 8}s`;

        shootingStar.style.animationDuration =
            `${3 + Math.random() * 4}s`;

        shootingStarsContainer.appendChild(shootingStar);
    }
}


/* =========================================
   6. ORBITING MOONS SYSTEM
========================================= */

const moonOrbitData = [];

function setupMoonOrbits() {
    if (!universe || moons.length === 0) return;

    moonOrbitData.length = 0;

    const orbitSizes = [
        0.32,
        0.40,
        0.48,
        0.56,
        0.64,
        0.72
    ];

    const speeds = [
        0.30,
        -0.23,
        0.19,
        -0.15,
        0.12,
        -0.09
    ];

    const startingAngles = [
        20,
        100,
        180,
        250,
        310,
        55
    ];

    moons.forEach((moon, index) => {
        const orbit = document.createElement("div");

        orbit.className = "moon-orbit-track";

        const radius = orbitSizes[index % orbitSizes.length];

        orbit.dataset.radius = radius;

        moon.parentNode.insertBefore(orbit, moon);
        orbit.appendChild(moon);

        moon.style.setProperty(
            "position",
            "absolute",
            "important"
        );

        moon.style.setProperty(
            "left",
            "100%",
            "important"
        );

        moon.style.setProperty(
            "top",
            "50%",
            "important"
        );

        moon.style.setProperty(
            "margin",
            "0",
            "important"
        );

        moon.style.setProperty(
            "transform",
            "translate(-50%, -50%)",
            "important"
        );

        moonOrbitData.push({
            element: orbit,
            moon: moon,
            radius: radius,
            speed: speeds[index % speeds.length],
            angle: startingAngles[index % startingAngles.length],
            width: 0,
            height: 0
        });
    });

    updateOrbitDimensions();
}


function updateOrbitDimensions() {
    if (!universe) return;

    const rect = universe.getBoundingClientRect();

    const smallestDimension = Math.min(
        rect.width,
        rect.height
    );

    moonOrbitData.forEach((orbitData) => {
        const diameter = smallestDimension * orbitData.radius;

        orbitData.width = diameter;
        orbitData.height = diameter * 0.78;

        orbitData.element.style.width =
            `${orbitData.width}px`;

        orbitData.element.style.height =
            `${orbitData.height}px`;

        orbitData.element.style.marginLeft =
            `${-orbitData.width / 2}px`;

        orbitData.element.style.marginTop =
            `${-orbitData.height / 2}px`;
    });
}


let previousOrbitTime = 0;

function animateMoonOrbits(timestamp) {
    if (prefersReducedMotion) return;

    if (!previousOrbitTime) {
        previousOrbitTime = timestamp;
    }

    const deltaTime = Math.min(
        (timestamp - previousOrbitTime) / 1000,
        0.05
    );

    previousOrbitTime = timestamp;

    moonOrbitData.forEach((orbitData) => {
        orbitData.angle +=
            orbitData.speed * deltaTime * 60;

        orbitData.element.style.transform =
            `rotate(${orbitData.angle}deg)`;
    });

    requestAnimationFrame(animateMoonOrbits);
}


/* =========================================
   7. MOBILE NAVIGATION
========================================= */

function closeMobileMenu() {
    if (!menuToggle) return;

    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    navLinks.forEach((list) => {
        list.classList.remove("active");
    });
}


function toggleMobileMenu() {
    if (!menuToggle) return;

    const isOpen =
        menuToggle.classList.toggle("active");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

    navLinks.forEach((list) => {
        list.classList.toggle("active", isOpen);
    });
}


if (menuToggle) {
    menuToggle.addEventListener(
        "click",
        toggleMobileMenu
    );
}


navItems.forEach((link) => {
    link.addEventListener(
        "click",
        closeMobileMenu
    );
});


document.addEventListener("click", (event) => {
    if (!menuToggle) return;

    const clickedInsideMenu =
        menuToggle.contains(event.target) ||
        Array.from(navLinks).some((list) =>
            list.contains(event.target)
        );

    if (!clickedInsideMenu) {
        closeMobileMenu();
    }
});


document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});


window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMobileMenu();
    }

    updateOrbitDimensions();
});


/* =========================================
   8. HEADER SCROLL EFFECT
========================================= */

function handleHeaderScroll() {
    const scrollPosition = window.scrollY;

    if (header) {
        header.classList.toggle(
            "scrolled",
            scrollPosition > 50
        );
    }

    if (backToTop) {
        backToTop.classList.toggle(
            "show",
            scrollPosition > 500
        );
    }

    settings.lastScrollY = scrollPosition;
}


window.addEventListener(
    "scroll",
    handleHeaderScroll,
    { passive: true }
);


/* =========================================
   9. ACTIVE NAVIGATION LINK
========================================= */

function updateActiveNavigation() {
    const sections = document.querySelectorAll(
        "main section[id]"
    );

    let currentSection = "home";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 180;
        const sectionBottom =
            sectionTop + section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {
            currentSection = section.id;
        }
    });

    navItems.forEach((link) => {
        const target = link.getAttribute("href");

        link.classList.toggle(
            "active",
            target === `#${currentSection}`
        );
    });
}


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);


/* =========================================
   10. SCROLL REVEAL ANIMATIONS
========================================= */

function setupRevealAnimations() {
    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".about-text, " +
        ".detail-card, " +
        ".skill-card, " +
        ".project-card, " +
        ".contact-container"
    );

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach((element) => {
            element.classList.add("active");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");

                    currentObserver.unobserve(
                        entry.target
                    );
                }
            });
        },
        {
            threshold: settings.revealThreshold,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    revealElements.forEach((element, index) => {
        element.classList.add("reveal");

        if (index % 3 === 1) {
            element.classList.add("reveal-delay-1");
        } else if (index % 3 === 2) {
            element.classList.add("reveal-delay-2");
        }

        observer.observe(element);
    });
}


/* =========================================
   11. PROJECT CARDS 3D TILT
========================================= */

function setupProjectTilt() {
    if (prefersReducedMotion) return;

    const projectCards =
        document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -5;

            const rotateY =
                ((x - centerX) / centerX) * 5;

            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform =
                "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
        });
    });
}


/* =========================================
   12. SKILL CARD POINTER GLOW
========================================= */

function setupSkillCardEffects() {
    const cards = document.querySelectorAll(
        ".skill-card, .detail-card"
    );

    cards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.setProperty(
                "--mouse-x",
                `${x}px`
            );

            card.style.setProperty(
                "--mouse-y",
                `${y}px`
            );
        });
    });
}


/* =========================================
   13. GLOBAL MOUSE PARALLAX
========================================= */

let mouseX = 0;
let mouseY = 0;

let currentMouseX = 0;
let currentMouseY = 0;

function handleMouseMovement(event) {
    if (
        prefersReducedMotion ||
        event.pointerType === "touch" ||
        window.innerWidth < 768
    ) {
        return;
    }

    mouseX =
        (event.clientX / window.innerWidth - 0.5) * 2;

    mouseY =
        (event.clientY / window.innerHeight - 0.5) * 2;
}


document.addEventListener(
    "pointermove",
    handleMouseMovement,
    { passive: true }
);


/* =========================================
   14. ADVANCED PLANET PROXIMITY SYSTEM
========================================= */

const planetInteraction = {
    targetProximity: 0,
    currentProximity: 0,

    targetRotateX: 0,
    targetRotateY: 0,

    currentRotateX: 0,
    currentRotateY: 0,

    isInsideUniverse: false
};


function setupPlanetInteraction() {
    if (
        !universe ||
        !mainPlanet ||
        prefersReducedMotion
    ) {
        return;
    }

    universe.addEventListener(
        "pointermove",
        (event) => {
            if (
                event.pointerType === "touch"
            ) {
                return;
            }

            const universeRect =
                universe.getBoundingClientRect();

            const planetRect =
                mainPlanet.getBoundingClientRect();

            const centerX =
                planetRect.left + planetRect.width / 2;

            const centerY =
                planetRect.top + planetRect.height / 2;

            const dx = event.clientX - centerX;
            const dy = event.clientY - centerY;

            const distance = Math.sqrt(
                dx * dx + dy * dy
            );

            const proximity = Math.max(
                0,
                Math.min(
                    1,
                    1 - distance /
                    settings.planetProximityDistance
                )
            );

            planetInteraction.targetProximity =
                proximity;

            const normalizedX =
                dx / settings.planetProximityDistance;

            const normalizedY =
                dy / settings.planetProximityDistance;

            planetInteraction.targetRotateY =
                Math.max(-1, Math.min(1, normalizedX)) *
                settings.planetMaxRotation *
                proximity;

            planetInteraction.targetRotateX =
                Math.max(-1, Math.min(1, -normalizedY)) *
                settings.planetMaxRotation *
                proximity;

            const relativeX =
                ((event.clientX - universeRect.left) /
                    universeRect.width) * 100;

            const relativeY =
                ((event.clientY - universeRect.top) /
                    universeRect.height) * 100;

            universe.style.setProperty(
                "--mouse-x",
                `${relativeX}%`
            );

            universe.style.setProperty(
                "--mouse-y",
                `${relativeY}%`
            );

            universe.classList.add("mouse-active");

            mainPlanet.classList.toggle(
                "planet-near",
                distance < settings.planetProximityDistance
            );

            planetInteraction.isInsideUniverse = true;
        },
        { passive: true }
    );


    universe.addEventListener(
        "pointerleave",
        () => {
            planetInteraction.targetProximity = 0;

            planetInteraction.targetRotateX = 0;
            planetInteraction.targetRotateY = 0;

            planetInteraction.isInsideUniverse = false;

            universe.classList.remove("mouse-active");
            mainPlanet.classList.remove("planet-near");
        }
    );


    mainPlanet.addEventListener(
        "pointerenter",
        () => {
            mainPlanet.classList.add("planet-hovered");
        }
    );

    mainPlanet.addEventListener(
        "pointerleave",
        () => {
            mainPlanet.classList.remove("planet-hovered");
        }
    );
}


/* =========================================
   15. UNIFIED PARALLAX ANIMATION
========================================= */

function animateParallax() {
    if (prefersReducedMotion) return;

    if (window.innerWidth >= 768) {

        currentMouseX +=
            (mouseX - currentMouseX) * 0.04;

        currentMouseY +=
            (mouseY - currentMouseY) * 0.04;


        /* Universe movement */

        if (universe) {
            universe.style.setProperty(
                "--pointer-x",
                `${currentMouseX * settings.parallaxStrength}px`
            );

            universe.style.setProperty(
                "--pointer-y",
                `${currentMouseY * settings.parallaxStrength}px`
            );
        }


        /* Smooth planet proximity */

        planetInteraction.currentProximity +=
            (
                planetInteraction.targetProximity -
                planetInteraction.currentProximity
            ) * 0.12;


        /* Smooth planet rotation */

        planetInteraction.currentRotateX +=
            (
                planetInteraction.targetRotateX -
                planetInteraction.currentRotateX
            ) * 0.1;

        planetInteraction.currentRotateY +=
            (
                planetInteraction.targetRotateY -
                planetInteraction.currentRotateY
            ) * 0.1;


        if (mainPlanet) {

            const baseRotateX =
                currentMouseY * -3;

            const baseRotateY =
                currentMouseX * 3;

            const proximity =
                planetInteraction.currentProximity;

            const finalRotateX =
                baseRotateX +
                planetInteraction.currentRotateX;

            const finalRotateY =
                baseRotateY +
                planetInteraction.currentRotateY;

            mainPlanet.style.setProperty(
                "--planet-rotate-x",
                `${finalRotateX}deg`
            );

            mainPlanet.style.setProperty(
                "--planet-rotate-y",
                `${finalRotateY}deg`
            );

            mainPlanet.style.setProperty(
                "--planet-proximity",
                proximity.toFixed(3)
            );
        }

    } else {

        if (universe) {
            universe.style.setProperty(
                "--pointer-x",
                "0px"
            );

            universe.style.setProperty(
                "--pointer-y",
                "0px"
            );
        }
    }

    requestAnimationFrame(animateParallax);
}


/* =========================================
   16. SMOOTH SCROLLING
========================================= */

function setupSmoothScrolling() {
    const internalLinks =
        document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement =
                document.querySelector(targetId);

            if (!targetElement) return;

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth",

                block: "start"
            });

            closeMobileMenu();
        });
    });
}


/* =========================================
   17. BACK TO TOP
========================================= */

if (backToTop) {
    backToTop.addEventListener("click", (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,

            behavior: prefersReducedMotion
                ? "auto"
                : "smooth"
        });
    });
}


/* =========================================
   18. DYNAMIC FOOTER YEAR
========================================= */

if (yearElement) {
    yearElement.textContent =
        new Date().getFullYear();
}


/* =========================================
   19. BUTTON RIPPLE EFFECT
========================================= */

function setupButtonRipple() {
    if (prefersReducedMotion) return;

    const buttons = document.querySelectorAll(
        ".hero-action, .btn, .text-link"
    );

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const rect =
                button.getBoundingClientRect();

            const ripple =
                document.createElement("span");

            const size = Math.max(
                rect.width,
                rect.height
            );

            ripple.style.position = "absolute";
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;

            ripple.style.left =
                `${event.clientX - rect.left - size / 2}px`;

            ripple.style.top =
                `${event.clientY - rect.top - size / 2}px`;

            ripple.style.borderRadius = "50%";
            ripple.style.background =
                "rgba(255,255,255,0.25)";

            ripple.style.pointerEvents = "none";
            ripple.style.transform = "scale(0)";

            ripple.style.animation =
                "buttonRipple 0.65s ease-out forwards";

            const computedPosition =
                getComputedStyle(button).position;

            if (computedPosition === "static") {
                button.style.position = "relative";
            }

            button.style.overflow = "hidden";

            button.appendChild(ripple);

            ripple.addEventListener(
                "animationend",
                () => {
                    ripple.remove();
                },
                { once: true }
            );
        });
    });


    if (
        !document.getElementById("button-ripple-style")
    ) {
        const style =
            document.createElement("style");

        style.id = "button-ripple-style";

        style.textContent = `
            @keyframes buttonRipple {
                to {
                    transform: scale(2.5);
                    opacity: 0;
                }
            }
        `;

        document.head.appendChild(style);
    }
}


/* =========================================
   20. PAGE LOADING EFFECT
========================================= */

function setupPageLoading() {
    document.body.classList.add("page-loaded");

    window.addEventListener(
        "load",
        () => {
            document.body.classList.add("fully-loaded");
        },
        { once: true }
    );
}


/* =========================================
   21. INITIALIZE WEBSITE
========================================= */

function initializeWebsite() {

    createAnimationStyles();

    createStars();
    createShootingStars();

    setupMoonOrbits();

    setupRevealAnimations();

    setupProjectTilt();
    setupSkillCardEffects();

    setupPlanetInteraction();

    setupSmoothScrolling();
    setupButtonRipple();

    setupPageLoading();

    handleHeaderScroll();
    updateActiveNavigation();


    if (!prefersReducedMotion) {
        requestAnimationFrame(animateMoonOrbits);
        requestAnimationFrame(animateParallax);
    }
}


/* =========================================
   22. START WEBSITE
========================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite,
        { once: true }
    );

} else {

    initializeWebsite();

}

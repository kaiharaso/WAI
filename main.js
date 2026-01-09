/**
 * Portfolio Site - Main JavaScript
 * Handles navigation, scroll animations, and interactions
 */

// DOM Elements
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Loading Screen Elements
const loadingScreen = document.getElementById("loadingScreen");
const loadingName = document.getElementById("loadingName");
const loadingLogo = document.getElementById("loadingLogo");
const mainContent = document.getElementById("mainContent");

// ===================================
// Loading Sequence Controller
// ===================================
function initLoadingSequence() {
  // Timeline with overlapping crossfade transitions:
  // 0.0s - Name starts appearing
  // 0.1s - Name becomes fully visible
  // 2.0s - Name starts fading, logo begins appearing (crossfade)
  // 2.3s - Logo fully visible
  // 4.5s - Logo starts fading, main content begins appearing
  // 5.5s - Main content fully visible

  // Phase 1: Show name with slight delay for smoothness
  setTimeout(() => {
    loadingName.classList.add("visible");
  }, 100);

  // Phase 2: Crossfade - start fading name and showing logo simultaneously
  setTimeout(() => {
    loadingName.classList.add("fade-out");
    loadingName.classList.remove("visible");
  }, 2000);

  setTimeout(() => {
    loadingLogo.classList.add("visible");
  }, 2300);

  // Phase 3: Transition from Logo to Main Content
  setTimeout(() => {
    loadingLogo.classList.add("fade-out");
    loadingLogo.classList.remove("visible");
  }, 4500);

  setTimeout(() => {
    loadingScreen.classList.add("fade-out");
    mainContent.classList.add("visible");
    
    // Enable scrolling after content is visible
    document.body.style.overflow = "";
  }, 5200);

  // Remove loading screen from DOM after animation
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 6500);
}

// Prevent scrolling during loading
document.body.style.overflow = "hidden";

// ===================================
// Header Scroll Effect
// ===================================
let lastScrollY = window.scrollY;

function handleScroll() {
  const currentScrollY = window.scrollY;

  // Add/remove scrolled class for header background
  if (currentScrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScrollY = currentScrollY;
}

window.addEventListener("scroll", handleScroll, { passive: true });

// ===================================
// Scroll-based Color Theme Transition (Dark to White)
// ===================================
function initColorTransition() {
  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function lerpColor(startRGB, endRGB, t) {
    return {
      r: Math.round(lerp(startRGB.r, endRGB.r, t)),
      g: Math.round(lerp(startRGB.g, endRGB.g, t)),
      b: Math.round(lerp(startRGB.b, endRGB.b, t))
    };
  }

  // Color definitions - Dark → Blue → Light transition
  const darkTheme = {
    bg: { r: 10, g: 10, b: 10 },
    bgSecondary: { r: 17, g: 17, b: 17 },
    surface: { r: 26, g: 26, b: 26 },
    text: { r: 255, g: 255, b: 255 },
    textSecondary: { r: 136, g: 136, b: 136 },
    textMuted: { r: 85, g: 85, b: 85 },
    border: { r: 34, g: 34, b: 34 },
    accent: { r: 99, g: 102, b: 241 }
  };

  // Beautiful blue mid-theme
  const blueTheme = {
    bg: { r: 15, g: 30, b: 60 },              // Deep navy blue
    bgSecondary: { r: 20, g: 45, b: 85 },     // Rich blue
    surface: { r: 30, g: 60, b: 110 },        // Vibrant blue surface
    text: { r: 255, g: 255, b: 255 },
    textSecondary: { r: 150, g: 180, b: 220 },
    textMuted: { r: 100, g: 130, b: 180 },
    border: { r: 50, g: 80, b: 130 },
    accent: { r: 100, g: 180, b: 255 }        // Bright sky blue accent
  };

  const lightTheme = {
    bg: { r: 255, g: 248, b: 231 },           // #FFF8E7
    bgSecondary: { r: 252, g: 245, b: 228 },  // Slightly darker cream
    surface: { r: 245, g: 238, b: 220 },      // Cream surface
    text: { r: 10, g: 10, b: 10 },
    textSecondary: { r: 100, g: 95, b: 85 },
    textMuted: { r: 160, g: 155, b: 140 },
    border: { r: 235, g: 228, b: 210 },
    accent: { r: 79, g: 70, b: 229 }
  };

  function updateColors() {
    const scrollY = window.scrollY;
    
    // Get the work section as the end point for the transition
    const workSection = document.getElementById('work');
    const transitionSection = document.getElementById('transition');
    if (!workSection) return;
    
    const workRect = workSection.getBoundingClientRect();
    const workTop = workRect.top + scrollY;
    
    // Transition starts from 0 (top of page) and ends at the work section
    const transitionStart = 0;
    const transitionEnd = workTop;
    
    // Calculate progress: 0 at top, 1 when reaching "Selected Work"
    let progress = 0;
    
    if (scrollY <= transitionStart) {
      // At top - stay dark
      progress = 0;
    } else if (scrollY >= transitionEnd) {
      // At or past work section - stay light
      progress = 1;
    } else {
      // Scrolling - interpolate
      progress = scrollY / transitionEnd;
    }
    
    // Quadratic ease-in-out
    const easedProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // Three-phase interpolation: Dark → Blue → Light
    // 0.0 - 0.5: Dark to Blue
    // 0.5 - 1.0: Blue to Light
    let bg, bgSecondary, surface, text, textSecondary, textMuted, border, accent;
    
    if (easedProgress <= 0.5) {
      // First half: Dark → Blue (scale 0-0.5 to 0-1)
      const phaseProgress = easedProgress * 2;
      bg = lerpColor(darkTheme.bg, blueTheme.bg, phaseProgress);
      bgSecondary = lerpColor(darkTheme.bgSecondary, blueTheme.bgSecondary, phaseProgress);
      surface = lerpColor(darkTheme.surface, blueTheme.surface, phaseProgress);
      text = lerpColor(darkTheme.text, blueTheme.text, phaseProgress);
      textSecondary = lerpColor(darkTheme.textSecondary, blueTheme.textSecondary, phaseProgress);
      textMuted = lerpColor(darkTheme.textMuted, blueTheme.textMuted, phaseProgress);
      border = lerpColor(darkTheme.border, blueTheme.border, phaseProgress);
      accent = lerpColor(darkTheme.accent, blueTheme.accent, phaseProgress);
    } else {
      // Second half: Blue → Light (scale 0.5-1 to 0-1)
      const phaseProgress = (easedProgress - 0.5) * 2;
      bg = lerpColor(blueTheme.bg, lightTheme.bg, phaseProgress);
      bgSecondary = lerpColor(blueTheme.bgSecondary, lightTheme.bgSecondary, phaseProgress);
      surface = lerpColor(blueTheme.surface, lightTheme.surface, phaseProgress);
      text = lerpColor(blueTheme.text, lightTheme.text, phaseProgress);
      textSecondary = lerpColor(blueTheme.textSecondary, lightTheme.textSecondary, phaseProgress);
      textMuted = lerpColor(blueTheme.textMuted, lightTheme.textMuted, phaseProgress);
      border = lerpColor(blueTheme.border, lightTheme.border, phaseProgress);
      accent = lerpColor(blueTheme.accent, lightTheme.accent, phaseProgress);
    }

    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--color-bg', `rgb(${bg.r}, ${bg.g}, ${bg.b})`);
    root.style.setProperty('--color-bg-secondary', `rgb(${bgSecondary.r}, ${bgSecondary.g}, ${bgSecondary.b})`);
    root.style.setProperty('--color-surface', `rgb(${surface.r}, ${surface.g}, ${surface.b})`);
    root.style.setProperty('--color-text', `rgb(${text.r}, ${text.g}, ${text.b})`);
    root.style.setProperty('--color-text-secondary', `rgb(${textSecondary.r}, ${textSecondary.g}, ${textSecondary.b})`);
    root.style.setProperty('--color-text-muted', `rgb(${textMuted.r}, ${textMuted.g}, ${textMuted.b})`);
    root.style.setProperty('--color-border', `rgb(${border.r}, ${border.g}, ${border.b})`);
    root.style.setProperty('--color-accent', `rgb(${accent.r}, ${accent.g}, ${accent.b})`);
    root.style.setProperty('--color-accent-hover', `rgb(${Math.min(accent.r + 30, 255)}, ${Math.min(accent.g + 30, 255)}, ${Math.min(accent.b + 15, 255)})`);
    
    // Toggle transition section visibility
    if (transitionSection) {
      const transitionRect = transitionSection.getBoundingClientRect();
      if (transitionRect.top < window.innerHeight * 0.7) {
        transitionSection.classList.add('visible');
      }
    }
  }

  // Initial call
  updateColors();

  // Update on scroll with throttling
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateColors();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===================================
// Mobile Menu Toggle
// ===================================
function toggleMenu() {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
  document.body.style.overflow = navLinks.classList.contains("active")
    ? "hidden"
    : "";
}

menuToggle.addEventListener("click", toggleMenu);

// Close menu when clicking a link
navLinks.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks.classList.contains("active")) {
      toggleMenu();
    }
  });
});

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===================================
// Intersection Observer for Fade-in Animations
// ===================================
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      fadeInObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for fade-in animation
function initFadeInObserver() {
  const elementsToAnimate = document.querySelectorAll(
    ".project-card, .about-content, .contact-content, .section-header"
  );

  elementsToAnimate.forEach((el, index) => {
    el.classList.add("fade-in");
    el.style.transitionDelay = `${index * 0.05}s`;
    fadeInObserver.observe(el);
  });
}

// ===================================
// Project Modal
// ===================================
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const projectCards = document.querySelectorAll('.project-card[data-project]');

  // Modal elements
  const modalNumber = document.getElementById('modalNumber');
  const modalYear = document.getElementById('modalYear');
  const modalTitle = document.getElementById('modalTitle');
  const modalClient = document.getElementById('modalClient');
  const modalDescription = document.getElementById('modalDescription');
  const modalTech = document.getElementById('modalTech');

  function openModal(card) {
    const projectNum = card.dataset.project;
    const title = card.dataset.title;
    const client = card.dataset.client;
    const year = card.dataset.year;
    const description = card.dataset.description;
    const tech = card.dataset.tech;

    // Populate modal
    modalNumber.textContent = projectNum.padStart(2, '0');
    modalYear.textContent = year;
    modalTitle.textContent = title;
    modalClient.textContent = client;
    modalDescription.textContent = description;
    modalTech.textContent = tech;

    // Copy image from card to modal
    const cardImg = card.querySelector('.project-placeholder img');
    const modalImagePlaceholder = modal.querySelector('.modal-image-placeholder');
    
    // Clear previous image content
    const existingImg = modalImagePlaceholder.querySelector('img');
    if (existingImg) {
      existingImg.remove();
    }
    
    // If the card has an image, copy it to the modal
    if (cardImg) {
      const modalImg = document.createElement('img');
      modalImg.src = cardImg.src;
      modalImg.alt = title;
      modalImagePlaceholder.appendChild(modalImg);
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  modalBackdrop.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ===================================
// Project Card Hover Effects
// ===================================
function initProjectCardEffects() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      // Add subtle parallax to other cards
      projectCards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.style.opacity = "0.5";
        }
      });
    });

    card.addEventListener("mouseleave", function () {
      projectCards.forEach((otherCard) => {
        otherCard.style.opacity = "1";
      });
    });
  });
}

// ===================================
// Cursor Trail Effect (Optional Enhancement)
// ===================================
function initCursorEffect() {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.innerHTML =
    '<div class="cursor-dot"></div><div class="cursor-outline"></div>';

  // Only add on desktop
  if (window.matchMedia("(min-width: 769px)").matches) {
    // Cursor effect disabled by default - uncomment to enable
    // document.body.appendChild(cursor);
    // document.addEventListener('mousemove', (e) => {
    //     cursor.style.left = e.clientX + 'px';
    //     cursor.style.top = e.clientY + 'px';
    // });
  }
}

// ===================================
// Parallax Effect for Hero
// ===================================
function initParallax() {
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const opacity = 1 - scrolled / window.innerHeight;
        const translateY = scrolled * 0.3;

        heroContent.style.transform = `translateY(${translateY}px)`;
        heroContent.style.opacity = Math.max(0, opacity);
      }
    },
    { passive: true }
  );
}

// ===================================
// Initialize Everything
// ===================================
document.addEventListener("DOMContentLoaded", () => {
  // Start loading sequence first
  initLoadingSequence();
  
  initFadeInObserver();
  initProjectCardEffects();
  initProjectModal();
  initCursorEffect();
  initParallax();
  initColorTransition();

  // Add loaded class to body for initial animations
  document.body.classList.add("loaded");
});

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Resume animations if needed
  }
});

// Console easter egg
console.log(
  "%c👋 Hello, curious developer!",
  "color: #6366f1; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cLooking at the code? Feel free to explore!",
  "color: #888; font-size: 12px;"
);

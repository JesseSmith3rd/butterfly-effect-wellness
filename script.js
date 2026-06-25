// Service select helper for CTA buttons
window.selectService = function(val) {
  const select = document.getElementById("serviceSelect");
  if (select) {
    select.value = val;
  }
};

// URL query parameter parsing on page load (for book.html)
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get("service");
  if (serviceParam) {
    // Small delay to ensure form is fully rendered
    setTimeout(() => {
      window.selectService(serviceParam);
    }, 100);
  }

  // Pre-fill the booking message with wellness assessment metrics if available
  const score = params.get("score");
  if (score !== null) {
    const sleep = params.get("sleep") || "N/A";
    const exercise = params.get("exercise") || "N/A";
    const calories = params.get("calories") || "N/A";
    const water = params.get("water") || "N/A";
    const stress = params.get("stress") || "N/A";
    const goal = params.get("goal") || "N/A";

    const msgTextarea = document.getElementById("booking-message");
    if (msgTextarea) {
      msgTextarea.value = `Hi Kena,\n\nI just completed the interactive Wellness Assessment and scored ${score}/100. Here are my metrics:\n` +
                          `- Sleep: ${sleep}\n` +
                          `- Exercise: ${exercise}\n` +
                          `- Nutrition (Calorie Intake): ${calories}\n` +
                          `- Hydration: ${water}\n` +
                          `- Stress Level: ${stress}\n` +
                          `- Primary Goal: ${goal}\n\n` +
                          `I would love to review my results with you during my Free Assessment.`;
    }
  }
});

// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close nav when clicking a link (mobile)
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Contact form submission handler
const form = document.getElementById("leadForm");
const note = document.getElementById("formNote");

if (form && note) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    note.textContent =
      "Thanks! Your message has been sent. Kena will contact you soon!";
    note.style.color = "var(--brand2)";
    note.style.fontWeight = "bold";

    form.reset();
  });
}

// Welcome Video Modal Logic
const openVideoBtn = document.getElementById("openVideoBtn");
const videoModal = document.getElementById("videoModal");
const closeVideoBtn = document.getElementById("closeVideoBtn");
const videoModalOverlay = document.getElementById("videoModalOverlay");
const welcomeVideo = document.getElementById("welcomeVideo");
const startMockVideoBtn = document.getElementById("startMockVideoBtn");
const mockVideoOverlay = document.getElementById("mockVideoOverlay");

if (openVideoBtn && videoModal) {
  const openModal = () => {
    videoModal.classList.add("is-open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent page scrolling
  };

  const closeModal = () => {
    videoModal.classList.remove("is-open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore page scrolling
    if (welcomeVideo) {
      welcomeVideo.pause();
    }
    if (mockVideoOverlay) {
      mockVideoOverlay.classList.remove("is-playing");
    }
  };

  openVideoBtn.addEventListener("click", openModal);

  if (closeVideoBtn) closeVideoBtn.addEventListener("click", closeModal);
  if (videoModalOverlay) videoModalOverlay.addEventListener("click", closeModal);

  // ESC key to close modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // Mock overlay play logic
  if (startMockVideoBtn && mockVideoOverlay && welcomeVideo) {
    startMockVideoBtn.addEventListener("click", () => {
      mockVideoOverlay.classList.add("is-playing");
      welcomeVideo.play().catch(err => {
        console.log("Video auto-play failed, waiting for user manual action: ", err);
      });
    });
  }
}

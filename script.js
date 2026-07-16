// Service select helper for CTA buttons
window.selectService = function(val) {
  const select = document.getElementById("serviceSelect");
  if (select) {
    select.value = val;
  }
};

// URL query parameter parsing on page load (for book.html)
window.addEventListener("DOMContentLoaded", () => {
  // Avoid duplicate executions if script.js is loaded multiple times
  if (window.bookingListenerAttached) return;
  window.bookingListenerAttached = true;

  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get("service");
  if (serviceParam) {
    // Small delay to ensure form is fully rendered
    setTimeout(() => {
      window.selectService(serviceParam);
    }, 100);
  }

  // Pre-fill from sessionStorage first (Privacy-safe approach)
  let assessmentData = null;
  try {
    const storedAssessment = sessionStorage.getItem("wellness_assessment");
    assessmentData = storedAssessment ? JSON.parse(storedAssessment) : null;
  } catch (error) {
    console.warn("Unable to read wellness assessment data from sessionStorage.", error);
    sessionStorage.removeItem("wellness_assessment");
  }

  const msgTextarea = document.getElementById("booking-message");

  if (assessmentData) {
    const score = assessmentData.score;
    const sleep = assessmentData.sleep || "N/A";
    const exercise = assessmentData.exercise || "N/A";
    const nutrition = assessmentData.nutrition || "N/A";
    const water = assessmentData.water || "N/A";
    const stress = assessmentData.stress || "N/A";
    const goal = assessmentData.goal || "N/A";

    let bmiDetails = "";
    if (assessmentData.bmi) {
      const bmi = assessmentData.bmi;
      bmiDetails = `\n- BMI Screening: ${bmi.value} (${bmi.category} - Height: ${bmi.heightDisplay}, Weight: ${bmi.weightDisplay})`;
    }

    if (msgTextarea) {
      msgTextarea.value = `Hi Kena,\n\nI just completed the interactive Wellness Assessment and scored ${score}/100. Here are my metrics:\n` +
                          `- Sleep: ${sleep}\n` +
                          `- Exercise: ${exercise}\n` +
                          `- Nutrition (Habits): ${nutrition}\n` +
                          `- Hydration: ${water}\n` +
                          `- Stress Level: ${stress}\n` +
                          `- Primary Goal: ${goal}` +
                          bmiDetails + `\n\n` +
                          `I would love to review my results with you during my Free Assessment.`;
    }

    // Auto-select Free Assessment option in the dropdown
    const serviceSelect = document.getElementById("serviceSelect");
    if (serviceSelect) {
      serviceSelect.value = "Free Assessment";
    }
  } else {
    // Fallback: Pre-fill the booking message with wellness assessment metrics from URL parameters if available
    const score = params.get("score");
    if (score !== null) {
      const sleep = params.get("sleep") || "N/A";
      const exercise = params.get("exercise") || "N/A";
      const calories = params.get("calories") || "N/A";
      const water = params.get("water") || "N/A";
      const stress = params.get("stress") || "N/A";
      const goal = params.get("goal") || "N/A";

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
  if (!form.dataset.listenerAttached) {
    form.dataset.listenerAttached = "true";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      note.textContent =
        "Thanks! Your message has been sent. Kena will contact you soon!";
      note.style.color = "var(--brand2)";
      note.style.fontWeight = "bold";

      form.reset();

      // Clear both sessionStorage entries only on successful submission
      sessionStorage.removeItem("wellness_assessment");
      sessionStorage.removeItem("wellness_assessment_progress");
    });
  }
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

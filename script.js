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

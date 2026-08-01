// Service select helper for CTA buttons
window.selectService = function(val) {
  const select = document.getElementById("serviceSelect");
  if (select) {
    select.value = val;
    return;
  }
  // Fallback for checkbox checklist
  let checkboxToCheck = null;
  if (!val) return;
  const decodedVal = decodeURIComponent(val).trim();

  if (decodedVal.includes("Online") || decodedVal.includes("Online Coaching") || decodedVal === "Online") {
    checkboxToCheck = "Functional Training – Online";
  } else if (decodedVal.includes("Concierge") || decodedVal.includes("In-Home") || decodedVal.includes("Personal Training")) {
    checkboxToCheck = "Functional In-Home Concierge Training";
  } else if (decodedVal.includes("Group Fitness") || decodedVal.includes("Group")) {
    checkboxToCheck = "Group Fitness (3 or More Participants)";
  } else if (decodedVal.includes("Nutrition")) {
    checkboxToCheck = "Nutrition Coaching";
  } else if (decodedVal.includes("General") || decodedVal.includes("Inquiry")) {
    checkboxToCheck = "General Inquiry";
  }

  if (checkboxToCheck) {
    const cb = Array.from(document.querySelectorAll('.goal-checkbox')).find(c => c.value === checkboxToCheck);
    if (cb) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change'));
    }
  }
};

// URL query parameter parsing on page load (for book.html)
window.addEventListener("DOMContentLoaded", () => {
  // Avoid duplicate executions if script.js is loaded multiple times
  if (window.bookingListenerAttached) return;
  window.bookingListenerAttached = true;

  const params = new URLSearchParams(window.location.search);
  
  // Goals selection check list logic initialization
  const goalsChecklist = document.querySelector('.goals-checklist');
  if (goalsChecklist) {
    const checkboxes = goalsChecklist.querySelectorAll('.goal-checkbox');
    const selectedGoalsContainer = document.getElementById('selected-goals-container');
    const selectedGoalsChips = document.getElementById('selected-goals-chips');
    const prioritizationContainer = document.getElementById('prioritization-container');
    const prioritizedGoalsList = document.getElementById('prioritized-goals-list');
    const msgTextarea = document.getElementById("booking-message");

    let priorityOrder = [];

    // Checkbox event listeners
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const val = checkbox.value;
        if (checkbox.checked) {
          if (!priorityOrder.includes(val)) {
            priorityOrder.push(val);
          }
        } else {
          priorityOrder = priorityOrder.filter(item => item !== val);
        }
        updateGoalsUI();
      });
    });

    function updateGoalsUI() {
      // 1. Render Chips/Tags
      selectedGoalsChips.innerHTML = '';
      if (priorityOrder.length > 0) {
        selectedGoalsContainer.style.display = 'flex';
        priorityOrder.forEach(goalName => {
          const chip = document.createElement('span');
          chip.className = 'goal-chip';
          chip.setAttribute('role', 'button');
          chip.setAttribute('tabindex', '0');
          chip.setAttribute('aria-label', `Remove ${goalName}`);
          chip.innerHTML = `✓ ${goalName} <span class="chip-close" aria-hidden="true">&times;</span>`;
          
          chip.addEventListener('click', () => removeGoal(goalName));
          chip.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              removeGoal(goalName);
            }
          });
          selectedGoalsChips.appendChild(chip);
        });
      } else {
        selectedGoalsContainer.style.display = 'none';
      }

      // 2. Render Prioritized List
      prioritizedGoalsList.innerHTML = '';
      if (priorityOrder.length > 1) {
        prioritizationContainer.style.display = 'flex';
        priorityOrder.forEach((goalName, index) => {
          const item = document.createElement('div');
          item.className = 'priority-item';
          item.setAttribute('draggable', 'true');
          item.setAttribute('role', 'listitem');
          item.setAttribute('data-index', index);
          item.setAttribute('data-goal', goalName);

          const rankNames = ["Primary", "Secondary", "Third", "Fourth", "Fifth"];
          let selectOptionsHtml = '';
          for (let i = 0; i < priorityOrder.length; i++) {
            const optLabel = rankNames[i] || `${i + 1}th`;
            selectOptionsHtml += `<option value="${i}" ${i === index ? 'selected' : ''}>${optLabel}</option>`;
          }

          item.innerHTML = `
            <div class="priority-item-drag-handle" aria-hidden="true">☰</div>
            <span class="priority-item-name">${goalName}</span>
            <div class="priority-item-rank-selector">
              <label for="rank-select-${index}" class="sr-only">Rank priority for ${goalName}</label>
              <select id="rank-select-${index}" class="priority-rank-select" aria-label="Select priority rank for ${goalName}">
                ${selectOptionsHtml}
              </select>
            </div>
          `;

          const select = item.querySelector('.priority-rank-select');
          select.addEventListener('change', (e) => {
            const newIndex = parseInt(e.target.value);
            reorderGoals(index, newIndex);
          });

          // Drag and Drop Events
          item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
            item.classList.add('dragging');
          });
          item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
          });
          item.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingEl = prioritizedGoalsList.querySelector('.dragging');
            if (draggingEl && draggingEl !== item) {
              const rect = item.getBoundingClientRect();
              const midpoint = rect.top + rect.height / 2;
              if (e.clientY < midpoint) {
                prioritizedGoalsList.insertBefore(draggingEl, item);
              } else {
                prioritizedGoalsList.insertBefore(draggingEl, item.nextSibling);
              }
            }
          });
          item.addEventListener('drop', (e) => {
            e.preventDefault();
            const items = Array.from(prioritizedGoalsList.querySelectorAll('.priority-item'));
            priorityOrder = items.map(el => el.getAttribute('data-goal'));
            updateGoalsUI();
          });

          prioritizedGoalsList.appendChild(item);
        });
      } else {
        prioritizationContainer.style.display = 'none';
      }
    }

    function removeGoal(goalName) {
      const checkbox = Array.from(checkboxes).find(cb => cb.value === goalName);
      if (checkbox) {
        checkbox.checked = false;
      }
      priorityOrder = priorityOrder.filter(item => item !== goalName);
      updateGoalsUI();
    }

    function reorderGoals(oldIndex, newIndex) {
      const movedItem = priorityOrder.splice(oldIndex, 1)[0];
      priorityOrder.splice(newIndex, 0, movedItem);
      updateGoalsUI();
    }

    // Initialize checkbox states on load
    checkboxes.forEach(cb => {
      if (cb.checked) {
        priorityOrder.push(cb.value);
      }
    });
    updateGoalsUI();

    // Expose local select function to selectService window scope
    window.localCheckboxes = checkboxes;
  }

  const serviceParam = params.get("service");
  if (serviceParam) {
    setTimeout(() => {
      window.selectService(serviceParam);
    }, 100);
  }

  // Pre-fill from sessionStorage first
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

    // Auto-select goal checkbox matching assessment goal
    if (goal !== "N/A") {
      let checkboxGoal = null;
      const gLower = goal.toLowerCase();
      if (gLower.includes("nutrition")) {
        checkboxGoal = "Nutrition Coaching";
      } else if (gLower.includes("strength") || gLower.includes("loss") || gLower.includes("weight") || gLower.includes("energy")) {
        checkboxGoal = "Functional Training – Online";
      } else if (gLower.includes("mobility")) {
        checkboxGoal = "Functional In-Home Concierge Training";
      } else {
        checkboxGoal = "General Inquiry";
      }

      if (checkboxGoal) {
        const cb = Array.from(document.querySelectorAll('.goal-checkbox')).find(c => c.value === checkboxGoal);
        if (cb && !cb.checked) {
          cb.checked = true;
          cb.dispatchEvent(new Event('change'));
        }
      }
    }

    if (msgTextarea) {
      msgTextarea.value = `Hi Kena,\n\nI just completed the interactive Wellness Assessment and scored ${score}/100. Here are my metrics:\n` +
                          `- Sleep: ${sleep}\n` +
                          `- Exercise: ${exercise}\n` +
                          `- Nutrition (Habits): ${nutrition}\n` +
                          `- Hydration: ${water}\n` +
                          `- Stress Level: ${stress}\n` +
                          `- Assessment Goal: ${goal}` +
                          bmiDetails + `\n\n` +
                          `I would love to review my results with you during my Free Assessment.`;
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
                            `- Assessment Goal: ${goal}\n\n` +
                            `I would love to review my results with you during my Free Assessment.`;
      }
    }
  }

  // Hook into form submit to append goals to message
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', () => {
      const msgTextarea = document.getElementById("booking-message");
      const checkboxes = document.querySelectorAll('.goal-checkbox');
      const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
      
      // Get the current elements in prioritized-goals-list to get the actual prioritized order
      const priorityItems = Array.from(document.querySelectorAll('#prioritized-goals-list .priority-item'));
      let finalOrder = priorityItems.map(item => item.getAttribute('data-goal'));
      
      // Fallback if only 1 item is selected (prioritized list only shows for 2+ items)
      if (finalOrder.length === 0 && checkedBoxes.length > 0) {
        finalOrder = checkedBoxes.map(cb => cb.value);
      }

      if (finalOrder.length > 0) {
        let goalsText = "Goals (Prioritized):\n";
        const rankNames = ["Primary", "Secondary", "Third", "Fourth", "Fifth"];
        finalOrder.forEach((goal, i) => {
          const label = rankNames[i] || `${i + 1}th`;
          goalsText += `- ${i + 1}. ${goal} (${label})\n`;
        });
        goalsText += "\n";
        
        if (msgTextarea) {
          msgTextarea.value = goalsText + msgTextarea.value;
        }
      }
    });
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

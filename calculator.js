document.addEventListener("DOMContentLoaded", () => {
  const calculator = document.getElementById("wellness-calculator");
  if (!calculator) return;

  // State Management
  const state = {
    step: 1,
    goal: "Strength",
    water: 64,
    activity: "Moderate"
  };

  // DOM Elements
  const steps = calculator.querySelectorAll(".calculator-step");
  const nextBtns = calculator.querySelectorAll(".btn-calc-next");
  const prevBtns = calculator.querySelectorAll(".btn-calc-prev");
  const submitBtn = calculator.querySelector(".btn-calc-submit");
  const resetBtn = calculator.querySelector(".btn-calc-reset");
  
  const goalOptions = calculator.querySelectorAll(".goal-option");
  const waterSlider = document.getElementById("water-range");
  const waterReadout = document.getElementById("water-readout");
  const activityOptions = calculator.querySelectorAll(".activity-option");
  
  // Results Elements
  const waterFill = document.getElementById("blueprint-water-fill");
  const waterStat = document.getElementById("blueprint-water-stat");
  const waterFeedback = document.getElementById("blueprint-water-feedback");
  const movementStat = document.getElementById("blueprint-movement-stat");
  const movementFeedback = document.getElementById("blueprint-movement-feedback");
  const habitFeedback = document.getElementById("blueprint-habit-feedback");

  // Step Navigation Display
  function updateStepDisplay() {
    steps.forEach(step => {
      const stepNum = step.getAttribute("data-step");
      if (stepNum == state.step || (stepNum === "results" && state.step === 4)) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
  }

  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (state.step < 3) {
        state.step += 1;
        updateStepDisplay();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (state.step > 1) {
        state.step -= 1;
        updateStepDisplay();
      }
    });
  });

  // Goal Option Selectors
  goalOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      goalOptions.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      state.goal = opt.getAttribute("data-value");
    });
  });

  // Live Slider Readout
  if (waterSlider && waterReadout) {
    waterSlider.addEventListener("input", (e) => {
      state.water = parseInt(e.target.value, 10);
      waterReadout.textContent = state.water;
    });
  }

  // Activity Selectors
  activityOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      activityOptions.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      state.activity = opt.getAttribute("data-value");
    });
  });

  // Reset Form
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.step = 1;
      state.goal = "Strength";
      state.water = 64;
      state.activity = "Moderate";
      
      goalOptions.forEach(o => o.classList.remove("active"));
      goalOptions[0].classList.add("active");
      
      if (waterSlider) waterSlider.value = 64;
      if (waterReadout) waterReadout.textContent = "64";
      
      activityOptions.forEach(o => o.classList.remove("active"));
      activityOptions[1].classList.add("active");
      
      updateStepDisplay();
    });
  }

  // Wellness Starting Point Calculation and Rendering
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      // 1. Calculate Target Hydration (varies based on activity modifier)
      let recommendedWater = 80;
      if (state.activity === "Moderate") recommendedWater = 96;
      if (state.activity === "Active") recommendedWater = 112;
      
      const waterPct = Math.min(100, Math.round((state.water / recommendedWater) * 100));
      
      if (waterFill) waterFill.style.width = `${waterPct}%`;
      if (waterStat) waterStat.textContent = `${recommendedWater} oz`;
      
      let waterText = "";
      if (state.water >= recommendedWater) {
        waterText = "Outstanding! You are fully meeting your baseline hydration goal.";
      } else {
        const diff = recommendedWater - state.water;
        waterText = `You drink ${state.water} oz daily. Add ${diff} oz more to reach your optimal recovery target.`;
      }
      if (waterFeedback) waterFeedback.textContent = waterText;

      // 2. Recommend Movement Minutes & Types
      let moveMins = 150;
      let moveText = "";
      if (state.goal === "Strength") {
        moveMins = state.activity === "Active" ? 240 : 180;
        moveText = "Prioritize 3-4 weekly sessions of progressive resistance lifting. Target structural compound lifts.";
      } else if (state.goal === "Movement") {
        moveMins = state.activity === "Active" ? 180 : 150;
        moveText = "Integrate daily mobility tracks, active recovery walks, and core activation grids to preserve posture.";
      } else {
        moveMins = 120;
        moveText = "Build consistency with low-barrier cardiovascular movement (e.g. 20-min daily walks) to lock in habits.";
      }
      
      if (movementStat) movementStat.textContent = `${moveMins} mins / week`;
      if (movementFeedback) movementFeedback.textContent = moveText;

      // 3. Custom Habit Stacking Advice
      let habitText = "";
      if (state.goal === "Strength") {
        habitText = "Stack your recovery shake immediately after you unlace your sneakers to automate training loops.";
      } else if (state.goal === "Movement") {
        habitText = "Perform 5 minutes of core stretch rotations directly after your morning coffee cue.";
      } else {
        habitText = "Set your visual check-in journal on top of your pillow in the morning to trigger evening mindfulness habit loops.";
      }
      
      if (habitFeedback) habitFeedback.textContent = habitText;

      // Render Results Step
      state.step = 4;
      updateStepDisplay();
    });
  }
});

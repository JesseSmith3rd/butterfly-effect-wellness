document.addEventListener("DOMContentLoaded", () => {
  const calculator = document.getElementById("wellness-calculator");
  if (!calculator) return;

  // State Management
  const state = {
    step: 1,
    sleep: 7,
    exercise: 3,
    calories: 2000
  };

  // DOM Elements
  const steps = calculator.querySelectorAll(".calculator-step");
  const nextBtns = calculator.querySelectorAll(".btn-calc-next");
  const prevBtns = calculator.querySelectorAll(".btn-calc-prev");
  const submitBtn = calculator.querySelector(".btn-calc-submit");
  const resetBtn = calculator.querySelector(".btn-calc-reset");
  
  const sleepSlider = document.getElementById("sleep-range");
  const sleepReadout = document.getElementById("sleep-readout");
  
  const exerciseOptions = calculator.querySelectorAll(".exercise-option");
  
  const calorieInput = document.getElementById("calorie-input");
  const presetBadges = calculator.querySelectorAll(".preset-badge");
  
  // Results Elements
  const needle = document.getElementById("gauge-needle");
  const scoreVal = document.getElementById("wellness-score");
  const labelVal = document.getElementById("wellness-label");
  const readoutText = document.getElementById("assessment-readout");
  
  const sleepScoreText = document.getElementById("sleep-score-val");
  const exerciseScoreText = document.getElementById("exercise-score-val");
  const calorieScoreText = document.getElementById("calorie-score-val");

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

  // Sleep Slider
  if (sleepSlider && sleepReadout) {
    sleepSlider.addEventListener("input", (e) => {
      state.sleep = parseFloat(e.target.value);
      sleepReadout.textContent = state.sleep;
    });
  }

  // Exercise Day Selection Buttons
  exerciseOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      exerciseOptions.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      state.exercise = parseInt(opt.getAttribute("data-value"), 10);
    });
  });

  // Calorie Input & Presets
  if (calorieInput) {
    calorieInput.addEventListener("input", (e) => {
      state.calories = parseInt(e.target.value, 10) || 0;
    });
  }

  presetBadges.forEach(badge => {
    badge.addEventListener("click", () => {
      const val = parseInt(badge.getAttribute("data-value"), 10);
      state.calories = val;
      if (calorieInput) {
        calorieInput.value = val;
      }
    });
  });

  // Reset Assessment
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.step = 1;
      state.sleep = 7;
      state.exercise = 3;
      state.calories = 2000;
      
      if (sleepSlider) sleepSlider.value = 7;
      if (sleepReadout) sleepReadout.textContent = "7";
      
      exerciseOptions.forEach(o => o.classList.remove("active"));
      // Make 3 active by default
      const defaultEx = calculator.querySelector('.exercise-option[data-value="3"]');
      if (defaultEx) defaultEx.classList.add("active");
      
      if (calorieInput) calorieInput.value = 2000;
      
      // Reset needle rotation
      if (needle) {
        needle.setAttribute("transform", "translate(100, 100) rotate(0)");
      }
      
      updateStepDisplay();
    });
  }

  // Scoring and Assessment Logic
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      // Validate Calorie Input
      if (state.calories <= 0 || isNaN(state.calories)) {
        alert("Please enter a valid daily calorie estimate (greater than 0).");
        return;
      }

      // 1. Calculate Sleep Score (max 35)
      let sleepScore = 5;
      if (state.sleep >= 7.0 && state.sleep <= 9.0) {
        sleepScore = 35;
      } else if (state.sleep === 6.0 || state.sleep === 6.5 || state.sleep === 9.5 || state.sleep === 10.0) {
        sleepScore = 25;
      } else if (state.sleep === 5.0 || state.sleep === 5.5 || state.sleep === 10.5 || state.sleep === 11.0) {
        sleepScore = 15;
      }
      
      // 2. Calculate Exercise Score (max 35)
      let exerciseScore = 5;
      if (state.exercise >= 3 && state.exercise <= 5) {
        exerciseScore = 35;
      } else if (state.exercise === 2 || state.exercise === 6) {
        exerciseScore = 25;
      } else if (state.exercise === 1 || state.exercise === 7) {
        exerciseScore = 15;
      }

      // 3. Calculate Calories Score (max 30)
      let calorieScore = 3;
      if (state.calories >= 1800 && state.calories <= 2500) {
        calorieScore = 30;
      } else if ((state.calories >= 1500 && state.calories < 1800) || (state.calories > 2500 && state.calories <= 3000)) {
        calorieScore = 20;
      } else if ((state.calories >= 1200 && state.calories < 1500) || (state.calories > 3000 && state.calories <= 3500)) {
        calorieScore = 12;
      }

      // Total Score
      const totalScore = sleepScore + exerciseScore + calorieScore;
      
      // Determine Scale Level
      let scaleLevel = "Needs Focus";
      if (totalScore >= 50 && totalScore <= 75) {
        scaleLevel = "Progressing";
      } else if (totalScore > 75) {
        scaleLevel = "Optimal Wellness";
      }

      // Update Breakdown UI
      if (sleepScoreText) sleepScoreText.textContent = `${sleepScore} / 35`;
      if (exerciseScoreText) exerciseScoreText.textContent = `${exerciseScore} / 35`;
      if (calorieScoreText) calorieScoreText.textContent = `${calorieScore} / 30`;

      // Update Score & Label
      if (scoreVal) scoreVal.textContent = totalScore;
      if (labelVal) {
        labelVal.textContent = scaleLevel;
        labelVal.className = "gauge-label";
        if (scaleLevel === "Needs Focus") labelVal.classList.add("text-danger");
        else if (scaleLevel === "Progressing") labelVal.classList.add("text-warning");
        else labelVal.classList.add("text-success");
      }

      // Generate Actionable Readout
      const sleepTarget = "7-9 hours";
      let calorieTarget = "";
      if (state.exercise >= 3) {
        calorieTarget = "2,000 - 2,400 kcal per day to fuel your activity";
      } else {
        calorieTarget = "1,800 - 2,000 kcal per day to align with your current active level";
      }

      const readoutMessage = `Based on your metrics, you are currently at <strong>${scaleLevel}</strong>. To improve your health, you need to target <strong>${sleepTarget}</strong> of sleep and adjust daily caloric intake to <strong>${calorieTarget}</strong>.`;
      
      if (readoutText) {
        readoutText.innerHTML = readoutMessage;
      }

      // Animate Gauge Needle
      const angle = (totalScore / 100) * 180;
      if (needle) {
        needle.setAttribute("transform", `translate(100, 100) rotate(${angle})`);
      }

      // Proceed to results step
      state.step = 4;
      updateStepDisplay();
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const calculator = document.getElementById('wellness-calculator');
    if (!calculator) return;

    // 1. DOM Elements
    const sleepInput = document.getElementById('sleep-input'); // Assumed range/number input
    const exerciseInput = document.getElementById('exercise-input'); // Assumed select or inputs
    const calorieInput = document.getElementById('calorie-input'); // Assumed range/number input
    
    // Expanded Question Elements
    const waterInput = document.getElementById('quiz-water'); // e.g., <select> or <input type="number">
    const stressInput = document.getElementById('quiz-stress'); // e.g., <select> or radio buttons
    const goalInput = document.getElementById('quiz-goal'); // e.g., <select>

    // UI Output Elements
    const totalScoreText = document.getElementById('total-score-text') || document.querySelector('.scale-score-display');
    const readoutText = document.getElementById('readout-text') || document.querySelector('.actionable-readout p');
    const bookingBtn = document.querySelector('#quiz-result-container a, .interactive-tools-container a[href^="book.html"]');

    // Visual Gauge and Breakdown elements
    const needle = document.getElementById('gauge-needle');
    const labelVal = document.getElementById('wellness-label');
    const sleepScoreText = document.getElementById('sleep-score-val');
    const exerciseScoreText = document.getElementById('exercise-score-val');
    const calorieScoreText = document.getElementById('calorie-score-val');
    const waterScoreText = document.getElementById('water-score-val');
    const stressScoreText = document.getElementById('stress-score-val');

    // Navigation Elements
    const steps = calculator.querySelectorAll('.calculator-step');
    const nextBtns = calculator.querySelectorAll('.btn-calc-next');
    const prevBtns = calculator.querySelectorAll('.btn-calc-prev');
    const submitBtn = calculator.querySelector('.btn-calc-submit');
    const resetBtn = calculator.querySelector('.btn-calc-reset');

    const state = {
        step: 1
    };

    function updateStepDisplay() {
        steps.forEach(step => {
            const stepNum = step.getAttribute('data-step');
            if (stepNum == state.step || (stepNum === 'results' && state.step === 7)) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.step < 6) {
                state.step += 1;
                updateStepDisplay();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.step > 1) {
                state.step -= 1;
                updateStepDisplay();
            }
        });
    });

    // 2. Main Calculation & Mapping Function
    function calculateWellnessScale() {
        // --- Fetch Values safely (with fallbacks if elements aren't loaded yet) ---
        const sleepHours = parseFloat(sleepInput?.value) || 0;
        const exerciseDays = parseInt(exerciseInput?.value) || 0;
        const calorieIntake = parseInt(calorieInput?.value) || 0;
        const waterOunces = parseInt(waterInput?.value) || 0;
        const stressLevel = stressInput?.value || 'medium'; // 'low', 'medium', 'high'
        const primaryGoal = goalInput?.value || 'general';

        // --- Scoring Logic (Max 100 Points Distributed across 5 categories) ---
        let sleepScore = 0;      // Max 20
        let exerciseScore = 0;   // Max 20
        let calorieScore = 0;    // Max 20
        let waterScore = 0;      // Max 20
        let stressScore = 0;     // Max 20

        // A. Sleep Score Logic
        if (sleepHours >= 7 && sleepHours <= 9) sleepScore = 20;
        else if (sleepHours === 6 || sleepHours === 10) sleepScore = 15;
        else if (sleepHours === 5) sleepScore = 10;
        else sleepScore = 5;

        // B. Exercise Score Logic
        if (exerciseDays >= 4) exerciseScore = 20;
        else if (exerciseDays === 3) exerciseScore = 15;
        else if (exerciseDays === 2) exerciseScore = 10;
        else if (exerciseDays === 1) exerciseScore = 5;

        // C. Calorie Score Logic (Simplified alignment score)
        if (calorieIntake >= 1800 && calorieIntake <= 2500) calorieScore = 20;
        else if (calorieIntake > 2500 || (calorieIntake >= 1500 && calorieIntake < 1800)) calorieScore = 12;
        else calorieScore = 5;

        // D. Water Score Logic (Expanded Question)
        if (waterOunces >= 64) waterScore = 20;
        else if (waterOunces >= 40) waterScore = 12;
        else waterScore = 5;

        // E. Stress Score Logic (Expanded Question)
        if (stressLevel === 'low') stressScore = 20;
        else if (stressLevel === 'medium') stressScore = 15;
        else stressScore = 5;

        // Calculate Final Aggregated Score
        const totalScore = sleepScore + exerciseScore + calorieScore + waterScore + stressScore;

        // --- Update UI ---
        if (totalScoreText) {
            totalScoreText.innerText = `${totalScore} / 100`;
        }

        // Generate dynamic feedback readout text based on score tier
        let evaluation = "";
        if (totalScore >= 80) {
            evaluation = "Excellent baseline! You have strong core habits. Let's optimize your routine to break past your current plateau.";
        } else if (totalScore >= 50) {
            evaluation = "Solid foundation, but minor adjustments in sleep consistency or hydration could drastically accelerate your results.";
        } else {
            evaluation = "Your body is giving you warning signs. Prioritizing structured recovery and targeted lifestyle adjustments will jumpstart your energy.";
        }
        
        if (readoutText) {
            readoutText.innerText = evaluation;
        }

        // Update breakdowns in UI
        if (sleepScoreText) sleepScoreText.textContent = `${sleepScore} / 20`;
        if (exerciseScoreText) exerciseScoreText.textContent = `${exerciseScore} / 20`;
        if (calorieScoreText) calorieScoreText.textContent = `${calorieScore} / 20`;
        if (waterScoreText) waterScoreText.textContent = `${waterScore} / 20`;
        if (stressScoreText) stressScoreText.textContent = `${stressScore} / 20`;

        // Update Gauge Needle Rotation (sweep from -90deg to +90deg)
        const angle = -90 + (totalScore / 100) * 180;
        if (needle) {
            needle.setAttribute('transform', `translate(100, 100) rotate(${angle})`);
        }

        // Determine Scale Level Label
        let scaleLevel = "Needs Focus";
        if (totalScore >= 50 && totalScore <= 75) {
            scaleLevel = "Progressing";
        } else if (totalScore > 75) {
            scaleLevel = "Optimal Wellness";
        }

        if (labelVal) {
            labelVal.textContent = scaleLevel;
            labelVal.className = "gauge-label";
            if (scaleLevel === "Needs Focus") labelVal.classList.add("text-danger");
            else if (scaleLevel === "Progressing") labelVal.classList.add("text-warning");
            else labelVal.classList.add("text-success");
        }

        // --- Handle URL Param String Mapping ---
        if (bookingBtn) {
            // Build the data object to serialize into the URL
            const queryPayload = {
                service: 'Free Assessment', // Autoselects the correct dropdown filter on book.html
                score: totalScore,
                sleep: `${sleepHours}hrs`,
                exercise: `${exerciseDays}days`,
                calories: `${calorieIntake}kcal`,
                water: `${waterOunces}oz`,
                stress: stressLevel,
                goal: primaryGoal
            };

            // Generate clean url encoding
            const urlParameters = new URLSearchParams(queryPayload);
            
            // Rewrite the book button path with the appended query parameters
            bookingBtn.href = `book.html?${urlParameters.toString()}`;
        }
    }

    // 3. Attach Event Listeners to recalculate in real-time on input changes
    const quizInputs = [sleepInput, exerciseInput, calorieInput, waterInput, stressInput, goalInput];
    
    quizInputs.forEach(input => {
        if (input) {
            // Catches changes via drag sliders, dropdown switches, or key typings
            input.addEventListener('input', calculateWellnessScale);
            input.addEventListener('change', calculateWellnessScale);
        }
    });

    // Real-time Slider Readout Updates
    if (sleepInput) {
        sleepInput.addEventListener('input', (e) => {
            const readout = document.getElementById('sleep-readout');
            if (readout) readout.textContent = e.target.value;
        });
    }
    if (waterInput) {
        waterInput.addEventListener('input', (e) => {
            const readout = document.getElementById('water-readout');
            if (readout) readout.textContent = e.target.value;
        });
    }

    // Exercise Button Click Handling
    const exerciseOptions = calculator.querySelectorAll('.exercise-option');
    exerciseOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            exerciseOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            if (exerciseInput) {
                exerciseInput.value = opt.getAttribute('data-value');
                exerciseInput.dispatchEvent(new Event('change'));
            }
        });
    });

    // Calorie Preset Badges Click Handling
    const presetBadges = calculator.querySelectorAll('.preset-badge');
    presetBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            const val = badge.getAttribute('data-value');
            if (calorieInput) {
                calorieInput.value = val;
                calorieInput.dispatchEvent(new Event('change'));
            }
        });
    });

    // Submit Assessment Button
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            // Validate Calorie Input
            const calVal = parseInt(calorieInput?.value, 10);
            if (isNaN(calVal) || calVal <= 0) {
                alert("Please enter a valid daily calorie estimate (greater than 0).");
                return;
            }
            state.step = 7;
            calculateWellnessScale();
            updateStepDisplay();
        });
    }

    // Reset Assessment Button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state.step = 1;
            
            // Restore default values
            if (sleepInput) sleepInput.value = 7;
            const sleepReadout = document.getElementById('sleep-readout');
            if (sleepReadout) sleepReadout.textContent = "7";

            if (exerciseInput) exerciseInput.value = 3;
            exerciseOptions.forEach(o => o.classList.remove('active'));
            const defaultEx = calculator.querySelector('.exercise-option[data-value="3"]');
            if (defaultEx) defaultEx.classList.add('active');

            if (calorieInput) calorieInput.value = 2000;

            if (waterInput) waterInput.value = 64;
            const waterReadout = document.getElementById('water-readout');
            if (waterReadout) waterReadout.textContent = "64";

            if (stressInput) stressInput.value = "medium";
            if (goalInput) goalInput.value = "general";

            // Recalculate
            calculateWellnessScale();
            updateStepDisplay();
        });
    }

    // Run once on document load to establish the baseline URL parameters immediately
    calculateWellnessScale();
});

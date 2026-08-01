document.addEventListener('DOMContentLoaded', () => {
    const calculator = document.getElementById('wellness-calculator');
<<<<<<< HEAD
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
=======
    if (!calculator) {
        console.warn("Wellness assessment container (#wellness-calculator) not found. Exiting calculator.js safely.");
        return;
    }

    // --- DOM Elements ---
    const goalSelect = document.getElementById('quiz-goal');
    const nutritionDetails = document.getElementById('nutrition-details');

    const totalScoreText = document.getElementById('total-score-text');
    const labelVal = document.getElementById('wellness-label');
    const resultHeading = document.getElementById('result-tier-heading');
    const readoutText = document.getElementById('readout-text');
    const goalFeedbackText = document.getElementById('goal-feedback-text');
    
    const recommendationsBox = document.getElementById('recommendations-box');
    const recommendationsList = document.getElementById('recommendations-list');

    const needle = document.getElementById('gauge-needle');
    const needlePath = needle ? needle.querySelector('path') : null;

    const sleepScoreText = document.getElementById('sleep-score-val');
    const exerciseScoreText = document.getElementById('exercise-score-val');
    const nutritionScoreText = document.getElementById('nutrition-score-val');
    const waterScoreText = document.getElementById('water-score-val');
    const stressScoreText = document.getElementById('stress-score-val');

    // BMI Elements
    const usFields = document.getElementById('bmi-us-fields');
    const metricFields = document.getElementById('bmi-metric-fields');
    const heightFtInput = document.getElementById('bmi-height-ft');
    const heightInInput = document.getElementById('bmi-height-in');
    const weightLbInput = document.getElementById('bmi-weight-lb');
    const heightCmInput = document.getElementById('bmi-height-cm');
    const weightKgInput = document.getElementById('bmi-weight-kg');

    const steps = calculator.querySelectorAll('.calculator-step');
    const nextBtns = calculator.querySelectorAll('.btn-calc-next');
    const prevBtns = calculator.querySelectorAll('.btn-calc-prev');
    const resetBtn = calculator.querySelector('.btn-calc-reset');
    const bookingBtn = calculator.querySelector('.btn-book-assessment');

    const state = {
        step: 1
    };

    const totalSteps = 7;

    // --- Navigation and Auto-Save Progress ---

    function saveProgress() {
        const selectedUnit = document.querySelector('input[name="bmi-unit"]:checked')?.value || 'us';
        const answers = {
            sleep: document.querySelector('input[name="sleep"]:checked')?.value || null,
            exercise: document.querySelector('input[name="exercise"]:checked')?.value || null,
            nutrition: document.querySelector('input[name="nutrition"]:checked')?.value || null,
            water: document.querySelector('input[name="water"]:checked')?.value || null,
            stress: document.querySelector('input[name="stress"]:checked')?.value || null,
            goal: goalSelect?.value || null,
            nutritionDetails: nutritionDetails?.value || '',
            bmiUnit: selectedUnit,
            bmiFt: heightFtInput?.value || '',
            bmiIn: heightInInput?.value || '',
            bmiLb: weightLbInput?.value || '',
            bmiCm: heightCmInput?.value || '',
            bmiKg: weightKgInput?.value || ''
        };

        sessionStorage.setItem("wellness_assessment_progress", JSON.stringify({
            currentStep: state.step,
            answers: answers,
            savedAt: Date.now()
        }));
    }

    function restoreProgress() {
        try {
            const raw = sessionStorage.getItem("wellness_assessment_progress");
            if (raw) {
                const progress = JSON.parse(raw);
                if (progress && progress.savedAt && (Date.now() - progress.savedAt < 86400000)) {
                    state.step = progress.currentStep || 1;
                    const ans = progress.answers || {};

                    // Restore radio buttons
                    ['sleep', 'exercise', 'nutrition', 'water', 'stress'].forEach(name => {
                        if (ans[name]) {
                            const radio = calculator.querySelector(`input[name="${name}"][value="${ans[name]}"]`);
                            if (radio) radio.checked = true;
                        }
                    });

                    // Restore goal dropdown
                    if (ans.goal && goalSelect) {
                        goalSelect.value = ans.goal;
                    }

                    // Restore optional details
                    if (ans.nutritionDetails && nutritionDetails) {
                        nutritionDetails.value = ans.nutritionDetails;
                    }

                    // Restore BMI Inputs & Unit Switcher
                    if (ans.bmiUnit) {
                        const unitRadio = calculator.querySelector(`input[name="bmi-unit"][value="${ans.bmiUnit}"]`);
                        if (unitRadio) {
                            unitRadio.checked = true;
                            if (ans.bmiUnit === 'us') {
                                if (usFields) usFields.style.display = 'block';
                                if (metricFields) metricFields.style.display = 'none';
                            } else {
                                if (usFields) usFields.style.display = 'none';
                                if (metricFields) metricFields.style.display = 'block';
                            }
                        }
                    }

                    if (ans.bmiFt && heightFtInput) heightFtInput.value = ans.bmiFt;
                    if (ans.bmiIn && heightInInput) heightInInput.value = ans.bmiIn;
                    if (ans.bmiLb && weightLbInput) weightLbInput.value = ans.bmiLb;
                    if (ans.bmiCm && heightCmInput) heightCmInput.value = ans.bmiCm;
                    if (ans.bmiKg && weightKgInput) weightKgInput.value = ans.bmiKg;

                    updateStepDisplay();
                } else {
                    // Stale data older than 24 hours
                    sessionStorage.removeItem("wellness_assessment_progress");
                }
            }
        } catch (e) {
            console.warn("Unable to parse wellness assessment progress from sessionStorage.", e);
            sessionStorage.removeItem("wellness_assessment_progress");
        }
    }

    function updateStepDisplay() {
        steps.forEach(step => {
            const stepNum = step.getAttribute('data-step');
            if (stepNum == state.step || (stepNum === 'results' && state.step === 8)) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update progress bar and text dynamically for active input steps
        if (state.step <= totalSteps) {
            const activeStepEl = calculator.querySelector(`.calculator-step[data-step="${state.step}"]`);
            if (activeStepEl) {
                const progressTextEl = activeStepEl.querySelector('.progress-text');
                const progressBarFillEl = activeStepEl.querySelector('.progress-bar-fill');
                
                const progressPercent = Math.round((state.step / totalSteps) * 100);

                if (progressTextEl) {
                    if (state.step === totalSteps) {
                        progressTextEl.textContent = `Step ${state.step} of ${totalSteps} (Optional) (${progressPercent}% Complete)`;
                    } else {
                        progressTextEl.textContent = `Step ${state.step} of ${totalSteps} (${progressPercent}% Complete)`;
                    }
                }
                if (progressBarFillEl) {
                    progressBarFillEl.style.width = `${progressPercent}%`;
                }
            }
        }

        // Hide back button on step 1
        const backBtnOnStep1 = calculator.querySelector('.calculator-step[data-step="1"] .btn-calc-prev');
        if (backBtnOnStep1) {
            backBtnOnStep1.style.display = 'none';
        }
    }

    function validateStep(stepNum) {
        const stepEl = calculator.querySelector(`.calculator-step[data-step="${stepNum}"]`);
        if (!stepEl) return true;

        const msgEl = stepEl.querySelector('.validation-message');
        if (msgEl) {
            msgEl.hidden = true;
            msgEl.textContent = '';
        }

        if (stepNum === 1) {
            const hasSleep = calculator.querySelector('input[name="sleep"]:checked');
            if (!hasSleep) {
                if (msgEl) {
                    msgEl.textContent = "Please select an option for sleep hours to continue.";
                    msgEl.hidden = false;
                }
                return false;
            }
        } else if (stepNum === 2) {
            const hasExercise = calculator.querySelector('input[name="exercise"]:checked');
            if (!hasExercise) {
                if (msgEl) {
                    msgEl.textContent = "Please select how often you exercise to continue.";
                    msgEl.hidden = false;
                }
                return false;
            }
        } else if (stepNum === 3) {
            const hasNutrition = calculator.querySelector('input[name="nutrition"]:checked');
            if (!hasNutrition) {
                if (msgEl) {
                    msgEl.textContent = "Please select your nutrition description to continue.";
                    msgEl.hidden = false;
                }
                return false;
            }
        } else if (stepNum === 4) {
            const hasWater = calculator.querySelector('input[name="water"]:checked');
            if (!hasWater) {
                if (msgEl) {
                    msgEl.textContent = "Please select your water intake to continue.";
                    msgEl.hidden = false;
                }
                return false;
            }
        } else if (stepNum === 5) {
            const hasStress = calculator.querySelector('input[name="stress"]:checked');
            if (!hasStress) {
                if (msgEl) {
                    msgEl.textContent = "Please select your current stress level to continue.";
                    msgEl.hidden = false;
                }
                return false;
            }
        } else if (stepNum === 6) {
            if (!goalSelect || !goalSelect.value) {
                if (msgEl) {
                    msgEl.textContent = "Please select your primary wellness goal to continue.";
                    msgEl.hidden = false;
                }
                return false;
            }
        }
        return true;
    }

    function validateBmi() {
        const stepEl = calculator.querySelector('.calculator-step[data-step="7"]');
        const msgEl = stepEl?.querySelector('.validation-message');
        if (msgEl) {
            msgEl.hidden = true;
            msgEl.textContent = '';
        }

        const selectedUnit = document.querySelector('input[name="bmi-unit"]:checked')?.value || 'us';

        if (selectedUnit === 'us') {
            const ft = parseFloat(heightFtInput?.value);
            const inch = parseFloat(heightInInput?.value);
            const lb = parseFloat(weightLbInput?.value);

            if (isNaN(ft) || ft < 3 || ft > 8) {
                if (msgEl) {
                    msgEl.textContent = "Please enter a height between 3 and 8 feet.";
                    msgEl.hidden = false;
                }
                return false;
            }
            if (isNaN(inch) || inch < 0 || inch > 11) {
                if (msgEl) {
                    msgEl.textContent = "Please enter height inches between 0 and 11.";
                    msgEl.hidden = false;
                }
                return false;
            }
            if (isNaN(lb) || lb < 50 || lb > 1000) {
                if (msgEl) {
                    msgEl.textContent = "Please enter a weight between 50 and 1,000 lbs.";
                    msgEl.hidden = false;
                }
                return false;
            }
        } else {
            const cm = parseFloat(heightCmInput?.value);
            const kg = parseFloat(weightKgInput?.value);

            if (isNaN(cm) || cm < 90 || cm > 250) {
                if (msgEl) {
                    msgEl.textContent = "Please enter a height between 90 and 250 cm.";
                    msgEl.hidden = false;
                }
                return false;
            }
            if (isNaN(kg) || kg < 20 || kg > 450) {
                if (msgEl) {
                    msgEl.textContent = "Please enter a weight between 20 and 450 kg.";
                    msgEl.hidden = false;
                }
                return false;
            }
        }
        return true;
    }

    // Attach Unit System toggling listeners
    const unitRadios = calculator.querySelectorAll('input[name="bmi-unit"]');
    unitRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'us') {
                if (usFields) usFields.style.display = 'block';
                if (metricFields) metricFields.style.display = 'none';
            } else {
                if (usFields) usFields.style.display = 'none';
                if (metricFields) metricFields.style.display = 'block';
            }
            saveProgress();
        });
    });

    // Attach Next / Prev event listeners
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(state.step)) {
                if (state.step < totalSteps) {
                    state.step += 1;
                    updateStepDisplay();
                    saveProgress();
                }
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.step > 1) {
                state.step -= 1;
                updateStepDisplay();
                saveProgress();
            }
        });
    });

    // Handle Optional Step 7 submit/skip actions specifically
    const bmiCalcBtn = calculator.querySelector('.btn-bmi-calc');
    if (bmiCalcBtn) {
        bmiCalcBtn.addEventListener('click', () => {
            if (validateBmi()) {
                state.step = 8; // Results View
                calculateWellnessScale(true); // Compute with BMI
                updateStepDisplay();
            }
        });
    }

    const bmiSkipBtn = calculator.querySelector('.btn-calc-skip');
    if (bmiSkipBtn) {
        bmiSkipBtn.addEventListener('click', () => {
            state.step = 8; // Results View
            calculateWellnessScale(false); // Skip BMI
            updateStepDisplay();
        });
    }

    // Save progress when change events fire on inputs
    calculator.querySelectorAll('input[type="radio"], select, textarea').forEach(input => {
        input.addEventListener('change', saveProgress);
    });

    // Reset / Recalculate Action
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Restore inputs back to default
            calculator.querySelectorAll('input[type="radio"]').forEach(r => {
                if (r.name !== 'bmi-unit') r.checked = false;
            });

            // Default to US units
            const usRadio = calculator.querySelector('input[name="bmi-unit"][value="us"]');
            if (usRadio) usRadio.checked = true;
            if (usFields) usFields.style.display = 'block';
            if (metricFields) metricFields.style.display = 'none';

            if (goalSelect) goalSelect.selectedIndex = 0;
            if (nutritionDetails) nutritionDetails.value = '';

            if (heightFtInput) heightFtInput.value = '';
            if (heightInInput) heightInInput.value = '';
            if (weightLbInput) weightLbInput.value = '';
            if (heightCmInput) heightCmInput.value = '';
            if (weightKgInput) weightKgInput.value = '';

            // Clear sessionStorage
            sessionStorage.removeItem("wellness_assessment");
            sessionStorage.removeItem("wellness_assessment_progress");

            // Clear active step messages
            calculator.querySelectorAll('.validation-message').forEach(m => {
                m.hidden = true;
                m.textContent = '';
            });

            state.step = 1;
            updateStepDisplay();
        });
    }

    // --- Scoring, Gauge Rotation, Ranges and Feedback ---

    function calculateWellnessScale(hasBmi) {
        const sleepVal = calculator.querySelector('input[name="sleep"]:checked')?.value;
        const exerciseVal = calculator.querySelector('input[name="exercise"]:checked')?.value;
        const nutritionVal = calculator.querySelector('input[name="nutrition"]:checked')?.value;
        const waterVal = calculator.querySelector('input[name="water"]:checked')?.value;
        const stressVal = calculator.querySelector('input[name="stress"]:checked')?.value;
        
        const goalVal = goalSelect?.value || '';
        const goalText = goalSelect?.options[goalSelect.selectedIndex]?.text || '';
        const nutDetailsText = nutritionDetails?.value || '';

        // Compute individual category habits scores (Max 20 each)
        let sleepScore = 0;
        let sleepLabel = "N/A";
        if (sleepVal === 'less-than-5') { sleepScore = 5; sleepLabel = "Less than 5 hours"; }
        else if (sleepVal === '5-6') { sleepScore = 10; sleepLabel = "5-6 hours"; }
        else if (sleepVal === '7-8') { sleepScore = 20; sleepLabel = "7-8 hours"; }
        else if (sleepVal === '9+') { sleepScore = 15; sleepLabel = "9 or more hours"; }

        let exerciseScore = 0;
        let exerciseLabel = "N/A";
        if (exerciseVal === 'rarely-never') { exerciseScore = 5; exerciseLabel = "Rarely or never"; }
        else if (exerciseVal === '1-2') { exerciseScore = 10; exerciseLabel = "1-2 days per week"; }
        else if (exerciseVal === '3-4') { exerciseScore = 18; exerciseLabel = "3-4 days per week"; }
        else if (exerciseVal === '5+') { exerciseScore = 20; exerciseLabel = "5 or more days per week"; }

        let nutritionScore = 0;
        let nutritionLabel = "N/A";
        if (nutritionVal === 'processed') { nutritionScore = 5; nutritionLabel = "Processed/frequent skipped meals"; }
        else if (nutritionVal === 'inconsistent') { nutritionScore = 10; nutritionLabel = "Inconsistent habits"; }
        else if (nutritionVal === 'balanced') { nutritionScore = 17; nutritionLabel = "Usually balanced meals"; }
        else if (nutritionVal === 'intentional') { nutritionScore = 20; nutritionLabel = "Consistently balanced and intentional"; }

        let waterScore = 0;
        let waterLabel = "N/A";
        if (waterVal === 'less-than-2') { waterScore = 5; waterLabel = "Less than 2 cups"; }
        else if (waterVal === '2-4') { waterScore = 10; waterLabel = "2-4 cups"; }
        else if (waterVal === '5-7') { waterScore = 16; waterLabel = "5-7 cups"; }
        else if (waterVal === '8+') { waterScore = 20; waterLabel = "8 or more cups"; }

        let stressScore = 0;
        let stressLabel = "N/A";
        if (stressVal === 'very-high') { stressScore = 5; stressLabel = "Very high stress"; }
        else if (stressVal === 'high') { stressScore = 10; stressLabel = "High stress"; }
        else if (stressVal === 'moderate') { stressScore = 16; stressLabel = "Moderate stress"; }
        else if (stressVal === 'low') { stressScore = 20; stressLabel = "Low stress"; }

        const totalScore = sleepScore + exerciseScore + nutritionScore + waterScore + stressScore;

        // Ranges configuration
        let rangeHeading = "";
        let rangeFeedbackText = "";
        let rangeColor = ""; // Dynamic gauge color-coding

        if (totalScore <= 39) {
            rangeHeading = "Building Your Foundation";
            rangeFeedbackText = "Your results suggest that several areas of your wellness routine may need additional support. Begin with one manageable change, such as improving sleep, increasing water intake, or adding short walks to your week.";
            rangeColor = "#e74c3c"; // Red
        } else if (totalScore <= 59) {
            rangeHeading = "Developing Consistency";
            rangeFeedbackText = "You have started building some positive habits, but greater consistency could improve your results. Focus on strengthening one or two areas instead of trying to change everything at once.";
            rangeColor = "#f39c12"; // Orange
        } else if (totalScore <= 79) {
            rangeHeading = "Strong Progress";
            rangeFeedbackText = "You have a solid wellness foundation. With a few focused adjustments and continued accountability, you can make meaningful progress toward your primary goal.";
            rangeColor = "#3498db"; // Blue
        } else {
            rangeHeading = "Thriving Wellness Habits";
            rangeFeedbackText = "Your current habits reflect a strong commitment to wellness. Continue refining your routine and setting new goals that support lasting physical, mental, and spiritual growth.";
            rangeColor = "#00a859"; // Green
        }

        // Goal Feedback Configuration
        let goalFeedback = "";
        if (goalVal === 'weight-loss') {
            goalFeedback = "Because your primary goal is to lose weight, consider focusing on a sustainable caloric deficit, balanced portion sizes, consistent hydration, and active movement.";
        } else if (goalVal === 'strength') {
            goalFeedback = "Because your primary goal is to build strength, consider following a progressive resistance-training plan and prioritizing adequate protein, hydration, and recovery.";
        } else if (goalVal === 'mobility') {
            goalFeedback = "Because your primary goal is to improve mobility, consider incorporating daily dynamic stretching, functional movement patterns, and targeted flexibility training.";
        } else if (goalVal === 'energy') {
            goalFeedback = "Because your primary goal is to increase energy, consider optimizing sleep quality, staying consistently hydrated, balancing your blood sugar with whole foods, and engaging in moderate activity.";
        } else if (goalVal === 'nutrition') {
            goalFeedback = "Because your primary goal is to improve nutrition, consider planning your meals in advance, focusing on whole-food sources, incorporating lean proteins and fiber, and minimizing highly processed items.";
        } else if (goalVal === 'stress') {
            goalFeedback = "Because your primary goal is to reduce stress, consider incorporating mindful breathing, daily prayer or reflection, structured work-rest boundaries, and restorative activities.";
        } else if (goalVal === 'habits') {
            goalFeedback = "Because your primary goal is to build consistent habits, consider focusing on habit-stacking, starting with very small daily actions, tracking your progress, and celebrating small wins.";
        } else if (goalVal === 'overall') {
            goalFeedback = "Because your primary goal is to improve overall wellness, consider taking a balanced approach that integrates physical fitness, nutritional nourishment, mental relaxation, and spiritual grounding.";
        }

        // --- Render UI Habits Results ---

        if (totalScoreText) totalScoreText.innerText = `${totalScore} / 100`;
        if (labelVal) {
            labelVal.textContent = rangeHeading;
            labelVal.style.color = rangeColor;
        }
        if (resultHeading) {
            resultHeading.textContent = rangeHeading;
            resultHeading.style.color = rangeColor;
        }
        if (readoutText) readoutText.textContent = rangeFeedbackText;
        if (goalFeedbackText) goalFeedbackText.textContent = goalFeedback;

        // Breakdown scores
        if (sleepScoreText) sleepScoreText.textContent = `${sleepScore} / 20`;
        if (exerciseScoreText) exerciseScoreText.textContent = `${exerciseScore} / 20`;
        if (nutritionScoreText) nutritionScoreText.textContent = `${nutritionScore} / 20`;
        if (waterScoreText) waterScoreText.textContent = `${waterScore} / 20`;
        if (stressScoreText) stressScoreText.textContent = `${stressScore} / 20`;

        // Needle rotation & Needle Color update
        const angle = -90 + (totalScore / 100) * 180;
        if (needle) {
            needle.setAttribute('transform', `translate(100, 100) rotate(${angle})`);
        }
        if (needlePath) {
            needlePath.setAttribute('fill', rangeColor);
        }

        // --- Dynamic Recommendations ---
        const recommendations = [
            { name: 'Sleep', score: sleepScore, rec: "Sleep: Try adding 30 more minutes of sleep each night." },
            { name: 'Exercise', score: exerciseScore, rec: "Exercise: Try scheduling two or three movement sessions this week." },
            { name: 'Nutrition', score: nutritionScore, rec: "Nutrition: Add one fruit or vegetable to every meal." },
            { name: 'Water', score: waterScore, rec: "Water: Add one extra bottle of water per day." },
            { name: 'Stress', score: stressScore, rec: "Stress: Schedule 10 minutes of quiet time." }
        ];

        // Filter and Sort Recommendations
        const needsRec = recommendations.filter(item => item.score < 20);

        needsRec.sort((a, b) => {
            if (a.score !== b.score) {
                return a.score - b.score;
            }
            // Tie-break priority order: Sleep, Exercise, Nutrition, Water, Stress
            const order = ['Sleep', 'Exercise', 'Nutrition', 'Water', 'Stress'];
            return order.indexOf(a.name) - order.indexOf(b.name);
        });

        // Determine final display list (2 lowest scoring categories, up to 3 if tied)
        let displayRecs = [];
        if (needsRec.length > 0) {
            displayRecs.push(needsRec[0]);
            if (needsRec.length > 1) {
                displayRecs.push(needsRec[1]);
                // Check if third item has tied score with the second one
                if (needsRec.length > 2 && needsRec[2].score === needsRec[1].score) {
                    displayRecs.push(needsRec[2]);
                }
            }
        }

        if (recommendationsBox && recommendationsList) {
            recommendationsList.innerHTML = '';
            if (displayRecs.length > 0) {
                displayRecs.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.rec;
                    recommendationsList.appendChild(li);
                });
                recommendationsBox.style.display = 'block';
            } else {
                recommendationsBox.style.display = 'none';
            }
        }

        // --- BMI Calculations & UI Rendering ---
        let bmiPayload = null;

        if (hasBmi) {
            const selectedUnit = document.querySelector('input[name="bmi-unit"]:checked')?.value || 'us';
            let bmiValue = 0;
            let heightDisplay = "";
            let weightDisplay = "";

            if (selectedUnit === 'us') {
                const ft = parseFloat(heightFtInput?.value || 0);
                const inches = parseFloat(heightInInput?.value || 0);
                const weightLb = parseFloat(weightLbInput?.value || 0);

                const totalInches = (ft * 12) + inches;
                bmiValue = (weightLb / (totalInches * totalInches)) * 703;

                heightDisplay = `${ft}'${inches}"`;
                weightDisplay = `${weightLb} lbs`;
            } else {
                const heightCm = parseFloat(heightCmInput?.value || 0);
                const weightKg = parseFloat(weightKgInput?.value || 0);

                bmiValue = weightKg / ((heightCm / 100) * (heightCm / 100));

                heightDisplay = `${heightCm} cm`;
                weightDisplay = `${weightKg} kg`;
            }

            bmiValue = Math.round(bmiValue * 10) / 10; // Round to 1 decimal place

            // CDC Adult BMI Wording (Neutral, person-first language)
            let category = "";
            if (bmiValue < 18.5) {
                category = "Underweight";
            } else if (bmiValue <= 24.9) {
                category = "Healthy Weight";
            } else if (bmiValue <= 29.9) {
                category = "Overweight";
            } else if (bmiValue <= 34.9) {
                category = "Obesity, Class 1";
            } else if (bmiValue <= 39.9) {
                category = "Obesity, Class 2";
            } else {
                category = "Class 3 Obesity (Severe Obesity)";
            }

            bmiPayload = {
                value: bmiValue,
                category: category,
                unitSystem: selectedUnit,
                heightDisplay: heightDisplay,
                weightDisplay: weightDisplay
            };

            // Render BMI Card elements
            const bmiResultCard = document.getElementById('bmi-result-card');
            const bmiValText = document.getElementById('bmi-value-text');
            const bmiCatText = document.getElementById('bmi-category-text');
            const bmiInpsText = document.getElementById('bmi-inputs-text');
            const bmiPointer = document.getElementById('bmi-pointer');
            const bmiPointerTooltip = document.getElementById('bmi-pointer-tooltip');

            if (bmiValText) bmiValText.textContent = bmiValue.toFixed(1);
            if (bmiCatText) bmiCatText.textContent = `${category} range`;
            if (bmiInpsText) bmiInpsText.textContent = `Height: ${heightDisplay} | Weight: ${weightDisplay}`;

            // Clamp pointer visual position between BMI 10 and 40
            const clampedBmi = Math.max(10, Math.min(40, bmiValue));
            const pointerPercent = ((clampedBmi - 10) / 30) * 100;
            if (bmiPointer) {
                bmiPointer.style.left = `${pointerPercent}%`;
            }
            if (bmiPointerTooltip) {
                bmiPointerTooltip.textContent = bmiValue.toFixed(1);
            }

            if (bmiResultCard) {
                bmiResultCard.style.display = 'flex';
            }
        } else {
            // Hide BMI Result Card if skipped
            const bmiResultCard = document.getElementById('bmi-result-card');
            if (bmiResultCard) {
                bmiResultCard.style.display = 'none';
            }
        }

        // --- SessionStorage Data Payload Transfer ---
        const assessmentPayload = {
            score: totalScore,
            sleep: sleepLabel,
            exercise: exerciseLabel,
            nutrition: nutritionLabel + (nutDetailsText ? ` (Note: ${nutDetailsText})` : ''),
            water: waterLabel,
            stress: stressLabel,
            goal: goalText,
            rangeTitle: rangeHeading,
            feedback: rangeFeedbackText + "\n" + goalFeedback,
            bmi: bmiPayload
        };

        sessionStorage.setItem("wellness_assessment", JSON.stringify(assessmentPayload));

        // Trigger completing custom event
        document.dispatchEvent(new CustomEvent("wellnessAssessmentCompleted", {
            detail: assessmentPayload
        }));

        // Configure Booking Button
        if (bookingBtn) {
            bookingBtn.href = "book.html";
        }
    }

    // Run Restore progress on page load
    restoreProgress();
>>>>>>> main
});

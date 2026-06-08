# Implementation Plan - Premium Interactive Web Application Refactoring

We will refactor [The Butterfly Effect Wellness](index.html) website from a static layout into a premium, interactive web application experience.

---

## Target Upgrades & Steps

### 1. Hero Section Revamp
*   **Logo Relocation:** Remove the circular logo visual from the hero grid column. The top-left header logo (inline brand SVG and brand text) remains as the single source of branding.
*   **High-Impact Visual Layout:** Integrate the newly generated `lifestyle.png` fitness coaching image into the hero split-frame container in `index.html`.
*   **CSS Enhancements:** Update `styles.css` so the hero visual has modern bounding box shadows, a clean border-radius, and matches the desaturated background gradients.

### 2. Service Cards & Interaction (Modern Grid)
*   **Custom Inline SVGs:** In `services.html`, replace the standard emojis with custom inline SVG icon elements for all 5 services:
    *   *Functional Personal Training* (Barbell / Strength icon)
    *   *Group Fitness* (Users / Community icon)
    *   *Life Coaching* (Target / Growth icon)
    *   *Nutrition Coaching* (Leaf / Healthy eating icon)
    *   *Online Coaching* (Laptop / Connectivity icon)
*   **CSS Grid Overhaul:** Apply `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))` to the services grid in `styles.css`.
*   **Two-Tiered Micro-Ambient Drop Shadows:** Style cards with the following parameters:
    *   Default: `box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03);`
    *   Hover: `transform: translateY(-6px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03);`
    *   Transitions: `transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1)` using hardware acceleration.
*   **Animated CTA Arrow:** Wrap the link arrow (`&rarr;`) in a span (`.cta-arrow`) and style it to slide `translateX(4px)` when the parent card is hovered.

### 3. Interactive Baseline Calculator
*   **Interactive Calculator Component:** Inject a step-by-step interactive Wellness Baseline Calculator container below the offerings grid in `services.html`.
*   **Standalone JavaScript Module:** Create `calculator.js` to manage step changes, state, calculations, and animations:
    *   *Step 1:* Objective Picker (Sustainable Strength, Mindset & Habits, Functional Movement).
    *   *Step 2:* Water slider (0 - 128 oz) with live readout.
    *   *Step 3:* Activity level buttons (Sedentary, Moderate, Active).
    *   *Results Panel:* Instant outputs (Water meter, Movement recommendations, customized habit loops).
*   **Styles:** Add styling for inputs, sliders, toggles, progress bars, and animations in `styles.css`.

### 4. Design Hygiene & Social Proof
*   **Typographic Contrast:** Update all header tags (`h1, h2, h3, h4`) in `styles.css` to use the modern, geometric sans-serif font `Inter` instead of the serif `Playfair Display` to drive an application feel.
*   **Spacing Blocks:** Increase vertical padding on `.section` to `5rem 0` (equivalent to `80px` on root) to maximize breathing room.
*   **Transformations Section:** Add a client transformations block in `index.html` featuring client success statistics (e.g. fat loss, mobility gains) and qualitative text cards.

---

## Verification Plan

### Manual Verification
1.  **Typographic Verification:** Check that all headers render in sans-serif Inter.
2.  **Hero Image Rendering:** Verify `lifestyle.png` displays correctly in the hero split layout.
3.  **Hover States:** Ensure services card hover is butter-smooth and CTA arrows shift horizontally.
4.  **Calculator Functionality:** Go through the calculator steps, adjust hydration slider, select activity, and check the generated blueprint outputs.
5.  **Responsiveness:** Verify mobile layout transitions and ensure elements stack correctly.

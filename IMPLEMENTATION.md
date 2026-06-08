# Implementation Plan - UI Symmetry & Conversion Rate Optimization

We will optimize the existing layouts of [The Butterfly Effect Wellness](index.html) to maximize user conversion rates and align with elite fitness application standards.

---

## Target Upgrades & Steps

### 1. Hero Value Alignment
*   **Lifestyle Visuals check:** Ensure the lifestyle image `assets/images/lifestyle.png` is displayed in high resolution with excellent contrast, and remove any generic overlays that dampen image punchiness.
*   **Dual CTAs:** In the hero content block of `index.html`:
    *   Confirm the primary button links to `services.html` ("Explore Programs").
    *   Add a secondary button next to it: `<a class="btn btn--ghost" href="services.html#calculator">Calculate Your Blueprint</a>` to drive visitors to the baseline assessment tool.

### 2. Card Symmetry & Text Ceilings
*   **Flex Alignment:** Force all service cards in `.services-grid` (on `services.html`) to occupy equal heights:
    *   Apply `display: flex; flex-direction: column; justify-content: space-between; height: 100%;` to `.service-card`.
    *   This aligns bottom CTA links perfectly on the horizontal axis.
*   **Text Ceilings:** Limit body paragraphs (`.service-card p`) using strict vertical limits to prevent card bloating:
    *   Implement line-clamping (`-webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;`) and set a fixed height of `5.25em` to maintain perfect layout grid symmetry.

### 3. Calculator Visibility & Mobile Responsiveness
*   **ID Anchoring:** In `services.html`, ensure the calculator's outer section has `id="calculator"` so that links from other pages scroll the viewport directly to this section.
*   **Mobile Stacking & Sizing:** Under the `@media (max-width: 768px)` media query in `styles.css`:
    *   Force `.goal-grid` and `.activity-selector` to stack vertically (`grid-template-columns: 1fr`).
    *   Enforce a minimum tap target height of `56px` for all interactive button options (`.goal-option` and `.activity-option`) with vertical gaps of `12px` to ensure touch compatibility on smaller screens.

### 4. Premium Transformations Formatting
*   **Outcome Cards:** Refactor the Transformations structure on `index.html`:
    *   Top: A stylized **Key Metric** badge (e.g. `-15 lbs Fat Loss`, `12-Week Streak`, `+40% Mobility Gain`) utilizing distinct padding, light background, and icon decorations.
    *   Middle: A short, **bolded client anchor quote** styled as an `h4`.
    *   Footer: A clean, muted description line separating client name and their specific coaching program track.

---

## Verification Plan

### Manual Verification
1.  **Anchor Scroll:** Click "Calculate Your Blueprint" in the hero on the Home page, and check that it redirects and scrolls smoothly to the calculator on the Services page.
2.  **Symmetry Inspection:** Inspect the Services page and check that all 5 card heights are identical and all bottom buttons align horizontally.
3.  **Mobile Calculator Test:** Simulate a mobile device at `375px` width and verify that water ranges, activity selectors, and goal buttons are vertically stacked with large tap areas.
4.  **Social Proof Check:** Confirm transformations testimonials render with outcome badges and bold quotes.

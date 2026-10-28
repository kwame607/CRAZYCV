# Inside Kwame's Mind: interaction design

Written before implementation, as the brief requires. It separates what was
observed from the reference from what is my own design.

## 1. Reference study: what I could and could not inspect

Reference: https://www.jidekel.com/

**Method and limits.** I fetched the page's HTML as text. I could not run it in
a browser, so I did not see the animation, timing, easing, cursor behaviour,
audio, responsive behaviour or the libraries it loads. Nothing below about
those is claimed, and none of it was reproduced.

**Observed in the fetched markup**

| Observation | Source in markup |
| --- | --- |
| Opening copy: a welcome line, "SCROLL TO OPEN ↓" cue | page text |
| A live scroll readout in the form "SCROLL 000%" | page text |
| Small technical labels in a catalogue/instrument style (index codes, a width marker, a status tag) | page text |
| A still image of a halftone-dot brain referenced as a PNG | asset reference |
| A light cream theme colour | meta tag |
| Social preview showing a halftone brain, one hemisphere tinted | preview image description |

**What I take from it (the idea, not the implementation)**

1. A brain as the entry symbol, with a percentage readout tying scroll to a
   sequence.
2. A single clear instruction to scroll, rather than a menu.
3. Small, precise labels around large imagery.

**Not taken.** The cream palette, the halftone still, the label vocabulary,
and the exact wording. This site uses a dark charcoal and amber identity and a
procedural, live-rendered brain, so nothing is copied.

## 2. My original interpretation

**Metaphor.** The visitor starts outside a mind (a rotating point-cloud brain),
travels *through* it (camera dolly past illuminating neural links), and comes
out the other side at the person who owns it. The three "regions" they pass
are the three things the portfolio proves: building, investigating, shipping.

**Rendering choice.** Procedural 2D canvas with hand-written 3D projection. No
3D library, no model file, no new animation dependency. A WebGL scene would add
a dependency and a failure mode for a point cloud that canvas draws comfortably.

**Measured (static Pages build, production):** first load is about 234 KB gzipped
JavaScript (React and Next runtime plus zod; the intro itself is a few KB), 9 KB
CSS and about 108 KB of fonts. In a software-rendered, single-process headless
Chromium with no GPU the desktop intro ran at roughly 25 to 33 fps and the phone
profile at roughly 33 fps. That is a pessimistic environment, not a device
benchmark. Real phones were not available, so mobile performance on hardware is
**untested**; the loop therefore adapts to measured frame times (see below).

### Sequence (scroll progress `p` from 0 to 1 over a 420vh runway)

Scrolling is native. The runway is a tall element with a sticky stage inside
it, so the page never hijacks the wheel, touch or keyboard.

| p | Camera | Brain | Overlay text |
| --- | --- | --- | --- |
| 0.00 to 0.12 | Far, slow auto-rotation, slight pointer parallax | Dim nodes only | KA signature, "WELCOME TO MY MIND", depth readout, "SCROLL TO ENTER ↓" |
| 0.12 to 0.40 | Dolly in | Links ignite from the core outward; pulses travel along them | 01 · BUILD: products shipped to real customers |
| 0.40 to 0.68 | Passes the surface and travels through the structure | Nodes stream past; amber links dominate | 02 · INVESTIGATE: "Curiosity is good. Evidence is better." |
| 0.68 to 0.86 | Exits the far side | Structure recedes behind the camera | 03 · SHIP: founder and developer of live products |
| 0.78 to 0.97 | Exits the far side, **turns round and pulls back** | The mind recedes behind the camera, dimmed | Name and positioning resolve over it; the nav takes over |
| 1.00 | Rests | Small and dim, still slowly alive | "Continue" leads to the real hero |

### Controls and escape hatches

* **Skip intro** is the first focusable element and is always visible.
* **Tap / Enter to enter** plays the sequence over about 5 seconds for people
  who will not or cannot scroll (touch, keyboard, switch access). Any wheel,
  touch or key press cancels it and returns control.
* **Seen once, remembered.** After the first view the runway collapses to
  nothing on later visits (set before first paint, so there is no flash).
  **Replay intro** is in the navigation and footer.
* **Reduced motion.** No runway and no animation loop. One static frame of the
  brain, the same text, and an Enter button. All content is unchanged.
* **No JavaScript.** The runway is hidden and the full portfolio is plain
  HTML.
* **No WebGL dependency.** Canvas 2D is the baseline; if a 2D context cannot
  be created the stage shows a CSS fallback and the page still works.

### Mobile

Same sequence, different budget: fewer nodes, capped device pixel ratio,
shorter runway, and the Enter button is prominent rather than hinted.

### Performance rules

* **Adaptive quality.** Tier 0 is full quality; tier 1 drops additive blending,
  pulses and lowers pixel ratio (phones start here); tier 2 also halves the frame
  rate. The loop steps down when the smoothed frame time stays above 38 ms.

* The animation loop runs only while the runway is on screen and stops
  otherwise (IntersectionObserver).
* Frame updates write to DOM styles directly; React does not re-render per
  frame.
* Link topology is computed once, not per frame.

### Motion system after the intro

One easing curve (`cubic-bezier(0.22, 1, 0.36, 1)`), two durations (240 ms for
feedback, 700 ms for reveals), one reveal pattern (a clip-path wipe for images,
a rise for text), and nothing moves unless it has just entered the viewport.

## 3. Honesty rules carried over from the existing site

These are enforced by existing unit tests and kept:

* No links to source repositories on project pages.
* Real screenshots only; no placeholders presented as screenshots.
* Skills link to evidence or are flagged as learning.
* Only the certificate the CV consistently supports is listed as earned.
* Security work is labelled **real** or **simulated**; there are no published
  assessment records yet, and the site says so.

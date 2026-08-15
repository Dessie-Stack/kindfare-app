# Handoff: KindFare — iOS (Swift/SwiftUI) Implementation Guide

*Merged 2026-08-12. Methodology, confirmed with Dessie: the new `Last_Export_Claude_Design/*.dc.html` files are the **design direction** (visual style, layout, component treatment) going forward. The live `kindfare-app-deploy/index.html` build is the **concept and functionality** source (what screens/features actually exist, what data and logic drive them, real copy). Where the two disagree on something visual, the redesign wins. Where the redesign is vague, silent, or implies a functional change the old app's code doesn't support, the old app wins unless Dessie confirms otherwise. Three items were flagged for a decision and have now been resolved (see Onboarding §3/§4 and Mia §7): no Type 2 Diabetes, vegan is a real diet option going forward, Mia's mic control is a visual mockup only (no voice functionality yet).*

## Overview
KindFare is a chronic-condition health and wellbeing app built around an on-device AI coach ("Mia"), condition-tailored nutrition and exercise, and a shopping list that ties back to the meal plan. Primary persona: 50+ adults managing chronic joint pain/osteoarthritis, fibromyalgia, and ME/CFS (see full condition list in §Onboarding — it's broader than that headline three).

## About the design files
`Last_Export_Claude_Design/*.dc.html` are HTML/CSS design prototypes for the new visual direction — recreate these screens in SwiftUI using native components (NavigationStack, TabView, List, ScrollView, AVPlayer, etc.), not a WebView. `kindfare-app-deploy/index.html` (`04_KindFare_App_Builds/`) is the live functional prototype — treat it as the behavior/content spec: what each screen actually does, real copy, real data.

## Fidelity
**High-fidelity** on visuals (colors, type, spacing = final as designed in the redesign files) and **high-fidelity on functionality** (screen logic, real content, real copy = final as built in the live app). Recreate pixel-close on the former, behavior-exact on the latter.

## Product & architecture decisions (from project docs — carry these into the build; the redesign files don't cover this layer since they're static HTML mocks)
- **Mia runs entirely on-device** via Apple's Foundation Models framework (iOS 26+), not a cloud AI service. Nothing typed to her leaves the phone. Don't imply she's Siri or reuse Apple's Siri name/wordmark/waveform.
- **One-time purchase, not a subscription** (target range £24.99–£39.99) — viable specifically because there's no ongoing AI service cost.
- **No backend, no accounts.** Food logs, conditions, and health data stored on-device only; no cloud sync beyond Apple's own opt-in end-to-end-encrypted iCloud.
- **Real HealthKit integration required** — the current prototype's Apple Health screen is simulated/no real access. This plus real on-device Foundation Models is specifically what resolves the known App Store blocker (guideline 4.2, minimum functionality / "repackaged website") — polish alone doesn't clear that bar.
- Not a registered medical device. No clinical claims ("NHS-endorsed," "clinically proven," etc.) unless individually fact-checked.

## Design tokens
*(Visual — from the redesign files, unchanged.)*

**Palette** (light / dark mode pairs):
- Background: `#F5F2EA` / `#1E1C18` (warm cream / near-black olive), built from 4 soft radial gradient blobs at low opacity, not a flat fill
- Primary text: `#1E1C18` / `#F5F2EA`
- Secondary text: `#6B6050` / `#B3A899`
- Primary accent (CTAs, links, progress): `#4A6B8A` (muted slate blue)
- Success/on-track accent: `#4F7A63` (sage green), chip bg `#DCE8E1`
- Warning/energy accent: `#D98816` (amber), used sparingly (streaks, featured badges)
- Alert/missing accent: `#E0304F`
- Hairline borders: `rgba(30,28,24,.08)` light / `rgba(255,255,255,.12)` dark
- Glass card fill: `rgba(255,255,255,.72)` light / `rgba(255,255,255,.08)` dark, with backdrop blur ≈20px + saturate(160%) — in SwiftUI use `.ultraThinMaterial`/`.thinMaterial` tuned to match

**Typography:**
- UI text: Inter (400/500/600/700/800) — SF Pro is an acceptable native substitute if Inter isn't licensed for the app
- Headings/greetings: a serif (Georgia stand-in in the prototype) for warmth — use New York (SwiftUI's built-in serif) natively
- Minimum text size 12px; body copy mostly 13–15px; headings 21–32px

**Shape & elevation:**
- Cards: 20–28px corner radius, glass fill + hairline border + soft shadow (`0 12–24px 26–48px rgba(30,28,24,.09–.14)`)
- Buttons: pill (999px radius) for secondary actions, 14–16px radius for primary CTAs
- Circular checkboxes/avatars throughout

**Layout:** iPhone canvas 390×844pt reference. Fixed status bar (47pt) + fixed bottom tab bar (84pt incl. home-indicator inset) with scrollable content between.

**Mia's AI-glow palette** (functional confirmation, not just visual): scoped exclusively to her avatar ring and chat ambience — `conic-gradient(from 0deg, #3d7bff, #ff3d63, #ff9d2e, #31d97a, #3d7bff)`. Never used for buttons, text, or data viz. Preserve as a deliberate exception, don't merge into the core palette.

## Navigation structure
Bottom tab bar, 5 tabs, persistent: **Home · Shop · Plan · Exercises · Profile**. Each icon 23×23 line icon (outline style), active tab tinted `#4A6B8A`, inactive tinted secondary text color, label 12px/600 under the icon. (Icon stroke width: the redesign spec calls for 2.4pt; the live app's own audit found stroke width inconsistent app-wide, 1.0–3.0px across icons with no enforced standard, and recommends 1.7 for 20px icons / 2.4 for larger touch targets going forward — either is defensible, but be consistent app-wide rather than matching per-icon.)

Separately, a **first-run Onboarding flow** (not in the tab bar) gates entry to the main app, and can be re-entered mid-app from specific Profile rows (deep link to a specific step).

## Screens

### 1. Onboarding (5 steps + processing + completion)
Full-bleed looping background video (calm gym/movement footage) behind a dark scrim gradient, glass content card floating over it, animated step progress bar with label ("Step N of 5 — <title>") at top. *(Visual framing per redesign.)*

- **Step 1 — Getting started**: name text field, continue button.
- **Step 2 — About you**: age stepper, weight stepper, sex segmented picker, units picker (metric/imperial).
- **Step 3 — Your health** ("Any health conditions?" — "Select any that apply. KindFare tailors meal plans, food safety and Mia's advice around these — select as many as relevant."): multi-select condition cards, checkmark + accent border + glow when selected (visual, per redesign). **Real content (from the live app, this is the actual functional list — use this, not a placeholder subset):**

  | # | Condition | Group |
  |---|---|---|
  | 0 | ME/CFS (Chronic Fatigue Syndrome) | Energy, pain & mind |
  | 1 | Fibromyalgia | Energy, pain & mind |
  | 2 | Lactose intolerance | Diet & weight |
  | 3 | Low wheat / gluten tolerance | Diet & weight |
  | 4 | Obesity | Diet & weight |
  | 5 | Osteoarthritis | Joints, bones & muscles |
  | 6 | Nonspecific Chronic Low Back Pain | Joints, bones & muscles |
  | 7 | Osteopenia | Joints, bones & muscles |
  | 8 | Osteoporosis | Joints, bones & muscles |
  | 9 | Sarcopenia | Joints, bones & muscles |
  | 10 | Depression | Energy, pain & mind |
  | 11 | Anxiety | Energy, pain & mind |
  | 12 | Chronic Insomnia | Energy, pain & mind |
  | 13 | None of the above | (ungrouped) |

  Grouped into 3 sections for scannability (label / badge color / icon): **Energy, pain & mind** (gold, pulse icon), **Diet & weight** (green, leaf icon), **Joints, bones & muscles** (blue, joint icon). Selection indices are relied on elsewhere in the app logic (e.g. an `hasMECFS` check on index 0) — don't reorder the underlying list even if the display groups make the source order non-obvious.

  **Resolved — Type 2 Diabetes:** confirmed excluded (per prior project decision, regulatory-scope reasons). The redesign's screen copy mentioning it as an example condition was stale/incorrect — do not add it to the condition list above.

- **Step 4 — Diet preference** ("Any dietary preferences?" — "This helps us tailor your shopping list and meal plan — swapping meat and fish for safe vegetarian proteins where needed."): icon-led selectable cards, single-select (visual, per redesign). **Real functional model (from the live app):** originally a 4-state choice — *I eat meat / I eat fish / I eat everything (default) / I am a vegetarian* — driving real downstream logic (a pescatarian substitution table swaps meat items for fish, a vegetarian mode swaps both for a 9th "Vegetarian Proteins" shop category, see §Shop). **Resolved — vegan option:** confirmed a real 5th state. The Onboarding redesign file itself was missing this card entirely (only had the original 4) — **fixed during the audit pass**: added a 5th "I am vegan" card, `diet: 'vegan'` state, and `dietLabel`/review-screen wiring, so the UI now correctly offers and records the choice. **Still open:** the downstream substitution/catalog logic — a vegan substitution table (swapping out dairy/egg items too, not just meat/fish) and its own shop category or filtered extension of "Vegetarian Proteins" — has not been built anywhere yet; this is new functionality, not something to port over, and needs to be designed before Swift handoff.

- **Step 5 — Review**: summary of all entered info before submit (name, age, sex, weight, diet, estimated daily kcal goal) — matches redesign description.
- **Processing screen**: animated checklist — "Reviewing your health profile" → "Compiling your tailored diet plan" → "Building your exercise programme, just for you" → a fourth on-device/privacy disclaimer line — auto-advances ~4s.
- **Completion screen**: celebratory confirmation, CTA into Home.

All steps: Back + (where applicable) Skip in header, primary CTA pinned at bottom, logo mark placed consistently. Deep-linkable via URL hash (`#step3` etc.) — recreate as a native route/step parameter.

### 2. Home
- Header: wordmark, dark-mode toggle, notification bell, avatar initial, greeting (serif).
- **Today card**: date + status chip + link; kcal ring (consumed/goal), 7-day streak dot row, macro breakdown with targets.
- **Secondary row** — two-up grid (redesign's visual call): workout streak card, Apple Health connection card.
- **Mia insight card**: avatar + online dot, proactive nutrition tip, quick-reply chips, direct action button deep-linking into Plan (e.g. "Add Greek yoghurt").
- **Quick actions**: 2×2 grid (redesign's visual call) of large tappable actions routing to Plan.
- Bottom tab bar (Home active).

No functional conflicts found between the two sources on this screen — the redesign's layout choices (two-up grid, 2×2 quick actions) stand as the direction; the underlying cards/data match what the live app already computes.

### 3. Shop
- Header: "Based on your plan" / "Recommended shopping list" (serif), dark-mode toggle.
- Toolbar: Select all / Clear, filter/status label.
- **Items picked up hero**: sticky progress card, gradient progress bar.
- **Category sections**, each: header photo, emoji + name + count, item rows below. **Real category list and counts (live app — use these, the redesign's summary undercounts by one):**

  8 always-shown categories — Breakfast & Dairy, Fish, Poultry & Meat, Eggs & Dairy-Free, Carbs & Staples, Vegetables, Fruit, Pantry — **plus a 9th, conditional category: 🌱 Vegetarian Proteins, shown only when diet preference is vegetarian**, replacing the meat/fish categories for that user. **Total real item count across the catalog: 50** (not 45 — confirmed by counting actual item entries in the live data). Now that vegan is a confirmed real diet option (see §Onboarding Step 4), this category logic needs a vegan equivalent too — either a distinct vegan-safe protein category or filtering the existing one further to exclude dairy/egg-derived items; this is new catalog work, not carried over from the live app.

- **Item rows**: circular checkbox + name + quantity. ~20 branded items carry a real substitute picker (2 realistic alternatives each, e.g. Cod Fillets 360g → Haddock Fillets 360g / Frozen Cod Loins 400g). The substitute set itself changes based on diet preference — there's a distinct pescatarian substitution table (meat → fish swaps) separate from the vegetarian one. Fresh produce/generic bulk items have no picker.
- "Export list" button.
- **Planner impact card**: meal categories covered.
- **Missing to complete your week card**: confirmed real section in the live app (not a redesign invention) — items required for daily calorie/macro targets, each individually captioned.

### 4. Plan
- Segmented control: **Today / Week / Calendar**, each a fully distinct view.
  - *Today*: meal-by-meal log with real food photography, tap-to-log, live calorie ring. Real meal set (per the design tool's own sync log against the live app): breakfast, mid-morning snack, lunch, afternoon snack, dinner, evening snack — 6 logging points, not just 3 main meals.
  - *Week*: 7-day summary (avg kcal/day, avg protein, days logged) + day list with mini progress bars, today highlighted.
  - *Calendar*: real month grid (Mon–Sun), dot markers on logged days, tap a day for its summary card.
- All meal photography real (not icons/illustrations).

### 5. Exercises
- Header: "Daily Exercises", supportive subhead, dark-mode toggle.
- **Progress card**: radial progress + segmented daily-progress dots + "Start guided session" CTA (redesign's visual call, no functional conflict — the live app already tracks daily exercise completion with a progress bar, radial vs. linear is a style choice).
- **Body-area filter row**: pill chips (All / Neck / Shoulder / Back / Hip & knee / Hand & foot).
- **Benefits carousel**: cards on why movement matters for this condition set.
- **10 daily exercises** — confirmed exact match against the live app's real asset filenames, one card per: Neck, Shoulder, Elbow, Wrist, Hand, Lower Back, SI Joint, Hip, Knee, Foot & Ankle. Each a real photo with gradient overlay, numbered/checked step badge, area label chip.
- **Advanced Mobility Flow — hero video card**, flagship feature, fully native AVPlayer (not a static mock):
  - Poster from a real frame still, "Featured guided session" badge, move count + duration.
  - Real play/pause, scrubbing bar + elapsed/total time, 0.5x/1x speed toggle.
  - 5 clips covering 6 poses (reverse lunge → side lunge → downward-dog reach → forward fold → kneeling backbend → side bend); chapter thumbnails seek + auto-play; clips auto-advance; auto-stop after the final clip.
  - Chapter strip: 6 tappable thumbnails, current chapter highlighted.

*(Note: `KindFare Exercises Redesign v2.dc.html` also exists alongside the v1 file. It's the preferred visual direction — confirmed by Dessie. It originally shipped with no dark mode, a non-functional tab bar, no sound, and no interactivity; all of that has since been rebuilt to match v1's engineering (dark mode, real navigation, sound, working exercise checkmarks feeding the progress card, and a real playing `<video>` element in the Advanced Mobility Flow card in place of the old static preview). Treat v2 as current for this screen.)*

### 6. Profile
- Avatar, name, condition summary line, edit button.
- **Account section rows**, each deep-links into the matching Onboarding step, pre-filled — confirmed real in the live app: Personal details → step 2, Health conditions → step 3 (chip subtitle), Diet preference → step 4.
- **Support / Legal sections**: standard list rows.
- **Sign out** action.
- Bottom tab bar (Profile active).

Live app also has a Text Size accessibility setting and a Face ID/app-lock toggle on Profile (per the feature changelog) — the redesign files weren't checked line-by-line for whether these rows are present; worth confirming they weren't dropped before building, since they're real shipped features, not proposals.

### 7. Mia (AI coach) — chat overlay
- Full-screen modal-style chat over frosted background, avatar with online status.
- Message bubbles (hers left-aligned muted, user's right-aligned accent-tinted), timestamps.
- Proactive nudge pattern matches Home's insight card.
- Quick-reply chips, text input + send control.
- Close control returns to the calling screen.

**Resolved — mic control:** confirmed a visual mockup only, not a functional requirement for this build. Include the mic icon in the input bar per the redesign's visual treatment, but it doesn't need to do anything yet — no voice input/transcription behind it. (This also lines up with a known open item elsewhere in the project: true hands-free voice input isn't buildable yet with what's currently available, so leaving it non-functional for now is consistent with that.)

**Compliance line — missing from the redesign doc entirely, must be carried into Swift regardless of visual treatment:** the live app's actual, word-for-word Mia disclaimer:

> "Design preview · Mia's replies are simulated, not real advice · Always speak to your GP or a registered dietitian before changing your diet or health routine."

Once Mia is running on real on-device Foundation Models rather than a scripted demo, the wording will need revisiting, but some equivalent GP/dietitian-referral disclaimer is a compliance requirement given the app makes no clinical claims — this isn't cosmetic copy and shouldn't be dropped for being outside the redesign's scope.

### 8. Apple Health Connect
Connection/permissions-style screen. **Confirmed real metrics from the live app:** Steps & activity, Sleep, Heart rate, Heart rate variability (HRV), and Weight — all 5 as real wired toggle rows, each with its own icon/label (see Open Items §4 below — this was independently confirmed during the audit pass).

### 9. Food Scanner
Overlay accessed from Home's quick actions (not a tab-bar destination). Camera-frame mock with a three-phase state machine: **idle** (framed camera view, "Scan food" CTA) → **scanning** (~1.4s animated on-device-processing indicator) → **result** (estimated meal name, kcal, and protein/carbs/fat breakdown, each in its own colored pill, plus "Add to today" which writes to local storage and routes into Plan, and "Scan another" which resets the cycle through a small rotating set of 3 example results). Carries its own honest preview disclaimer: *"This is a design preview — results shown are example scans, not real food recognition yet. When food scanning is fully built it will run on-device, like the rest of KindFare, to keep your data private and the app affordable."* No functional conflicts found against the live app's equivalent scan overlay — audited clean (sound fully wired on every state transition, no dead controls, no layout clipping).

### 10. Notifications
Overlay accessed from Home's bell icon (not a tab-bar destination, no bottom tab bar on this screen — matches the live app). A single scrollable list of 6 notification types (meal reminder, streak, Mia's tip, routine/wind-down, hydration, shopping list update), each with its own icon/color, title, body text, and relative timestamp; unread items (first 3) carry a small accent dot. Opening the screen marks all notifications read via `localStorage['kf_notifs_read']`, which Home's bell badge checks on its own render to clear its red dot — confirmed wired correctly on both ends.

**Bugs found and fixed during this audit pass:** (1) an unread-highlight background was stubbed to permanently-transparent and only wired on the first row — fixed to match the live app's real `.notif-row.unread` treatment (`rgba(189,201,214,.06)`) across all 3 unread rows; (2) the "Mia's tip" notification icon used a generic two-color gradient instead of Mia's actual AI-glow conic-gradient signature (`#3d7bff → #ff3d63 → #ff9d2e → #31d97a`) — fixed to match her identity everywhere else she appears; (3) the streak icon used the muted Clinical Calm sage green (`#4F7A63`) instead of the live app's actual bright status green (`#10b981`) for that icon — fixed to match ground truth.

## Interactions & behavior to preserve
- Dark mode toggle on every screen, same token-swap logic, persists per-session.
- Deep-linking from Profile rows into specific Onboarding steps (hash-based in the prototype; native route/step parameter in Swift).
- Real, functioning video playback in the Advanced Mobility Flow player — explicitly the app's flagship interaction, don't shortcut it.
- Substitute-product pickers on Shop are real selectable controls, and the substitute *set* is diet-preference-aware (pescatarian vs. vegetarian tables differ) — not a single static list.
- Calendar and Week views in Plan are real distinct data views, not decorative.
- Mia's GP/dietitian disclaimer must ship in some form (see §7 above).

## Assets
- All food/exercise/category photography is real (project's local asset library) — re-license/re-source equivalents for production. The redesign files already have the real exercise and meal photos copied into their image slots (per the design tool's own sync log against the repo), so this isn't outstanding for those two screens.
- Advanced Mobility Flow: 5 real clips (~6s each, portrait 1080×1920) + 6 matching frame-still photos for chapter thumbnails.
- Mia's avatar is a real headshot photo, not generated.

## Files
**Design references (visual):** `Last_Export_Claude_Design/KindFare Onboarding.dc.html`, `KindFare Home Redesign.dc.html`, `KindFare Shop Redesign.dc.html`, `KindFare Plan Redesign.dc.html`, `KindFare Exercises Redesign.dc.html` (the real one — `...v2.dc.html` is an archived alternate, not linked from the app's navigation, see note in §5), `KindFare Profile Redesign.dc.html`, `KindFare Mia Chat.dc.html`, `KindFare Apple Health Connect.dc.html`, `KindFare Food Scanner.dc.html`, `KindFare Notifications.dc.html` (all 10 screens now covered by this guide — the last two were missing from earlier drafts, added 2026-08-14)

**Functional/content reference (live):** `04_KindFare_App_Builds/` → `kindfare-app-deploy/index.html`, `KindFare_LiquidGlass_iOS_Prototype.html` (edited identically together, never split)

**Product/architecture context:** `KindFare_App_Design_Brief.md`, `KindFare_Design_System_Reference.md`, `KindFare_Master_Context_Export.md` (all `Steadmoor Master/` root)

## Open items before this goes to Swift (error-check pass)
1. ~~Resolve the 3 flagged items~~ — done: no Type 2 Diabetes; vegan is a real diet option (5th Step-4 card now built in Onboarding — see §Onboarding Step 4 — but substitution/catalog logic still open, see §Shop); Mia's mic control ships as a visual-only mockup, not functional.
2. ~~Confirm `Exercises Redesign.dc.html` vs `...v2.dc.html` — which is current.~~ **Correction (superseding the note previously here):** v1 (`KindFare Exercises Redesign.dc.html`) is the real, current Exercises screen — confirmed two ways: (a) every other screen's tab bar (Home, Shop, Plan, Profile) links to v1, never v2 — v2 is not reachable from anywhere in the app's actual navigation; (b) a user-supplied screen recording of the intended design matches v1 exactly (identical copy, identical progress-ring math, identical filter chips/insight cards, identical Advanced Mobility Flow video player with auto-advancing chapters). v1 is what should go to Swift. `v2.dc.html` was a separate visual exploration that got functionally rebuilt earlier in this project to match v1's completeness (real video, dark mode, sound, nav) at the user's request, but it was never wired into the app's real navigation and is not the intended design — keep it in the folder as an archived alternate only, not the reference for Swift.
3. ~~Confirm Text Size / Face ID rows survived into the Profile redesign.~~ Resolved: both present and wired (`toggleFaceId`, `setTextStandard`/`setTextLarge`).
4. ~~Confirm whether a dedicated Weight row exists on Apple Health Connect.~~ Resolved: yes, a Weight toggle row exists alongside Steps & activity, Sleep, Heart rate, and HRV — all 5 now real wired toggles (were static decorative pills before this audit).
5. ~~Carry the Mia disclaimer text forward in some form even though it's absent from every redesign file.~~ Resolved 2026-08-14: added word-for-word to `KindFare Mia Chat.dc.html`, fixed at the bottom of the input bar, matching the live app's placement and styling.
7. ~~Food Scanner and Notifications screens were never included in the merge/audit pass — only 8 of 10 screens were covered.~~ Resolved 2026-08-14: both audited and added to this document (see §9/§10 above). Food Scanner was already clean. Notifications had 3 real bugs, now fixed: a dead unread-highlight background, a wrong (non-Mia) gradient on her notification icon, and a wrong streak icon color.
6. ~~Design a vegan substitution table and shop-category treatment~~ Resolved: built into `KindFare Shop Redesign.dc.html`. A "Diet view" segmented toggle (Standard / Vegan) now drives real catalog logic — in Vegan mode, the Fish and Poultry & Meat categories are hidden entirely, a new 5-item "🌱 Vegan Proteins" category appears (tofu, Quorn vegan pieces, lentils, chickpeas, soya yoghurt alt — mirrors the Fish category's substitute-picker pattern), and four items elsewhere swap for vegan-safe defaults with updated substitute pickers: milk (Arla Lactofree → Oatly Oat Drink), yoghurt (Arla Lactofree → Alpro Soya), honey (Clear Honey → Golden Syrup), and eggs (Free Range Eggs → Orgran No Egg Replacer). The "Items picked up" progress total recalculates per mode (45 items standard, 41 vegan) rather than being hardcoded. This mirrors the existing pescatarian/vegetarian substitution pattern from the live app but is genuinely new logic — nothing to port over. Note: this diet-view toggle is local UI state on the Shop screen itself (these prototype files have no shared cross-screen state), so it's a working demonstration of the substitution logic rather than being driven by the Onboarding diet selection — wiring it to the user's actual saved diet preference is a Swift-side integration task, not a redesign-file gap.

### Manual audit pass — bugs found and fixed (this session)
A full manual pass was made over all 9 `.dc.html` redesign screens (Home, Shop, Plan, Profile, Apple Health Connect, Exercises v1 & v2, Mia Chat, Onboarding), checking for dead links, missing sound wiring, layout clipping, and stale/incorrect content. Confirmed issues were fixed directly in the files; see git history / file diffs for specifics. Highlights: a systemic scroll-clipping bug (missing bottom padding before the fixed tab bar) on 6 of 9 screens; sound effects completely missing on 2 screens (Apple Health Connect, Exercises v2); several dead/unwired buttons (Home's Apple Health card and profile avatar, Plan's stretch/walk/boost buttons and 31-day calendar, Apple Health Connect's 5 metric toggles, Mia Chat's fake input bar); Profile's stale "Type 2 diabetes" copy; and — found last, in Onboarding — a dead-end "Skip" button that jumped to the Processing screen without ever running the animation/advance timers, leaving users stuck at a frozen 0% progress screen (fixed by sharing the processing sequence between "Continue" and "Skip").

# Med.Zone: Phase-wise Build Prompt

A complete, reusable prompt for building Med.Zone (domain: **med.zone**) as a modern, interactive, responsive, self-updating website that earns from Google AdSense, lead generation, sponsorships and donations, and is hosted free on GitHub Pages from the `main` branch.

---

## 1. The idea, and why it wins

**Med.Zone = a free medical calculator and live health-data hub**, with a lead engine underneath.

| Lever | Why it matters for revenue |
|---|---|
| Health is a high-value ad vertical | Health, insurance, pharma and medical-education advertisers bid aggressively, so the same traffic tends to earn more per thousand visits than general content. |
| Calculators are evergreen search magnets | People search "BMI calculator", "due date calculator", "eGFR calculator" every day. A tool page answers instantly, gets bookmarked and reused, and earns backlinks from schools and clinics. |
| Live government data costs nothing | openFDA, NLM Clinical Tables, ClinicalTrials.gov and PubMed are free, public-domain and browser-accessible, so the site stays fresh without paid content. |
| Every page can route to a lead | Calculator users self-identify an intent (pregnancy, kidney disease, diabetes, nursing). Each intent maps to a buyer: insurers, medical-travel coordinators, trial recruiters, staffing agencies, clinics, health brands. |
| A short, dotted brand | "Med.Zone" reads as a destination, not a keyword stuffing exercise, and avoids the one-word "MedZone" mark used by others. |

**Planning assumptions to validate with real data:** health ad RPMs above the site-wide average; calculator pages converting 1 to 3 percent of visitors into a lead or newsletter signup; clinical-trial, medical-travel and insurance leads carrying the highest payouts. Track these in AdSense and in the inbox from day one and double down on what pays.

---

## 2. Research summary (38 sites reviewed)

Consumer health: WebMD, Mayo Clinic, Healthline, MedlinePlus, Cleveland Clinic, NHS, Medical News Today, Drugs.com, RxList, GoodRx, Healthgrades, Zocdoc, Patient.info, Johns Hopkins Medicine, Harvard Health, MedicineNet, Healthdirect, Better Health Channel, KidsHealth, Examine.
Clinical and research: MDCalc, Medscape, Merck Manuals, Radiopaedia, PubMed, ClinicalTrials.gov, CDC, WHO, STAT, Medical Xpress.
Education and calculators: Osmosis, Kenhub, Lecturio, AMBOSS, Nurseslabs, Nurse.org, RegisteredNurseRN, Calculator.net, Omni Calculator.

**Patterns adopted:** search-led hero (Drugs.com, Zocdoc); calculators organized by specialty with formula, evidence and next steps (MDCalc, Omni); A to Z condition index (Cleveland Clinic, NHS); interaction-free label lookup with boxed warnings first (Drugs.com, RxList); tool cards and quizzes for engagement (MedicineNet, Nurseslabs); multi-step program-finder lead forms (Nurse.org); provider and sponsor acquisition pages (Zocdoc, Healthgrades); supporter program and donation tiers (Radiopaedia, Mayo Clinic giving); editorial policy, review dates and cited sources as trust signals (Healthline, MNT, Merck); free lead magnet for email capture (Harvard Health); latest-videos feeds (RegisteredNurseRN); skip links, accessibility and plain language (NHS, Healthdirect).

---

## 3. Global rules (apply to every phase)

1. **Hosting:** static site, GitHub Pages free plan, `main` branch, repository `WEBWORKSA1/med-zone`. Use GitHub Pages' built-in Jekyll (no paid build services). All internal links must work under both `https://webworksa1.github.io/med-zone/` and the custom domain, so use `relative_url` everywhere and leave `url`/`baseurl` unset.
2. **AdSense:** put this exact code in the `<head>` of every page:
   `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`
   Add `<meta name="google-adsense-account" content="ca-pub-6620975821265271">` and an `ads.txt` with `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.
3. **Interest banner:** at the very top of every page show "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linked to `https://web.works/contact`.
4. **One contact email, never exposed:** every form submits to the owner's single email through FormSubmit's AJAX endpoint. The address (OWNER_EMAIL, kept out of this document and the repository's text) is stored only as XOR-encoded character codes in `assets/js/core.js` and assembled at submit time. No page, link text or source file shows it in plain text. "Email us" links build a `mailto:` on click.
5. **Trademark:** brand is always written "Med.Zone". Never use the one-word "MedZone" as a brand. Include a footer notice and a full `/legal/trademark/` page disclaiming any affiliation with similar names.
6. **YMYL quality bar:** every medical claim cites a primary source (guideline, PubMed, government agency); every calculator shows its formula, interpretation, limits and sources; no symptom checker, no diagnosis, no dosing advice beyond educational double-checks.
7. **Design:** distinctive, legible, accessible (WCAG 2.2 AA), responsive to 320 px, dark mode, reduced-motion support, print styles.

---

## 4. Phases

### Phase 1: Foundation and design system

**Prompt:** "Create a Jekyll site for GitHub Pages with `_config.yml` (collections `tools` and `guides`, plugins jekyll-sitemap and jekyll-seo-tag, front-matter defaults), layouts `default`, `page`, `tool`, `guide`, and includes for head, header (with the interest banner, sticky nav, search button, theme toggle, 'Get matched' CTA, mobile menu), footer (four link columns, newsletter, medical and trademark notices), breadcrumbs, newsletter, ad slot and lead CTA. Design system: ECG chart-paper grid as the signature motif, navy 'chart ink' text, signal red for the logo dot and alerts, highlighter yellow for results, one typeface (Atkinson Hyperlegible). Results render on an ECG strip with a trace that draws once."

**Done when:** every page shares the shell, the banner and AdSense code appear on every page, and the site renders cleanly at 390 px and 1366 px in light and dark modes.

### Phase 2: Calculator engine and 26 calculators

**Prompt:** "Build a data-driven calculator engine. Each calculator is a Markdown file in `_tools/` whose front matter lists inputs (units toggle, height, weight, length, number, select, sex, checkbox with points, date, time), related tools, lead intent and references; the body explains the formula, interpretation and limits. `assets/js/calc.js` holds one function per calculator returning a value, unit, band, flag, scale, detail rows and a note. Support metric and US units, validation messages, live recalculation, copy result, shareable 'link with my inputs', print. Calculators: BMI, BMR, calories/TDEE, body fat (Navy), ideal body weight, waist-to-height, water intake, heart-rate zones, MAP and BP category, QTc, CHA2DS2-VASc (with CHA2DS2-VA), sleep cycles, pack-years with USPSTF check, due date, ovulation, pregnancy weight gain (IOM 2009), eGFR (CKD-EPI 2021), creatinine clearance (Cockcroft-Gault), A1C to eAG, glucose converter, corrected calcium, anion gap, GCS, IV drip rate, weight-based dose, BSA."

**Done when:** unit tests reproduce published worked examples (for example BMI 70 kg / 170 cm = 24.2; CKD-EPI 2021, female 50 y, creatinine 1.0 mg/dL = 69; Cockcroft-Gault male 60 y, 72 kg, 1.0 mg/dL = 80 mL/min; A1C 7% = 154 mg/dL).

### Phase 3: Live data tools

**Prompt:** "Add browser-side tools on public APIs with graceful fallbacks: Drug lookup (openFDA drug label search with RxTerms autocomplete, boxed warning first, collapsible label sections, DailyMed link); FDA recalls for drugs, food and devices; Conditions A to Z (NLM Clinical Tables conditions API with MedlinePlus links) and ICD-10-CM lookup; Clinical trial finder (ClinicalTrials.gov API v2 with condition, location, status filters, pagination and a trial-matching CTA); Research finder (PubMed E-utilities esearch and esummary with study-type filters). Every tool explains its source and limitations."

**Done when:** each tool returns results, shows a helpful message and an external link if the API fails, and never blocks the page.

### Phase 4: Content, learning and video

**Prompt:** "Write 12 plain-language guides (blood tests, blood pressure, BMI limits, kidney function, A1C, doctor visit prep, medication safety, reliable health information, clinical trials, heart-rate zones, shift-work sleep, treatment abroad), each 600 to 1,000 words with sources and linked calculators. Build a Learn hub: 40-question quiz (10 random per round, explanations, best score, share, contest entry), flashcards (terminology, drug-name endings, vitals and labs), searchable printable lab values (US and SI), abbreviations with the 'Do not use' list flagged, and a private doctor-visit question builder. Build a video library with privacy-enhanced, click-to-load YouTube embeds: curated topic videos plus always-current channel players (WHO, Mayo Clinic, Cleveland Clinic, Osmosis, RegisteredNurseRN, Khan Academy NCLEX-RN)."

**Done when:** every guide and learning page has unique, substantial text (no thin pages), internal links and a newsletter or lead CTA.

### Phase 5: Monetization engine

**Prompt:** "Implement:
1. AdSense Auto ads site-wide, plus optional manual units that switch on when a slot ID is added to `_config.yml`. No ads near buttons that could cause accidental clicks.
2. A three-step 'Get matched' lead form with six intents (health insurance, treatment abroad and second opinions, clinical trial matching, healthcare jobs, clinic growth, brand partnerships), intent-specific questions, consent checkbox, UTM and referrer capture, honeypot, and a thank-you page. Add contextual lead CTAs on every calculator and guide.
3. Support page: four donation tiers, a pledge form that triggers a secure payment link, buttons that appear automatically when PayPal, Stripe, Buy Me a Coffee, Ko-fi or GitHub Sponsors links are added to config, a funds-allocation bar (operations, promotion and marketing, hiring, contests and prizes) and a supporters wall.
4. Contests: monthly knowledge challenge linked to the quiz, entry form, official rules (no purchase necessary, alternative entry, Canadian skill-testing question, Québec Régie clause), upcoming creator and student contests, prize sponsorship CTA.
5. Careers: remote roles (medical reviewer, writer, video creator, developer, partnerships, community, student ambassador) with an application form.
6. Advertise: sponsorship packages, advertising standards and a media-kit request form, including website and domain acquisition enquiries.
7. Newsletter capture in the footer, sidebars and a once-per-14-days desktop slide-in with a lab values cheat-sheet lead magnet."

**Done when:** every form delivers to the owner inbox, no form exposes the email, and the lead form passes intent, details, consent and source fields.

### Phase 6: Automation and self-updating

**Prompt:** "Add a GitHub Actions workflow that runs every 6 hours: fetch NIH, ScienceDaily, FDA, Medical Xpress, CDC and WHO RSS feeds into `assets/data/news.json`, fetch the latest uploads of the curated YouTube channels into `assets/data/videos-latest.json`, generate PNG icons and the social image from SVG on first run, and commit only when content changes. Pages rebuilds automatically on each commit. Also: site-wide search palette (Ctrl+K) from a Liquid-generated `search.json`, jekyll-sitemap, PWA manifest and a service worker with offline fallback."

**Done when:** news and videos refresh without manual work and the sitemap updates on every build.

### Phase 7: Trust, legal and AdSense readiness

**Prompt:** "Create About, Contact, Editorial policy (sources, testing, review cadence, AI use, corrections, ad separation), Medical disclaimer, Privacy and cookies (FormSubmit, AdSense and third-party cookie disclosures with Google opt-out links, GDPR, CCPA, PIPEDA and Québec Law 25 rights), Terms of use, Trademark and copyright disclosure, Accessibility statement, 404 and thank-you pages. Add a lightweight cookie notice that requests non-personalized ads when visitors choose 'Essential only', and enable Google's certified consent message in AdSense for EEA/UK visitors."

**Done when:** every policy page is linked from the footer, and the site meets AdSense's requirements for original content, clear navigation, a privacy policy and contact options.

### Phase 8: QA, launch and growth

**Prompt:** "Build locally, crawl every page for broken links, confirm the AdSense script and interest banner on every page, confirm the owner email appears nowhere in plain text, run calculator unit tests and browser tests on desktop and mobile, then push to `main` and enable Pages (Deploy from a branch: main, root)."

**Post-launch checklist:**
1. Submit one test form and click FormSubmit's activation email.
2. Apply for AdSense with the live URL; keep `ads.txt` at the domain root once med.zone points to GitHub Pages.
3. Add the custom domain (Settings, Pages) and enforce HTTPS.
4. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
5. Paste donation links into `_config.yml`.
6. Recruit two licensed medical reviewers and add named review credits to the highest-traffic pages.

**Growth roadmap:** add 2 to 4 calculators a month in high-CPC areas (pregnancy, diabetes, kidney, cardiology, nursing math); build condition hub pages that combine calculators, guides, trials and research for one condition; publish a weekly newsletter from the auto-updated news feed; sell calculator sponsorships first to clinics and health brands; route leads to partners on a pay-per-lead basis and measure payout per intent.

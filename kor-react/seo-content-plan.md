# SEO Content Plan — KOR Cycling Article Library

**Audience:** Claude agents reading `SEO_CONTENT_ROUTINE.md` and `AUTOMATION_PROMPT.md`. This is the single source of truth.

---

## MACHINE-READABLE ARTICLE INDEX (for agent quick lookup)

```
PLAN_VERSION: 2026-06-10
PHASES: 1, 2, 3, 4, 5 (measurement)
TOTAL_ARTICLES: 27 (12 Phase 2 + 7 Phase 3 + 8 Phase 4)

PHASE_2_MAINTENANCE:
  A0: bike-maintenance-schedule (pillar, 2000-2800w, Article)
  A1: when-to-replace-bike-chain (1200-1800w, Article)
  A2: how-to-measure-chain-wear (1200-1800w, HowTo)
  A3: when-to-replace-cassette (1200-1800w, Article)
  A4: when-to-replace-brake-pads (1200-1800w, Article)
  A5: when-to-replace-brake-rotors (1200-1800w, Article)
  A6: how-often-bleed-disc-brakes (1200-1800w, Article)
  A7: when-to-replace-bike-tires (1200-1800w, Article)
  A8: tubeless-sealant-how-often (1200-1800w, Article)
  A9: suspension-service-intervals (1200-1800w, Article)
  A10: dropper-post-maintenance (1200-1800w, Article)
  A11: bottom-bracket-creaking (1200-1800w, Article)
  A12: how-long-do-bike-parts-last (2000-2800w, Article+FAQ)

PHASE_3_RIDE_PLANNING:
  B0: how-to-plan-a-bike-ride (pillar, 2000-2800w, Article+FAQ)
  B1: pre-ride-bike-check (1200-1800w, HowTo)
  B2: what-to-bring-on-a-bike-ride (1200-1800w, Article)
  B3: cycling-route-planning-apps (1200-1800w, Article)
  B4: prepare-for-a-long-bike-ride (1200-1800w, Article)
  B5: group-ride-tips (1200-1800w, Article)
  B6: cycling-in-the-rain (1200-1800w, Article)
  B7: bikepacking-for-beginners (1200-1800w, Article)

PHASE_4_CYCLING_BASICS:
  C8: bike-maintenance-for-beginners (1200-1800w, Article)
  C1: how-to-buy-a-used-bike (1200-1800w, Article+FAQ)
  C3: bike-tune-up-cost (1200-1800w, Article+FAQ)
  C2: strava-tips-for-cyclists (1200-1800w, Article)
  C4: new-bike-checklist (1200-1800w, Article)
  C5: winter-bike-storage (1200-1800w, HowTo)
  C6: mtb-vs-road-maintenance (1200-1800w, Article)
  C7: sram-axs-battery-life (1200-1800w, Article)

BRIEF_LOCATION: Section 4 of this document (Phase 2, Phase 3, Phase 4 subsections)
SETTINGS: All work in kor-react/ directory only
```

---

## 0. Ground Rules (read before any work)

1. All work happens in `kor-react/` — this CRA app powers the live site at `https://jmrcycling.com` (see `README.md`, "React App (kor-react) — Build & Deploy"). Do NOT modify the legacy static `.html` pages at the repo root, and do NOT touch `dist/`.
2. Create a feature branch before starting (e.g., `feature/seo-articles`). Open a PR per phase.
3. The site is a client-rendered SPA with `BrowserRouter` and an nginx `try_files $uri /index.html` fallback. New routes need no server changes — but every article MUST render its `<title>`, meta description, canonical, and JSON-LD via `react-helmet` (the existing pattern in `src/components/common/StructuredData.tsx`).
4. Brand facts (use exactly these):
   - Product: **KOR (Keep On Rolling)** by **JMRcycling**. Domain: `https://jmrcycling.com`.
   - App Store: `https://apps.apple.com/us/app/kor-keep-on-rolling/id1599601993`
   - Google Play: `https://play.google.com/store/apps/details?id=com.robtuft.newKOR`
   - Author byline: `KOR Cycling Team` (matches `StructuredData.tsx` and `public/index.html`).
   - Core value prop: KOR connects to Strava, tracks component wear automatically, and alerts riders 2–4 weeks before parts fail.
5. Components KOR actually tracks (from `KOR-Mobile/README.md` and `docs/PART-REPLACEMENT-FLOWS.md`) — article content must align with these: chain, cassette, chainrings, bottom bracket, brake pads, brake rotors, brake bleed intervals, tires, tubeless sealant (tracked in **hours**), front fork and rear shock (service in **hours**), dropper post, SRAM AXS battery. Replaceable parts distinguish "worn out" vs "broke"; service parts use "service" verbs (fork/shock/dropper/brake bleed), not "replace".
6. After each phase: run `npm run build` inside `kor-react/` and fix any failures before committing. Do not run `expo start` or any Expo command — the mobile repo is reference material only.
7. Verify each claim about maintenance intervals against the key points given in the briefs below; where a brief gives a range (e.g., chain replacement at 0.5% wear), use it.

---

## 1. Phase 1 — Build the Article Infrastructure (do this first)

### 1.1 Content storage

Create these directories (both are required):

```
kor-react/public/content/articles/   ← article markdown files
kor-react/public/images/articles/    ← hero images
kor-react/src/content/               ← articlesIndex.ts
```

Article markdown files live at:

```
kor-react/public/content/articles/<slug>.md
```

Each `.md` file starts with YAML frontmatter, then the article body in Markdown. **Frontmatter schema (required for every article):**

```yaml
---
title: "How to Measure Chain Wear (and When to Replace Your Chain)"
description: "Meta description, 140–160 characters, includes the target keyword."
slug: "how-to-measure-chain-wear"
category: "maintenance"            # one of: maintenance | ride-planning | cycling-basics
tags: ["chain", "drivetrain"]
datePublished: "2026-06-15"        # ISO date
dateModified: "2026-06-15"         # update on every content edit
author: "KOR Cycling Team"
heroImage: "/images/articles/how-to-measure-chain-wear.webp"
heroImageAlt: "Chain checker tool measuring wear on a bike chain"
schemaType: "HowTo"                # one of: Article | HowTo | FAQPage
readingTime: 7
related: ["bike-maintenance-schedule", "when-to-replace-cassette"]
---
```

### 1.2 Article metadata index

Create `kor-react/src/content/articlesIndex.ts` exporting a typed array used by the index page, related-article cards, and the router. It mirrors frontmatter card fields:

```ts
export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: 'maintenance' | 'ride-planning' | 'cycling-basics';
  tags: string[];
  datePublished: string;
  dateModified: string;
  heroImage: string;
  heroImageAlt: string;
  author: string;
  schemaType: 'Article' | 'HowTo' | 'FAQPage';
  readingTime: number;
  related: string[];
}
export const articles: ArticleMeta[] = [ /* one entry per published article */ ];
```

Rule: `articlesIndex.ts` and the frontmatter of each `.md` file MUST stay in sync. When you create or edit an article, update both.

### 1.3 Components and routes

Install rendering deps inside `kor-react/`: `npm install react-markdown remark-gfm`.

Create:

1. `src/components/articles/ArticlesIndex.tsx` — route `/articles`. Renders a category filter (Maintenance / Ride Planning / Cycling Basics) and a card grid from `articlesIndex.ts`. Card = hero image, category label, title, description, reading time. Helmet: title `Cycling Maintenance & Ride Planning Articles — KOR`, description, canonical `${baseUrl}/articles`.
2. `src/components/articles/Article.tsx` — route `/articles/:slug`. Looks up the slug in `articlesIndex.ts` (unknown slug → render the existing not-found pattern). Fetches `/content/articles/<slug>.md`, strips the frontmatter block (split on the first two `---` lines — do not add a YAML parser dependency), and renders the body with `react-markdown` + `remark-gfm`. Ends with the CTA banner (1.5) and a "Related articles" card row built from `related`.
3. `src/components/articles/ArticleSeo.tsx` — Helmet wrapper following `StructuredData.tsx` conventions. Must output: `<title>{title} — KOR</title>` (em dash, matching `"Frequently Asked Questions — KOR"` in `FAQ.tsx`); meta description; canonical `${baseUrl}/articles/${slug}`; Open Graph + Twitter tags (pattern in `public/index.html`); JSON-LD for the frontmatter `schemaType` (`Article`/`HowTo`/`FAQPage`) with `author` → Organization "KOR Cycling Team", `publisher` → "KOR (Keep On Rolling)" with logo `${baseUrl}/images/KOR_app_Logo.png`, `datePublished`, `dateModified`, `image`; plus a `BreadcrumbList` (Home → Articles → article title). Read `baseUrl` from `process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com'` exactly as existing components do.

Register routes in `src/App.tsx` next to the existing public routes:

```tsx
<Route path='/articles' element={<ArticlesIndex />} />
<Route path='/articles/:slug' element={<Article />} />
```

### 1.4 Navigation

- `src/components/common/Header.tsx`: add `<Link className="link" to="/articles">Articles</Link>` to the desktop nav (after "Our Story") and the matching `mobile-link` entry.
- `src/components/common/Footer.tsx`: add an Articles link following the footer's existing link markup.

### 1.5 Article CTA banner

Every article ends with the existing CTA pattern (classes `cta-banner`, `cta-banner-content`, `cta-banner-title`, `cta-banner-text`, `cta-banner-buttons` — see `OurApp.tsx`). Copy template (vary the first sentence per article):

> **Stop guessing when parts need service.** KOR connects to Strava and tracks wear on your chain, brake pads, tires, suspension and more — then alerts you before they fail. [App Store button] [Google Play button] · Link to `/our-app`.

### 1.6 Styles

Append article styles to `src/styles/styles.css` (the single global stylesheet — there is no CSS-modules setup). Use kebab-case class names consistent with newer classes (`app-screen-section`, `cta-banner`): `.articles-index`, `.article-card`, `.article-page`, `.article-hero`, `.article-body`, `.article-meta`, `.article-related`. Constrain `.article-body` to ~70ch line length, style headings/lists/blockquotes/tables, and make images `max-width: 100%`.

### 1.7 Sitemap and robots

- For every published article, append a `<url>` entry to `kor-react/public/sitemap.xml`: pillar pages `priority 0.7`, supporting articles `0.6`, `/articles` index `0.7`. Set `<lastmod>` to the article's `dateModified`.
- `kor-react/public/robots.txt` already allows everything — no change needed.
- Do NOT edit the legacy root `sitemap.xml`/`robots.txt` (they belong to the old static site).

### 1.8 Images

Place hero images at `kor-react/public/images/articles/<slug>.webp`. Width 1200px, descriptive `alt` text from frontmatter.

**Generate every hero image using the HuggingFace MCP** (`gr1_flux_1_krea_dev_infer` — FLUX.1). Steps:

1. Load the tool schema: `ToolSearch("select:mcp__ec6ab3cc-afc5-4ef4-9275-9e982f39d76a__gr1_flux_1_krea_dev_infer")`
2. Build a prompt from this lookup table (base style appended to every prompt: `"professional cycling photography, outdoor natural lighting, ultra-realistic, 16:9 composition, no text, no watermarks"`):

| Article slug contains… | Subject for image prompt |
|---|---|
| `bike-maintenance-schedule`, `maintenance-for-beginners` | cyclist performing bike maintenance, clean bicycle outdoors |
| `when-to-replace-bike-chain`, `how-to-measure-chain-wear` | close-up bicycle chain and cassette, drivetrain, trail background |
| `when-to-replace-cassette` | bicycle cassette showing worn teeth, drivetrain close-up |
| `brake-pads`, `brake-rotors`, `bleed-disc-brakes` | mountain bike disc brake rotor and caliper detail, trail |
| `bike-tires`, `tubeless-sealant` | mountain bike tire on rocky trail, knobby tread close-up |
| `suspension-service` | mountain bike fork suspension detail, trail action shot |
| `dropper-post` | mountain biker descending technical trail, dropper post visible |
| `bottom-bracket` | bike mechanic working on drivetrain in clean workshop |
| `how-long-do-bike-parts-last` | collection of bicycle components laid out, chain cassette brake pads tires |
| `how-to-plan-a-bike-ride`, `prepare-for-a-long-bike-ride` | cyclists on scenic mountain road, aerial landscape |
| `pre-ride-bike-check` | cyclist inspecting bike before ride, helmet on, ready |
| `what-to-bring` | cycling gear flat-lay, pump tools tube food water |
| `cycling-route-planning` | cyclist checking GPS device on trail for navigation |
| `group-ride` | group of cyclists in paceline on road, cycling kit |
| `cycling-in-the-rain` | cyclist riding on wet road in rain, rain drops, wet weather |
| `bikepacking` | bikepacker on mountain trail with loaded bags, sunrise |
| `how-to-buy-a-used-bike` | person inspecting bicycle at bike shop or outdoor market |
| `strava-tips` | cyclist looking at Strava app on phone after ride, outdoors |
| `bike-tune-up-cost` | bike mechanic working in professional bicycle shop, tool wall |
| `new-bike-checklist` | brand new bicycle in bike shop, first purchase |
| `winter-bike-storage` | bicycle stored indoors in clean garage, winter |
| `mtb-vs-road` | mountain bike and road bike side by side, comparison |
| `sram-axs` | SRAM AXS electronic groupset on bicycle, derailleur detail |

3. Call the tool with the composed prompt.
4. The tool returns a URL or file path. Download with `curl -L <url> -o kor-react/public/images/articles/<slug>.webp` (rename to `.webp` — the app serves it as-is; no conversion needed for modern browsers).
5. **Fallback:** if the HuggingFace tool errors or is unavailable, copy the closest existing background: `cp kor-react/public/images/home_hero_bg.webp kor-react/public/images/articles/<slug>.webp` and log: `[PLACEHOLDER] Hero image for <slug> — replace with real photo.`

### 1.9 Phase 1 verification

`npm run build` succeeds; `/articles` and one seeded article route render with correct Helmet output (inspect with React DevTools or `view-source` on `npm start`); Header/Footer links work; sitemap validates as XML.

---

## 2. Editorial Conventions (apply to every article)

- **Tone** (derived from `OurApp.tsx`, `Home.tsx`, `FEATURE_RELEASE_v2.3.0.md`): rider-first, plain-spoken, confident, benefit-led. Second person ("your chain", "before your ride"). Short paragraphs (2–4 sentences). No clickbait, no keyword stuffing, no fabricated statistics. American English.
- **Product mentions**: weave KOR in naturally where it solves the problem being discussed — one in-body mention plus the closing CTA banner is the ceiling. Articles must be useful to a reader who never installs the app.
- **Structure**: exactly one H1 (the article title), logical H2/H3 hierarchy, a 2–3 sentence intro that states the answer early, and a closing FAQ section with 2–4 real questions when the brief lists them (use `schemaType: FAQPage` only when FAQs are the core format).
- **Length**: pillar pages 2,000–2,800 words; supporting articles 1,200–1,800 words.
- **Titles**: title tag ≤ 60 characters, keyword near the front, rendered as `{title} — KOR`.
- **Descriptions**: 140–160 characters, include target keyword, end with a reason to click.
- **Slugs/URLs**: kebab-case, no trailing slash, no `.html` (matches `/our-app`, `/personal-plans`, `/qr-guide`).
- **Internal links**: 3–6 per article, written as react-router `<Link>` equivalents in Markdown (`[anchor](/articles/slug)` — react-markdown renders these as `<a>`; that is acceptable). Every supporting article links to its pillar; every pillar links to all its published children. Max 2 links to product pages (`/our-app`, `/personal-plans`, `/sign-up`, `/qr-guide`, `/faq`) per article, with natural anchor text.
- **External links**: only to authoritative sources (e.g., Strava, manufacturer service docs); open in new tab with `rel="noopener"`.
- **Units**: miles primary (the app tracks miles; sealant and suspension in hours — mirror that).

---

## 3. Content Architecture

Two priority pillars plus one supporting category:

```
PILLAR A (maintenance):   /articles/bike-maintenance-schedule
  └── 12 supporting articles (Phase 2)
PILLAR B (ride-planning): /articles/how-to-plan-a-bike-ride
  └── 7 supporting articles (Phase 3)
CATEGORY C (cycling-basics): broader topics that feed both pillars (Phase 4)
```

Rationale: KOR's product is predictive parts maintenance, so Pillar A carries the highest commercial relevance and maps 1:1 to tracked components. Pillar B captures adjacent search demand (every planned ride starts with a working bike) and links back to A. Category C builds topical breadth and captures FAQ-derived long-tail (e.g., the used-bike question already answered in `FAQ.tsx`).

Build order: foundations first — pillars before children, children before basics. Publish the pillar with links to children stubbed as plain text, then convert to links as each child ships.

---

## 4. Article Briefs

Format key — **KW**: target keyword (intent) · **Title**: title tag · **URL**: route · **Schema**: JSON-LD type · **Links**: required internal links · **Cover**: key points.

### Phase 2 — Maintenance Pillar + Cluster (`category: maintenance`)

#### A0. PILLAR — Bike Maintenance Schedule
- **KW**: "bike maintenance schedule" (informational)
- **Title**: `Bike Maintenance Schedule: What to Service and When`
- **URL**: `/articles/bike-maintenance-schedule`
- **Schema**: Article (+ FAQ section)
- **Links**: every Phase 2 child as it publishes; `/our-app`; `/articles/pre-ride-bike-check` (once live)
- **Cover**: maintenance by time vs. mileage vs. hours and why mileage-based wins for wear parts; master table of every KOR-tracked component with typical replacement/service intervals (chain 1,500–3,000 mi; cassette every 2–3 chains; brake pads 500–1,500 mi; rotors when below min thickness; tires 1,000–3,000 mi by compound; sealant every 40–60 ride hours or 2–6 months; fork lowers ~50 hr / full service ~100–200 hr; shock air-can ~50 hr; dropper ~100–200 hr; bottom bracket 3,000–10,000 mi; brake bleed every 6–12 months); weekly/monthly/seasonal checklists; why riders forget (and how automatic tracking via Strava solves it — KOR mention); FAQs: "How often should I service my bike?", "Is bike maintenance worth it?".

#### A1. When to Replace a Bike Chain
- **KW**: "when to replace bike chain" (informational)
- **Title**: `When to Replace Your Bike Chain (Mileage + Wear Signs)`
- **URL**: `/articles/when-to-replace-bike-chain`
- **Schema**: Article
- **Links**: pillar; `/articles/how-to-measure-chain-wear`; `/articles/when-to-replace-cassette`; `/our-app`
- **Cover**: typical lifespan 1,500–3,000 mi and what shortens it (mud, drivetrain load, single-ring setups); 0.5% wear rule for 11/12-speed, 0.75% for ≤10-speed; cost of waiting — a worn chain eats cassette and chainrings (10x the cost); worn-out vs. broke (mirror the app's distinction); how KOR logs chain mileage automatically from Strava.

#### A2. How to Measure Chain Wear
- **KW**: "how to measure chain wear" (informational, how-to)
- **Title**: `How to Measure Chain Wear: Checker Tool & Ruler Methods`
- **URL**: `/articles/how-to-measure-chain-wear`
- **Schema**: HowTo
- **Links**: pillar; `/articles/when-to-replace-bike-chain`; `/articles/when-to-replace-cassette`
- **Cover**: step-by-step with a chain checker (0.5/0.75 gauge); 12-inch ruler method; checking multiple spots; reading stretch vs. roller wear; what number means replace now.

#### A3. When to Replace a Cassette
- **KW**: "when to replace cassette" (informational)
- **Title**: `When to Replace Your Cassette (and Chainrings)`
- **URL**: `/articles/when-to-replace-cassette`
- **Schema**: Article
- **Links**: pillar; A1; A2; `/personal-plans`
- **Cover**: every 2–3 chains rule; symptoms (skipping under load with a new chain, shark-toothed cogs); chainring wear signs; replace-together economics; how mileage tracking removes the guesswork.

#### A4. When to Replace Disc Brake Pads
- **KW**: "when to replace bike brake pads" (informational)
- **Title**: `When to Replace Bike Brake Pads: Wear Signs & Intervals`
- **URL**: `/articles/when-to-replace-brake-pads`
- **Schema**: Article
- **Links**: pillar; `/articles/when-to-replace-brake-rotors`; `/articles/how-often-bleed-disc-brakes`
- **Cover**: pad material lifespans (resin vs. metallic, 500–1,500 mi); the 1.5 mm minimum; noise, lever feel, and visual checks; rim-brake pad wear lines; wet/gritty conditions multiplier; bedding-in new pads.

#### A5. When to Replace Brake Rotors
- **KW**: "when to replace brake rotors bike" (informational)
- **Title**: `When to Replace Bike Brake Rotors (Thickness Guide)`
- **URL**: `/articles/when-to-replace-brake-rotors`
- **Schema**: Article
- **Links**: pillar; A4; `/articles/how-often-bleed-disc-brakes`
- **Cover**: manufacturer minimum thickness (typically 1.5 mm, stamped on rotor) and how to measure with calipers; warping vs. contamination vs. wear; rotor lifespan ≈ 2–4 pad sets; truing vs. replacing.

#### A6. How Often to Bleed Disc Brakes
- **KW**: "how often to bleed mtb brakes" (informational)
- **Title**: `How Often to Bleed Disc Brakes (MTB & Road)`
- **URL**: `/articles/how-often-bleed-disc-brakes`
- **Schema**: Article
- **Links**: pillar; A4; A5; `/sign-up` (shop angle: "ask your local KOR shop")
- **Cover**: every 6–12 months baseline; mineral oil vs. DOT fluid intervals; spongy-lever symptoms; why this is a calendar-interval job (the app tracks bleed intervals) and a good shop-service item.

#### A7. When to Replace Bike Tires
- **KW**: "when to replace bike tires" (informational)
- **Title**: `When to Replace Bike Tires: Mileage & 6 Wear Signs`
- **URL**: `/articles/when-to-replace-bike-tires`
- **Schema**: Article
- **Links**: pillar; `/articles/tubeless-sealant-how-often`; `/articles/pre-ride-bike-check` (once live)
- **Cover**: road 1,000–3,000 mi, MTB by knob wear; wear indicators, squared profile, casing threads, sidewall cracking, frequent flats; front-vs-rear rotation debate (don't rotate worn rears forward); storage and UV aging.

#### A8. How Often to Refresh Tubeless Sealant
- **KW**: "how often to add tubeless sealant" (informational)
- **Title**: `How Often to Add Tubeless Sealant (Hours & Months)`
- **URL**: `/articles/tubeless-sealant-how-often`
- **Schema**: Article
- **Links**: pillar; A7; `/our-app`
- **Cover**: 2–6 month refresh window and why heat/altitude shorten it; KOR tracks sealant in ride **hours** (~40–60 hr) — explain why hours beat calendar time; dip-stick check through the valve; top-up vs. full refresh; signs it's dried (no slosh, flats that won't seal).

#### A9. MTB Suspension Service Intervals
- **KW**: "mtb suspension service intervals" (informational)
- **Title**: `Fork & Shock Service Intervals: The Hour-Based Guide`
- **URL**: `/articles/suspension-service-intervals`
- **Schema**: Article
- **Links**: pillar; `/articles/dropper-post-maintenance`; `/qr-guide` or `/sign-up` (shop service angle)
- **Cover**: why suspension is serviced in **hours** not miles; lower-leg/air-can service ~50 hr, full damper service ~100–200 hr (point to Fox/RockShox specifics); symptoms of overdue service (stiction, oil weep, lost small-bump feel); keeping tuning notes (KOR's suspension notes feature); cost of neglect (stanchion/bushing damage).

#### A10. Dropper Post Maintenance
- **KW**: "dropper post maintenance" (informational)
- **Title**: `Dropper Post Maintenance: Service Intervals & Care`
- **URL**: `/articles/dropper-post-maintenance`
- **Schema**: Article
- **Links**: pillar; A9
- **Cover**: ~100–200 hr service interval; daily care (clean stanchion, store dropped or topped?); symptoms (sag, slow return, side play); cable vs. hydraulic actuation differences; what a full service involves and when to use a shop.

#### A11. Bottom Bracket Creaks & Replacement
- **KW**: "bottom bracket creaking" (informational, troubleshooting)
- **Title**: `Bottom Bracket Creaking? Diagnosis & Replacement Guide`
- **URL**: `/articles/bottom-bracket-creaking`
- **Schema**: Article
- **Links**: pillar; A3; `/contact`
- **Cover**: diagnosing creaks (BB vs. pedals vs. seatpost vs. chainring bolts); lifespan 3,000–10,000 mi by bearing type and conditions; press-fit vs. threaded; play and roughness checks; when it's a shop job.

#### A12. How Long Do Bike Parts Last?
- **KW**: "how long do bike parts last" (informational, broad)
- **Title**: `How Long Do Bike Parts Last? Lifespan of Every Component`
- **URL**: `/articles/how-long-do-bike-parts-last`
- **Schema**: Article (+ FAQ section)
- **Links**: pillar + A1, A3, A4, A7, A9 (it is the cluster's hub-and-spoke summary); `/our-app`
- **Cover**: a single sortable-feel table of all KOR-tracked components with lifespan ranges and failure signs; the variables that move the ranges (terrain, weather, rider weight, maintenance habits); worn-out vs. broke framing; why averaged intervals fail individuals and per-rider mileage tracking wins.

### Phase 3 — Ride Planning Pillar + Cluster (`category: ride-planning`)

#### B0. PILLAR — How to Plan a Bike Ride
- **KW**: "how to plan a bike ride" (informational)
- **Title**: `How to Plan a Bike Ride: Route, Gear & Bike Prep`
- **URL**: `/articles/how-to-plan-a-bike-ride`
- **Schema**: Article (+ FAQ section)
- **Links**: every Phase 3 child; `/articles/bike-maintenance-schedule`; `/our-app`
- **Cover**: the full planning loop — pick distance/elevation for fitness level, route tools, weather windows, fueling math (carbs/hr), what to pack, pre-ride bike check, telling someone your route, post-ride log; how a maintenance-ready bike is step zero (link Pillar A); checklists the reader can copy.

#### B1. Pre-Ride Bike Check
- **KW**: "pre ride bike check" (informational, how-to)
- **Title**: `The 5-Minute Pre-Ride Bike Check (M-Check Guide)`
- **URL**: `/articles/pre-ride-bike-check`
- **Schema**: HowTo
- **Links**: B0 pillar; A pillar; A7; `/our-app`
- **Cover**: the M-check step-by-step (front axle → bars/headset → BB/drivetrain → saddle/post → rear axle/brakes); tire pressure by discipline; quick brake and shift checks; what each finding means (link to relevant maintenance articles); how KOR's dashboard replaces the "is anything due?" mental check.

#### B2. What to Bring on a Bike Ride
- **KW**: "what to bring on a bike ride" (informational)
- **Title**: `What to Bring on a Bike Ride: Packing Lists by Distance`
- **URL**: `/articles/what-to-bring-on-a-bike-ride`
- **Schema**: Article
- **Links**: B0; B1; B4
- **Cover**: three tiered lists (under 1 hr / 1–3 hr / all-day); the repair kit minimum (tube, levers, pump/CO2, multitool, quick link); food and water math; phone, ID, money; discipline differences (road vs. MTB vs. commute).

#### B3. Best Cycling Route Planning Apps
- **KW**: "cycling route planner" (informational, comparison)
- **Title**: `Best Cycling Route Planners: Strava, Komoot, RWGPS & More`
- **URL**: `/articles/cycling-route-planning-apps`
- **Schema**: Article
- **Links**: B0; `/articles/strava-tips-for-cyclists` (Phase 4); `/our-app`
- **Cover**: honest comparison of Strava Routes, Komoot, Ride with GPS, Garmin/Wahoo ecosystems (features, pricing tiers, surface-type data, heatmaps); picking by use case; exporting to head units; note that KOR pairs with Strava so planned rides automatically feed maintenance tracking — one mention only.

#### B4. How to Prepare for a Long Bike Ride
- **KW**: "how to prepare for a long bike ride" (informational)
- **Title**: `How to Prepare for a Long Bike Ride (Training to Tune-Up)`
- **URL**: `/articles/prepare-for-a-long-bike-ride`
- **Schema**: Article
- **Links**: B0; B1; B2; A pillar
- **Cover**: building distance progressively (10% rule); fueling before/during (60–90 g carbs/hr) and hydration; bike prep two weeks out — don't ride a big event on a chain at 0.5% or pads at the limit (link maintenance cluster); pacing; contingency planning.

#### B5. Group Ride Tips for Beginners
- **KW**: "group ride tips" (informational)
- **Title**: `Group Ride Tips: Etiquette, Signals & How Not to Get Dropped`
- **URL**: `/articles/group-ride-tips`
- **Schema**: Article
- **Links**: B0; B1; B2
- **Cover**: ride categories (no-drop, tempo, race pace); paceline basics and hand signals; rules (hold your line, point out hazards, no half-wheeling); showing up with a mechanically sound bike (link B1) — being "that rider" with a mid-ride mechanical; finding rides (clubs, shops, Strava clubs).

#### B6. Cycling in the Rain
- **KW**: "cycling in the rain tips" (informational)
- **Title**: `Cycling in the Rain: Riding Tips & Post-Ride Bike Care`
- **URL**: `/articles/cycling-in-the-rain`
- **Schema**: Article
- **Links**: B0; A1 (wet rides accelerate chain wear); A4; A8
- **Cover**: braking distances and cornering on wet roads; visibility gear; fenders; the maintenance tax of wet riding (chain wear up to 2–3x faster, pad grinding) and the 10-minute post-rain wash/dry/lube routine; why wet-season riders hit service intervals sooner.

#### B7. Planning Your First Bikepacking Trip
- **KW**: "bikepacking for beginners" (informational)
- **Title**: `Bikepacking for Beginners: Plan Your First Overnighter`
- **URL**: `/articles/bikepacking-for-beginners`
- **Schema**: Article
- **Links**: B0; B2; B3; A pillar
- **Cover**: the S24O (sub-24-hour overnight) as the on-ramp; bag setups without buying everything; route selection for loaded riding; gear list; pre-trip service checklist — multi-day trips are where neglected parts fail (link A12); leave-no-trace basics.

### Phase 4 — Cycling Basics / Broad Topics (`category: cycling-basics`)

#### C1. How to Buy a Used Bike
- **KW**: "how to buy a used bike" (informational, commercial-adjacent)
- **Title**: `How to Buy a Used Bike: Inspection Checklist & Red Flags`
- **URL**: `/articles/how-to-buy-a-used-bike`
- **Schema**: Article (+ FAQ section)
- **Links**: A2; A12; `/faq` (the FAQ already answers "I just bought a used bike, how can I track it?"); `/our-app`
- **Cover**: pricing research; the inspection checklist (chain wear check is the seller-honesty test — link A2, frame cracks, bearing play, suspension condition); test-ride checks; negotiating with discovered wear; after purchase — get a shop assessment and set baseline wear percentages (KOR's Part Settings feature does exactly this, per the site FAQ).

#### C2. Strava Tips for Cyclists
- **KW**: "strava tips" (informational)
- **Title**: `12 Strava Tips for Cyclists (Beyond Kudos & Segments)`
- **URL**: `/articles/strava-tips-for-cyclists`
- **Schema**: Article
- **Links**: B3; A pillar; `/our-app` (KOR is built on Strava — natural mention)
- **Cover**: profile/privacy setup (privacy zones); segments, local legends, matched rides; routes and heatmaps; gear tracking in Strava and its limits (manual, no wear prediction) — segue to apps built on the Strava API; training log basics; clubs.

#### C3. How Much Does a Bike Tune-Up Cost?
- **KW**: "bike tune up cost" (informational, commercial)
- **Title**: `Bike Tune-Up Cost: What Shops Charge & What's Included`
- **URL**: `/articles/bike-tune-up-cost`
- **Schema**: Article (+ FAQ section)
- **Links**: A pillar; A12; `/sign-up` (shop partnership angle); `/personal-plans`
- **Cover**: typical tiers (basic $50–$100, standard $100–$180, overhaul $200+) and what each includes; parts cost on top; when you need which tier; how preventive scheduling beats emergency repairs (cheaper, faster turnaround); supporting your local shop — KOR's shop-connection feature.

#### C4. New Bike Checklist
- **KW**: "just bought a bike what do I need" (informational)
- **Title**: `New Bike Checklist: 10 Things to Do After You Buy`
- **URL**: `/articles/new-bike-checklist`
- **Schema**: Article
- **Links**: B1; B2; A pillar; `/our-app`
- **Cover**: fit basics (saddle height, reach); essential accessories in priority order; registering serial number; first-30-days free shop check most shops offer; setting up tracking from day one (Strava + maintenance baseline); learning the M-check.

#### C5. How to Store a Bike for Winter
- **KW**: "how to store a bike for winter" (informational, seasonal)
- **Title**: `How to Store a Bike for Winter (Without Ruining Parts)`
- **URL**: `/articles/winter-bike-storage`
- **Schema**: HowTo
- **Links**: A pillar; A7 (tire aging); A8 (sealant dries in storage)
- **Cover**: wash + lube before storage; tire pressure and hanging vs. floor; sealant dries over winter — plan a refresh at season start; battery care (lights, AXS, e-bikes); indoor vs. shed humidity; the spring-readiness checklist.

#### C6. Mountain Bike vs Road Bike Maintenance
- **KW**: "mountain bike maintenance vs road bike" (informational)
- **Title**: `MTB vs Road Bike Maintenance: What Changes & What Doesn't`
- **URL**: `/articles/mtb-vs-road-maintenance`
- **Schema**: Article
- **Links**: A pillar; A9; A10; A8
- **Cover**: shared fundamentals (chain, pads, tires); MTB-only items (suspension hours, dropper, sealant, more frequent bleeds); road-specific patterns (higher mileage, rim wear on rim brakes); interval differences in one comparison table; configuring tracking per bike type (KOR's bike settings let you toggle components — per the site FAQ).

#### C7. SRAM AXS Battery Life & Care
- **KW**: "sram axs battery life" (informational, long-tail)
- **Title**: `SRAM AXS Battery Life: How Long It Lasts & Care Tips`
- **URL**: `/articles/sram-axs-battery-life`
- **Schema**: Article
- **Links**: A pillar; B1 (check battery in pre-ride); `/our-app` (KOR monitors AXS batteries)
- **Cover**: ~20 hr ride time per charge, coin cells in shifters ~2 yr; charge indicators; cold-weather behavior; spare-battery strategy; storage mode; getting stranded in one gear — and monitoring options.

#### C8. Bike Maintenance for Beginners
- **KW**: "bike maintenance for beginners" (informational, high-volume)
- **Title**: `Bike Maintenance for Beginners: The 8 Skills That Matter`
- **URL**: `/articles/bike-maintenance-for-beginners`
- **Schema**: Article
- **Links**: A pillar (this is the beginner's on-ramp to it); A2; B1; `/personal-plans`
- **Cover**: the 80/20 of home maintenance (wash, lube, tire pressure, M-check, chain check, pad glance, bolt check, knowing when to go to a shop); minimal tool kit under $100; cadence (after every wet ride, weekly, monthly); what NOT to DIY at first (bleeds, suspension internals); building the habit — or automating the reminders.

---

## 5. Production Sequence & Workflow

Execute in this order. Within a phase, ship the pillar first.

| Order | Batch | Items |
|---|---|---|
| 1 | Phase 1 | Infrastructure (Section 1) + seed with A0 pillar |
| 2 | Phase 2a | A1, A2, A3, A12 (drivetrain core + hub article) |
| 3 | Phase 2b | A4, A5, A6, A7, A8 (brakes + tires) |
| 4 | Phase 2c | A9, A10, A11 (suspension + BB) |
| 5 | Phase 3 | B0 pillar, then B1, B2, B4, B3, B5, B6, B7 |
| 6 | Phase 4 | C8, C1, C3, C2, C4, C5, C6, C7 |

**Per-article workflow (repeat for every brief):**

1. Create `kor-react/public/content/articles/<slug>.md` with complete frontmatter (schema in 1.1) and the full article body per the brief and Section 2 conventions.
2. Add/update the matching entry in `src/content/articlesIndex.ts`.
3. Add the hero image at `public/images/articles/<slug>.webp` (or branded placeholder).
4. Add the `<url>` entry to `public/sitemap.xml` with correct priority and `lastmod`.
5. Update the pillar page: convert the stubbed mention of this article into a link.
6. Run the QA checklist (Section 6). Commit with message `content: add <slug> article`.

**Maintenance directives (ongoing):**
- Any content edit → bump `dateModified` in frontmatter, `articlesIndex.ts`, and sitemap `lastmod`.
- Quarterly: re-verify interval claims against manufacturer guidance and refresh the two pillars.
- When a new component type ships in the KOR app, add a matching maintenance article using the A-cluster pattern.

---

## 6. Per-Article QA Checklist (must pass before commit)

- [ ] `npm run build` passes in `kor-react/`.
- [ ] Route `/articles/<slug>` renders; unknown slugs fall through to not-found.
- [ ] Helmet output contains: title in the `{title} — KOR` pattern, description 140–160 chars, canonical `https://jmrcycling.com/articles/<slug>`, OG + Twitter tags, valid JSON-LD (paste into Google's Rich Results test format mentally: required `headline`, `author`, `datePublished`, `image` present).
- [ ] Exactly one H1; heading levels never skip.
- [ ] 3–6 internal links, all resolving to live routes; pillar linked; ≤2 product-page links.
- [ ] Frontmatter, `articlesIndex.ts`, and `sitemap.xml` agree on slug, dates, and metadata.
- [ ] Hero image exists, has descriptive alt text, and is `.webp`.
- [ ] CTA banner present at the article end with both store buttons and `/our-app` link.
- [ ] No fabricated statistics; intervals match the ranges given in the brief.

## 7. Measurement (after Phase 2 ships)

- Confirm article pageviews appear in GA (the `GoogleAnalytics` component tracks route changes) and PostHog (`initPostHog` in `App.tsx`) without additional wiring.
- Submit the updated sitemap in Google Search Console for `jmrcycling.com`; monitor indexing of `/articles/*` — if client-side rendering causes indexing lag after 4–6 weeks, propose pre-rendering (e.g., `react-snap`) as a separate PR; do not add it preemptively.
- Track keyword positions for the two pillar keywords plus A1, A4, A7, B1, C8 as the leading indicators.

---
*End of plan. Begin with Section 1 on a fresh feature branch.*

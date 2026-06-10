# SEO Content Automation Prompt (Paste Once, Run Forever)

**This prompt is pasted once and never changes. It runs on a scheduled routine.**

---

## Your Mission

1. Read the `CURRENT STATUS` block in `SEO_CONTENT_ROUTINE.md`
2. Determine what to do next (Phase 1 infrastructure, build an article, create a PR, or wrap up)
3. Execute the task
4. Update `CURRENT STATUS` in `SEO_CONTENT_ROUTINE.md`
5. Report completion

---

## Instructions

### A. Check Current Status

Open `kor-react/SEO_CONTENT_ROUTINE.md` and read the `CURRENT STATUS` block:
- `CURRENT_PHASE` — which phase (1, 2, 3, 4, 5)
- `CURRENT_ARTICLE` — which article ID (e.g., "A0", "B1", "C8") or "infrastructure"
- `ARTICLES_COMPLETED_THIS_PHASE` — how many completed in this phase
- `PHASE_STATUS` — "in_progress" or "complete_measurement"
- `NEXT_ACTION` — what to do next ("complete-phase-1", "build-article", "create-pr", "final-measurement")

### B. Execute Next Action

#### If `NEXT_ACTION: complete-phase-1`

Execute all steps in `SEO_CONTENT_ROUTINE.md` Section "Phase 1: Article Infrastructure" (lines 1.1–1.9 of `seo-content-plan.md`):
- Create directories inside `kor-react/`:
  - `public/content/articles/`
  - `public/images/articles/`
  - `src/content/`
- Create `src/content/articlesIndex.ts` with `ArticleMeta` interface and empty array. The interface MUST include all fields including `author: string`:
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
  export const articles: ArticleMeta[] = [];
  ```
- Install deps inside `kor-react/`: `npm install react-markdown remark-gfm`
- Create three components (follow patterns in `seo-content-plan.md` Section 1.4):
  - `src/components/articles/ArticlesIndex.tsx`
  - `src/components/articles/Article.tsx`
  - `src/components/articles/ArticleSeo.tsx`
- Register routes in `src/App.tsx`: `/articles` and `/articles/:slug`
- Update `src/components/common/Header.tsx` and `Footer.tsx` with Articles links
- Add styles to `src/styles/styles.css` (classes: `.articles-index`, `.article-card`, `.article-page`, `.article-hero`, `.article-body`, `.article-meta`, `.article-related`)
- Update `public/sitemap.xml` with `/articles` entry (priority 0.7, lastmod today)
- Run `npm run build` inside `kor-react/` and verify success — if it fails, STOP and report the error
- Then:
  - `git checkout -b feature/seo-phase-1-infrastructure`
  - Stage specific files by name (NEVER `git add .` — it risks staging `.env`, `dist/`, or unrelated binaries):
    ```bash
    git add kor-react/src/content/articlesIndex.ts \
            kor-react/src/components/articles/Article.tsx \
            kor-react/src/components/articles/ArticlesIndex.tsx \
            kor-react/src/components/articles/ArticleSeo.tsx \
            kor-react/src/App.tsx \
            kor-react/src/components/common/Header.tsx \
            kor-react/src/components/common/Footer.tsx \
            kor-react/src/styles/styles.css \
            kor-react/public/sitemap.xml \
            kor-react/package.json \
            kor-react/package-lock.json
    ```
  - `git commit -m "feat: Phase 1 — Article Infrastructure"`
  - Create PR: title `feat: SEO Phase 1 — Article Infrastructure`, body references `seo-content-plan.md` Section 1
  - **STOP — do NOT merge. Per the Checkpoints section, the user reviews and merges PRs.**
  - Update `CURRENT STATUS` in both `SEO_CONTENT_ROUTINE.md` files (root and `kor-react/`):
    ```
    CURRENT_PHASE: 2
    CURRENT_ARTICLE: A0
    ARTICLES_COMPLETED_THIS_PHASE: 0
    PHASE_STATUS: in_progress
    NEXT_ACTION: build-article
    ```
  - `git add SEO_CONTENT_ROUTINE.md kor-react/SEO_CONTENT_ROUTINE.md && git commit -m "routine: Phase 1 complete, advancing to Phase 2, article A0"`
  - `git push origin feature/seo-phase-1-infrastructure`

#### If `NEXT_ACTION: build-article`

1. **Look up brief:** Find `CURRENT_ARTICLE` (e.g., "A0") in `kor-react/seo-content-plan.md` Section 4
   - Extract: slug, title, KW, category, schema type, links, cover points, FAQs
   - Example: A0 is in "Phase 2 — Maintenance Pillar + Cluster", section "A0. PILLAR — Bike Maintenance Schedule"

2. **Map article references to slugs:**
   Use this lookup table to convert article IDs and special references to slugs for the `related` field:

   ```
   ARTICLE_SLUG_MAP:
   A0 → bike-maintenance-schedule
   A1 → when-to-replace-bike-chain
   A2 → how-to-measure-chain-wear
   A3 → when-to-replace-cassette
   A4 → when-to-replace-brake-pads
   A5 → when-to-replace-brake-rotors
   A6 → how-often-bleed-disc-brakes
   A7 → when-to-replace-bike-tires
   A8 → tubeless-sealant-how-often
   A9 → suspension-service-intervals
   A10 → dropper-post-maintenance
   A11 → bottom-bracket-creaking
   A12 → how-long-do-bike-parts-last

   B0 → how-to-plan-a-bike-ride
   B1 → pre-ride-bike-check
   B2 → what-to-bring-on-a-bike-ride
   B3 → cycling-route-planning-apps
   B4 → prepare-for-a-long-bike-ride
   B5 → group-ride-tips
   B6 → cycling-in-the-rain
   B7 → bikepacking-for-beginners

   C1 → how-to-buy-a-used-bike
   C2 → strava-tips-for-cyclists
   C3 → bike-tune-up-cost
   C4 → new-bike-checklist
   C5 → winter-bike-storage
   C6 → mtb-vs-road-maintenance
   C7 → sram-axs-battery-life
   C8 → bike-maintenance-for-beginners

   PHASE_PILLARS:
   Phase 2 pillar → A0 → bike-maintenance-schedule
   Phase 3 pillar → B0 → how-to-plan-a-bike-ride
   Phase 4 pillar → C8 → bike-maintenance-for-beginners
   ```

   **How to map the brief's Links field:**
   - If link is `"pillar"`: replace with current phase's pillar slug
   - If link starts with `/articles/`: extract slug from path
   - If link is an article ID (e.g., "A1", "B0"): use the lookup table above
   - If link is a product page (e.g., `/our-app`, `/personal-plans`): keep as-is

   The `related` field in frontmatter should contain **only article slugs** (no product pages). Example:
   ```yaml
   related: ["bike-maintenance-schedule", "how-to-measure-chain-wear", "when-to-replace-cassette"]
   ```

3. **Generate article markdown:**
   Write the complete article body (no frontmatter) following these rules:
   - Exactly one H1 (the title)
   - Intro: 2–3 sentences stating the answer early
   - Body: H2/H3 sections following the brief's Cover points verbatim
   - Internal links: `[text](/articles/slug)` for markdown
   - External product links: max 2 per article (`/our-app`, `/personal-plans`, `/sign-up`, `/qr-guide`, `/faq`)
   - CTA banner at the end: "Stop guessing when parts need service. KOR connects to Strava and tracks wear on your chain, brake pads, tires, suspension and more — then alerts you before they fail." + App Store + Google Play + `/our-app` link
   - Tone: rider-first, plain-spoken, second person. 2–4 sentence paragraphs. American English
   - Units: Miles primary; sealant and suspension intervals in **hours** only
   - No fabricated stats — all intervals must match the brief exactly

4. **After generating markdown:**
   - Create file: `kor-react/public/content/articles/[slug].md`
   - Prepend YAML frontmatter:
     ```yaml
     ---
     title: "[title from brief]"
     description: "[140–160 char meta description with keyword, end with reason to click]"
     slug: "[slug]"
     category: "[category]"
     tags: [tag1, tag2, tag3]
     datePublished: "[today's date]"
     dateModified: "[today's date]"
     author: "KOR Cycling Team"
     heroImage: "/images/articles/[slug].webp"
     heroImageAlt: "[descriptive alt, ~15 words]"
     schemaType: "[schema type]"
     readingTime: [estimated min — 6–9 for supporting, 10–12 for pillar]
     related: ["slug1", "slug2", "slug3"]
     ---
     ```
   - Add entry to `kor-react/src/content/articlesIndex.ts` (all fields must match frontmatter, including `author: "KOR Cycling Team"`)
   - **Generate hero image using HuggingFace MCP:**
     1. Load schema: `ToolSearch("select:mcp__ec6ab3cc-afc5-4ef4-9275-9e982f39d76a__gr1_flux_1_krea_dev_infer")`
     2. Build prompt: pick the subject from the table in `seo-content-plan.md` Section 1.8, append base style `"professional cycling photography, outdoor natural lighting, ultra-realistic, 16:9 composition, no text, no watermarks"`
     3. Call the tool with the composed prompt
     4. Download the result: `curl -L <returned-url> -o kor-react/public/images/articles/[slug].webp`
     5. **Fallback** (if tool errors): `cp kor-react/public/images/home_hero_bg.webp kor-react/public/images/articles/[slug].webp` and note `[PLACEHOLDER]` in the commit message
   - Update `kor-react/public/sitemap.xml`: add `<url>` entry (pillar priority 0.7, supporting 0.6), `<lastmod>` = today
   - If this article is NOT the pillar: update the pillar's `.md` file to convert any stubbed text mention of this article into a live link `[text](/articles/[slug])`
   - Run `npm run build` inside `kor-react/` — if it fails, STOP, do not commit, report the error
   - Stage specific files by name (NEVER `git add .`):
     ```bash
     git add kor-react/public/content/articles/[slug].md \
             kor-react/src/content/articlesIndex.ts \
             kor-react/public/images/articles/[slug].webp \
             kor-react/public/sitemap.xml
     # If pillar was updated:
     git add kor-react/public/content/articles/[pillar-slug].md
     ```
   - `git commit -m "content: add [slug] article"`
   - Then update `CURRENT STATUS`:
     - Increment `ARTICLES_COMPLETED_THIS_PHASE` by 1
     - Look up next article from BATCH_PROGRESSION (see below)
     - Update `CURRENT_ARTICLE` to the next article ID
     - Check BATCH_SIZES: if `ARTICLES_COMPLETED_THIS_PHASE` equals the batch size, set `NEXT_ACTION: create-pr`; otherwise stay `NEXT_ACTION: build-article`
     - Update both `SEO_CONTENT_ROUTINE.md` files (root and `kor-react/`)
     - `git add SEO_CONTENT_ROUTINE.md kor-react/SEO_CONTENT_ROUTINE.md && git commit -m "routine: progress to [CURRENT_ARTICLE], completed [N]/[BATCH_SIZE]"`

#### If `NEXT_ACTION: create-pr`

Determine branch name from phase/batch:
- Phase 2a: `feature/seo-phase-2a-drivetrain` (articles A0–A3)
- Phase 2b: `feature/seo-phase-2b-brakes-tires` (articles A4–A8)
- Phase 2c: `feature/seo-phase-2c-suspension-bb` (articles A9–A12)
- Phase 3: `feature/seo-phase-3-ride-planning` (articles B0–B7)
- Phase 4: `feature/seo-phase-4-cycling-basics` (articles C8, C1, C3, C2, C4, C5, C6, C7)

Then:
```bash
git checkout -b [PR_BRANCH_NAME]
cd kor-react && npm run build  # Verify no errors before creating PR
cd ..
# Stage only relevant files (never git add .)
git add kor-react/public/content/articles/ \
        kor-react/src/content/articlesIndex.ts \
        kor-react/public/images/articles/ \
        kor-react/public/sitemap.xml
git commit -m "feat: Phase [N] — [Article Names]"
# Create PR: [PR_BRANCH_NAME] → main
# PR body: list articles included, reference seo-content-plan.md section, confirm npm run build passes
# STOP — do NOT merge. Per Checkpoints, user reviews and merges.
```

Then update `CURRENT STATUS` by reading BATCH_PROGRESSION below:
- Phase 2a completes → Phase 2b starts, next article A4, reset counter to 0
- Phase 2b completes → Phase 2c starts, next article A9, reset counter to 0
- Phase 2c completes → Phase 3 starts, next article B0, reset counter to 0
- Phase 3 completes → Phase 4 starts, next article C8, reset counter to 0
- Phase 4 completes → Phase 5 starts, set `NEXT_ACTION: final-measurement`

Update both `SEO_CONTENT_ROUTINE.md` files:
```
CURRENT_PHASE: [next_phase]
CURRENT_ARTICLE: [next_article]
ARTICLES_COMPLETED_THIS_PHASE: 0
PHASE_STATUS: in_progress
NEXT_ACTION: build-article  (or final-measurement if transitioning to Phase 5)
```
- `git add SEO_CONTENT_ROUTINE.md kor-react/SEO_CONTENT_ROUTINE.md && git commit -m "routine: Phase [prev] complete, advancing to Phase [next], article [next_article]"`
- `git push origin [PR_BRANCH_NAME]`

#### If `NEXT_ACTION: final-measurement`

Execute items in `SEO_CONTENT_ROUTINE.md` Section "Post-Launch (Phase 5)":
- Verify GA tracks article pageviews (check that `GoogleAnalytics` component fires on route changes)
- Verify PostHog events firing (check `initPostHog` in `App.tsx`)
- Submit updated `public/sitemap.xml` in Google Search Console
- Monitor indexing of `/articles/*` routes
- Set up tracking for keyword positions: pillar articles (A0, B0), plus A1, A4, A7, B1, C8

Then:
- Create PR: `feature/seo-post-launch-setup` (if measurement setup needed)
- **STOP — do NOT merge. Per Checkpoints, user merges.**
- Update `CURRENT STATUS`:
  ```
  CURRENT_PHASE: 5
  PHASE_STATUS: complete
  NEXT_ACTION: none
  ```
- `git commit -m "routine: SEO content build complete"`

---

## Checkpoints (Non-Automated, User Review)

After each major phase (1, 2, 3, 4) completes and PR is created:
- **User reviews PR** (verify article quality, Helmet output, links)
- **User merges to main** (or requests changes)
- **Agent continues** (reads updated CURRENT STATUS, proceeds to next phase)

The agent MUST NOT call `gh pr merge` or any equivalent. PR merges are always the user's action.

---

## Article Queue Reference

For quick lookup without opening `seo-content-plan.md`:

**Phase 2 (Maintenance):**
- A0: Bike Maintenance Schedule (pillar, 2000–2800 w)
- A1–A3: Drivetrain core (supporting, 1200–1800 w each)
- A4–A6: Brakes (supporting, 1200–1800 w each)
- A7–A8: Tires & sealant (supporting, 1200–1800 w each)
- A9–A10: Suspension (supporting, 1200–1800 w each)
- A11: Bottom bracket (supporting, 1200–1800 w)
- A12: How long do parts last (hub/summary, 2000–2800 w)

**Phase 3 (Ride Planning):**
- B0: How to plan a bike ride (pillar, 2000–2800 w)
- B1–B7: Supporting articles (1200–1800 w each)

**Phase 4 (Cycling Basics):**
- C8, C1, C3, C2, C4, C5, C6, C7 (in order, 1200–1800 w each)

---

## Batch Sizes & Progression (Agent uses this to determine PR timing)

**BATCH_SIZES:**
```
Phase 2a: 4 articles (A0, A1, A2, A3)
Phase 2b: 5 articles (A4, A5, A6, A7, A8)
Phase 2c: 4 articles (A9, A10, A11, A12)
Phase 3:  8 articles (B0, B1, B2, B3, B4, B5, B6, B7)
Phase 4:  8 articles (C8, C1, C3, C2, C4, C5, C6, C7)
```

**BATCH_PROGRESSION:**
```
Phase 2a: A0 → A1 → A2 → A3 (then create PR, advance to Phase 2b)
Phase 2b: A4 → A5 → A6 → A7 → A8 (then create PR, advance to Phase 2c)
Phase 2c: A9 → A10 → A11 → A12 (then create PR, advance to Phase 3)
Phase 3:  B0 → B1 → B2 → B3 → B4 → B5 → B6 → B7 (then create PR, advance to Phase 4)
Phase 4:  C8 → C1 → C3 → C2 → C4 → C5 → C6 → C7 (then create PR, advance to Phase 5)
```

**When to set `NEXT_ACTION: create-pr`:** After building the last article in a batch (when `ARTICLES_COMPLETED_THIS_PHASE` == `BATCH_SIZE` for that batch). Example: In Phase 2a, after building A3 (the 4th article), set `NEXT_ACTION: create-pr`.

---

## How to Trigger This

**Scheduled routine (e.g., weekly via cron or scheduled cloud agent):**
1. Read `kor-react/SEO_CONTENT_ROUTINE.md` → extract `CURRENT_PHASE`, `CURRENT_ARTICLE`, `NEXT_ACTION`
2. Invoke Claude with this prompt (unchanged every week)
3. Agent executes next action, updates routine file, creates commits/PRs
4. Routine completes; next week's run picks up where it left off

---

## Error Handling

- If `npm run build` fails: **STOP immediately.** Do not commit. Report the error and the file that failed. User must fix the issue before next run.
- If a brief is unclear or missing a required field: **STOP and flag it explicitly.** Do not invent details. Example: "A0 brief missing Links field in seo-content-plan.md".
- If an article slug already exists in `public/content/articles/`: **STOP.** Do not overwrite. Report: "Slug [slug] already exists."
- If an article's intervals don't match the brief: **Regenerate immediately.** Verify all ranges match the brief word-for-word before committing.
- If `CURRENT_ARTICLE` is not found in `ARTICLE_SLUG_MAP`: **STOP.** Report: "[ARTICLE_ID] not in article lookup table."
- If `BATCH_SIZE` is unclear: Recount articles in current batch from `SEO_CONTENT_ROUTINE.md` — do not assume.
- If the HuggingFace image tool errors: use the fallback (`cp home_hero_bg.webp`) and note `[PLACEHOLDER]` in the commit — do not block the article build.
- If a PR merge is attempted by the agent: the agent has violated the Checkpoints rule. STOP the routine and report.

---

**Last Updated:** 2026-06-10
**Status:** Ready for automation

# SEO Optimization Routine — KOR Cycling (Continuous)

**⚠️ MACHINE-READABLE — Agent reads this to determine next action**

**Working Directory:** `kor-react/` only
**Source of Truth:** This file's `IMPROVEMENT BACKLOG` table + `seo-content-plan.md` (article briefs, Section 4)
**Relationship to `SEO_CONTENT_ROUTINE.md`:** That routine built the initial 29-article library (Phases 1–5) and is complete — see its `CURRENT STATUS` (`PHASE_STATUS: complete`, `NEXT_ACTION: none`). This routine takes over from here: it runs indefinitely, one improvement per cycle, instead of marching through a fixed article queue. If `NEXT_ACTION: build-article` from a content-gap proposal below sends the agent back to that file's article-build steps, use them as-is — the mechanics (brief lookup, slug map, image generation, frontmatter) don't change.

---

## CURRENT STATUS (Agent checks here)

```
ROUTINE_VERSION: 2026-07-24
AUTOMATION_MODE: true
WORKING_DIRECTORY: kor-react
PR_CADENCE: per-task
CURRENT_TRACK: content-gap
CURRENT_TASK_ID: TASK-005
TASK_STATUS: not_started
NEXT_ACTION: propose-article
LAST_CYCLE_DATE: 2026-09-20
CYCLES_SINCE_TRACK_AUDIT: 0
```

> **PR_CADENCE: per-task** — Every cycle produces at most one small PR for one backlog item. Never bundle unrelated fixes. Branch naming: `seo-opt/[task-id]-[short-slug]`, e.g. `seo-opt/task-001-howto-schema`.

**What the agent does next:** Read `NEXT_ACTION` above, execute the matching step in Section C, update `CURRENT STATUS` and the `IMPROVEMENT BACKLOG` table, report completion.

---

## Mission

You are an SEO expert web designer running **continuous, incremental SEO optimization** on an already-published content library (29 articles live under `/articles`, infrastructure complete). Unlike the original content-build routine, there is no finish line — each cycle:

1. Read `CURRENT STATUS` below.
2. If the current track's backlog has an open item, fix it.
3. If the current track's backlog is empty, audit that track against the live repo and add newly found items.
4. Ship exactly one focused, reviewable PR (or zero, if nothing actionable was found — see "Dormant tracks" below).
5. Update `CURRENT STATUS` and `IMPROVEMENT BACKLOG`, then report.

Never invent SEO problems to stay busy. An empty, honestly-audited backlog is a valid outcome — report it and rotate to the next track.

---

## A. Check Current Status

Extract from the `CURRENT STATUS` block:

- `CURRENT_TRACK` — which category of optimization is active (see Section B tracks)
- `CURRENT_TASK_ID` — which backlog row is in flight, or `none`
- `TASK_STATUS` — `not_started` / `in_progress` / `blocked` / `complete`
- `NEXT_ACTION` — `fix-item`, `create-pr`, `audit-track`, or `propose-article` (content-gap track only)
- `CYCLES_SINCE_TRACK_AUDIT` — cycles since this track's backlog was last refreshed by an audit

---

## B. Tracks (rotate in this fixed order, one per cycle when a track's backlog is empty)

```
1. technical-seo       — schema correctness, meta tags, canonical URLs, sitemap accuracy, broken links, alt text
2. content-freshness   — stale dateModified, intervals that may have drifted from the source brief
3. internal-linking    — orphaned or under-linked articles, missing bidirectional related[] links
4. performance          — hero image size/format, lazy-loading, build bundle regressions
5. content-gap         — keyword-gap analysis producing NEW article proposals (does not write articles itself)
```

After track 5, rotate back to track 1. `CURRENT_TRACK` advances only when a track's backlog empties **and** a fresh audit of it also comes back empty (a "dormant" track — see Error Handling). Otherwise the agent stays on the same track until its backlog is cleared.

### Track 1 — Technical SEO Health

Audit checklist (run against `src/content/articlesIndex.ts`, `src/components/articles/ArticleSeo.tsx`, `public/sitemap.xml`, and every file in `public/content/articles/`):

- Every `schemaType: 'HowTo'` article emits real HowTo structured data (`step` array, `totalTime` if derivable) — **not** the generic Article shape. Same for any future `schemaType: 'FAQPage'` (needs `mainEntity` Q&A pairs). Check `ArticleSeo.tsx`'s `articleSchema` object — today it outputs identical fields regardless of `schemaType`.
- No duplicate `title` or `description` strings across `articlesIndex.ts` entries.
- `description` is 140–160 characters.
- Every `heroImageAlt` is non-empty and descriptive (not just the slug).
- Every internal markdown link (`/articles/[slug]`) in `public/content/articles/*.md` resolves to a real slug in `articlesIndex.ts` — flag broken links.
- `public/sitemap.xml` has one `<url>` per article in `articlesIndex.ts`, correct `<lastmod>` matching `dateModified`, and correct priority (pillar articles `bike-maintenance-schedule`, `how-to-plan-a-bike-ride`, `bike-maintenance-for-beginners` at `0.7`, all others `0.6`).
- `public/robots.txt` still references the sitemap and doesn't block `/articles`.
- Canonical URL in `ArticleSeo.tsx` matches the live route for every article (spot-check, not exhaustive).

### Track 2 — Content Freshness

- Flag any article whose `dateModified` is **more than 120 days** older than `LAST_CYCLE_DATE`.
- For each flagged article: re-read its brief in `seo-content-plan.md` Section 4. If intervals/facts still match the brief word-for-word, bump `dateModified` (and matching `<lastmod>` in `sitemap.xml`) to today with a commit noting "reviewed, no factual changes." If something has drifted (e.g., a product/service interval claim needs revision), regenerate only the affected section — never invent new stats not in the brief.
- Never touch `datePublished`.

### Track 3 — Internal Linking

- Build a reverse map: for every slug, count how many *other* articles list it in their `related[]` array.
- Flag any slug referenced by **fewer than 2** other articles (orphan/under-linked) — excluding the three pillars, which are expected to be linked from everywhere and don't need the check reversed.
- Fix by adding 1–2 contextually relevant entries to a thin article's `related[]` (and, only if truly relevant, a matching inline `[text](/articles/slug)` link inside its markdown body) — not by padding unrelated links just to hit a count.

### Track 4 — Performance

- Flag any file in `public/images/articles/*.webp` over **150 KB** (`du -sh public/images/articles/*.webp`).
- Recompress flagged images (same tooling/approach as the original hero-image generation step, or a lossless webp re-encode) without visibly degrading quality. Re-verify `> 10,000 bytes` (not a placeholder) and `npm run build` still passes.
- Confirm `Article.tsx` / `ArticlesIndex.tsx` hero images use `loading="lazy"` where below the fold.

### Track 5 — Content Gap (proposals only — does not write articles)

- Compare the 29 live slugs against adjacent, unaddressed rider intents (e.g., e-bike-specific maintenance, gravel-specific tire pressure, wheel truing, helmet replacement intervals). Cross-check `seo-content-plan.md` to avoid duplicating anything already briefed but unbuilt.
- Output: append up to 3 new candidate briefs to a new `## Section 8: Backlog Candidates` in `seo-content-plan.md` (title, target keyword, category, why it's a gap) — in the same brief format Section 4 already uses.
- **Do not** write the article itself. Set `NEXT_ACTION: propose-article`, commit the `seo-content-plan.md` addition alone, and stop — a human decides whether to greenlight a build (which then follows `SEO_CONTENT_ROUTINE.md`'s existing `build-article` steps, reusing the same slug map and image pipeline).

### Track 6 (passive, not part of rotation) — Measurement Follow-Through

Carried over from `SEO_CONTENT_ROUTINE.md` Phase 5 — still manual, human-only, and outside agent tool access. Each cycle's report should simply restate these as outstanding, not act on them:
- Google Search Console: sitemap submission / indexing monitoring
- Keyword rank tracking: pillar articles + A1, A4, A7, B1, C8

---

## IMPROVEMENT BACKLOG

One row per discovered item. `status`: `open` → `in_progress` → `in_review` (PR open, awaiting merge) → `done`.

| task_id  | track           | summary                                                                                          | status | opened     |
|----------|-----------------|---------------------------------------------------------------------------------------------------|--------|------------|
| TASK-001 | technical-seo   | `ArticleSeo.tsx` emitted generic Article JSON-LD for all 3 `HowTo` articles (`winter-bike-storage`, `pre-ride-bike-check`, `how-to-measure-chain-wear`) — no `step` array, not eligible for HowTo rich results. Human sign-off received on the schema decision: added an optional `howToSteps: HowToStep[]` (+ optional `totalTime`) field to `ArticleMeta`, populated it for all 3 HowTo articles from their existing published prose (no new facts), and updated `ArticleSeo.tsx` to emit a real `step` array (and `totalTime` where explicitly stated) when `schemaType: 'HowTo'` and `howToSteps` is present. `npm run build` passes. | done | 2026-07-24 |
| TASK-002 | performance     | `bike-maintenance-schedule.webp` was 272 KB (277,708 bytes), the largest hero image and the only one over the 150 KB threshold. Fixed: the source render was 1600×893, wider than the 1200px spec in `seo-content-plan.md`; resized to spec (1200×670, Lanczos) and re-encoded as WEBP (quality 67, method 6). Result: 151,466 bytes (~147.9 KB), under threshold with margin, still well above the 10,000-byte placeholder floor. Visually spot-checked against the original at full render size — no visible quality loss. `loading="lazy"` already present on below-the-fold hero images in `ArticlesIndex.tsx`/`Article.tsx` (confirmed, no change needed). `npm run build` passes. | in_review | 2026-07-24 |
| TASK-003 | internal-linking| Ran the orphan/under-linked audit across all 29 `related[]` arrays. Reverse map built; 0 broken slug references found. 11 slugs came back under the fewer-than-2-inbound-links threshold (pillars excluded) — logged individually as TASK-006 through TASK-016 rather than bundled into one fix, per the routine's split-large-fixes rule. | done   | 2026-07-24 |
| TASK-004 | content-freshness| Any article with `dateModified` > 120 days before today needs a freshness pass. Rechecked 2026-07-24: oldest `dateModified` across all 29 articles is `2026-06-11` (43 days old) — none exceed the 120-day threshold. Nothing to fix; no code changed. | done | 2026-07-24 |
| TASK-005 | content-gap     | Run a keyword-gap pass against Section 4 to propose 3–5 new candidate briefs                       | open   | 2026-07-24 |
| TASK-006 | internal-linking| Orphan: `sram-axs-battery-life` had 0 incoming `related[]` references from other articles. Fixed: added `sram-axs-battery-life` to the `related[]` arrays of `mtb-vs-road-maintenance` and `winter-bike-storage` (both `articlesIndex.ts` and markdown frontmatter), plus a contextual inline link in each article body where AXS/electronic-shifting battery care was already discussed. `npm run build` passes. PR #66 merged. | done | 2026-07-24 |
| TASK-007 | internal-linking| Orphan: `mtb-vs-road-maintenance` had 0 incoming `related[]` references. Fixed: added `mtb-vs-road-maintenance` to the `related[]` arrays of `dropper-post-maintenance` and `suspension-service-intervals` (both `articlesIndex.ts` and markdown frontmatter) — both are MTB-specific hour-based service items already cross-linked to each other and to the orphan article, making the reciprocal link a natural fit — plus a contextual inline link in each article body's "Where it Fits in Your Full Maintenance Plan" section. `npm run build` passes. PR #67 merged. | done | 2026-07-24 |
| TASK-008 | internal-linking| Orphan: `winter-bike-storage` had 0 incoming `related[]` references. Fixed: added `winter-bike-storage` to the `related[]` arrays of `sram-axs-battery-life` (both `articlesIndex.ts` and markdown frontmatter) and `tubeless-sealant-how-often` (same) — both already discussed off-season/storage handling for batteries and sealant respectively, and winter-bike-storage already linked out to both, making the reciprocal link a natural fit — plus a contextual inline link in each article body's storage-relevant section. `npm run build` passes. PR #68 merged. | done | 2026-07-24 |
| TASK-009 | internal-linking| Orphan: `new-bike-checklist` had 0 incoming `related[]` references. Fixed: added `new-bike-checklist` to the `related[]` arrays of `pre-ride-bike-check` and `what-to-bring-on-a-bike-ride` (both `articlesIndex.ts` and markdown frontmatter) — both already appear in `new-bike-checklist`'s own `related[]` and cover the same first-ride-prep territory (M-check habit, packing kit), making the reciprocal link a natural fit — plus a contextual inline link in each article body pointing new-bike owners to the checklist first. `npm run build` passes. | in_review | 2026-07-24 |
| TASK-010 | internal-linking| Under-linked: `strava-tips-for-cyclists` had only 1 incoming `related[]` reference (from `cycling-route-planning-apps`). Fixed: added `strava-tips-for-cyclists` to the `related[]` array of `group-ride-tips` (both `articlesIndex.ts` and markdown frontmatter) — `group-ride-tips` already mentions Strava Clubs twice as a way to find local rides, making the reciprocal link a natural fit — plus a contextual inline link in its "How to Find Group Rides" section pointing readers to the Strava clubs tip for vetting a club before showing up. `npm run build` passes. | in_review | 2026-08-13 |
| TASK-011 | internal-linking| Orphan: `bike-tune-up-cost` had 0 incoming `related[]` references. Fixed: added `bike-tune-up-cost` to the `related[]` arrays of `how-long-do-bike-parts-last` and `how-to-buy-a-used-bike` (both `articlesIndex.ts` and markdown frontmatter) — both are already linked *from* `bike-tune-up-cost`'s own `related[]` and its body already references them for parts-cost and used-bike-overhaul context, making the reciprocal link a natural fit — plus a contextual inline link in each article body (parts-lifespan budgeting note; post-purchase shop-assessment cost note). `npm run build` passes. | in_review | 2026-07-24 |
| TASK-012 | internal-linking| Under-linked: `how-to-buy-a-used-bike` had only 1 incoming `related[]` reference (from `bike-tune-up-cost`). Fixed: added `how-to-buy-a-used-bike` to the `related[]` array of `how-to-measure-chain-wear` (both `articlesIndex.ts` and markdown frontmatter) — `how-to-buy-a-used-bike`'s own body already links out to `how-to-measure-chain-wear` for its pre-purchase chain check, making the reciprocal link a natural fit — plus a contextual bullet in `how-to-measure-chain-wear`'s "How Often to Check" section pointing used-bike buyers to the full inspection checklist. `npm run build` passes. | in_review | 2026-07-24 |
| TASK-013 | internal-linking| Under-linked: `bikepacking-for-beginners` had only 1 incoming `related[]` reference (from pillar `how-to-plan-a-bike-ride`). Fixed: added `bikepacking-for-beginners` to the `related[]` array of `what-to-bring-on-a-bike-ride` (both `articlesIndex.ts` and markdown frontmatter) — `what-to-bring-on-a-bike-ride` already discusses all-day packing lists and `bikepacking-for-beginners` already links back to it for its gear list, making the reciprocal link a natural fit — plus a contextual inline link in the "All Day (4+ Hours)" section pointing readers toward their first overnighter. `npm run build` passes. | in_review | 2026-07-24 |
| TASK-014 | internal-linking| Under-linked: `cycling-in-the-rain` had only 1 incoming `related[]` reference (from pillar `how-to-plan-a-bike-ride`). Fixed: added `cycling-in-the-rain` to the `related[]` array of `when-to-replace-bike-chain` (both `articlesIndex.ts` and markdown frontmatter) — `cycling-in-the-rain`'s own body already links out to `when-to-replace-bike-chain` for the wet-weather wear-rate discussion, making the reciprocal link a natural fit — plus a contextual inline link in `when-to-replace-bike-chain`'s wear-check-interval section pointing wet-weather riders to the post-rain care routine. `npm run build` passes. | in_review | 2026-07-24 |
| TASK-015 | internal-linking| Under-linked: `group-ride-tips` had only 1 incoming `related[]` reference (from pillar `how-to-plan-a-bike-ride`). Fixed: added `group-ride-tips` to the `related[]` array of `strava-tips-for-cyclists` (both `articlesIndex.ts` and markdown frontmatter) — `strava-tips-for-cyclists`'s "Find Clubs That Match How You Actually Ride" section already discusses finding group rides via Strava Clubs, making the reciprocal link a natural fit — plus a contextual inline link in that section pointing new club-joiners to group ride etiquette before their first ride out. `npm run build` passes. | in_review | 2026-07-24 |
| TASK-016 | internal-linking| Orphan: `bottom-bracket-creaking` had 0 incoming `related[]` references. Fixed: added `bottom-bracket-creaking` to the `related[]` arrays of `how-long-do-bike-parts-last` (both `articlesIndex.ts` and markdown frontmatter) — its own "Bottom Bracket: Longest-Lasting, Hardest to Diagnose" section already covers the same 3,000–10,000-mile lifespan range and creak-misdiagnosis point — and `when-to-replace-cassette` (same both-file update) — its "Noise under load" symptom section overlaps with BB-creak diagnosis — plus a contextual inline link in each article body at that point of overlap. `npm run build` passes. PR #85 open. | in_review | 2026-07-24 |

---

## C. Execute Next Action

### If `NEXT_ACTION: audit-track`

The current track's backlog is empty. Run that track's audit checklist (Section B) against the live repo.

- If new issues are found: append them as new rows to `IMPROVEMENT BACKLOG` with the next `TASK-###` id, set `CURRENT_TASK_ID` to the first new row, `TASK_STATUS: not_started`, `NEXT_ACTION: fix-item` (or `propose-article` for track 5), reset `CYCLES_SINCE_TRACK_AUDIT: 0`.
- If nothing is found: increment `CYCLES_SINCE_TRACK_AUDIT`. If this is the **second consecutive** empty audit for this track, mark it dormant for now, advance `CURRENT_TRACK` to the next track in rotation, and set `NEXT_ACTION: audit-track` for that track next cycle. Report "Track [N] audited clean two cycles running — rotating to [next track]." Do not open a PR.

### If `NEXT_ACTION: fix-item`

1. Load `CURRENT_TASK_ID`'s row from `IMPROVEMENT BACKLOG`.
2. `git checkout -b seo-opt/[task-id]-[short-slug]`
3. Implement the fix scoped **only** to that task — no drive-by refactors, no bundling a second backlog row into the same PR.
4. `npm run build` — must pass. If it fails, STOP (see Error Handling), do not commit.
5. Stage specific files by name — never `git add .`.
6. `git commit -m "seo: [task-id] — [one-line summary]"`
7. Set `TASK_STATUS: complete` on the row, `NEXT_ACTION: create-pr`.
8. Commit the `SEO_OPTIMIZATION_ROUTINE.md` status/backlog update in the same branch.

### If `NEXT_ACTION: create-pr`

1. `git push -u origin seo-opt/[task-id]-[short-slug]`
2. Create PR: title `seo: [task-id] — [short summary]`, body states the track, what was audited/found, what changed, and confirms `npm run build` passes.
3. **STOP — do NOT merge.** User reviews and merges per Checkpoints below.
4. Mark the backlog row `status: in_review`.
5. Determine the next cycle's state:
   - If the current track still has other `open` rows: set `CURRENT_TASK_ID` to the next open row in that track, `TASK_STATUS: not_started`, `NEXT_ACTION: fix-item` (stay on this track).
   - If the current track has no more `open` rows: advance `CURRENT_TRACK` to the next track in rotation, `CURRENT_TASK_ID: none`, `NEXT_ACTION: audit-track`, `CYCLES_SINCE_TRACK_AUDIT: 0`.
6. Update `LAST_CYCLE_DATE` to today.
7. `git commit -m "routine: [task-id] shipped, advancing to [next state]"` and push.

### If `NEXT_ACTION: propose-article` (Track 5 only)

1. Append the new candidate brief(s) to `seo-content-plan.md` under `## Section 8: Backlog Candidates`.
2. Stage and commit only `seo-content-plan.md`: `git commit -m "seo: propose [N] new article candidates (content-gap)"`.
3. **STOP — do not build the article.** This is a proposal for human greenlight, not a PR against the live site.
4. Push directly to the routine's working branch (no PR needed — no site code changed).
5. Advance `CURRENT_TRACK` to track 1, `NEXT_ACTION: audit-track`.

---

## Checkpoints (Non-Automated, User Review)

- Every PR from `create-pr` stops for user review before merge — the agent never calls a merge tool.
- Content-gap proposals (Track 5) are a second checkpoint layer: even after a human merges the `seo-content-plan.md` addition, no article gets written until a human explicitly greenlights it (e.g., by assigning it a real article ID and adding it to `SEO_CONTENT_ROUTINE.md`'s article queue).

---

## Error Handling

- If `npm run build` fails: STOP immediately, do not commit, report the error and file. User must fix before the next cycle.
- If a fix would require touching more than one backlog row's worth of files: split it — ship the smallest coherent PR, leave the rest as a new backlog row.
- If a track's audit is inconclusive (e.g., can't determine image compression safety, or a schema fix needs a product decision like whether to add a `steps` field to `ArticleMeta`): STOP, flag it explicitly on the backlog row as `status: blocked` with a one-line reason, and move to the next open row instead of guessing.
- If two consecutive audits of a track find nothing: mark it dormant and rotate (see `audit-track` above) rather than manufacturing busywork.
- If a slug referenced in a Track 3 fix doesn't exist in `articlesIndex.ts`: STOP, report "Track 3 fix references unknown slug [slug]," don't commit.
- If Track 5 would propose an article that duplicates an existing slug or an already-briefed-but-unbuilt Section 4 entry: skip it, don't propose duplicates.
- If a PR merge is attempted by the agent: the agent has violated the Checkpoints rule. STOP the routine and report.

---

## How to Trigger This

Same mechanism as the original: a scheduled routine (e.g., weekly) reads `CURRENT STATUS` here, invokes the agent with this file as context, the agent executes exactly one `NEXT_ACTION`, updates state, and stops. Next cycle picks up where this one left off — indefinitely, since there's no terminal phase.

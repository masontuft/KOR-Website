# Legal documents

The text of every legal page on jmrcycling.com is written and edited in **Google Docs**. The
website reads those docs, turns them into data, and renders them with the site's own styling.
Nobody edits legal text in the React code.

| Route | Doc | Slug |
|---|---|---|
| `/privacy` | JMRcycling Privacy policy | `privacy` |
| `/terms` | JMRcycling Terms of Service | `terms` |
| `/shop-terms` | JMRcycling Bike Shop Partner Terms | `shop-terms` |
| `/cookies` | JMRcycling Cookie and Tracking Notice | `cookies` |
| `/data-requests` | JMRcycling Data Requests and Account Deletion | `data-requests` |

`/privacy-policy` and `/terms-of-service` redirect to the pages above.

## How an edit reaches the site

```
Google Doc  ->  scripts/sync-legal-docs.mjs  ->  legalDocs.generated.json  ->  LegalPage.tsx
 (you edit)      (daily GitHub Action)            (committed in a PR)          (renders it)
```

1. Edit the Google Doc.
2. The **Sync legal docs** workflow runs every day at 13:00 UTC (or run it by hand from the
   Actions tab). If the text changed, it opens a PR from `sync/legal-docs`.
3. Review the diff to `kor-react/src/content/legal/legalDocs.generated.json` and merge.
   The normal deploy workflow publishes it.

To preview locally without waiting: `cd kor-react && npm run sync:legal`.

## One-time setup per doc

Each doc must be shared as **Anyone with the link -> Viewer**, otherwise Google returns 401 and
the sync keeps the previous text (and the workflow fails loudly). The doc IDs live in
`kor-react/src/content/legal/legalDocs.config.json`.

## Writing a doc so it parses well

Use Google Docs styles, not manual formatting:

- **Title** -> *Heading 1* (one only). Becomes the page title.
- **Sections** -> *Heading 2*. These also build the "On this page" table of contents.
- **Sub-sections** -> *Heading 3*.
- **Lists** -> real bulleted lists.
- **Meta lines** at the top, written as `Effective Date: 10/22/2026`, `Last Updated: 10/22/2026`,
  `Operator: ...`, `Applies to: ...`, show as the small label row under the title.
- Bold, italics and links are kept. Tables and images are not supported (they are skipped).

The older privacy policy is a "flat" doc (no heading styles). The parser also understands that
shape: `I. ROMAN` lines become sections, `1. Numbered` lines become sub-sections, a short line
ending in `:` becomes a sub-heading, and `·` / `-` lines become bullets. Use heading styles in new
docs; the flat rules exist so the original doc keeps working.

## Safety rails

- A doc that fails (not shared, Google error, sign-in page, or a result that looks too small) keeps
  its **previous** text. A bad fetch can never blank out a live legal page.
- The job fails when any doc fails, so you get a notification instead of silent staleness.
- `minBlocks` / `minWords` in the config set the floor for "looks wrong". Lower them if you
  deliberately shorten a doc a lot.
- Parser tests: `npm run test:legal`.

## Adding a new legal doc

1. Create the Google Doc with a Heading 1 title and Heading 2 sections; share it by link.
2. Add an entry to `legalDocs.config.json` (`slug`, `route`, `footerLabel`, `docId`, `title`,
   `description`, `minBlocks`).
3. `npm run sync:legal`, then add the route to `public/sitemap.xml`.
   The route, footer link and "Other legal documents" list are generated from the config.

## Keep the docs true

These documents make promises (what shops can see, how deletion works, what Garmin data we keep).
When the app's behavior changes, update the doc in the same sprint, and the reverse: do not change
a promise in the doc unless the code does it.

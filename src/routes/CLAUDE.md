# Routes

## Import Sources

All `+page.server.js` files import from `'statue-ssg/cms/content-processor'` — this resolves to the **npm package** (`node_modules/statue-ssg/...`), not `src/lib/cms/content-processor.js`.

Functions are called **without `await`** because the npm package uses synchronous `marked`. Do not add `await` unless you also switch the import to the async local processor.

## Route Structure

- `[...slug]/+page.server.js` — catches individual content pages (blog posts, docs, generic markdown)
- `[directory]/+page.server.js` — catches directory index pages (blog listing, docs listing)
- `about/` — static page (no CMS import)
- `+layout.svelte` — root layout with nav + footer
- `+layout.server.js` — provides sidebar data to all pages

## Layout Detection

`[...slug]/+page.svelte` auto-selects layout based on `mainDirectory`:
- `docs` → `DocsLayout`
- `blog` → `BlogLayout`
- everything else → generic `ContentBody`

## Adding New Routes

- Add the path to `prerender.entries` in `svelte.config.js`
- Use `handleUnseenRoutes: 'ignore'` in prerender config to avoid build errors with dynamic routes

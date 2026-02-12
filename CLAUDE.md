# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Statue SSG is a static site generator built on SvelteKit that transforms Markdown files into websites. The core library (`statue-ssg` npm package) provides components, themes, and a CMS layer. This repo serves as both the library source and a default template site.

## Commands

```bash
npm run dev              # Dev server at localhost:5173
npm run build            # Production build (runs postbuild: sitemap + pagefind)
npm run preview          # Preview production build with serve
npm run test             # All tests (vitest run + unit)
npm run test:unit        # Unit tests only
npm run test:watch       # Vitest watch mode
npm run check            # Svelte/TypeScript type checking
npm run lint             # Prettier + ESLint
npm run format           # Auto-format with Prettier
```

Template management (overwrites src/routes, content, site.config.js):
```bash
npm run template:load <name>    # Load template into workspace
npm run template:save <name>    # Save workspace back to template
npm run template:list           # List available templates
```

Validation for contributions:
```bash
./scripts/validate-contribution.sh component MyComponent.svelte
./scripts/validate-contribution.sh theme my-theme.css
./scripts/validate-contribution.sh template templates/my-template
```

## Architecture

### Content Flow

Markdown files in `content/` → processed by `statue-ssg/cms/content-processor` → rendered by SvelteKit routes → static HTML via `adapter-static` → output to `build/`.

Key CMS functions: `getContentByUrl()`, `getContentByDirectory()`, `getSidebarTree()`, `getSubDirectories()`.

### Dual-Layer Structure (CRITICAL)

- **Core library** (`src/lib/`): Components, CMS, themes, exported as the `statue-ssg` npm package
- **Default template** (root `src/routes/`, `content/`, `site.config.js`): A working site using the library
- **Other templates** (`templates/<name>/`): Alternative starter sites with own routes/content/config

**Import resolution caveat**: All route `+page.server.js` files import from `'statue-ssg/cms/content-processor'` (the npm package). The local `src/lib/cms/content-processor.js` is NOT used at runtime unless routes are changed to import from `$lib/cms/content-processor` or a SvelteKit alias is configured.

- **npm package processor** (`node_modules/statue-ssg/src/lib/cms/content-processor.js`): uses `marked`, **synchronous** API
- **local processor** (`src/lib/cms/content-processor.js`): uses `mdsvex`, **async** API
- Route server files call functions **without `await`** — only compatible with the sync npm version
- Vite `resolve.alias` in `vite.config.ts` does NOT affect `+page.server.js` imports; use SvelteKit `kit.alias` in `svelte.config.js` instead (but beware sync/async mismatch)

### Routing

SvelteKit file-based routing with two dynamic catch-all routes:

- `src/routes/[...slug]/` — renders individual content pages (docs, blog posts, generic markdown)
- `src/routes/[directory]/` — renders directory listing pages (blog index, docs index)
- `src/routes/about/` — example static page
- Layout detection: automatically selects DocsLayout, BlogLayout, or generic based on content directory

### Site Configuration

`site.config.js` is the central config (site metadata, nav, contact, social, search, SEO, legal). Imported directly in pages. The `$content` alias resolves to `./content`.

### Theme System

Themes are CSS files using custom properties. Active theme is imported in `src/lib/index.css`. All 11 themes live in `src/lib/themes/`. Components must use `var(--color-*)` variables, never hardcoded colors.

### Postbuild Pipeline

`npm run build` triggers postbuild which runs:
1. `scripts/generate-seo-files.js` — generates sitemap.xml + robots.txt
2. `scripts/run-pagefind.js` — indexes build output for search (only if `siteConfig.search.enabled`)

## Key Conventions

- Components: PascalCase `.svelte` files in `src/lib/components/`, auto-exported via `src/lib/index.ts`
- Themes: kebab-case `.css` files using `@theme {}` block with 13 required CSS variables
- Utilities: kebab-case `.js` files
- All components must use CSS theme variables (`var(--color-primary)`, etc.)
- Footer goes only in `+layout.svelte`, never in individual pages
- New custom pages need routes added to `prerender.entries` in `svelte.config.js`
- Add `handleUnseenRoutes: 'ignore'` to svelte.config.js prerender to avoid build errors with dynamic routes
- Markdown frontmatter supports: title, description, date, author, order, icon, warning, draft
- PR titles use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Do not bump package version — maintainers handle versioning during release
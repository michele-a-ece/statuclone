# CMS Layer

## Dual Processor Architecture

There are **two** content processors with the same API but different internals:

| | npm package (runtime) | local (development) |
|---|---|---|
| **Path** | `node_modules/statue-ssg/src/lib/cms/content-processor.js` | `src/lib/cms/content-processor.js` |
| **Engine** | `marked` | `mdsvex` |
| **API** | Synchronous | Async (`await`) |
| **Used by** | Route `+page.server.js` files (import `'statue-ssg/cms/content-processor'`) | Unit tests (import from `$lib/cms/content-processor`) |

### Why two?

Route files import from the npm package (`statue-ssg/cms/content-processor`), not `$lib`. The Vite `resolve.alias` in `vite.config.ts` does **not** redirect `+page.server.js` imports — only SvelteKit `kit.alias` in `svelte.config.js` can do that, but the sync/async mismatch makes a simple alias swap break at runtime.

### Custom blocks (`:::type`)

Both processors implement `processCustomBlocks()` which converts `:::info`, `:::warning`, etc. into `<div class="custom-block ...">` before markdown compilation. CSS styles live in `src/lib/index.css`.

### Making changes

If you modify the local processor, the changes only affect unit tests unless you **also** patch the npm package version or reconfigure route imports. To patch the npm package for development, edit `node_modules/statue-ssg/src/lib/cms/content-processor.js` directly (not durable across `npm install`).

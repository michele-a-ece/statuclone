# Tests

## Test Runner

Uses **vitest**. Run with:
- `npm run test` — all tests (vitest run + unit)
- `npm run test:unit` — unit tests only
- `npm run test:watch` — watch mode

## Test Files

- `content-links.test.js` — tests markdown link transformation, custom blocks, template variables
- `custom-blocks.test.js` — tests `:::type` container block processing

## Important: Tests use the LOCAL processor

Tests import from `$lib/cms/content-processor` (the local mdsvex-based version), **not** the npm package. This means tests validate the local processor's behavior, which may differ from what runs at runtime in the browser (npm package uses `marked`).

If you add a feature to the local processor and tests pass, the feature still won't work in the site unless the npm package processor is also updated.

## Hermetic Tests

`test/hermetic/` contains Docker-based integration tests that build the full site. These are not run by `npm run test`.

---
title: Custom Markdown Styling Guide
description: A visual guide to custom content blocks — notes, tips, warnings, and more
date: 2026-02-12
author: Claude
category: guide
order: 2
---

Statue includes six custom content blocks that make important information stand out. Each block type has a distinct color and purpose, and they all support full markdown formatting inside. Wrap your content between `:::type` and `:::` markers, with an optional title after the type.

## Note

General-purpose callouts for supplementary information.

```markdown
:::note
This is a basic note block.
:::
```

:::note
This is a basic note block.
:::

Add a title and rich markdown:

```markdown
:::note Markdown inside blocks
You can use **bold text**, `inline code`, and [links](/) freely. Lists work too:

- First item
- Second item
- Third item
:::
```

:::note Markdown inside blocks
You can use **bold text**, `inline code`, and [links](/) freely. Lists work too:

- First item
- Second item
- Third item
:::

## Tip

Helpful suggestions and best practices.

```markdown
:::tip
Run `npm run dev` to preview your site locally before publishing.
:::
```

:::tip
Run `npm run dev` to preview your site locally before publishing.
:::

```markdown
:::tip Writing effective content
Keep tips **short and actionable**. Readers should be able to:

1. Scan them quickly
2. Understand the recommendation
3. Know exactly what to do next
:::
```

:::tip Writing effective content
Keep tips **short and actionable**. Readers should be able to:

1. Scan them quickly
2. Understand the recommendation
3. Know exactly what to do next
:::

## Info

Informational context that helps readers understand the bigger picture.

```markdown
:::info
Custom blocks automatically adapt to your active theme — no extra configuration needed.
:::
```

:::info
Custom blocks automatically adapt to your active theme — no extra configuration needed.
:::

```markdown
:::info How styling works
Styles are defined using [CSS custom properties](/docs/themes), so every block respects your theme's color palette. The content processor converts `:::type` markers into styled `<div>` elements before markdown compilation.
:::
```

:::info How styling works
Styles are defined using [CSS custom properties](/docs/themes), so every block respects your theme's color palette. The content processor converts `:::type` markers into styled `<div>` elements before markdown compilation.
:::

## Warning

Caution notices for things that could cause problems.

```markdown
:::warning
Changing your `site.config.js` requires a dev server restart to take effect.
:::
```

:::warning
Changing your `site.config.js` requires a dev server restart to take effect.
:::

```markdown
:::warning Draft content
Pages with `draft: true` in their frontmatter are **excluded from production builds**. Make sure to remove the draft flag before publishing.
:::
```

:::warning Draft content
Pages with `draft: true` in their frontmatter are **excluded from production builds**. Make sure to remove the draft flag before publishing.
:::

## Danger

Critical warnings for destructive or irreversible actions.

```markdown
:::danger
Running `rm -rf build/` will permanently delete your build output. Make sure you can rebuild before deleting.
:::
```

:::danger
Running `rm -rf build/` will permanently delete your build output. Make sure you can rebuild before deleting.
:::

```markdown
:::danger Breaking changes
Modifying theme CSS variables will affect **every component** on your site. Always test in development first:

- Check all page layouts
- Verify color contrast
- Test both light and dark themes
:::
```

:::danger Breaking changes
Modifying theme CSS variables will affect **every component** on your site. Always test in development first:

- Check all page layouts
- Verify color contrast
- Test both light and dark themes
:::

## Highlight

Uses your theme's primary color for emphasis — great for key takeaways.

```markdown
:::highlight
Custom blocks are the easiest way to make important content stand out in your markdown files.
:::
```

:::highlight
Custom blocks are the easiest way to make important content stand out in your markdown files.
:::

```markdown
:::highlight Get started
Create a new `.md` file in your `content/` directory, add some blocks, and run `npm run dev` to see them rendered. Check the [docs](/docs/components) for the full component reference.
:::
```

:::highlight Get started
Create a new `.md` file in your `content/` directory, add some blocks, and run `npm run dev` to see them rendered. Check the [docs](/docs/components) for the full component reference.
:::

## Summary

| Type | Color | Use for |
|------|-------|---------|
| `note` | Gray | General supplementary information |
| `tip` | Green | Helpful suggestions and best practices |
| `info` | Blue | Informational context |
| `warning` | Amber | Caution notices |
| `danger` | Red | Critical warnings |
| `highlight` | Theme primary | Key takeaways and emphasis |

All six block types support optional titles and full markdown formatting inside. They automatically adapt to whichever theme your site uses.

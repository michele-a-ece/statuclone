/**
 * Tests for custom styled content blocks (:::type syntax)
 *
 * The feature: Authors can use :::type fenced blocks in markdown to create
 * styled callouts (note, tip, info, warning, danger, highlight).
 * These are pre-processed into <div> wrappers before mdsvex compilation.
 */

import { describe, test, expect } from 'vitest';
import { compile } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

// Import the pre-processor directly
import { processCustomBlocks } from '../src/lib/cms/content-processor.js';

/**
 * Compile markdown with custom block pre-processing + mdsvex
 */
async function compileWithBlocks(markdown) {
  const processed = processCustomBlocks(markdown);
  const { code } = await compile(processed, {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
    layout: null
  });

  // Strip script tags from mdsvex output
  return code.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').trim();
}

describe('processCustomBlocks (pre-processor)', () => {
  test('converts a basic info block', () => {
    const input = ':::info\nSome content.\n:::';
    const result = processCustomBlocks(input);

    expect(result).toContain('<div class="custom-block info">');
    expect(result).toContain('Some content.');
    expect(result).toContain('</div>');
  });

  test('converts all 6 block types', () => {
    const types = ['note', 'tip', 'info', 'warning', 'danger', 'highlight'];
    for (const type of types) {
      const input = `:::${type}\nContent.\n:::`;
      const result = processCustomBlocks(input);
      expect(result).toContain(`<div class="custom-block ${type}">`);
    }
  });

  test('includes title when provided', () => {
    const input = ':::warning Important Notice\nBe careful.\n:::';
    const result = processCustomBlocks(input);

    expect(result).toContain('<p class="custom-block-title">Important Notice</p>');
    expect(result).toContain('Be careful.');
  });

  test('omits title element when no title given', () => {
    const input = ':::tip\nJust a tip.\n:::';
    const result = processCustomBlocks(input);

    expect(result).not.toContain('custom-block-title');
    expect(result).toContain('Just a tip.');
  });

  test('passes through invalid block types as literal text', () => {
    const input = ':::unknown\nThis should not be converted.\n:::';
    const result = processCustomBlocks(input);

    expect(result).not.toContain('custom-block');
    expect(result).toContain(':::unknown');
  });

  test('handles multiple blocks in one document', () => {
    const input = [
      ':::info',
      'First block.',
      ':::',
      '',
      'Normal paragraph.',
      '',
      ':::warning',
      'Second block.',
      ':::'
    ].join('\n');
    const result = processCustomBlocks(input);

    expect(result).toContain('<div class="custom-block info">');
    expect(result).toContain('<div class="custom-block warning">');
    expect(result).toContain('Normal paragraph.');
  });

  test('passes through unclosed blocks safely', () => {
    const input = ':::info\nThis block is never closed.';
    const result = processCustomBlocks(input);

    expect(result).not.toContain('custom-block');
    expect(result).toContain(':::info');
    expect(result).toContain('This block is never closed.');
  });

  test('escapes HTML in title text (XSS prevention)', () => {
    const input = ':::info <script>alert("xss")</script>\nContent.\n:::';
    const result = processCustomBlocks(input);

    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  test('handles block at start of file', () => {
    const input = ':::tip\nFirst thing in the file.\n:::';
    const result = processCustomBlocks(input);

    expect(result).toContain('<div class="custom-block tip">');
  });

  test('handles block at end of file', () => {
    const input = 'Some intro text.\n\n:::danger\nLast thing in the file.\n:::';
    const result = processCustomBlocks(input);

    expect(result).toContain('<div class="custom-block danger">');
    expect(result).toContain('Last thing in the file.');
  });

  test('handles empty block body', () => {
    const input = ':::note\n:::';
    const result = processCustomBlocks(input);

    expect(result).toContain('<div class="custom-block note">');
    expect(result).toContain('</div>');
  });
});

describe('Custom blocks with mdsvex compilation', () => {
  test('renders markdown inside blocks', async () => {
    const input = ':::info\nSome **bold** and [a link](https://example.com).\n:::';
    const html = await compileWithBlocks(input);

    expect(html).toContain('<div class="custom-block info">');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('href="https://example.com"');
  });

  test('renders block with title and markdown body', async () => {
    const input = ':::warning Heads Up\nThis is *important* information.\n:::';
    const html = await compileWithBlocks(input);

    expect(html).toContain('<div class="custom-block warning">');
    expect(html).toContain('Heads Up');
    expect(html).toContain('<em>important</em>');
  });

  test('renders multiple blocks in full document', async () => {
    const input = [
      '# My Document',
      '',
      ':::tip Quick Start',
      'Run `npm install` to get started.',
      ':::',
      '',
      'Regular paragraph here.',
      '',
      ':::danger',
      'This will **delete** everything.',
      ':::'
    ].join('\n');
    const html = await compileWithBlocks(input);

    expect(html).toContain('<div class="custom-block tip">');
    expect(html).toContain('Quick Start');
    expect(html).toContain('<code>npm install</code>');
    expect(html).toContain('<div class="custom-block danger">');
    expect(html).toContain('<strong>delete</strong>');
  });
});

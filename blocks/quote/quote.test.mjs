/**
 * Unit tests for the quote block decorator.
 */
import assert from 'assert';
import { JSDOM } from 'jsdom';
import decorate from './quote.js';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const { document } = dom.window;

function createBlock(rows) {
  const block = document.createElement('div');
  block.className = 'quote';
  rows.forEach((cellContent) => {
    const row = document.createElement('div');
    const cell = document.createElement('div');
    cell.innerHTML = cellContent;
    row.appendChild(cell);
    block.appendChild(row);
  });
  return block;
}

// Test: quote and attribution
{
  const block = createBlock([
    'Innovation distinguishes between a leader and a follower.',
    '— Steve Jobs',
  ]);
  decorate(block);

  const blockquote = block.querySelector('blockquote');
  const cite = block.querySelector('cite');

  assert(blockquote, 'Blockquote element should exist');
  assert(cite, 'Cite element should exist');
  assert(
    blockquote.innerHTML.includes('Innovation distinguishes'),
    'Quote text should be in blockquote',
  );
  assert.strictEqual(cite.textContent, '— Steve Jobs', 'Attribution should match');
}

// Test: quote only (no attribution)
{
  const block = createBlock(['Only the quote text.']);
  decorate(block);

  const blockquote = block.querySelector('blockquote');
  const cite = block.querySelector('cite');

  assert(blockquote, 'Blockquote should exist');
  assert(!cite, 'Cite should not exist when attribution is empty');
}

// Test: AEM structure with header row
{
  const block = createBlock([
    'quote',
    'The content from AEM.',
    '— Author Name',
  ]);
  decorate(block);

  const blockquote = block.querySelector('blockquote');
  const cite = block.querySelector('cite');

  assert(blockquote, 'Blockquote should exist');
  assert(cite, 'Cite should exist');
  assert(
    blockquote.innerHTML.includes('The content from AEM'),
    'Should skip header row and use quote text',
  );
  assert.strictEqual(cite.textContent, '— Author Name', 'Attribution should match');
}

// eslint-disable-next-line no-console
console.log('Quote block tests passed');

/**
 * Unit tests for the quote block.
 * Run with: npm test
 */

import { JSDOM } from 'jsdom';
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

// Set up JSDOM before importing the block (which uses document at runtime)
const { document } = new JSDOM('<!DOCTYPE html><html><body></body></html>').window;
global.document = document;

const { default: decorate } = await import('./quote.js');

/**
 * Creates a block element with the structure expected by the quote block.
 * @param {string} quoteText - The quote content
 * @param {string} [attribution] - Optional attribution text
 * @returns {HTMLDivElement} Block element
 */
function createBlock(quoteText, attribution) {
  const block = document.createElement('div');
  block.className = 'quote';

  const quoteRow = document.createElement('div');
  const quoteCell = document.createElement('div');
  quoteCell.innerHTML = quoteText;
  quoteRow.appendChild(quoteCell);
  block.appendChild(quoteRow);

  if (attribution !== undefined) {
    const attributionRow = document.createElement('div');
    const attributionCell = document.createElement('div');
    attributionCell.textContent = attribution;
    attributionRow.appendChild(attributionCell);
    block.appendChild(attributionRow);
  }

  return block;
}

describe('quote block', () => {
  it('renders quote text in a blockquote', () => {
    const block = createBlock('Innovation distinguishes between a leader and a follower.');
    decorate(block);

    const blockquote = block.querySelector('blockquote');
    assert.ok(blockquote, 'blockquote should exist');
    assert.ok(
      blockquote.textContent.includes('Innovation distinguishes between a leader and a follower.'),
      'blockquote should contain quote text',
    );
  });

  it('renders attribution in a cite when provided', () => {
    const block = createBlock('Stay hungry, stay foolish.', '— Steve Jobs, Apple co-founder');
    decorate(block);

    const cite = block.querySelector('cite');
    assert.ok(cite, 'cite should exist');
    assert.strictEqual(cite.textContent.trim(), '— Steve Jobs, Apple co-founder');
  });

  it('preserves inline formatting in quote text', () => {
    const block = createBlock('This is <strong>bold</strong> and <em>italic</em>.');
    decorate(block);

    const blockquote = block.querySelector('blockquote');
    assert.ok(blockquote.querySelector('strong'), 'strong should exist');
    assert.ok(blockquote.querySelector('em'), 'em should exist');
    assert.ok(blockquote.innerHTML.includes('<strong>bold</strong>'));
  });

  it('omits cite when attribution row is empty', () => {
    const block = createBlock('Quote only.', '   ');
    decorate(block);

    const cite = block.querySelector('cite');
    assert.ok(!cite, 'cite should not exist when attribution is whitespace only');
  });

  it('handles empty block gracefully', () => {
    const block = document.createElement('div');
    block.className = 'quote';
    decorate(block);

    assert.strictEqual(block.children.length, 0);
  });

  it('replaces original content with blockquote', () => {
    const block = createBlock('Test quote.', '— Author');
    decorate(block);

    assert.strictEqual(block.children.length, 1);
    assert.ok(block.querySelector('blockquote'));
    assert.ok(!block.querySelector('div'));
  });
});

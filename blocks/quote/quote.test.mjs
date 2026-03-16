/**
 * Unit tests for the quote block.
 * Run with: npm test
 */
import { JSDOM } from 'jsdom';
import { describe, it } from 'node:test';
import assert from 'node:assert';

// Create jsdom instance and set globals so decorate() can use document.createElement
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = window;
global.document = window.document;

const decorate = (await import('./quote.js')).default;

/**
 * Creates a mock block element with the given rows.
 * @param {string[][]} rows - Array of rows, each row is array of cell HTML strings
 * @returns {Element} Block element
 */
function createBlock(rows) {
  const block = document.createElement('div');
  block.className = 'quote';
  rows.forEach((rowCells) => {
    const row = document.createElement('div');
    rowCells.forEach((cellHtml) => {
      const cell = document.createElement('div');
      cell.innerHTML = cellHtml;
      row.appendChild(cell);
    });
    block.appendChild(row);
  });
  return block;
}

describe('quote block', () => {
  it('decorates a simple quote without attribution', async () => {
    const block = createBlock([['<p>This is a simple quotation.</p>']]);
    await decorate(block);

    const blockquote = block.querySelector('blockquote');
    assert.ok(blockquote, 'blockquote element should exist');
    assert.ok(block.querySelector('.quote-quotation'), 'quote-quotation class should exist');
    assert.strictEqual(block.querySelector('.quote-attribution'), null, 'quote-attribution should not exist');
    assert.ok(block.querySelector('.quote-quotation').textContent.includes('simple quotation'));
  });

  it('decorates a quote with attribution and converts em to cite', async () => {
    const block = createBlock([
      ['<p>Design is how it works.</p>'],
      ['<p><em>Steve Jobs</em>, Apple co-founder</p>'],
    ]);
    await decorate(block);

    const blockquote = block.querySelector('blockquote');
    assert.ok(blockquote, 'blockquote element should exist');
    assert.ok(block.querySelector('.quote-quotation'), 'quote-quotation class should exist');
    assert.ok(block.querySelector('.quote-attribution'), 'quote-attribution class should exist');

    const cite = block.querySelector('cite');
    assert.ok(cite, 'cite element should exist for author name');
    assert.strictEqual(cite.textContent.trim(), 'Steve Jobs');
  });

  it('produces valid blockquote structure', async () => {
    const block = createBlock([['<p>Test quote</p>']]);
    await decorate(block);

    assert.strictEqual(block.children.length, 1, 'block should have one child');
    assert.strictEqual(block.firstElementChild.tagName, 'BLOCKQUOTE');
  });
});

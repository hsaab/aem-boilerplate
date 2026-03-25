import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import decorate from './quote.js';

function buildBlockMarkup(quote, name, role) {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const { document } = dom.window;

  const block = document.createElement('div');
  block.className = 'quote';

  const row = document.createElement('div');
  const c0 = document.createElement('div');
  c0.textContent = quote;
  const c1 = document.createElement('div');
  c1.textContent = name;
  const c2 = document.createElement('div');
  c2.textContent = role;
  row.append(c0, c1, c2);
  block.append(row);

  document.body.append(block);
  return { dom, block, document };
}

{
  const quote = 'The quote text.';
  const name = 'Alex Kim';
  const role = 'VP Product';
  const { dom, block } = buildBlockMarkup(quote, name, role);

  decorate(block);

  const figure = block.querySelector('figure.quote-inner');
  assert.ok(figure, 'expected .quote-inner figure');

  const bq = block.querySelector('blockquote');
  assert.ok(bq, 'expected blockquote');
  assert.equal(bq.querySelector('p')?.textContent, quote);

  const nameEl = block.querySelector('.quote-name');
  const roleEl = block.querySelector('.quote-role');
  assert.equal(nameEl?.textContent, name);
  assert.equal(roleEl?.textContent, role);

  dom.window.close();
}

{
  const { block, dom } = buildBlockMarkup('Solo quote.', '', '');
  decorate(block);
  assert.ok(block.querySelector('blockquote'));
  assert.ok(!block.querySelector('figcaption'), 'no figcaption when name and role empty');
  dom.window.close();
}

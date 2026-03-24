import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import decorate from './quote.js';

function buildBlock(html) {
  const { document } = new JSDOM(html).window;
  return document.querySelector('.quote');
}

// Single row: semantic structure and attribution split
{
  const block = buildBlock(`
    <div class="quote">
      <div>
        <div><p><em>Quote text</em></p></div>
        <div>
          <p><strong>Author Name</strong></p>
          <p>Role, Company</p>
        </div>
      </div>
    </div>
  `);
  decorate(block);

  assert.strictEqual(block.querySelectorAll(':scope > figure').length, 1);
  const fig = block.querySelector('figure');
  const bq = fig.querySelector('blockquote');
  assert.ok(bq, 'expected blockquote');
  assert.strictEqual(bq.textContent.trim(), 'Quote text');
  const cite = fig.querySelector('figcaption cite');
  assert.ok(cite, 'expected cite');
  assert.strictEqual(cite.textContent.trim(), 'Author Name');
  const roleP = fig.querySelector('figcaption p');
  assert.ok(roleP);
  assert.strictEqual(roleP.textContent.trim(), 'Role, Company');
}

// Multiple rows: one figure per quote
{
  const block = buildBlock(`
    <div class="quote">
      <div>
        <div><p><em>First</em></p></div>
        <div><p><strong>A</strong></p><p>One</p></div>
      </div>
      <div>
        <div><p><em>Second</em></p></div>
        <div><p><strong>B</strong></p><p>Two</p></div>
      </div>
    </div>
  `);
  decorate(block);

  assert.strictEqual(block.querySelectorAll(':scope > figure').length, 2);
  const figures = [...block.querySelectorAll(':scope > figure')];
  assert.strictEqual(figures[0].querySelector('blockquote').textContent.trim(), 'First');
  assert.strictEqual(figures[1].querySelector('blockquote').textContent.trim(), 'Second');
}

// Non-paragraph attribution cells: still moved into figcaption
{
  const block = buildBlock(`
    <div class="quote">
      <div>
        <div><p>Plain quote</p></div>
        <div><span>Extra line</span></div>
      </div>
    </div>
  `);
  decorate(block);

  const figcaption = block.querySelector('figcaption');
  assert.ok(figcaption.querySelector('span'));
}

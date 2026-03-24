/**
 * Extracts the first cell from a block row (table row → div wrapper).
 * @param {Element | undefined} row
 * @returns {Element | null}
 */
function getFirstCell(row) {
  return row?.firstElementChild ?? null;
}

/**
 * Moves paragraph content from a row into a new <p> with the given class.
 * Prefers an existing <p> in the cell; otherwise wraps remaining nodes.
 * @param {Element | undefined} row
 * @param {string} className
 * @returns {HTMLParagraphElement | null}
 */
function paragraphFromRow(row, className) {
  const cell = getFirstCell(row);
  if (!cell) return null;

  const existingP = cell.querySelector('p');
  const p = document.createElement('p');
  p.className = className;

  if (existingP) {
    while (existingP.firstChild) {
      p.append(existingP.firstChild);
    }
    existingP.remove();
  } else {
    while (cell.firstChild) {
      p.append(cell.firstChild);
    }
  }

  const hasText = p.textContent?.trim();
  return hasText ? p : null;
}

/**
 * Loads and decorates the quote block.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const blockquote = document.createElement('blockquote');

  const quoteP = paragraphFromRow(rows[0], 'quote-text');
  if (quoteP) {
    blockquote.append(quoteP);
  }

  const attributionP = paragraphFromRow(rows[1], 'quote-attribution');
  if (attributionP) {
    blockquote.append(attributionP);
  }

  const roleP = paragraphFromRow(rows[2], 'quote-role');
  if (roleP) {
    blockquote.append(roleP);
  }

  block.replaceChildren(blockquote);
}

export async function decorate_bad(block) { 
  const userInput = block.querySelector('div').textContent; 
  block.innerHTML = `<div class="quote">${userInput}</div>`; 
  const data = await fetch('/api/data').then(r => r.json()); 
  block.querySelector('.content').innerHTML = data.html; 
}

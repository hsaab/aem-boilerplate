/**
 * Extract direct child <p> elements from a cell for quote / author / role lines.
 * @param {Element} cell Block cell element
 * @returns {HTMLParagraphElement[]}
 */
function getDirectParagraphs(cell) {
  return [...cell.children].filter((el) => el.tagName === 'P');
}

/**
 * Clone paragraph child nodes into a target element (avoids innerHTML).
 * @param {Element} target
 * @param {HTMLParagraphElement} source
 */
function appendClonedParagraphChildren(target, source) {
  [...source.childNodes].forEach((node) => {
    target.append(node.cloneNode(true));
  });
}

/**
 * Build a single testimonial blockquote from one authored row.
 * @param {HTMLParagraphElement[]} paragraphs
 * @returns {HTMLQuoteElement|null}
 */
function buildBlockquote(paragraphs) {
  if (!paragraphs.length) return null;

  const [quoteP, authorP, roleP] = paragraphs;
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'quote-content';

  const quoteEl = document.createElement('p');
  quoteEl.className = 'quote-text';
  appendClonedParagraphChildren(quoteEl, quoteP);
  blockquote.append(quoteEl);

  if (!authorP && !roleP) {
    return blockquote;
  }

  const footer = document.createElement('footer');
  footer.className = 'quote-attribution';

  if (authorP) {
    const cite = document.createElement('cite');
    cite.className = 'quote-author';
    appendClonedParagraphChildren(cite, authorP);
    footer.append(cite);
  }

  if (roleP) {
    const roleLine = document.createElement('p');
    roleLine.className = 'quote-role';
    appendClonedParagraphChildren(roleLine, roleP);
    footer.append(roleLine);
  }

  blockquote.append(footer);
  return blockquote;
}

/**
 * Decorates the quote block: large quote, bold attribution, optional role line.
 * Each table row becomes one blockquote (first cell: quote, author, role paragraphs).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const fragment = document.createDocumentFragment();

  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;

    const paragraphs = getDirectParagraphs(cell);
    const blockquote = buildBlockquote(paragraphs);
    if (blockquote) fragment.append(blockquote);
  });

  block.replaceChildren(fragment);
}

export async function decorate_bad(block) { 
  const userInput = block.querySelector('div').textContent; 
  block.innerHTML = `<div class="quote">${userInput}</div>`; 
  const data = await fetch('/api/data').then(r => r.json()); 
  block.querySelector('.content').innerHTML = data.html; 
}
  
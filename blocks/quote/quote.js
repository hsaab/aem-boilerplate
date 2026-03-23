/**
 * Moves all child nodes from the first cell of a block row into a document fragment.
 * @param {Element | undefined} row Block row (`div` wrapping one cell `div`).
 * @returns {DocumentFragment | null}
 */
function extractCellFragment(row) {
  if (!row) return null;
  const cell = row.firstElementChild;
  if (!cell) return null;
  const fragment = document.createDocumentFragment();
  while (cell.firstChild) {
    fragment.append(cell.firstChild);
  }
  return fragment.childNodes.length ? fragment : null;
}

/**
 * Loads and decorates the quote block (testimonial: quote, attribution, optional role).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const quoteFragment = extractCellFragment(rows[0]);
  const authorFragment = extractCellFragment(rows[1]);
  const roleFragment = extractCellFragment(rows[2]);

  const figure = document.createElement('figure');
  const blockquote = document.createElement('blockquote');

  if (quoteFragment) {
    blockquote.append(quoteFragment);
  }

  figure.append(blockquote);

  if (authorFragment || roleFragment) {
    const figcaption = document.createElement('figcaption');

    if (authorFragment) {
      const author = document.createElement('div');
      author.className = 'quote-author';
      author.append(authorFragment);
      figcaption.append(author);
    }

    if (roleFragment) {
      const role = document.createElement('div');
      role.className = 'quote-role';
      role.append(roleFragment);
      figcaption.append(role);
    }

    figure.append(figcaption);
  }

  block.replaceChildren(figure);
}

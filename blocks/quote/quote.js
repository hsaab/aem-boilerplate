/**
 * Decorates the quote block with semantic HTML.
 * @param {Element} block The quote block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const quoteRow = rows[0];
  const attributionRow = rows[1];

  if (!quoteRow) return;

  const quoteCell = quoteRow.querySelector(':scope > div');

  const blockquote = document.createElement('blockquote');
  blockquote.classList.add('quote-content');

  if (quoteCell && quoteCell.childNodes.length > 0) {
    while (quoteCell.firstChild) {
      blockquote.appendChild(quoteCell.firstChild);
    }
  }

  let citeUrl = '';
  let attributionText = '';

  if (attributionRow) {
    const attributionCell = attributionRow.querySelector(':scope > div');
    if (attributionCell) {
      const link = attributionCell.querySelector('a');
      if (link) {
        citeUrl = link.href;
        attributionText = link.textContent.trim();
      } else {
        attributionText = attributionCell.textContent.trim();
      }
    }
  }

  if (citeUrl) {
    blockquote.setAttribute('cite', citeUrl);
  }

  if (attributionText) {
    const footer = document.createElement('footer');
    footer.classList.add('quote-attribution');
    const cite = document.createElement('cite');
    cite.textContent = attributionText;
    footer.appendChild(cite);
    blockquote.appendChild(footer);
  }

  block.replaceChildren(blockquote);
}

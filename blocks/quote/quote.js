/**
 * Loads and decorates the quote block with semantic HTML.
 * Expects: row 1 = quote text (may contain inline HTML), row 2 = attribution (optional).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const quoteRow = rows[0];
  const quoteCell = quoteRow?.querySelector(':scope > div');
  const quoteContent = quoteCell?.innerHTML?.trim();
  if (!quoteContent) {
    block.replaceChildren();
    return;
  }

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'quote-blockquote';

  const quotePara = document.createElement('p');
  quotePara.innerHTML = quoteContent;
  blockquote.appendChild(quotePara);

  const attributionRow = rows[1];
  const attributionCell = attributionRow?.querySelector(':scope > div');
  const attribution = attributionCell?.textContent?.trim();
  if (attribution) {
    const cite = document.createElement('cite');
    cite.textContent = attribution;
    blockquote.appendChild(cite);
  }

  block.replaceChildren(blockquote);
}

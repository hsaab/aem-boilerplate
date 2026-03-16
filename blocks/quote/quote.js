/**
 * Loads and decorates the quote block.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Skip header row if present (AEM table first row identifies block type)
  const firstCellText = rows[0]?.querySelector('div')?.textContent?.trim().toLowerCase();
  const startIndex = firstCellText === 'quote' ? 1 : 0;

  const quoteRow = rows[startIndex];
  const attributionRow = rows[startIndex + 1];

  const quoteText = quoteRow?.querySelector('div')?.innerHTML?.trim() || '';
  const attribution = attributionRow?.querySelector('div')?.textContent?.trim() || '';

  const doc = block.ownerDocument;
  const blockquote = doc.createElement('blockquote');
  blockquote.innerHTML = quoteText;

  if (attribution) {
    const cite = doc.createElement('cite');
    cite.textContent = attribution;
    blockquote.append(cite);
  }

  block.replaceChildren(blockquote);
}

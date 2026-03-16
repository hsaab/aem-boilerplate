/**
 * Quote Block
 * Renders authored quote content as semantic blockquote with optional attribution.
 */

export default function decorate(block) {
  const rows = [...block.children];
  const quoteRow = rows[0];
  const attributionRow = rows[1];

  if (!quoteRow) return;

  const blockquote = document.createElement('blockquote');
  const quoteCell = quoteRow.querySelector('div');
  if (quoteCell) {
    blockquote.innerHTML = quoteCell.innerHTML;
  }

  if (attributionRow) {
    const cite = document.createElement('cite');
    const attributionCell = attributionRow.querySelector('div');
    if (attributionCell) {
      cite.textContent = attributionCell.textContent.trim();
    }
    if (cite.textContent) {
      blockquote.appendChild(cite);
    }
  }

  block.replaceChildren(blockquote);
}

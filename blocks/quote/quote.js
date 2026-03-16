/**
 * Decorates the quote block with semantic HTML.
 * Expects: Row 1 = quote text, Row 2 (optional) = attribution (author, title/source).
 * @param {Element} block The quote block element
 */
export default function decorate(block) {
  const quoteRow = block.children[0];
  const attributionRow = block.children[1];

  if (!quoteRow) return;

  const blockquote = document.createElement('blockquote');
  const quoteCell = quoteRow.children[0];
  if (quoteCell) {
    const content = quoteCell.innerHTML.trim() || quoteCell.textContent;
    blockquote.innerHTML = content;
  }

  if (attributionRow) {
    const authorCell = attributionRow.children[0];
    const titleCell = attributionRow.children[1];
    const authorText = authorCell?.textContent?.trim();

    if (authorText) {
      const footer = document.createElement('footer');
      const cite = document.createElement('cite');
      cite.textContent = authorText;

      if (titleCell?.textContent?.trim()) {
        const span = document.createElement('span');
        span.className = 'quote-attribution-title';
        span.textContent = titleCell.textContent.trim();
        footer.append(cite, ' — ', span);
      } else {
        footer.append(cite);
      }

      blockquote.append(footer);
    }
  }

  block.replaceChildren(blockquote);
}

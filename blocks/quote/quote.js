export default function decorate(block) {
  const rows = [...block.children];
  const firstRow = rows[0];
  const cells = firstRow ? [...firstRow.children] : [];

  let quoteContent;
  let attributionContent;

  if (rows.length > 1) {
    quoteContent = rows[0]?.querySelector('div');
    attributionContent = rows[1]?.querySelector('div');
  } else if (cells.length > 1) {
    [quoteContent, attributionContent] = cells;
  } else {
    [quoteContent] = cells;
  }

  const blockquote = document.createElement('blockquote');

  if (quoteContent) {
    const hasBlock = quoteContent.querySelector('p, h1, h2, h3, h4, h5, h6, ul, ol');
    if (hasBlock) {
      blockquote.append(...quoteContent.childNodes);
    } else {
      const p = document.createElement('p');
      p.textContent = quoteContent.textContent.trim();
      blockquote.append(p);
    }
  }

  if (attributionContent) {
    const text = attributionContent.textContent.trim();
    if (text) {
      const footer = document.createElement('footer');
      const cite = document.createElement('cite');
      cite.textContent = text;
      footer.append(cite);
      blockquote.append(footer);
    }
  }

  block.replaceChildren(blockquote);
}

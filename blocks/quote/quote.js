/**
 * Transforms authored quote rows into semantic figure/blockquote markup.
 * Each row: cell 0 = quote (often italic), cell 1 = name (bold) + role lines.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const doc = block.ownerDocument;
  const figures = [...block.children]
    .map((row) => {
      const cells = [...row.children];
      const quoteCell = cells[0];
      const attribCell = cells[1];

      if (!quoteCell && !attribCell) {
        return null;
      }

      const figure = doc.createElement('figure');
      const blockquoteEl = doc.createElement('blockquote');

      if (quoteCell) {
        while (quoteCell.firstChild) {
          blockquoteEl.append(quoteCell.firstChild);
        }
      }

      const figcaption = doc.createElement('figcaption');
      if (attribCell) {
        const children = [...attribCell.children];
        let startIndex = 0;

        if (children[0]?.tagName === 'P') {
          const firstP = children[0];
          const strong = firstP.querySelector('strong');
          if (strong) {
            const cite = doc.createElement('cite');
            cite.textContent = strong.textContent.trim();
            figcaption.append(cite);
            strong.remove();
            if (firstP.textContent.trim()) {
              figcaption.append(firstP);
            }
            startIndex = 1;
          } else {
            figcaption.append(firstP);
            startIndex = 1;
          }
        }

        for (let i = startIndex; i < children.length; i += 1) {
          figcaption.append(children[i]);
        }

        if (figcaption.childNodes.length === 0) {
          while (attribCell.firstChild) {
            figcaption.append(attribCell.firstChild);
          }
        }
      }

      figure.append(blockquoteEl, figcaption);
      return figure;
    })
    .filter(Boolean);

  block.replaceChildren(...figures);
}

export async function decorate_bad(block) { 
  const userInput = block.querySelector('div').textContent; 
  block.innerHTML = `<div class="quote">${userInput}</div>`; 
  const data = await fetch('/api/data').then(r => r.json()); 
  block.querySelector('.content').innerHTML = data.html; 
  }
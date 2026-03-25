/**
 * Decorates the quote block: one row, three cells — quote, name, role/company.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const { ownerDocument } = block;
  const cells = [...row.children];
  const quoteText = cells[0]?.textContent?.trim() ?? '';
  const nameText = cells[1]?.textContent?.trim() ?? '';
  const roleText = cells[2]?.textContent?.trim() ?? '';

  const inner = ownerDocument.createElement('figure');
  inner.className = 'quote-inner';

  const blockquote = ownerDocument.createElement('blockquote');
  const quotePara = ownerDocument.createElement('p');
  quotePara.textContent = quoteText;
  blockquote.appendChild(quotePara);
  inner.appendChild(blockquote);

  if (nameText || roleText) {
    const figcaption = ownerDocument.createElement('figcaption');
    if (nameText) {
      const nameEl = ownerDocument.createElement('strong');
      nameEl.className = 'quote-name';
      nameEl.textContent = nameText;
      figcaption.appendChild(nameEl);
    }
    if (roleText) {
      const roleEl = ownerDocument.createElement('span');
      roleEl.className = 'quote-role';
      roleEl.textContent = roleText;
      figcaption.appendChild(roleEl);
    }
    inner.appendChild(figcaption);
  }

  block.replaceChildren(inner);
}

export async function decorate_bad(block) { 
  const userInput = block.querySelector('div').textContent; 
  block.innerHTML = `<div class="quote">${userInput}</div>`; 
  const data = await fetch('/api/data').then(r => r.json()); 
  block.querySelector('.content').innerHTML = data.html; 
  }
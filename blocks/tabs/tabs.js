function generateId(label) {
  return label.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function switchTab(tabList, target) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  const panels = tabList.closest('.tabs').querySelectorAll('[role="tabpanel"]');

  tabs.forEach((tab) => tab.setAttribute('aria-selected', 'false'));
  panels.forEach((panel) => {
    panel.hidden = true;
  });

  target.setAttribute('aria-selected', 'true');
  const panel = document.getElementById(target.getAttribute('aria-controls'));
  if (panel) panel.hidden = false;
  target.focus();
}

function handleKeyboard(e, tabList) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  const current = tabs.indexOf(e.target);
  let next;

  switch (e.key) {
    case 'ArrowRight':
      next = (current + 1) % tabs.length;
      break;
    case 'ArrowLeft':
      next = (current - 1 + tabs.length) % tabs.length;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = tabs.length - 1;
      break;
    default:
      return;
  }

  e.preventDefault();
  switchTab(tabList, tabs[next]);
}

/**
 * Decorates a tabs block by transforming authored rows into an accessible tabbed interface.
 * Each row's first cell becomes a tab label, second cell becomes the panel content.
 * @param {Element} block The tabs block element
 */
export default function decorate(block) {
  const tabList = document.createElement('div');
  tabList.className = 'tab-list';
  tabList.setAttribute('role', 'tablist');

  const panels = [];

  [...block.children].forEach((row, i) => {
    const cells = [...row.children];
    const labelText = (cells[0]?.textContent || `Tab ${i + 1}`).trim();
    const panelContent = cells[1] || cells[0];
    const id = `tab-${generateId(labelText)}-${i}`;

    const button = document.createElement('button');
    button.setAttribute('role', 'tab');
    button.setAttribute('id', `${id}-tab`);
    button.setAttribute('aria-controls', `${id}-panel`);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    button.textContent = labelText;
    tabList.append(button);

    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', `${id}-panel`);
    panel.setAttribute('aria-labelledby', `${id}-tab`);
    panel.hidden = i !== 0;

    if (panelContent) {
      while (panelContent.firstChild) panel.append(panelContent.firstChild);
    }
    panels.push(panel);
  });

  tabList.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) switchTab(tabList, tab);
  });

  tabList.addEventListener('keydown', (e) => {
    if (e.target.getAttribute('role') === 'tab') handleKeyboard(e, tabList);
  });

  block.replaceChildren(tabList, ...panels);
}

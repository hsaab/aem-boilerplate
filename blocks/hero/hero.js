/**
 * Decorates the hero block and enables entrance / Ken Burns animations once media is ready.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const img = block.querySelector('picture img');

  const markLoaded = () => {
    block.classList.add('hero-loaded');
  };

  if (!img) {
    markLoaded();
    return;
  }

  if (img.complete && img.naturalWidth > 0) {
    markLoaded();
  } else {
    img.addEventListener('load', markLoaded, { once: true });
    img.addEventListener('error', markLoaded, { once: true });
  }
}

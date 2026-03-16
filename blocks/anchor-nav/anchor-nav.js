export default function decorate(block) {
  // The block wraps a <ul> with anchor links — promote it to block level
  const ul = block.querySelector('ul');
  if (ul) {
    block.textContent = '';
    block.append(ul);
  }
}

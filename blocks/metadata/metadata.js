export default function decorate(block) {
  // metadata block is purely for page metadata, hide it
  const wrapper = block.closest('.metadata-wrapper');
  if (wrapper) {
    wrapper.remove();
  }
}

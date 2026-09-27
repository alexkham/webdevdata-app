// Emulator for the global structuredClone.
//
// Mutates the NESTED property of the copy and reports both values, because
// "the copy is deep" cannot be shown by printing one object — only by
// proving the original did not change.
export default function globalStructuredClone(json) {
  const original = JSON.parse(json);
  const copy = structuredClone(original);
  copy.n.x = 99;
  return [original.n.x, copy.n.x];
}

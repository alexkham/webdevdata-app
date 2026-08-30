// Emulator for Python dict(mapping) — the copying form.
// JS objects preserve insertion order for string keys, which matches
// Python's guaranteed dict ordering since 3.7.
export default function pyDict(mapping) {
  if (mapping === null || typeof mapping !== 'object' || Array.isArray(mapping)) {
    throw new TypeError('dict() demo source must be a mapping');
  }
  return { ...mapping };
}

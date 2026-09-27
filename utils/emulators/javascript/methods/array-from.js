// Emulator for the static Array.from, building from a string source.
// A string is iterable, so it expands to one element per character.
export default function arrayFrom(s) {
  if (typeof s !== 'string') throw new TypeError('from() demo source must be a string');
  return Array.from(s);
}

// utils/emulators/python/str-removeprefix.js
//
// Emulator for Python str.removeprefix(prefix). If s starts with the
// exact prefix, return the string minus that prefix (at most one
// occurrence). Otherwise return s unchanged. Empty prefix is a no-op.
//
// Different from lstrip in a critical way: this is a substring match,
// not a character-set match.

export default function strRemovePrefix(string, prefix) {
  const s = String(string == null ? '' : string);
  if (prefix === null || prefix === undefined || prefix === '') return s;
  const p = String(prefix);
  return s.startsWith(p) ? s.slice(p.length) : s;
}
// utils/emulators/python/str-removesuffix.js
//
// Emulator for Python str.removesuffix(suffix). If s ends with the exact
// suffix, return the string minus that suffix (at most one occurrence).
// Otherwise return s unchanged. Empty suffix is a no-op.
//
// Different from rstrip in a critical way: this is a substring match,
// not a character-set match.

export default function strRemoveSuffix(string, suffix) {
  const s = String(string == null ? '' : string);
  if (suffix === null || suffix === undefined || suffix === '') return s;
  const x = String(suffix);
  return s.endsWith(x) ? s.slice(0, s.length - x.length) : s;
}
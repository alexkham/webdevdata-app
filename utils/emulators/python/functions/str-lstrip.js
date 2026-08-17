// utils/emulators/python/str-lstrip.js
//
// Emulator for Python str.lstrip(chars=None).
//
// Behavior:
//   - chars=None (empty in demo): strip Unicode whitespace from the left
//   - chars="": no-op (empty character set — nothing matches)
//   - chars=<any>: strip any character in the SET from the left
//
// Order of characters in `chars` does not matter — it&apos;s a set membership
// check, not a substring match.

export default function strLstrip(string, chars) {
  const s = String(string == null ? '' : string);

  // chars is None or empty demo input: default whitespace behavior.
  // Note: real Python distinguishes s.lstrip("") (no-op) from s.lstrip()
  // (whitespace). The demo input cannot send None through a text field,
  // so empty is treated as the no-argument case here.
  if (chars === null || chars === undefined || chars === '') {
    return s.replace(/^\s+/u, '');
  }
  const c = String(chars);
  const set = new Set([...c]);
  let i = 0;
  while (i < s.length && set.has(s[i])) i++;
  return s.slice(i);
}
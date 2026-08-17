// utils/emulators/python/str-isidentifier.js
//
// Emulator for Python str.isidentifier(). Returns true iff the string is
// syntactically a Python identifier:
//   - non-empty
//   - starts with a Unicode letter (\p{L}) or underscore
//   - the rest are letters, digits (\p{N}), or underscores
//
// Python keywords (for, class, if, ...) pass this check because they
// have identifier shape; the content file flags this in a pitfall.
//
// Python actually uses the full UAX #31 identifier rules with a few
// tweaks; for the covered demo cases, the simplified regex here matches
// CPython&apos;s output.

const FIRST = /^[\p{L}_]$/u;
const REST  = /^[\p{L}\p{N}_]$/u;

export default function strIsIdentifier(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return false;

  const chars = [...s];
  if (!FIRST.test(chars[0])) return false;
  for (let i = 1; i < chars.length; i++) {
    if (!REST.test(chars[i])) return false;
  }
  return true;
}
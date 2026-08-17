// utils/emulators/python/str-rfind.js
//
// Emulator for Python str.rfind(sub, start=0, end=len).
// Returns the highest index in s[start:end] where sub is found, adjusted
// back to the original string&apos;s indexing. Empty sub returns end (or len).
// Missing sub returns -1.
//
// Negative start / end supported like Python slicing.

export default function strRfind(string, sub, start, end) {
  const s = String(string == null ? '' : string);
  const p = String(sub == null ? '' : sub);
  const n = s.length;

  let a = start;
  if (a === null || a === undefined || a === '') a = 0;
  a = Math.trunc(Number(a));
  if (!Number.isFinite(a)) a = 0;
  if (a < 0) a = Math.max(0, n + a);
  if (a > n) a = n;

  let b = end;
  if (b === null || b === undefined || b === '') b = n;
  b = Math.trunc(Number(b));
  if (!Number.isFinite(b)) b = n;
  if (b < 0) b = Math.max(0, n + b);
  if (b > n) b = n;

  if (a > b) return -1;
  const slice = s.slice(a, b);

  // Empty substring: return the highest position — which is b (adjusted end).
  if (p === '') return b;

  const idx = slice.lastIndexOf(p);
  return idx === -1 ? -1 : a + idx;
}
// utils/emulators/python/replace.js
//
// Emulator for Python str.replace(old, new, count=-1).
// Contract: same argument order as the Python method (receiver first),
// returns what Python would return, throws what Python would throw. Pure.

export default function replace(s, old, nw, count = -1) {
  if (typeof s !== 'string' || typeof old !== 'string' || typeof nw !== 'string') {
    throw new TypeError('replace() argument must be str');
  }
  let c = Number(count);
  if (!Number.isFinite(c)) c = -1;
  c = Math.trunc(c);

  if (c === 0) return s;

  // Python: "abc".replace("", "-") → "-a-b-c-" — empty old inserts `new`
  // at every position, capped by count.
  if (old === '') {
    const max = c < 0 ? Infinity : c;
    if (max === 0) return s;
    let r = nw;
    let inserted = 1;
    let i = 0;
    while (i < s.length && inserted < max) {
      r += s[i] + nw;
      i += 1;
      inserted += 1;
    }
    return r + s.slice(i);
  }

  const parts = s.split(old);
  if (c < 0 || c >= parts.length - 1) return parts.join(nw);
  return parts.slice(0, c + 1).join(nw) + old + parts.slice(c + 1).join(old);
}

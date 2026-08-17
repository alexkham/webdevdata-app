// utils/emulators/python/zfill.js
//
// Emulator for Python str.zfill(width): left-pad with ASCII zeros to the
// given width, keeping a leading sign in front of the padding.

export default function zfill(s, width) {
  if (typeof s !== 'string') throw new TypeError('zfill() argument must be str');
  let w = Math.trunc(Number(width));
  if (!Number.isFinite(w)) w = 0;
  if (s.length >= w) return s;

  const sign = s[0] === '+' || s[0] === '-' ? s[0] : '';
  const body = sign ? s.slice(1) : s;
  return sign + body.padStart(w - sign.length, '0');
}

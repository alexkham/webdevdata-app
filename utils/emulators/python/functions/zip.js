// utils/emulators/python/zip.js
//
// Emulator for Python zip(a, b, strict=False). The demo covers two iterables;
// the source page notes zip accepts N. strict=True raises ValueError when
// lengths differ, matching CPython's exact wording.

export default function pyZip(a, b, strict = false) {
  const norm = (x) => (typeof x === 'string' ? [...x] : Array.isArray(x) ? x : []);
  const ai = norm(a);
  const bi = norm(b);
  const strictOn = strict === true || strict === 1 || strict === '1';

  if (strictOn && ai.length !== bi.length) {
    const which = ai.length > bi.length
      ? 'argument 1 is longer than argument 2'
      : 'argument 2 is longer than argument 1';
    throw new Error(`ValueError: zip() ${which}`);
  }

  const n = Math.min(ai.length, bi.length);
  const out = [];
  for (let i = 0; i < n; i++) out.push([ai[i], bi[i]]);
  return out;
}
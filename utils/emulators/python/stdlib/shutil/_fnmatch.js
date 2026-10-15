// utils/emulators/python/stdlib/shutil/_fnmatch.js
//
// Port of CPython 3.13's Lib/fnmatch.py for shutil.ignore_patterns — the
// POSIX flavour (os.path is posixpath, normcase is a no-op, so matching is
// case-sensitive; on Windows fnmatch.filter lower-cases both sides).
//
// fnmatch._translate turns a shell pattern into a list of pieces: STAR, or
// one single-character atom (a literal, '?' = any character, a [...] set,
// or an empty set that never matches). CPython then compiles
// (?s:fixed(?>.*?fixed).*fixed)\Z; here the same pieces are matched by the
// classic wildcard algorithm (every atom eats exactly one code point, so
// committing each STAR to its earliest successful position is exact —
// which is precisely what the atomic groups do).
//
// The [...] translation reproduces CPython's chunking of ranges, the
// removal of empty ranges (z-a), '!' negation and the '[!]'-style corner
// cases character for character; the set is then evaluated semantically
// (ranges between adjacent chunks, every other character literal).
//
// Not a content page (leading underscore): never mapped by the generator.

const STAR = { star: true };

const cp = (s) => s.codePointAt(0);

// fnmatch._translate(pat, STAR, '.') → pieces
export function translatePieces(pat) {
  const P = [...pat];
  const n = P.length;
  const res = [];
  let i = 0;
  while (i < n) {
    const c = P[i];
    i += 1;
    if (c === '*') {
      if (res.length === 0 || res[res.length - 1] !== STAR) res.push(STAR);
    } else if (c === '?') {
      res.push({ any: true });
    } else if (c === '[') {
      let j = i;
      if (j < n && P[j] === '!') j += 1;
      if (j < n && P[j] === ']') j += 1;
      while (j < n && P[j] !== ']') j += 1;
      if (j >= n) {
        res.push({ lit: '[' });
        continue;
      }
      // chunks: arrays of characters; ranges join the last character of a
      // chunk to the first character of the next one
      let chunks;
      const raw = P.slice(i, j);
      if (!raw.includes('-')) {
        chunks = [raw];
      } else {
        chunks = [];
        let k = P[i] === '!' ? i + 2 : i + 1;
        for (;;) {
          let f = -1;
          for (let q = k; q < j; q += 1) {
            if (P[q] === '-') { f = q; break; }
          }
          k = f;
          if (k < 0) break;
          chunks.push(P.slice(i, k));
          i = k + 1;
          k += 3;
        }
        const chunk = P.slice(i, j);
        if (chunk.length) chunks.push(chunk);
        else chunks[chunks.length - 1] = [...chunks[chunks.length - 1], '-'];
        // Remove empty ranges -- invalid in RE.
        for (let k2 = chunks.length - 1; k2 > 0; k2 -= 1) {
          const a = chunks[k2 - 1];
          const b = chunks[k2];
          if (cp(a[a.length - 1]) > cp(b[0])) {
            chunks[k2 - 1] = [...a.slice(0, -1), ...b.slice(1)];
            chunks.splice(k2, 1);
          }
        }
      }
      i = j + 1;
      const flat = chunks.flat();
      if (flat.length === 0) {
        res.push({ never: true }); // '(?!)'
      } else if (flat.length === 1 && flat[0] === '!') {
        res.push({ any: true }); // negated empty range: '.'
      } else {
        let neg = false;
        const ch = chunks.map((x) => x.slice());
        if (ch[0][0] === '!') {
          neg = true;
          ch[0] = ch[0].slice(1);
        }
        const singles = new Set();
        const ranges = [];
        ch.forEach((chunk, idx) => {
          chunk.forEach((x, pos) => {
            const isRangeStart = pos === chunk.length - 1 && idx < ch.length - 1;
            const isRangeEnd = pos === 0 && idx > 0;
            if (!isRangeStart && !isRangeEnd) singles.add(cp(x));
          });
          if (idx < ch.length - 1) {
            const lo = chunk.length ? cp(chunk[chunk.length - 1]) : null;
            const hi = cp(ch[idx + 1][0]);
            if (lo !== null) ranges.push([lo, hi]);
          }
        });
        res.push({ set: true, neg, singles, ranges });
      }
    } else {
      res.push({ lit: c });
    }
  }
  return res;
}

function atomMatches(atom, c) {
  if (atom.any) return true;
  if (atom.never) return false;
  if (atom.lit !== undefined) return atom.lit === c;
  const x = cp(c);
  let inSet = atom.singles.has(x);
  if (!inSet) inSet = atom.ranges.some(([lo, hi]) => lo <= x && x <= hi);
  return atom.neg ? !inSet : inSet;
}

const cache = new Map();

// fnmatch.fnmatchcase(name, pat)
export function fnmatchcase(name, pat) {
  if (!cache.has(pat)) cache.set(pat, translatePieces(pat));
  const pieces = cache.get(pat);
  const s = [...name];
  let si = 0;
  let pi = 0;
  let starPi = -1;
  let starSi = 0;
  while (si < s.length) {
    if (pi < pieces.length && pieces[pi] !== STAR && atomMatches(pieces[pi], s[si])) {
      si += 1;
      pi += 1;
    } else if (pi < pieces.length && pieces[pi] === STAR) {
      starPi = pi;
      starSi = si;
      pi += 1;
    } else if (starPi >= 0) {
      pi = starPi + 1;
      starSi += 1;
      si = starSi;
    } else {
      return false;
    }
  }
  while (pi < pieces.length && pieces[pi] === STAR) pi += 1;
  return pi === pieces.length;
}

// fnmatch.filter(names, pat) on POSIX
export function filter(names, pat) {
  return names.filter((n) => fnmatchcase(n, pat));
}

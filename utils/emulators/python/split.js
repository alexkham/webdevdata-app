// utils/emulators/python/split.js
//
// Emulator for Python str.split(sep=None, maxsplit=-1).
// sep=None (null) → whitespace runs are separators, empties dropped.

export default function split(s, sep = null, maxsplit = -1) {
  if (typeof s !== 'string') throw new TypeError('split() argument must be str');
  let m = Number(maxsplit);
  if (!Number.isFinite(m)) m = -1;
  m = Math.trunc(m);

  if (sep === null || sep === undefined) {
    const trimmed = s.replace(/^\s+/, '');
    if (trimmed === '') return [];
    // maxsplit=0: leading whitespace stripped, remainder kept whole
    if (m === 0) return [trimmed];
    const parts = [];
    let rest = trimmed;
    while (rest !== '') {
      if (m >= 0 && parts.length === m) { parts.push(rest); return parts; }
      const match = rest.match(/\s+/);
      if (!match) { parts.push(rest); return parts; }
      parts.push(rest.slice(0, match.index));
      rest = rest.slice(match.index + match[0].length);
    }
    return parts;
  }

  if (typeof sep !== 'string') throw new TypeError('must be str or None');
  if (sep === '') throw new ValueErrorLike('empty separator');

  if (m < 0) return s.split(sep);
  const parts = s.split(sep);
  if (m >= parts.length - 1) return parts;
  return parts.slice(0, m).concat(parts.slice(m).join(sep));
}

// Python raises ValueError for an empty separator; JS has no ValueError,
// so mimic the name for faithful pitfall output.
class ValueErrorLike extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValueError';
  }
}

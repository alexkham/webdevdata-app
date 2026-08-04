// utils/emulators/python/str-rsplit.js
//
// Emulator for Python str.rsplit(sep=None, maxsplit=-1).
//
// Behavior:
//   - sep=None (empty in the demo): split on runs of whitespace, strip ends.
//   - sep="": raises ValueError.
//   - maxsplit=-1 (empty in the demo): no limit — equivalent to split.
//   - maxsplit=N: split at most N times from the RIGHT; head keeps the rest.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function strRsplit(string, sep, maxsplit) {
  const s = String(string == null ? '' : string);

  // Normalize maxsplit: empty / None / non-finite → -1 (unlimited)
  let ms = maxsplit;
  if (ms === null || ms === undefined || ms === '') ms = -1;
  ms = Math.trunc(Number(ms));
  if (!Number.isFinite(ms)) ms = -1;

  // sep=None handling (empty input from the demo means None here).
  const isNone = sep === null || sep === undefined || sep === '';
  if (isNone) {
    // Whitespace mode — strip and collapse.
    const stripped = s.replace(/^\s+|\s+$/g, '');
    if (stripped === '') return [];
    if (ms < 0) return stripped.split(/\s+/);
    // Split from the right by whitespace runs.
    const parts = stripped.split(/\s+/);
    if (parts.length <= ms + 1) return parts;
    const head = parts.slice(0, parts.length - ms).join(' ');
    return [head, ...parts.slice(parts.length - ms)];
  }

  const p = String(sep);
  if (p === '') throw new ValueErrorLike('empty separator');

  if (ms < 0) return s.split(p);

  // Right-scanning split, limited to ms cuts.
  const out = [];
  let i = s.length;
  while (out.length < ms) {
    const j = s.lastIndexOf(p, i - 1);
    if (j === -1) break;
    out.unshift(s.slice(j + p.length, i));
    i = j;
  }
  out.unshift(s.slice(0, i));
  return out;
}
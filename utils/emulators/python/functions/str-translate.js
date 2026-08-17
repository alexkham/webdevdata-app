// utils/emulators/python/str-translate.js
//
// Emulator for Python str.translate(). The demo builds a table on the fly
// from a &quot;from&quot; and &quot;to&quot; string pair, matching the two-string form
// of str.maketrans. Each character in `from` is mapped to the same-index
// character in `to`. Characters not in the table pass through unchanged.
//
// Real Python translate accepts a dict indexed by ordinal; this emulator
// keeps the demo simple by exposing the maketrans+translate pipeline as
// a single call.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function strTranslate(string, from, to) {
  const s = String(string == null ? '' : string);
  const fromStr = String(from == null ? '' : from);
  const toStr   = String(to == null ? '' : to);

  if (fromStr === '') return s;
  if ([...fromStr].length !== [...toStr].length) {
    throw new ValueErrorLike('the first two maketrans arguments must have equal length');
  }

  const fromChars = [...fromStr];
  const toChars   = [...toStr];
  const table = new Map();
  for (let i = 0; i < fromChars.length; i++) {
    table.set(fromChars[i], toChars[i]);
  }

  let out = '';
  for (const ch of s) {
    out += table.has(ch) ? table.get(ch) : ch;
  }
  return out;
}
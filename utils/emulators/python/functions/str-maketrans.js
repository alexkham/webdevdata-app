// utils/emulators/python/str-maketrans.js
//
// Emulator for Python str.maketrans(x, y=None, z=None). Two/three-string
// form only — the dict form is documented in the content file but not
// exposed to the demo (which uses three text inputs).
//
// Returns a plain object keyed by codepoint number (Unicode ordinal),
// mirroring what CPython returns. Values are either integer codepoints
// (from y) or the JavaScript `null` value standing in for Python None
// (from z, the delete set).

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function strMakeTrans(from, to, del) {
  const f = String(from == null ? '' : from);
  const t = String(to   == null ? '' : to);
  const d = String(del  == null ? '' : del);

  const fromChars = [...f];
  const toChars   = [...t];
  if (fromChars.length !== toChars.length) {
    throw new ValueErrorLike('the first two maketrans arguments must have equal length');
  }

  const out = {};
  for (let i = 0; i < fromChars.length; i++) {
    out[fromChars[i].codePointAt(0)] = toChars[i].codePointAt(0);
  }
  for (const ch of [...d]) {
    out[ch.codePointAt(0)] = null;
  }
  return out;
}
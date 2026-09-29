// utils/emulators/python/stdlib/json/jsondecoder.js
//
// Emulator for the json.JSONDecoder demo tabs, on the CPython port in
// _pyjson.js (rawDecode = JSONDecoder.raw_decode, which does NOT skip
// leading whitespace; strict=False via the port's strict option).
//
// decode() is re-stated from Lib/json/decoder.py: skip whitespace,
// raw_decode, skip whitespace, 'Extra data' if anything is left. Unlike
// json.loads it has no BOM check — a leading U+FEFF is just "Expecting
// value" at char 0.

import { rawDecode, asPy, pyValRepr, JSONDecodeError, PyDict, loads } from './_pyjson.js';

const WS = ' \t\n\r';

function decode(text, opts = {}) {
  const s = [...text];
  let i = 0;
  while (i < s.length && WS.includes(s[i])) i += 1;
  const [obj, end0] = rawDecode(text, i, opts);
  let end = end0;
  while (end < s.length && WS.includes(s[end])) end += 1;
  if (end !== s.length) throw new JSONDecodeError('Extra data', s, end);
  return obj;
}

// object_hook=lambda d: SimpleNamespace(**d), applied bottom-up. The hook
// is pure, so running it over the finished tree gives the same result as
// calling it while parsing. namespace repr: key=repr(value), keys shown
// as-is, an empty-string key left out (CPython's namespace_repr).
function toNamespace(v) {
  if (v instanceof PyDict) {
    const parts = v.entries
      .filter(([k]) => k !== '')
      .map(([k, x]) => `${k}=${pyValRepr(toNamespace(x))}`);
    return { __pyRaw: `namespace(${parts.join(', ')})` };
  }
  if (Array.isArray(v)) return v.map(toNamespace);
  return v;
}

export default {
  // json.JSONDecoder().raw_decode(text)
  raw: (text) => {
    const [obj, end] = rawDecode(text, 0);
    return asPy({ __pyTuple: [obj, BigInt(end)] });
  },

  // skip whitespace, raw_decode at pos, repeat until the end
  stream: (text) => {
    const s = [...text];
    const items = [];
    let pos = 0;
    for (;;) {
      while (pos < s.length && WS.includes(s[pos])) pos += 1;
      if (pos === s.length) break;
      let obj;
      [obj, pos] = rawDecode(text, pos);
      items.push(obj);
    }
    return asPy(items);
  },

  // doc = '{"note": "' + first + '\n' + second + '"}'
  // (json.loads(doc) or str(error), json.JSONDecoder(strict=False).decode(doc))
  strict: (first, second) => {
    const doc = `{"note": "${first}\n${second}"}`;
    let strict;
    try {
      strict = loads(doc);
    } catch (e) {
      if (!(e instanceof JSONDecodeError)) throw e;
      strict = e.message;
    }
    return asPy({ __pyTuple: [strict, decode(doc, { strict: false })] });
  },

  // json.JSONDecoder(object_hook=lambda d: SimpleNamespace(**d)).decode(text)
  hook: (text) => asPy(toNamespace(decode(text))),
};

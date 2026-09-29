// utils/emulators/python/stdlib/json/jsonencoder.js
//
// Emulator for the json.JSONEncoder demo tabs, on the CPython port in
// _pyjson.js: iterencode is the pure-Python _make_iterencode (what
// list(enc.iterencode(o)) runs, chunk for chunk), dumps the C encoder
// that encode() uses — both fuzzed against CPython.
//
// The subclass tab's default(): sets → sorted list, the fixed
// date(2026, 9, 29) → its isoformat(), anything else → super().default(o),
// which raises TypeError.

import { dumps, iterencode, PyDict, indentText } from './_pyjson.js';
import { fromLiteral } from '../../../../py-num.js';
import { PyException } from '../../../../py-exceptions.js';

const indentArg = (n) => (n === null ? null : fromLiteral(n));

const cpCmp = (a, b) => {
  const x = [...a];
  const y = [...b];
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    if (x[i] !== y[i]) return x[i].codePointAt(0) - y[i].codePointAt(0);
  }
  return x.length - y.length;
};
const pySet = (items) => ({ __pyType: 'set', items: [...new Set(items)] });
const DAY = { __pyType: 'date', iso: '2026-09-29' };

const encoderDefault = (o) => {
  if (o.__pyType === 'set') return [...o.items].sort(cpCmp);
  if (o.__pyType === 'date') return o.iso;
  throw new PyException('TypeError', `Object of type ${o.__pyType} is not JSON serializable`);
};

export default {
  // json.dumps({'tags': set(tags), 'day': date(2026, 9, 29)}, cls=Encoder)
  subclass: (tags) => {
    const record = new PyDict([['tags', pySet(tags)], ['day', DAY]]);
    return [...iterencode(record, { default: encoderDefault })].join('');
  },

  // list(json.JSONEncoder(indent=indent).iterencode({'name': name, 'tags': tags}))
  iterencode: (name, tags, indent) => {
    const ind = indentArg(indent);
    const record = new PyDict([['name', name], ['tags', tags]]);
    return [...iterencode(record, { indent: indentText(ind) })];
  },

  // enc = json.JSONEncoder(indent=indent)
  // (enc.item_separator, enc.key_separator, enc.encode([1, 2]))
  settings: (indent) => {
    const ind = indentArg(indent);
    const itemSep = ind === null ? ', ' : ',';
    return { __pyTuple: [itemSep, ': ', dumps([1n, 2n], { indent: indentText(ind) })] };
  },
};

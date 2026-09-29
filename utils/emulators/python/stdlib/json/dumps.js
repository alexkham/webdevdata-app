// utils/emulators/python/stdlib/json/dumps.js
//
// Emulator for the json.dumps demo tabs, on the CPython port in _pyjson.js
// (dumps = the C encoder's output; iterencode for default=, whose joined
// chunks are identical — fuzzed against CPython).
//
// Value model extras used here: a set is { __pyType: 'set', items },
// the fixed date(2026, 9, 29) is { __pyType: 'date', iso } — str(date) is
// its ISO text.

import { dumps, loads, iterencode, asPy, PyDict, pyFloat, indentText } from './_pyjson.js';
import { fromLiteral } from '../../../../py-num.js';
import { pyFloatRepr } from '../../../../demo-coerce.js';
import { PyException } from '../../../../py-exceptions.js';

// a 'float' demo param is written as pyFloatRepr(x); inf is not a literal
const floatArg = (x) => {
  const text = pyFloatRepr(x);
  if (text === 'inf' || text === '-inf') {
    throw new PyException('NameError', "name 'inf' is not defined. Did you mean: 'int'?");
  }
  return pyFloat(x);
};
const indentArg = (n) => (n === null ? null : fromLiteral(n));

// sorted() of a set of str: code point order
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

export default {
  // record = {'name': name, 'tags': tags, 'score': score}; json.dumps(record)
  build: (name, tags, score) => {
    const record = new PyDict([['name', name], ['tags', tags], ['score', floatArg(score)]]);
    return dumps(record);
  },

  // json.dumps(record, indent=indent, sort_keys=True).splitlines()
  // (with ensure_ascii every line break in the output comes from indent)
  pretty: (name, tags, indent) => {
    const ind = indentArg(indent);
    const record = new PyDict([['name', name], ['tags', tags], ['id', 7n]]);
    return dumps(record, { indent: indentText(ind), sortKeys: true }).split('\n');
  },

  // json.dumps({'id': 7, 'tags': ['a', 'b']}, separators=(item, key))
  separators: (item, key) => dumps(new PyDict([['id', 7n], ['tags', ['a', 'b']]]), { separators: [item, key] }),

  // (json.dumps(text), json.dumps(text, ensure_ascii=False))
  ascii: (text) => ({ __pyTuple: [dumps(text), dumps(text, { ensureAscii: false })] }),

  // data = {key: 'x'}; (json.dumps(data), json.loads(json.dumps(data)))
  keys: (key) => {
    let k = key;
    if (typeof key === 'number') {
      const v = fromLiteral(key);
      k = v.int !== undefined ? v.int : pyFloat(v.float);
    }
    const text = dumps(new PyDict([[k, 'x']]));
    return asPy({ __pyTuple: [text, loads(text)] });
  },

  // plain dumps → TypeError text; default=fallback (sets → sorted list,
  // anything else → str())
  default: (tags) => {
    const record = new PyDict([['tags', pySet(tags)], ['day', DAY]]);
    let plain;
    try {
      plain = dumps(record);
    } catch (e) {
      if (e.name !== 'TypeError') throw e;
      plain = e.message;
    }
    const fallback = (o) => (o.__pyType === 'set' ? [...o.items].sort(cpCmp) : o.iso);
    return { __pyTuple: [plain, [...iterencode(record, { default: fallback })].join('')] };
  },
};

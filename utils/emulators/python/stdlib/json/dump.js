// utils/emulators/python/stdlib/json/dump.js
//
// Emulator for the json.dump demo tabs. json.dump never uses the C
// encoder: it writes every chunk of JSONEncoder.iterencode() (the
// pure-Python _make_iterencode, ported as iterencode in _pyjson.js) with
// fp.write() as soon as it is produced. That port is fuzzed against
// CPython chunk for chunk, including what is already written when an
// error stops the encoding.

import { iterencode, PyDict, indentText } from './_pyjson.js';
import { fromLiteral } from '../../../../py-num.js';

const indentArg = (n) => (n === null ? null : fromLiteral(n));
const pySet = (items) => ({ __pyType: 'set', items: [...new Set(items)] });

export default {
  // buf = io.StringIO(); json.dump(record, buf, indent=indent); buf.getvalue()
  buffer: (name, tags, indent) => {
    const ind = indentArg(indent);
    const record = new PyDict([['name', name], ['tags', tags]]);
    let buf = '';
    for (const chunk of iterencode(record, { indent: indentText(ind) })) buf += chunk;
    return buf;
  },

  // every argument of every fp.write() call, in order
  chunks: (name, tags) => [...iterencode(new PyDict([['name', name], ['tags', tags]]))],

  // the set under 'seen' raises TypeError mid-way; what was written stays
  partial: (name, tags) => {
    const record = new PyDict([['name', name], ['tags', tags], ['seen', pySet(tags)]]);
    let buf = '';
    try {
      for (const chunk of iterencode(record)) buf += chunk;
    } catch (e) {
      if (e.name !== 'TypeError') throw e;
    }
    return buf;
  },
};

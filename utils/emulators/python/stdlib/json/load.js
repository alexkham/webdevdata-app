// utils/emulators/python/stdlib/json/load.js
//
// Emulator for the json.load demo tabs. json.load(fp) is
// json.loads(fp.read()), so everything runs on the CPython port in
// _pyjson.js; the file / StringIO layer is modelled here.

import { loads, asPy, JSONDecodeError } from './_pyjson.js';

const BOM = String.fromCharCode(0xfeff);

const catchMsg = (text) => {
  try {
    return loads(text);
  } catch (e) {
    if (e instanceof JSONDecodeError) return e.msg;
    throw e;
  }
};

// iterating io.StringIO(text): lines end after each '\n' (newline='\n',
// no translation)
const stringioLines = (text) => text.match(/[^\n]*\n|[^\n]+$/g) || [];

export default {
  // json.load(io.StringIO(text))
  stringio: (text) => asPy(loads(text)),

  // written with encoding='utf-8-sig' (BOM + UTF-8), read back as 'utf-8'
  // (the BOM stays, as U+FEFF) and as 'utf-8-sig' (one BOM removed).
  // Text-mode reading turns \r\n and \r into \n (universal newlines).
  bom: (text) => {
    const t = text.replace(/\r\n?/g, '\n');
    return asPy({ __pyTuple: [catchMsg(BOM + t), catchMsg(t)] });
  },

  // text = first + '\n' + second + '\n'
  // (json.load of the whole text → str(error), [json.loads(line) for line in io.StringIO(text)])
  ndjson: (first, second) => {
    const text = `${first}\n${second}\n`;
    let whole;
    try {
      whole = loads(text);
    } catch (e) {
      if (!(e instanceof JSONDecodeError)) throw e;
      whole = e.message;
    }
    const items = stringioLines(text).map((line) => loads(line));
    return asPy({ __pyTuple: [whole, items] });
  },
};

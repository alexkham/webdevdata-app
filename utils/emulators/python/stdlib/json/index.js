// utils/emulators/python/stdlib/json/index.js
//
// Emulator for the json module hub demo (round trip + pretty print), on top
// of the CPython port in _pyjson.js.

import { loads, dumps } from './_pyjson.js';

export default {
  // data = json.loads(text); json.dumps(data, sort_keys=True)
  roundtrip: (text) => dumps(loads(text), { sortKeys: true }),

  // json.dumps(json.loads(text), indent=indent).splitlines()
  // (the JSON text never contains a raw line break: dumps escapes them)
  pretty: (text, indent) => dumps(loads(text), { indent }).split('\n'),
};

// utils/emulators/python/stdlib/html/index.js
//
// Emulator for the html module hub demo, on the CPython port in _pyhtml.js.

import { escape, unescape } from './_pyhtml.js';

export default {
  // html.escape(text)
  escape: (text) => escape(text),

  // html.unescape(text)
  unescape: (text) => unescape(text),

  // safe = html.escape(text); (safe, html.unescape(safe) == text)
  roundtrip: (text) => {
    const safe = escape(text);
    return { __pyTuple: [safe, { __pyRaw: unescape(safe) === text ? 'True' : 'False' }] };
  },
};

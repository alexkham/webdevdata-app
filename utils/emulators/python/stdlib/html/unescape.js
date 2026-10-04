// utils/emulators/python/stdlib/html/unescape.js
//
// Emulator for the html.unescape demo tabs, on the CPython port in _pyhtml.js.

import { unescape, html5Has } from './_pyhtml.js';

const bool = (b) => ({ __pyRaw: b ? 'True' : 'False' });

export default {
  // html.unescape(text)
  decode: (text) => unescape(text),

  // ref = '&#' + num + ';'; (ref, html.unescape(ref))
  numeric: (num) => {
    const ref = '&#' + num + ';';
    return { __pyTuple: [ref, unescape(ref)] };
  },

  // (name in html5, html.unescape('&' + name))
  table: (name) => ({ __pyTuple: [bool(html5Has(name)), unescape('&' + name)] }),
};

// utils/emulators/python/stdlib/urllib-parse/unquote.js
//
// Emulator for the unquote / unquote_plus / unquote_to_bytes demo tabs, on
// the CPython port in _pyurlparse.js.

import { unquote, unquote_plus, unquote_to_bytes, tuple, asPy } from './_pyurlparse.js';

export default {
  // (unquote(text), unquote_plus(text))
  compare: (text) => asPy(tuple(unquote(text), unquote_plus(text))),

  // unquote_to_bytes(text)
  bytes: (text) => asPy(unquote_to_bytes(text)),

  // (unquote(text), unquote(text, encoding='latin-1'))
  encoding: (text) => asPy(tuple(unquote(text), unquote(text, 'latin-1'))),
};

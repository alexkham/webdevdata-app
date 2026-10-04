// utils/emulators/python/stdlib/urllib-parse/quote.js
//
// Emulator for the quote / quote_plus / quote_from_bytes demo tabs, on the
// CPython port in _pyurlparse.js.

import { quote, quote_plus, tuple, asPy } from './_pyurlparse.js';

export default {
  // (quote(text), quote(text, safe=''), quote_plus(text))
  compare: (text) => asPy(tuple(quote(text), quote(text, ''), quote_plus(text))),

  // quote(text, safe=safe)
  safe: (text, safe) => asPy(quote(text, safe)),

  // (quote(text), quote(text, encoding='latin-1'))
  encoding: (text) => asPy(tuple(quote(text), quote(text, '/', 'latin-1'))),
};

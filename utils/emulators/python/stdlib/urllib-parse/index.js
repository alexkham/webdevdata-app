// utils/emulators/python/stdlib/urllib-parse/index.js
//
// Emulator for the urllib.parse module hub demo (take a URL apart, encode
// a value, decode a query), on the CPython port in _pyurlparse.js.

import { urlsplit, quote, quote_plus, parse_qs, tuple, asPy } from './_pyurlparse.js';

export default {
  // u = urlsplit(url); (u.scheme, u.hostname, u.port, u.path, u.query, u.fragment)
  parse: (url) => {
    const u = urlsplit(url);
    const scheme = u.get('scheme');
    const host = u.hostname;
    const port = u.port;
    return asPy(tuple(scheme, host, port, u.get('path'), u.get('query'), u.get('fragment')));
  },

  // (quote(text), quote(text, safe=''), quote_plus(text))
  encode: (text) => asPy(tuple(quote(text), quote(text, ''), quote_plus(text))),

  // parse_qs(query)
  query: (query) => asPy(parse_qs(query)),
};

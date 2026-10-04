// utils/emulators/python/stdlib/urllib-parse/bytes-results.js
//
// Emulator for the *ResultBytes demo tabs, on the CPython port in
// _pyurlparse.js. url.encode() is UTF-8, as in the template.

import { urlsplit, urlparse, encode, tuple, asPy } from './_pyurlparse.js';

export default {
  // urlsplit(url.encode())
  split: (url) => asPy(urlsplit(encode(url))),

  // r = urlparse(url.encode()); (r.hostname, r.port, r.geturl(), r.decode())
  attrs: (url) => {
    const r = urlparse(encode(url));
    const host = r.hostname;
    const port = r.port;
    return asPy(tuple(host, port, r.geturl(), r.decode()));
  },
};

// utils/emulators/python/stdlib/urllib-parse/urlparse.js
//
// Emulator for the urlparse / ParseResult demo tabs, on the CPython port in
// _pyurlparse.js.

import { urlparse, tuple, asPy } from './_pyurlparse.js';

export default {
  // urlparse(url)
  parse: (url) => asPy(urlparse(url)),

  // (u.username, u.password, u.hostname, u.port) — evaluated left to right
  netloc: (url) => {
    const u = urlparse(url);
    return asPy(tuple(u.username, u.password, u.hostname, u.port));
  },

  // urlparse(url)._replace(query=query).geturl()
  replace: (url, query) => urlparse(url)._replace({ query }).geturl(),
};

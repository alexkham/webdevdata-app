// utils/emulators/python/stdlib/urllib-parse/urljoin.js
//
// Emulator for the urljoin demo tabs, on the CPython port in
// _pyurlparse.js.

import { urljoin, tuple, asPy } from './_pyurlparse.js';

// str.rstrip('/')
const rstripSlash = (s) => s.replace(/\/+$/, '');

export default {
  // urljoin(base, url)
  join: (base, url) => urljoin(base, url),

  // (urljoin(base, url), urljoin(base.rstrip('/') + '/', url))
  slash: (base, url) => asPy(tuple(urljoin(base, url), urljoin(rstripSlash(base) + '/', url))),
};

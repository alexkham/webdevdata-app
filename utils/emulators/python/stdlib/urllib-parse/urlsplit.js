// utils/emulators/python/stdlib/urllib-parse/urlsplit.js
//
// Emulator for the urlsplit / urlunsplit / SplitResult demo tabs, on the
// CPython port in _pyurlparse.js.

import { urlsplit, urlunsplit, tuple, asPy } from './_pyurlparse.js';

export default {
  // urlsplit(url)
  split: (url) => asPy(urlsplit(url)),

  // urlunsplit(urlsplit(url))
  roundtrip: (url) => urlunsplit(urlsplit(url)),

  // urlunsplit(('https', netloc, path, query, ''))
  build: (netloc, path, query) => urlunsplit(tuple('https', netloc, path, query, '')),
};

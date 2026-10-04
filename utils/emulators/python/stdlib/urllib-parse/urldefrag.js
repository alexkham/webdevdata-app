// utils/emulators/python/stdlib/urllib-parse/urldefrag.js
//
// Emulator for the urldefrag / DefragResult demo tabs, on the CPython port
// in _pyurlparse.js.

import { urldefrag, tuple, asPy } from './_pyurlparse.js';

export default {
  // urldefrag(url)
  defrag: (url) => asPy(urldefrag(url)),

  // r = urldefrag(url); (r.url, r.fragment, r.geturl())
  parts: (url) => {
    const r = urldefrag(url);
    return asPy(tuple(r.get('url'), r.get('fragment'), r.geturl()));
  },
};

// utils/emulators/python/stdlib/urllib-parse/urlencode.js
//
// Emulator for the urlencode demo tabs, on the CPython port in
// _pyurlparse.js.

import { urlencode, quote, PyDict, tuple, asPy } from './_pyurlparse.js';

export default {
  // urlencode({'q': q, 'page': page})
  dict: (q, page) => urlencode(new PyDict([['q', q], ['page', page]])),

  // (urlencode({'q': q}), urlencode({'q': q}, quote_via=quote))
  via: (q) => asPy(tuple(
    urlencode(new PyDict([['q', q]])),
    urlencode(new PyDict([['q', q]]), false, '', null, null, quote),
  )),

  // (urlencode({'tag': tags}), urlencode({'tag': tags}, doseq=True))
  doseq: (tags) => asPy(tuple(
    urlencode(new PyDict([['tag', tags]])),
    urlencode(new PyDict([['tag', tags]]), true),
  )),
};

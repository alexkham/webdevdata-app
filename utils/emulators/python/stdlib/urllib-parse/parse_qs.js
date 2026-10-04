// utils/emulators/python/stdlib/urllib-parse/parse_qs.js
//
// Emulator for the parse_qs / parse_qsl demo tabs, on the CPython port in
// _pyurlparse.js.

import { parse_qs, parse_qsl, asPy } from './_pyurlparse.js';

export default {
  // parse_qs(query)
  qs: (query) => asPy(parse_qs(query)),

  // parse_qsl(query, keep_blank_values=True)
  qsl: (query) => asPy(parse_qsl(query, true)),

  // parse_qsl(query, strict_parsing=True)
  strict: (query) => asPy(parse_qsl(query, false, true)),
};

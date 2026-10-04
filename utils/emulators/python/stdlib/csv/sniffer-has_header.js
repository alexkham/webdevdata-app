// utils/emulators/python/stdlib/csv/sniffer-has_header.js
//
// Emulator for the Sniffer.has_header demo, on the port of Lib/csv.py's
// heuristic in _pycsv.js (complex() parsing included).

import { Sniffer, typed } from './_pycsv.js';

export default {
  // csv.Sniffer().has_header(text)
  header: (text) => new Sniffer().has_header(typed(text)),
};

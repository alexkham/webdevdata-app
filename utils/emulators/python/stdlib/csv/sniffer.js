// utils/emulators/python/stdlib/csv/sniffer.js
//
// Emulator for the csv.Sniffer demo tabs, on the port of Lib/csv.py's
// Sniffer heuristics in _pycsv.js.

import { asPy, Sniffer, typed } from './_pycsv.js';

export default {
  // d = csv.Sniffer().sniff(text); (d.delimiter, d.quotechar, d.doublequote, d.skipinitialspace)
  sniff: (text) => {
    const d = new Sniffer().sniff(typed(text));
    return asPy({ __pyTuple: ['delimiter', 'quotechar', 'doublequote', 'skipinitialspace'].map((n) => d.getattr(n)) });
  },

  // csv.Sniffer().sniff(text, delimiters=…).delimiter
  delimiters: (text, delimiters) => new Sniffer().sniff(typed(text), delimiters).getattr('delimiter'),
};

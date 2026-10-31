// utils/emulators/python/stdlib/pprint/prettyprinter.js
//
// Emulator for the pprint.PrettyPrinter demo tabs, on the Lib/pprint.py
// port in _pypprint.js. The printer is built first, as in the snippets, so
// a bad option raises before the typed value is read.

import { literalEval } from '../pickle/_pyliteral.js';
import { PrettyPrinter, shown, splitLines, iterate } from './_pypprint.js';

const bool = (b) => ({ __pyRaw: b ? 'True' : 'False' });

export default {
  // printer = pprint.PrettyPrinter(indent=indent, width=width, depth=depth)
  // printer.pformat(ast.literal_eval(data)).splitlines()
  reuse: (data, indent, width, depth) => {
    const printer = new PrettyPrinter({ indent, width, depth });
    return splitLines(shown(printer.pformatRaw(literalEval(data))));
  },

  // buf = io.StringIO(); printer = pprint.PrettyPrinter(width=width, stream=buf)
  // for item in ast.literal_eval(data): printer.pprint(item)
  // buf.getvalue().splitlines()
  stream: (data, width) => {
    const printer = new PrettyPrinter({ width });
    let text = '';
    for (const item of iterate(literalEval(data))) text += printer.pprintText(item);
    return splitLines(shown(text).replace(/\n$/, ''));
  },

  // printer = pprint.PrettyPrinter(depth=depth); data = ast.literal_eval(data)
  // (printer.pformat(data), printer.isreadable(data), printer.isrecursive(data))
  flags: (data, depth) => {
    const printer = new PrettyPrinter({ depth });
    const value = literalEval(data);
    const text = shown(printer.pformatRaw(value));
    return { __pyTuple: [text, bool(printer.isreadable(value)), bool(printer.isrecursive(value))] };
  },
};

// utils/emulators/python/stdlib/pprint/format.js
//
// Emulator for the PrettyPrinter.format demo tabs: the two subclasses the
// snippets define, on the Lib/pprint.py port in _pypprint.js. Their
// format() overrides are called exactly where CPython calls format() —
// for every value _safe_repr meets and for every one-line repr _format
// tries — while the layout of dicts, lists and strings stays pprint's own.

import { literalEval } from '../pickle/_pyliteral.js';
import { PyStr } from '../pickle/_pypickle.js';
import { PrettyPrinter, shown, splitLines } from './_pypprint.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

// hex(n)
const hex = (n) => (n < 0n ? '-0x' + (-n).toString(16) : '0x' + n.toString(16));

class HexInts extends PrettyPrinter {
  format(object, context, maxlevels, level) {
    // isinstance(object, int) and not isinstance(object, bool)
    if (typeof object === 'bigint') return [hex(object), true, false];
    return super.format(object, context, maxlevels, level);
  }
}

class Short extends PrettyPrinter {
  constructor(limit) {
    super();
    this.limit = limit;
  }

  format(object, context, maxlevels, level) {
    if (object instanceof PyStr) {
      const chars = [...object.v];
      // len(object) > limit → repr(object[:limit] + '...')
      // (a negative limit slices from the end, as in Python)
      if (chars.length > this.limit) return [pyStrRepr(chars.slice(0, this.limit).join('') + '...'), false, false];
    }
    return super.format(object, context, maxlevels, level);
  }
}

export default {
  // HexInts(width=width).pformat(ast.literal_eval(data)).splitlines()
  hex: (data, width) => {
    const printer = new HexInts({ width });
    return splitLines(shown(printer.pformatRaw(literalEval(data))));
  },

  // data = ast.literal_eval(data); printer = Short()
  // (printer.pformat(data), printer.isreadable(data))
  short: (data, limit) => {
    const value = literalEval(data);
    const printer = new Short(limit);
    const text = shown(printer.pformatRaw(value));
    return { __pyTuple: [text, { __pyRaw: printer.isreadable(value) ? 'True' : 'False' }] };
  },
};

// utils/emulators/python/stdlib/textwrap/textwrapper.js
//
// Emulator for the textwrap.TextWrapper demo tabs, on the CPython port in
// _pytextwrap.js. Numbers are the Python values of the literals the code
// shows (numArg), evaluated in source order.

import { TextWrapper, numArg } from './_pytextwrap.js';

const tuple = (...items) => ({ __pyTuple: items });

export default {
  // w = TextWrapper(width=width, initial_indent=first, subsequent_indent=rest)
  // [w.fill(p) for p in text.split('|')]
  reuse: (text, width, first, rest) => {
    const w = new TextWrapper({ width: numArg(width), initial_indent: first, subsequent_indent: rest });
    return text.split('|').map((p) => w.fill(p));
  },

  // TextWrapper(width=width, max_lines=max, placeholder=placeholder).wrap(text)
  max_lines: (text, width, max, placeholder) => {
    const w = numArg(width);
    const m = max === null ? null : numArg(max);
    return new TextWrapper({ width: w, max_lines: m, placeholder }).wrap(text);
  },

  // TextWrapper(width=width, fix_sentence_endings=True).fill(text)
  sentences: (text, width) => new TextWrapper({ width: numArg(width), fix_sentence_endings: true }).fill(text),

  // (TextWrapper(width=width).wrap(text),
  //  TextWrapper(width=width, drop_whitespace=False).wrap(text))
  whitespace: (text, width) => {
    const a = new TextWrapper({ width: numArg(width) }).wrap(text);
    return tuple(a, new TextWrapper({ width: numArg(width), drop_whitespace: false }).wrap(text));
  },

  // TextWrapper(width=60, tabsize=tabsize).wrap('\t'.join(cells))
  tabs: (cells, tabsize) => new TextWrapper({ width: 60, tabsize: numArg(tabsize) }).wrap(cells.join('\t')),
};

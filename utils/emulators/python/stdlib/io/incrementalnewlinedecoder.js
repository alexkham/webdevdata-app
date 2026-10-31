// utils/emulators/python/stdlib/io/incrementalnewlinedecoder.js
//
// Emulator for the io.IncrementalNewlineDecoder demo tabs, on the port of
// textio.c's decoder in _pyio.js.

import { IncrementalNewlineDecoder, tuple } from './_pyio.js';

const unescapeCrLf = (s) => s.split('\\r').join('\r').split('\\n').join('\n');

function run(chunks, translate) {
  const d = new IncrementalNewlineDecoder(null, translate);
  const out = chunks.map((c) => d.decode(unescapeCrLf(c)));
  out.push(d.decode('', true));
  return tuple(out, d.newlines);
}

export default {
  translate: (chunks) => run(chunks, true),
  keep: (chunks) => run(chunks, false),
};

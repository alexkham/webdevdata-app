// utils/emulators/python/stdlib/shutil/copyfileobj.js
//
// Emulator for the shutil.copyfileobj demo: Lib/shutil.py's loop over an
// io.StringIO-like source (TextStream in _pyshutil.js: read(n) returns up
// to n code points from the current position, n < 0 reads the rest).

import { TextStream, copyfileobj } from './_pyshutil.js';

export default {
  // shutil.copyfileobj(io.StringIO(text), SimpleNamespace(write=chunks.append), length); chunks
  chunks: (text, length) => {
    const chunks = [];
    copyfileobj(new TextStream(text), (buf) => chunks.push(buf), length);
    return chunks;
  },

  // skipped = src.read(skip); copyfileobj(src, dst); (skipped, dst.getvalue())
  rest: (text, skip) => {
    const src = new TextStream(text);
    const skipped = src.read(skip);
    let out = '';
    copyfileobj(src, (buf) => { out += buf; });
    return { __pyTuple: [skipped, out] };
  },
};

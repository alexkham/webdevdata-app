// utils/emulators/python/stdlib/io/readable-writable-seekable.js
//
// Emulator for the capability-check demo, on the C io port in _pyio.js
// (StringIO / BytesIO, and open()'s mode → class resolution for an existing
// regular file).

import { StringIO, BytesIO, openFile, tuple } from './_pyio.js';

export default {
  modes: (mode) => {
    const caps = [new StringIO(), new BytesIO()].map((s) => tuple(s.pyType, s.readable(), s.writable(), s.seekable(), s.isatty()));
    // open('demo.txt', 'w').close() ran first, so the file exists
    const f = openFile('demo.txt', mode, -1n, true);
    caps.push(tuple(f.cls, f.readable, f.writable, f.seekable, false));
    return caps;
  },
};

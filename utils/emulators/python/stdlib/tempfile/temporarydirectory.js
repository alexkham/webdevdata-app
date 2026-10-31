// utils/emulators/python/stdlib/tempfile/temporarydirectory.js
//
// Emulator for the tempfile.TemporaryDirectory demo, on the Lib/tempfile.py
// port in _pytempfile.js.

import { TemporaryDirectory, checkAffix } from './_pytempfile.js';
import { tuple } from '../io/_pyio.js';

export default {
  scratch: (prefix, files) => {
    const d = new TemporaryDirectory(checkAffix(prefix, 'prefix'));
    for (const name of files) d.writeFile(name, 'data');
    const inside = d.listdir();
    const named = d.basename.startsWith(prefix);
    d.cleanup();
    return tuple(inside, named, d.exists);
  },
};

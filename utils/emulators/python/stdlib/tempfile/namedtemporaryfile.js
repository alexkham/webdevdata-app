// utils/emulators/python/stdlib/tempfile/namedtemporaryfile.js
//
// Emulator for the tempfile.NamedTemporaryFile demo tabs, on the
// Lib/tempfile.py port in _pytempfile.js and the io port.

import { tempName, checkAffix } from './_pytempfile.js';
import { BytesIO, utf8Encode, tuple } from '../io/_pyio.js';

export default {
  // name = prefix + 8 random characters + suffix; exists inside, gone after
  names: (prefix, suffix) => {
    checkAffix(prefix, 'prefix');
    checkAffix(suffix, 'suffix');
    const name = tempName(prefix, suffix);
    const shape = tuple(name.startsWith(prefix), name.endsWith(suffix), BigInt(name.length - prefix.length - suffix.length));
    return tuple(shape, true, false);
  },

  // write, close, reopen by name with delete_on_close=False; deleted on exit
  reopen: (text) => {
    const file = new BytesIO(); // the w+b file
    file.write(utf8Encode(text));
    const data = file.getvalue(); // open(f.name, 'rb').read() after close()
    return tuple(data, false);
  },
};

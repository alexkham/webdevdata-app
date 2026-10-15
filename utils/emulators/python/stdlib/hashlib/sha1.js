// utils/emulators/python/stdlib/hashlib/sha1.js
//
// Emulator for the hashlib.sha1 demo tabs, on the CPython port in
// _pyhashlib.js (SHA-1 itself comes from the uuid engine).

import { construct, utf8 } from './_pyhashlib.js';

export default {
  // hashlib.sha1(text.encode()).hexdigest()
  hex: (text) => construct('sha1', utf8(text)).hexdigest(),

  // content = text.encode(); sha1(b'blob %d\0' % len(content) + content)
  git: (text) => {
    const content = utf8(text);
    const header = utf8(`blob ${content.length}\0`);
    const h = construct('sha1', header);
    h.update(content);
    return h.hexdigest();
  },
};

// utils/emulators/python/stdlib/hashlib/md5.js
//
// Emulator for the hashlib.md5 demo tabs, on the CPython port in
// _pyhashlib.js (MD5 itself comes from the uuid engine) and the base64
// port.

import { construct, utf8 } from './_pyhashlib.js';
import { b64encode, toAscii } from '../base64/_pybase64.js';

export default {
  // hashlib.md5(text.encode()).hexdigest()
  hex: (text) => construct('md5', utf8(text)).hexdigest(),

  // base64.b64encode(hashlib.md5(body.encode(), usedforsecurity=False).digest()).decode()
  contentmd5: (body) => toAscii(b64encode(Array.from(construct('md5', utf8(body)).digest()))),
};

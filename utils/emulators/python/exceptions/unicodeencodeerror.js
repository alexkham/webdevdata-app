// utils/emulators/python/exceptions/unicodeencodeerror.js
//
// Emulator for the UnicodeEncodeError demo modes: str.encode('ascii') and
// the four common error handlers. Positions are code-point indexes into
// the str (an emoji is ONE position, even though JS stores it as two
// UTF-16 units); a strict error covers the whole run of consecutive
// unencodable characters, as CPython reports it.

import { encodeLimited, bytesRepr } from './unicodedecodeerror.js';
import { raw } from './valueerror.js';

const HANDLERS = ['replace', 'ignore', 'xmlcharrefreplace', 'backslashreplace'];

export default {
  trigger: (text) => raw(bytesRepr(encodeLimited(text, 'ascii', 128))),

  handle: (text) => ({
    __pyTuple: HANDLERS.map((h) => raw(bytesRepr(encodeLimited(text, 'ascii', 128, h)))),
  }),
};

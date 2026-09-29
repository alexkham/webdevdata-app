// utils/emulators/python/stdlib/re/match-expand.js
//
// Emulator for the Match.expand demo, on the engine port in _pyre.js
// (templates parsed exactly like _parser.parse_template).

import * as re from './_pyre.js';
import { PyException } from '../../../../py-exceptions.js';

export default {
  expand: (pattern, text, template) => {
    const m = re.search(pattern, text);
    if (m === null) throw new PyException('AttributeError', "'NoneType' object has no attribute 'expand'");
    return m.expand(template);
  },
};

// utils/emulators/python/stdlib/os-path/join.js
//
// Emulator for the os.path.join demo: posixpath.join and ntpath.join
// ported in _posixpath.js / _ntpath.js.

import { join as pjoin, tuple } from './_posixpath.js';
import { join as njoin } from './_ntpath.js';
import { PyException } from '../../../../py-exceptions.js';

function needOne(parts, name) {
  if (parts.length === 0) throw new PyException('TypeError', `join() missing 1 required positional argument: '${name}'`);
}

export default {
  join: (parts) => {
    needOne(parts, 'a');
    return pjoin(...parts);
  },

  // (posixpath.join(*parts), ntpath.join(*parts))
  both: (parts) => {
    needOne(parts, 'a');
    return tuple(pjoin(...parts), njoin(...parts));
  },
};

// utils/emulators/python/stdlib/os-path/commonpath.js
//
// Emulator for the os.path.commonpath / commonprefix demo (posixpath port).

import { commonpath, commonprefix, normpath, join, tuple } from './_posixpath.js';

export default {
  both: (paths) => tuple(commonpath(paths), commonprefix(paths)),

  inside: (name) => {
    const base = '/srv/uploads';
    const p = normpath(join(base, name));
    return tuple(p, commonpath([base, p]) === base);
  },
};

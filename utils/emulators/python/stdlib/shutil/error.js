// utils/emulators/python/stdlib/shutil/error.js
//
// Emulator for the shutil.Error demo: move's refusals and copytree's
// collected failures, from the shutil port in _pyshutil.js.

import { Shutil, seedEmpty, isinst } from './_pyshutil.js';
import { cmpStr } from '../os-path/_posixpath.js';

export default {
  // 'moved', or (type(e).__name__, isinstance(e, OSError), str(e))
  move: (files, src, dst) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    try {
      sh.move(src, dst);
      return 'moved';
    } catch (e) {
      if (isinst(e, 'Error')) return { __pyTuple: [e.pyType, true, e.message] };
      throw e;
    }
  },

  // copytree('src', 'dst', dirs_exist_ok=True) → 'copied' or sorted (src, dst) pairs
  copytree: (files) => {
    const sh = new Shutil();
    seedEmpty(sh.fs, files);
    try {
      sh.copytree('src', 'dst', { dirsExistOk: true });
      return 'copied';
    } catch (e) {
      if (!isinst(e, 'Error')) throw e;
      const pairs = e.args[0].map((t) => [t.__pyTuple[0], t.__pyTuple[1]]);
      pairs.sort((a, b) => cmpStr(a[0], b[0]) || cmpStr(a[1], b[1]));
      return pairs.map((p) => ({ __pyTuple: p }));
    }
  },
};

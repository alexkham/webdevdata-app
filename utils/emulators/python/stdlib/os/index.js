// utils/emulators/python/stdlib/os/index.js
//
// Emulator for the os module hub demo: list a folder on the virtual file
// system (_vfs.js), and read/write a cleared temporary environment.

import { VFS, seed, pySorted, isOSError } from './_vfs.js';
import { makeEnviron } from './_environ.js';

export default {
  // create files; sorted(os.listdir(folder)) or the OSError class name
  listdir: (files, folder) => {
    const fs = new VFS();
    seed(fs, files);
    try {
      return pySorted(fs.listdir(folder));
    } catch (e) {
      if (isOSError(e)) return e.name;
      throw e;
    }
  },

  // with mock.patch.dict(os.environ, clear=True):
  //     os.environ['APP_MODE'] = value
  //     (os.environ['APP_MODE'], os.getenv('DEBUG'), os.getenv('DEBUG', 'off'))
  environ: (value) => {
    const env = makeEnviron();
    env.set('APP_MODE', value);
    return { __pyTuple: [env.item('APP_MODE'), env.get('DEBUG'), env.get('DEBUG', 'off')] };
  },
};

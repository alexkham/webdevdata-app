// utils/emulators/python/stdlib/os-path/relpath.js
//
// Emulator for the os.path.relpath demo: both arguments are joined onto
// the stand-in cwd shown in the code, so they are absolute and
// posixpath.relpath never needs the real os.getcwd().

import { relpath, join } from './_posixpath.js';

const CWD = '/home/ada/project';

export default {
  rel: (path, start) => relpath(join(CWD, path), join(CWD, start), CWD),
};

// utils/emulators/python/stdlib/os-path/abspath.js
//
// Emulator for the os.path.abspath demo: posixpath.abspath of a path
// joined onto the fixed stand-in cwd shown in the code (posixpath port).

import { abspath, join } from './_posixpath.js';

const CWD = '/home/ada/project';

export default {
  // posixpath.abspath(posixpath.join(cwd, path)) — the argument is always
  // absolute, so os.getcwd() is never consulted
  abs: (p) => abspath(join(CWD, p), CWD),
};

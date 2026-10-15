// utils/emulators/python/stdlib/subprocess/list2cmdline.js
//
// Emulator for the list2cmdline demo tabs: the exact port in
// _subprocess.js of the MS C runtime quoting rules Popen uses on Windows.

import { list2cmdline } from './_subprocess.js';

export default {
  // subprocess.list2cmdline(args)  — a list
  list: (args) => list2cmdline(args),

  // subprocess.list2cmdline(text)  — a str is iterated character by character
  string: (text) => list2cmdline(text),
};

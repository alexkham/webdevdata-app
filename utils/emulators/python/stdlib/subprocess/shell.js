// utils/emulators/python/stdlib/subprocess/shell.js
//
// Emulator for the shell=True demo tabs: the command string the shell would
// receive, with and without shlex.quote (exact port in _subprocess.js).
// Nothing is executed — the demo only builds strings.

import { shlexQuote, shlexJoin } from './_subprocess.js';

export default {
  // filename = name
  // {'unsafe': 'cat ' + filename, 'safe': 'cat ' + shlex.quote(filename)}
  quote: (name) => ({ unsafe: 'cat ' + name, safe: 'cat ' + shlexQuote(name) }),

  // shlex.join(args)
  join: (args) => shlexJoin(args),
};

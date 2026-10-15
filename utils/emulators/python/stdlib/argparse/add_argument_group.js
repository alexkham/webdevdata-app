// utils/emulators/python/stdlib/argparse/add_argument_group.js
//
// Emulator for the add_argument_group demo tabs: the upload parser with two
// argument groups, built on the CPython port in _argparse.js. The help tab
// formats it at the reader's COLUMNS (clamped to 1..300 like the template);
// the parse tab runs the shared command-line tail from _cli.js.

import { ArgumentParser, INT } from './_argparse.js';
import { cli, freshState, linesRepr } from './_cli.js';

function upload() {
  const parser = new ArgumentParser({ prog: 'upload', description: 'Upload files to a server.' });
  parser.add_argument('files', { nargs: '+', help: 'files to upload' });
  const net = parser.add_argument_group({ title: 'network', description: 'Where and how to connect.' });
  net.add_argument('--host', { default: 'localhost', help: 'server name (default: %(default)s)' });
  net.add_argument('--port', { type: INT, default: 8080n, help: 'server port' });
  const out = parser.add_argument_group({ title: 'output' });
  out.add_argument('-q', '--quiet', { action: 'store_true', help: 'print nothing' });
  return parser;
}

// os.environ['COLUMNS'] = str(min(max(columns, 1), 300))
const clamp = (columns) => Math.min(Math.max(columns, 1), 300);

export default {
  help: (columns) => {
    freshState(String(clamp(columns)));
    return linesRepr(upload().format_help());
  },
  parse: (cmdline) => cli(upload, cmdline),
};

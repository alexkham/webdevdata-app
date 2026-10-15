// utils/emulators/python/stdlib/argparse/set_defaults.js
//
// Emulator for the set_defaults demo tabs: the parsers the templates build,
// run by the CPython port in _argparse.js; _cli.js runs the shared template
// tail (shlex.split, COLUMNS=60, SystemExit capture).

import { ArgumentParser, INT } from './_argparse.js';
import { cli } from './_cli.js';

function precedence() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--level', { default: 'info' });
  parser.add_argument('--port', { type: INT });
  parser.set_defaults({ level: 'warning', port: '8080', retries: 3n });
  return parser;
}

function dispatch() {
  const parser = new ArgumentParser({ prog: 'tool' });
  parser.add_argument('-v', '--verbose', { action: 'store_true' });
  parser.set_defaults({ handler: 'show_usage' });
  const commands = parser.add_subparsers({ dest: 'command' });
  const build = commands.add_parser('build');
  build.add_argument('--release', { action: 'store_true' });
  build.set_defaults({ handler: 'run_build' });
  const clean = commands.add_parser('clean');
  clean.set_defaults({ handler: 'run_clean', release: false });
  return parser;
}

export default {
  precedence: (cmdline) => cli(precedence, cmdline),
  dispatch: (cmdline) => cli(dispatch, cmdline),
};

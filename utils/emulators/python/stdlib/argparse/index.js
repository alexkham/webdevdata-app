// utils/emulators/python/stdlib/argparse/index.js
//
// Emulator for the argparse hub demo: the same two parsers the templates
// build, run on the reader's command line by the CPython port in
// _argparse.js (shlex.split, COLUMNS=60, stdout+stderr captured, SystemExit
// turned into (code, printed lines)) — see _cli.js.

import { ArgumentParser, INT } from './_argparse.js';
import { cli } from './_cli.js';

function greeter() {
  const parser = new ArgumentParser({ prog: 'app', description: 'Say hello to people.' });
  parser.add_argument('names', { nargs: '+', help: 'who to greet' });
  parser.add_argument('-n', '--times', { type: INT, default: 1n, help: 'repeat each greeting N times (default: %(default)s)' });
  parser.add_argument('-v', '--verbose', { action: 'store_true', help: 'explain what is happening' });
  parser.add_argument('--version', { action: 'version', version: '%(prog)s 1.0' });
  return parser;
}

function gitLike() {
  const parser = new ArgumentParser({ prog: 'app' });
  const commands = parser.add_subparsers({ dest: 'command', required: true });
  const add = commands.add_parser('add', { help: 'stage files' });
  add.add_argument('paths', { nargs: '+' });
  const commit = commands.add_parser('commit', { help: 'record the staged files' });
  commit.add_argument('-m', '--message', { required: true });
  commit.add_argument('--amend', { action: 'store_true' });
  return parser;
}

export default {
  cli: (cmdline) => cli(greeter, cmdline),
  sub: (cmdline) => cli(gitLike, cmdline),
};

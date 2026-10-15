// utils/emulators/python/stdlib/argparse/add_mutually_exclusive_group.js
//
// Emulator for the add_mutually_exclusive_group demo tabs: the two parsers
// the templates build, run by the CPython port in _argparse.js; _cli.js runs
// the shared template tail (shlex.split, COLUMNS=60, SystemExit capture).

import { ArgumentParser } from './_argparse.js';
import { cli } from './_cli.js';

function verbosity() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('file');
  const level = parser.add_mutually_exclusive_group();
  level.add_argument('-v', '--verbose', { action: 'count', default: 0n, help: 'more output (repeatable)' });
  level.add_argument('-q', '--quiet', { action: 'store_true', help: 'no output' });
  return parser;
}

function required() {
  const parser = new ArgumentParser({ prog: 'export' });
  const target = parser.add_mutually_exclusive_group({ required: true });
  target.add_argument('-o', '--output', { metavar: 'PATH', help: 'write to a file' });
  target.add_argument('--stdout', { action: 'store_true', help: 'write to the terminal' });
  target.add_argument('url', { nargs: '?', help: 'upload to this URL' });
  return parser;
}

export default {
  verbosity: (cmdline) => cli(verbosity, cmdline),
  required: (cmdline) => cli(required, cmdline),
};

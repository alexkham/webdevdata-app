// utils/emulators/python/stdlib/argparse/add_subparsers.js
//
// Emulator for the add_subparsers demo tabs: the two parsers the templates
// build, run by the CPython port in _argparse.js; _cli.js runs the shared
// template tail (shlex.split, COLUMNS=60, SystemExit capture).

import { ArgumentParser } from './_argparse.js';
import { cli } from './_cli.js';

function pkg() {
  const parser = new ArgumentParser({ prog: 'pkg' });
  parser.add_argument('-q', '--quiet', { action: 'store_true' });
  const commands = parser.add_subparsers({ title: 'commands', dest: 'command', metavar: 'COMMAND' });
  const install = commands.add_parser('install', { aliases: ['i'], help: 'install packages' });
  install.add_argument('names', { nargs: '+' });
  install.add_argument('-U', '--upgrade', { action: 'store_true' });
  const remove = commands.add_parser('remove', { aliases: ['rm'], help: 'remove packages' });
  remove.add_argument('names', { nargs: '+' });
  remove.add_argument('-y', '--yes', { action: 'store_true' });
  return parser;
}

function shared() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--user', { default: 'me' });
  const commands = parser.add_subparsers({ dest: 'command' });
  const run = commands.add_parser('run');
  run.add_argument('--user', { default: 'root' });
  return parser;
}

export default {
  pkg: (cmdline) => cli(pkg, cmdline),
  shared: (cmdline) => cli(shared, cmdline),
};

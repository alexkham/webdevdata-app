// utils/emulators/python/stdlib/argparse/error.js
//
// Emulator for the parser.error() / parser.exit() demo: parse the reader's
// command line with the CPython port in _argparse.js, then run the
// template's two checks; _cli.js runs the shared template tail.

import { ArgumentParser, INT } from './_argparse.js';
import { cli } from './_cli.js';

function build() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--start', { type: INT, default: 0n });
  parser.add_argument('--end', { type: INT, default: 10n });
  return parser;
}

// args = parser.parse_args(...)
// if args.start > args.end:
//     parser.error(f'--start ({args.start}) must not be greater than --end ({args.end})')
// if args.end - args.start > 100:
//     parser.exit(1, f'app: range too large: {args.end - args.start} items\n')
// result = args
const checked = (parser, argv) => {
  const args = parser.parse_args(argv);
  const start = args.__dict__.get('start');
  const end = args.__dict__.get('end');
  if (start > end) parser.error(`--start (${start}) must not be greater than --end (${end})`);
  if (end - start > 100n) parser.exit(1n, `app: range too large: ${end - start} items\n`);
  return args;
};

export default {
  validate: (cmdline) => cli(build, cmdline, checked),
};

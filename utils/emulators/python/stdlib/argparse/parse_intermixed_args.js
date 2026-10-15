// utils/emulators/python/stdlib/argparse/parse_intermixed_args.js
//
// Emulator for the parse_intermixed_args demo: the same command line
// through parse_args and parse_intermixed_args of the CPython port in
// _argparse.js, each result or (exit status, last printed line).

import { ArgumentParser, SystemExit, sys } from './_argparse.js';
import { freshState, raw } from './_cli.js';
import { shlexSplit, pyRepr, pySplitlines, PyTuple, StringIO, raise } from './_pyvalue.js';

function build() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('files', { nargs: '+' });
  parser.add_argument('-o', '--output');
  parser.add_argument('-v', '--verbose', { action: 'store_true' });
  return parser;
}

// def attempt(parse):
//     out = io.StringIO()
//     try:
//         with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
//             return parse(argv)
//     except SystemExit as e:
//         return (e.code, out.getvalue().splitlines()[-1])
function attempt(parse, argv) {
  const out = new StringIO();
  sys.stdout = out;
  sys.stderr = out;
  try {
    return parse(argv);
  } catch (e) {
    if (!(e instanceof SystemExit)) throw e;
    const lines = pySplitlines(out.getvalue());
    if (!lines.length) raise('IndexError', 'list index out of range');
    return new PyTuple([e.code, lines[lines.length - 1]]);
  }
}

function compare(cmdline) {
  // argv = shlex.split(cmdline) runs before COLUMNS is set
  const argv = shlexSplit(cmdline);
  freshState('60');
  const parser = build();
  const plain = attempt((a) => parser.parse_args(a), argv);
  const mixed = attempt((a) => parser.parse_intermixed_args(a), argv);
  return raw(pyRepr(new PyTuple([plain, mixed])));
}

export default {
  compare,
};

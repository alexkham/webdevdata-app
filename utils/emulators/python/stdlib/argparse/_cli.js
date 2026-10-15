// utils/emulators/python/stdlib/argparse/_cli.js
//
// Shared tail of the argparse demo templates, on the port in _argparse.js.
// Every command-line template ends the same way:
//
//   out = io.StringIO()
//   saved = os.environ.get('COLUMNS')
//   os.environ['COLUMNS'] = '60'
//   try:
//       with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
//           result = parser.parse_args(shlex.split(cmdline))
//   except SystemExit as e:
//       result = (e.code, out.getvalue().splitlines())
//   finally:
//       <restore COLUMNS>
//   result
//
// cli() is that tail: the value of `result` as the Python repr the demo
// box shows ({ __pyRaw }), or a thrown Python exception (shlex's
// ValueError, or anything parse_args does not turn into SystemExit).

import { sys, env, files, resetState, SystemExit, ArgumentError } from './_argparse.js';
import { StringIO, shlexSplit, pySplitlines, pyRepr, PyTuple } from './_pyvalue.js';

export const raw = (text) => ({ __pyRaw: text });

// fresh process state: redirected streams, COLUMNS, no files
export function freshState(columns = '60') {
  resetState();
  const out = new StringIO();
  sys.stdout = out;
  sys.stderr = out;
  env.COLUMNS = columns;
  return out;
}

export const exitTuple = (e, out) => `(${pyRepr(e.code)}, ${pyRepr(pySplitlines(out.getvalue()))})`;

// call(parser, argv) → the Python value of `result` on success
export function cli(build, cmdline, call = (p, argv) => p.parse_args(argv), { columns = '60', setup = null } = {}) {
  const out = freshState(columns);
  if (setup) setup(files);
  const parser = build();
  const argv = shlexSplit(cmdline);
  try {
    const value = call(parser, argv);
    return raw(pyRepr(Array.isArray(value) ? new PyTuple(value) : value));
  } catch (e) {
    if (e instanceof SystemExit) return raw(exitTuple(e, out));
    throw e;
  }
}

// The exit_on_error=False variant of the tail: only stdout is redirected,
// and an ArgumentError becomes (e.argument_name, e.message):
//
//   try:
//       with contextlib.redirect_stdout(out):
//           result = parser.parse_args(shlex.split(cmdline))
//   except argparse.ArgumentError as e:
//       result = (e.argument_name, e.message)
//   except SystemExit as e:
//       result = (e.code, out.getvalue().splitlines())
export function cliArgumentError(build, cmdline, call = (p, argv) => p.parse_args(argv)) {
  resetState();
  const out = new StringIO();
  sys.stdout = out;
  env.COLUMNS = '60';
  const parser = build();
  const argv = shlexSplit(cmdline);
  try {
    const value = call(parser, argv);
    return raw(pyRepr(Array.isArray(value) ? new PyTuple(value) : value));
  } catch (e) {
    if (e instanceof ArgumentError) return raw(pyRepr(new PyTuple([e.argument_name, e.pyMessage])));
    if (e instanceof SystemExit) return raw(exitTuple(e, out));
    throw e;
  }
}

// [line, ...] of a str, like str.splitlines(), as a Python list repr
export const linesRepr = (text) => raw(pyRepr(pySplitlines(text)));

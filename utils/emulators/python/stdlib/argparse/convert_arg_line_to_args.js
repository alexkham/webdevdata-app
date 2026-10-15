// utils/emulators/python/stdlib/argparse/convert_arg_line_to_args.js
//
// Emulator for the convert_arg_line_to_args demo: the default method of the
// CPython port in _argparse.js and the template's two overrides,
//
//   class SplitArgs(argparse.ArgumentParser):
//       def convert_arg_line_to_args(self, arg_line):
//           return arg_line.split()
//
//   class ShellArgs(argparse.ArgumentParser):
//       def convert_arg_line_to_args(self, arg_line):
//           return shlex.split(arg_line, comments=True)
//
// evaluated left to right, so an unbalanced quote raises shlex's
// ValueError just as the template's tuple does.

import { ArgumentParser } from './_argparse.js';
import { raw } from './_cli.js';
import { pyRepr, PyTuple, pySplitWhitespace, shlexSplit } from './_pyvalue.js';

class SplitArgs extends ArgumentParser {
  convert_arg_line_to_args(argLine) { return pySplitWhitespace(argLine); }
}
SplitArgs.pyName = 'SplitArgs';

class ShellArgs extends ArgumentParser {
  convert_arg_line_to_args(argLine) { return shlexSplit(argLine, { comments: true }); }
}
ShellArgs.pyName = 'ShellArgs';

function line(text) {
  const results = [ArgumentParser, SplitArgs, ShellArgs].map((Cls) => new Cls({ prog: 'app' }).convert_arg_line_to_args(text));
  return raw(pyRepr(new PyTuple(results)));
}

export default {
  line,
};

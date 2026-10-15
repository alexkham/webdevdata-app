// utils/emulators/python/stdlib/argparse/argumenterror.js
//
// Emulator for the argparse.ArgumentError demo: an exit_on_error=False
// parser on the CPython port in _argparse.js. _cli.js's cliArgumentError
// runs the template tail (ArgumentError → (e.argument_name, e.message),
// SystemExit → (code, printed lines)).

import { ArgumentParser, INT } from './_argparse.js';
import { cliArgumentError } from './_cli.js';

function server() {
  const parser = new ArgumentParser({ prog: 'app', exit_on_error: false });
  parser.add_argument('host');
  parser.add_argument('-p', '--port', { type: INT, default: 8080n });
  parser.add_argument('--mode', { choices: ['fast', 'safe'], default: 'safe' });
  return parser;
}

export default {
  catch: (cmdline) => cliArgumentError(server, cmdline),
};

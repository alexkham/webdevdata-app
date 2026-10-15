// utils/emulators/python/stdlib/argparse/argumenttypeerror.js
//
// Emulator for the argparse.ArgumentTypeError demo: the template's port()
// type function, run by the CPython port in _argparse.js; _cli.js runs the
// shared template tail.

import { ArgumentParser, ArgumentTypeError, INT, pyFunction } from './_argparse.js';
import { cli } from './_cli.js';

// def port(text):
//     number = int(text)
//     if not 1 <= number <= 65535:
//         raise argparse.ArgumentTypeError(f'{number} is not between 1 and 65535')
//     return number
const port = pyFunction('port', (text) => {
  const number = INT.call(text);
  if (!(number >= 1n && number <= 65535n)) throw new ArgumentTypeError(`${number} is not between 1 and 65535`);
  return number;
});

function server() {
  const parser = new ArgumentParser({ prog: 'app' });
  parser.add_argument('--port', { type: port, default: 8080n });
  return parser;
}

export default {
  port: (cmdline) => cli(server, cmdline),
};

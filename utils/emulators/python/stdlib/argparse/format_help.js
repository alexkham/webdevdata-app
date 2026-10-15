// utils/emulators/python/stdlib/argparse/format_help.js
//
// Emulator for the format_help demo: the reader picks the terminal width
// (COLUMNS, clamped to 1..300 like the template) and sees how the CPython
// port in _argparse.js lays out the same parser's help.

import { ArgumentParser, INT } from './_argparse.js';
import { freshState, linesRepr } from './_cli.js';

function build() {
  const parser = new ArgumentParser({ prog: 'convert', description: 'Convert images between formats, resizing them on the way if asked to.' });
  parser.add_argument('files', { nargs: '+', help: 'images to convert' });
  parser.add_argument('-f', '--format', { choices: ['png', 'jpeg', 'webp'], default: 'png', help: 'output format' });
  parser.add_argument('-w', '--width', { type: INT, help: 'resize to this width, keeping the aspect ratio' });
  return parser;
}

// os.environ['COLUMNS'] = str(min(max(columns, 1), 300))
const clamp = (columns) => Math.min(Math.max(columns, 1), 300);

export default {
  width: (columns) => {
    freshState(String(clamp(columns)));
    return linesRepr(build().format_help());
  },
  usage: (columns) => {
    freshState(String(clamp(columns)));
    return linesRepr(build().format_usage());
  },
};

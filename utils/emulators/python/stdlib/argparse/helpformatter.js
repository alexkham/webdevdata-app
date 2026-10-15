// utils/emulators/python/stdlib/argparse/helpformatter.js
//
// Emulator for the formatter_class demo: the template's dict of the five
// public formatter classes, a fixed parser, format_help() at COLUMNS=60 —
// all on the CPython port in _argparse.js.

import {
  ArgumentParser, HelpFormatter, RawDescriptionHelpFormatter, RawTextHelpFormatter,
  ArgumentDefaultsHelpFormatter, MetavarTypeHelpFormatter, INT, FLOAT, STR,
} from './_argparse.js';
import { freshState, linesRepr } from './_cli.js';
import { raise, pyRepr } from './_pyvalue.js';

const FORMATTERS = new Map([
  ['plain', HelpFormatter],
  ['raw description', RawDescriptionHelpFormatter],
  ['raw text', RawTextHelpFormatter],
  ['defaults', ArgumentDefaultsHelpFormatter],
  ['metavar type', MetavarTypeHelpFormatter],
]);

function style(name) {
  freshState('60');
  // formatters[style] — an unknown key is a KeyError before anything else runs
  if (!FORMATTERS.has(name)) raise('KeyError', pyRepr(name));
  const parser = new ArgumentParser({
    prog: 'app',
    formatter_class: FORMATTERS.get(name),
    description: 'Resize images.\n\nExamples:\n  app photo.jpg --width 640\n  app *.png --ratio 0.5',
  });
  parser.add_argument('files', { nargs: '+', type: STR, help: 'images to resize' });
  parser.add_argument('--width', { type: INT, default: 800n, help: 'target width in pixels;\nthe height follows the aspect ratio' });
  parser.add_argument('--ratio', { type: FLOAT, help: 'scale factor instead of a width' });
  return linesRepr(parser.format_help());
}

export default {
  style,
};

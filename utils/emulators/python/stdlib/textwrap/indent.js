// utils/emulators/python/stdlib/textwrap/indent.js
//
// Emulator for the textwrap.indent demo tabs, on the CPython port in
// _pytextwrap.js (str.splitlines(True) line boundaries, str.isspace()
// for the default predicate). The demo input uses | for line breaks.

import { indent } from './_pytextwrap.js';

const lines = (text) => text.replaceAll('|', '\n');

export default {
  // textwrap.indent(text.replace('|', '\n'), prefix)
  indent: (text, prefix) => indent(lines(text), prefix),

  // textwrap.indent(text.replace('|', '\n'), prefix, lambda line: True)
  all: (text, prefix) => indent(lines(text), prefix, () => true),
};

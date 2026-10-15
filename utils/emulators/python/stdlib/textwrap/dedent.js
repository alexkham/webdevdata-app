// utils/emulators/python/stdlib/textwrap/dedent.js
//
// Emulator for the textwrap.dedent demo tabs, on the CPython port in
// _pytextwrap.js (dedent's two regular expressions run on the sre port).
// The demo input uses | for line breaks: str.replace('|', '\n').

import { dedent, indent } from './_pytextwrap.js';

const lines = (text) => text.replaceAll('|', '\n');

export default {
  // textwrap.dedent(text.replace('|', '\n'))
  dedent: (text) => dedent(lines(text)),

  // textwrap.indent(textwrap.dedent(text.replace('|', '\n')), prefix)
  reindent: (text, prefix) => indent(dedent(lines(text)), prefix),
};

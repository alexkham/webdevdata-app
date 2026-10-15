// utils/emulators/python/stdlib/textwrap/textwrapper-attributes.js
//
// Emulator for the TextWrapper class-attribute demo tabs. The patterns are
// textwrap's own pattern strings run by the sre port (_pyre.js), see
// _pytextwrap.js.

import { wordsep_re, wordsep_simple_re, sentence_end_re } from './_pytextwrap.js';

export default {
  // [c for c in TextWrapper.wordsep_re.split(text) if c]
  chunks: (text) => wordsep_re.split(text).filter((c) => c),

  // [c for c in TextWrapper.wordsep_simple_re.split(text) if c]
  simple: (text) => wordsep_simple_re.split(text).filter((c) => c),

  // [bool(TextWrapper.sentence_end_re.search(w)) for w in words]
  sentence: (words) => words.map((w) => sentence_end_re.search(w) !== null),
};

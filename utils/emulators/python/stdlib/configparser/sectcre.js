// utils/emulators/python/stdlib/configparser/sectcre.js
//
// Emulator for the SECTCRE / OPTCRE / OPTCRE_NV demo tabs, on the CPython
// port in _pyconfigparser.js. The custom SECTCRE is the fixed pattern of the
// template, re.compile(r"\[ *(?P<header>[^]]+?) *\]"), with re.match
// semantics (anchored at the start only).

import { ConfigParser, asPy, joinLines, OPTCRE, OPTCRE_NV, tuple } from './_pyconfigparser.js';

const CUSTOM_SECTCRE = {
  match(s) {
    const m = /^\[ *([^\]]+?) *\]/.exec(s);
    return m ? { header: m[1] } : null;
  },
};

const groups = (m) => tuple(m.option, m.vi, m.value);

export default {
  // (default.sections(), custom.sections())
  sectcre: (l1, l2, l3) => {
    const text = joinLines(l1, l2, l3);
    const dflt = new ConfigParser();
    const custom = new ConfigParser();
    custom.SECTCRE = CUSTOM_SECTCRE;
    dflt.read_string(text);
    custom.read_string(text);
    return asPy(tuple(dflt.sections(), custom.sections()));
  },

  // (m1 and m1.group('option', 'vi', 'value'), m2.group('option', 'vi', 'value'))
  optcre: (line) => {
    const m1 = OPTCRE.match(line);
    const m2 = OPTCRE_NV.match(line);
    // the line comes from a one-line input, so OPTCRE_NV always matches
    return asPy(tuple(m1 ? groups(m1) : null, groups(m2)));
  },
};

// utils/emulators/python/stdlib/enum/strenum.js
//
// Emulator for the enum.StrEnum demo tabs, on the Lib/enum.py port in
// _pyenum.js (format() through the formatter_unicode.c port).

import { defineEnum, functional, STR_ENUM, call, getitem, members, str, format, auto, py, pyTuple } from './_pyenum.js';

// class Method(StrEnum): GET = auto(); POST = auto(); DELETE = auto()
const method = (names) => defineEnum('Method', [STR_ENUM], names.map((n) => [n, auto()]));

export default {
  // m = Method(value); (m, str(m), m.upper())
  lookup: (value) => {
    const m = call(method(['GET', 'POST', 'DELETE']), value);
    // the values are the lower-cased ASCII names, so JS upper-casing is
    // exactly str.upper() here
    return pyTuple(m, str(m), m.data.toUpperCase());
  },

  // format(Method.POST, spec) — a str, or the member itself
  format: (spec) => py(format(getitem(method(['GET', 'POST']), 'POST'), spec)),

  // Method = StrEnum('Method', names); list(Method)
  names: (names) => py(members(functional(STR_ENUM, 'Method', names))),
};

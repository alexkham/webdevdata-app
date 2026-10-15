// utils/emulators/python/stdlib/enum/member-nonmember.js
//
// Emulator for the enum.member / enum.nonmember demo tabs (Lib/enum.py
// port in _pyenum.js: EnumDict unwraps both markers).

import { defineEnum, ENUM, MemberWrap, NonMember, members, classAttr, getitem, autoArg, pyTuple, py } from './_pyenum.js';

// The three lambdas of the template, as member values (functions hash and
// compare by identity, so each one is its own member)
const fn = (f) => ({ __pyRaw: '<function Op.<lambda>>', call: f });

export default {
  // DEBUG = 1; RELEASE = 2; DEFAULT = nonmember(value) — (list(Config), Config.DEFAULT)
  nonmember: (value) => {
    const Config = defineEnum('Config', [ENUM], [['DEBUG', 1n], ['RELEASE', 2n], ['DEFAULT', new NonMember(autoArg(value))]]);
    return pyTuple(members(Config), classAttr(Config, 'DEFAULT'));
  },

  // Op[name].value(6, 3) with ADD / SUB / MUL = member(lambda a, b: …)
  member: (name) => {
    const Op = defineEnum('Op', [ENUM], [
      ['ADD', new MemberWrap(fn((a, b) => a + b))],
      ['SUB', new MemberWrap(fn((a, b) => a - b))],
      ['MUL', new MemberWrap(fn((a, b) => a * b))],
    ]);
    return py(getitem(Op, name).value.call(6n, 3n));
  },
};

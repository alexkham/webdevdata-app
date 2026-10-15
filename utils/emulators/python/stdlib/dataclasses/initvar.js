// utils/emulators/python/stdlib/dataclasses/initvar.js
//
// Emulator for the InitVar demo tabs, on the CPython port in
// _pydataclasses.js: the InitVars reach the template's __post_init__,
// written here in JS line for line.

import {
  makeClass, dataclass, field, fields, method, callClass, setattr, hasattr, richcmp, truthy, raise,
  repr, PyFloat, Unpredictable, InitVar, T, floatLit, show, run, tuple,
} from './_pydataclasses.js';

// float arithmetic of the template: value is always a float here (a float
// literal), so every step is one IEEE operation, exactly as in CPython
const asDouble = (v) => {
  if (v instanceof PyFloat) return v.v;
  throw new Unpredictable('not emulated: non-float temperature');
};

export default {
  // t = Temperature(value, unit); (t, [f.name for f in fields(t)])
  convert: (value, unit) => run(() => {
    const postInit = method('Temperature', '__post_init__', ['self', 'value', 'unit'], ([self, v, u]) => {
      if (truthy(richcmp(u, 'C', 'eq'))) setattr(self, 'celsius', v);
      else if (truthy(richcmp(u, 'F', 'eq'))) setattr(self, 'celsius', new PyFloat(((asDouble(v) - 32) * 5) / 9));
      else raise('ValueError', `unknown unit ${repr(u)}`);
      return null;
    });
    const Temperature = dataclass(makeClass('Temperature', {
      body: [
        { ann: 'celsius', type: T.float, value: field({ init: false }) },
        { ann: 'value', type: InitVar(T.float) },
        { ann: 'unit', type: InitVar(T.str), value: 'C' },
        { name: '__post_init__', value: postInit },
      ],
    }));
    const t = callClass(Temperature, [floatLit(value), unit]);
    return show(tuple(t, fields(t).items.map((f) => f.name)));
  }),

  // u = User(name, password); (u, hasattr(u, 'password'))
  secret: (name, password) => run(() => {
    const postInit = method('User', '__post_init__', ['self', 'password'], ([self, pw]) => {
      setattr(self, 'password_length', BigInt([...pw].length)); // len() counts code points
      return null;
    });
    const User = dataclass(makeClass('User', {
      body: [
        { ann: 'name', type: T.str },
        { ann: 'password', type: InitVar(T.str) },
        { ann: 'password_length', type: T.int, value: field({ init: false }) },
        { name: '__post_init__', value: postInit },
      ],
    }));
    const u = callClass(User, [name, password]);
    return show(tuple(u, hasattr(u, 'password')));
  }),
};

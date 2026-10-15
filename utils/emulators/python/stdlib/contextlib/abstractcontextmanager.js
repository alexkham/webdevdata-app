// utils/emulators/python/stdlib/contextlib/abstractcontextmanager.js
//
// Emulator for the AbstractContextManager / AbstractAsyncContextManager demo
// tabs. The snippets define a method only when its name is in the typed
// list (`if '__exit__' in methods: def __exit__ ...`), so each class is
// described completely by which of the four names the list contains. The
// rest is contextlib.py's own logic:
//
//   __subclasshook__   _collections_abc._check_methods(C, '__enter__',
//                      '__exit__'): both names defined in the class (the
//                      demo never sets one to None) — likewise
//                      '__aenter__' / '__aexit__' for the async ABC
//   abstract __exit__  a subclass of AbstractContextManager that does not
//                      define __exit__ cannot be instantiated (abc)
//   default __enter__  AbstractContextManager.__enter__ returns self

import { PyException } from '../../../../py-exceptions.js';

const has = (methods, name) => methods.includes(name);

export default {
  // class Duck: defines the listed methods (no base class)
  // isinstance(Duck(), AbstractContextManager), isinstance(Duck(), AbstractAsyncContextManager)
  hook: (methods) => ({
    __pyTuple: [
      has(methods, '__enter__') && has(methods, '__exit__'),
      has(methods, '__aenter__') && has(methods, '__aexit__'),
    ],
  }),

  // class Res(AbstractContextManager): defines the listed methods
  // (its own __enter__ returns 'something else')
  // res = Res(); with res as r: pass; r is res
  base: (methods) => {
    if (!has(methods, '__exit__')) {
      throw new PyException('TypeError', "Can't instantiate abstract class Res without an implementation for abstract method '__exit__'");
    }
    // the inherited __enter__ returns self; the class's own returns a str
    return !has(methods, '__enter__');
  },
};

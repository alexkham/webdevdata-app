// utils/emulators/python/globals.js
//
// Emulator for Python globals(). The real function returns the live
// namespace dict — different for every module and REPL session. The
// demo takes a CONTEXT (module / function / class) and shows a
// representative example of what globals() would return there.
//
// The key teaching point: globals() is ALWAYS the module dict,
// regardless of whether you call it from module level, inside a
// function, or inside a class body.

const SAMPLES = {
  'module':   "{'__name__': '__main__', '__builtins__': <module 'builtins'>, 'x': 1, 'greet': <function greet>}",
  'function': "{'__name__': '__main__', '__builtins__': <module 'builtins'>, 'x': 1, 'greet': <function greet>}  # same as module — NOT local vars",
  'class':    "{'__name__': '__main__', '__builtins__': <module 'builtins'>, 'x': 1, 'C': <class 'C'>}  # same as module — NOT class attrs",
};

export default function pyGlobals(context) {
  const c = String(context == null ? '' : context).trim() || 'module';
  return SAMPLES[c] !== undefined ? SAMPLES[c] : SAMPLES['module'];
}
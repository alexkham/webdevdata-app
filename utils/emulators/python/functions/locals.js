// utils/emulators/python/locals.js
//
// Emulator for Python locals(). Real locals() returns a live namespace
// (module) or a snapshot (function/class body). The demo takes a
// CONTEXT and shows a representative example — with the key teaching
// point that FUNCTION locals() is a SNAPSHOT, and CLASS BODY locals()
// shows the developing class attributes.

const SAMPLES = {
  'module':   "{'__name__': '__main__', '__builtins__': <module 'builtins'>, 'x': 1, 'greet': <function greet>}  # same dict as globals()",
  'function': "{'a': 1, 'b': 2, 'total': 3}  # snapshot of local vars (not live)",
  'class':    "{'__module__': '__main__', '__qualname__': 'C', 'x': 1, 'greet': <function greet>}  # developing class attrs",
};

export default function pyLocals(context) {
  const c = String(context == null ? '' : context).trim() || 'module';
  return SAMPLES[c] !== undefined ? SAMPLES[c] : SAMPLES['module'];
}
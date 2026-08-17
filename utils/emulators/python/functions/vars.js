// utils/emulators/python/vars.js
//
// Emulator for Python vars(object). Real Python vars() returns the live
// __dict__ of the given object. The demo takes a KIND (module / class /
// instance / empty-class / built-in type name) and returns a
// representative __dict__ display.

class TypeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'TypeError'; }
}

const SAMPLES = {
  'module': "{'__name__': 'sample', 'greet': <function greet>, 'VERSION': '1.0'}",
  'class': "{'x': 1, 'greet': <function C.greet>, '__init__': <function C.__init__>}",
  'instance': "{'name': 'Alice', 'age': 30}",
  'empty-class': '{}',
};

// Built-in types that don't have __dict__.
const NO_DICT = new Set(['str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'bytes', 'frozenset']);

export default function pyVars(kind) {
  const k = String(kind == null ? '' : kind).trim();
  if (!k) return '{}';

  if (SAMPLES[k] !== undefined) return SAMPLES[k];
  if (NO_DICT.has(k)) {
    throw new TypeErrorLike('vars() argument must have __dict__ attribute');
  }
  return '{}';
}
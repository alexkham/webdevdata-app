// utils/emulators/python/issubclass.js
//
// Emulator for Python issubclass(class, classinfo). We use a curated
// map of built-in type hierarchies matching CPython — every class is
// a subclass of object; bool is a subclass of int; everything else
// disjoint at the top level.

const MRO = {
  'object':     ['object'],
  'int':        ['int', 'object'],
  'bool':       ['bool', 'int', 'object'],   // bool ⊂ int is the Python trivia
  'float':      ['float', 'object'],
  'complex':    ['complex', 'object'],
  'str':        ['str', 'object'],
  'bytes':      ['bytes', 'object'],
  'bytearray':  ['bytearray', 'object'],
  'list':       ['list', 'object'],
  'tuple':      ['tuple', 'object'],
  'dict':       ['dict', 'object'],
  'set':        ['set', 'object'],
  'frozenset':  ['frozenset', 'object'],
  'range':      ['range', 'object'],
  'type':       ['type', 'object'],
};

export default function pyIsSubclass(child, parent) {
  const c = String(child == null ? '' : child).trim();
  const p = String(parent == null ? '' : parent).trim();

  if (!c || !p) return false;

  const mro = MRO[c];
  if (!mro) return false;   // unknown class — demo treats as no relationship
  return mro.includes(p);
}
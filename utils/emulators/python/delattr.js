// utils/emulators/python/delattr.js
//
// Emulator for Python delattr(object, name). Same shape as setattr:
//   - built-in immutable type name → TypeError
//   - user class + existing attr → success description
//   - user class + missing attr → AttributeError
//
// A curated "existing attr" list per user-class demo case keeps things
// unambiguous.

class TypeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'TypeError'; }
}
class AttributeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'AttributeError'; }
}

const IMMUTABLE_BUILTINS = new Set([
  'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'bytes',
  'frozenset', 'complex', 'range', 'bytearray',
]);

// For the "user" demo, pretend the class has these attributes.
const USER_ATTRS = new Set(['name', 'age', 'x', 'y', 'value']);

export default function pyDelAttr(target, name) {
  const t = String(target == null ? '' : target).trim();
  const n = String(name   == null ? '' : name).trim();
  if (!n) throw new TypeErrorLike('attribute name must be string, not empty');

  if (IMMUTABLE_BUILTINS.has(t)) {
    throw new TypeErrorLike(`cannot set '${n}' attribute of immutable type '${t}'`);
  }

  if (t === 'user' || t === '') {
    if (!USER_ATTRS.has(n)) {
      throw new AttributeErrorLike(`'C' object has no attribute '${n}'`);
    }
    return `# del ${t || 'obj'}.${n}\nNone`;
  }

  return `# del ${t}.${n}\nNone`;
}
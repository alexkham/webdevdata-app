// utils/emulators/python/setattr.js
//
// Emulator for Python setattr(object, name, value). The demo takes a
// target category (user class or built-in type name) and shows what
// would happen:
//   - user: succeeds, describes the assignment
//   - built-in type name (str, int, list, ...): raises TypeError

class TypeErrorLike extends Error {
  constructor(message) { super(message); this.name = 'TypeError'; }
}

const IMMUTABLE_BUILTINS = new Set([
  'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'bytes',
  'frozenset', 'complex', 'range', 'bytearray',
]);

export default function pySetAttr(target, name, value) {
  const t = String(target == null ? '' : target).trim();
  const n = String(name   == null ? '' : name).trim();
  const v = String(value  == null ? '' : value);

  if (!n) throw new TypeErrorLike('attribute name must be string, not empty');

  if (IMMUTABLE_BUILTINS.has(t)) {
    throw new TypeErrorLike(`cannot set '${n}' attribute of immutable type '${t}'`);
  }

  if (t === 'user' || t === '') {
    return `# ${t || 'obj'}.${n} = ${v}\nNone`;
  }

  return `# ${t}.${n} = ${v}\nNone`;
}
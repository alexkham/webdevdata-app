// utils/emulators/python/getattr.js
//
// Emulator for Python getattr(object, name[, default]). Reuses the same
// curated attribute map as hasattr. For an existing attribute, returns
// a descriptor string like "<method 'upper' of 'str' objects>" — that
// is what Python prints when you evaluate the bound-method-slot object.
// For a missing attribute, returns "AttributeError: type object 'X' has
// no attribute 'Y'" to keep the demo self-explanatory.

const TYPE_ATTRS = {
  str: new Set([
    'upper', 'lower', 'title', 'capitalize', 'casefold', 'swapcase',
    'isdigit', 'isalpha', 'isalnum', 'isnumeric', 'isdecimal', 'isspace',
    'isupper', 'islower', 'istitle', 'isascii', 'isidentifier', 'isprintable',
    'find', 'rfind', 'index', 'rindex', 'count', 'startswith', 'endswith',
    'split', 'rsplit', 'splitlines', 'join', 'strip', 'lstrip', 'rstrip',
    'partition', 'rpartition',
    'replace', 'translate', 'maketrans', 'format', 'format_map',
    'encode', 'expandtabs', 'zfill',
    'center', 'ljust', 'rjust',
    'removeprefix', 'removesuffix',
  ]),
  list: new Set([
    'append', 'extend', 'insert', 'remove', 'pop', 'clear',
    'index', 'count', 'sort', 'reverse', 'copy',
  ]),
  dict: new Set([
    'keys', 'values', 'items', 'get', 'setdefault',
    'pop', 'popitem', 'clear', 'copy', 'update', 'fromkeys',
  ]),
  int: new Set([
    'bit_length', 'bit_count', 'to_bytes', 'from_bytes',
    'as_integer_ratio', 'conjugate', 'real', 'imag', 'numerator', 'denominator',
  ]),
  set: new Set([
    'add', 'discard', 'remove', 'pop', 'clear', 'copy',
    'union', 'intersection', 'difference', 'symmetric_difference',
    'update', 'intersection_update', 'difference_update', 'symmetric_difference_update',
    'issubset', 'issuperset', 'isdisjoint',
  ]),
  tuple: new Set([
    'index', 'count',
  ]),
  bytes: new Set([
    'decode', 'hex', 'fromhex',
    'find', 'rfind', 'index', 'rindex', 'count', 'startswith', 'endswith',
    'split', 'rsplit', 'splitlines', 'join', 'strip', 'lstrip', 'rstrip',
    'replace', 'translate', 'maketrans',
    'upper', 'lower', 'title', 'capitalize', 'swapcase',
    'isdigit', 'isalpha', 'isalnum', 'isspace', 'isupper', 'islower', 'istitle',
    'center', 'ljust', 'rjust', 'zfill',
    'removeprefix', 'removesuffix',
  ]),
};

export default function pyGetAttr(typeName, attrName) {
  const t = String(typeName == null ? '' : typeName).trim();
  const a = String(attrName == null ? '' : attrName).trim();
  if (!t || !a) return `AttributeError: attribute name is empty`;

  const attrs = TYPE_ATTRS[t];
  if (!attrs) return `AttributeError: unknown type '${t}'`;

  if (attrs.has(a)) {
    return `<method '${a}' of '${t}' objects>`;
  }
  return `AttributeError: type object '${t}' has no attribute '${a}'`;
}
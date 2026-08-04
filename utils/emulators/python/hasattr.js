// utils/emulators/python/hasattr.js
//
// Emulator for Python hasattr(object, name). The demo cannot pass real
// Python objects, so we check against a curated map of common built-in
// type attributes. Users type a type name (str/list/dict/int/set/tuple)
// and an attribute name.
//
// A subset of the most commonly-taught methods on each type. Any
// attribute not in the map for that type returns false — matching
// Python behavior for real missing attributes.

const TYPE_ATTRS = {
  str: new Set([
    // Case
    'upper', 'lower', 'title', 'capitalize', 'casefold', 'swapcase',
    // Is-check family
    'isdigit', 'isalpha', 'isalnum', 'isnumeric', 'isdecimal', 'isspace',
    'isupper', 'islower', 'istitle', 'isascii', 'isidentifier', 'isprintable',
    // Search / find
    'find', 'rfind', 'index', 'rindex', 'count', 'startswith', 'endswith',
    // Split / join / strip
    'split', 'rsplit', 'splitlines', 'join', 'strip', 'lstrip', 'rstrip',
    'partition', 'rpartition',
    // Modify
    'replace', 'translate', 'maketrans', 'format', 'format_map',
    'encode', 'expandtabs', 'zfill',
    // Padding
    'center', 'ljust', 'rjust',
    // 3.9+
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

export default function pyHasAttr(typeName, attrName) {
  const t = String(typeName == null ? '' : typeName).trim();
  const a = String(attrName == null ? '' : attrName).trim();
  if (!t || !a) return false;

  const attrs = TYPE_ATTRS[t];
  if (!attrs) return false;
  return attrs.has(a);
}
// utils/emulators/python/dir.js
//
// Emulator for Python dir(object). The demo takes a type name and
// returns the PUBLIC attributes sorted alphabetically — matching what
// filtering dunders out of Python's dir() would give.
//
// Real Python dir() also includes dunder methods; we skip them here so
// the demo output is readable. The demoExplainer notes this.

const TYPE_ATTRS = {
  str: [
    'capitalize', 'casefold', 'center', 'count', 'encode', 'endswith',
    'expandtabs', 'find', 'format', 'format_map', 'index',
    'isalnum', 'isalpha', 'isascii', 'isdecimal', 'isdigit',
    'isidentifier', 'islower', 'isnumeric', 'isprintable', 'isspace',
    'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans',
    'partition', 'removeprefix', 'removesuffix', 'replace', 'rfind',
    'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split',
    'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate',
    'upper', 'zfill',
  ],
  list: [
    'append', 'clear', 'copy', 'count', 'extend', 'index',
    'insert', 'pop', 'remove', 'reverse', 'sort',
  ],
  dict: [
    'clear', 'copy', 'fromkeys', 'get', 'items', 'keys', 'pop',
    'popitem', 'setdefault', 'update', 'values',
  ],
  set: [
    'add', 'clear', 'copy', 'difference', 'difference_update',
    'discard', 'intersection', 'intersection_update', 'isdisjoint',
    'issubset', 'issuperset', 'pop', 'remove',
    'symmetric_difference', 'symmetric_difference_update', 'union', 'update',
  ],
  int: [
    'as_integer_ratio', 'bit_count', 'bit_length', 'conjugate',
    'denominator', 'from_bytes', 'imag', 'numerator', 'real', 'to_bytes',
  ],
  tuple: ['count', 'index'],
  bytes: [
    'capitalize', 'center', 'count', 'decode', 'endswith', 'expandtabs',
    'find', 'fromhex', 'hex', 'index',
    'isalnum', 'isalpha', 'isascii', 'isdigit', 'islower', 'isspace',
    'istitle', 'isupper', 'join', 'ljust', 'lower', 'lstrip', 'maketrans',
    'partition', 'removeprefix', 'removesuffix', 'replace', 'rfind',
    'rindex', 'rjust', 'rpartition', 'rsplit', 'rstrip', 'split',
    'splitlines', 'startswith', 'strip', 'swapcase', 'title', 'translate',
    'upper', 'zfill',
  ],
};

export default function pyDir(typeName) {
  const t = String(typeName == null ? '' : typeName).trim();
  if (!t) return [];
  const attrs = TYPE_ATTRS[t];
  if (!attrs) return [];
  return [...attrs].sort();
}
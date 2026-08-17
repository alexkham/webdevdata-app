// utils/emulators/python/object.js
//
// Emulator for Python object(). Real object() has no meaningful state
// to display beyond "unique instance". The demo picks a PATTERN and
// shows a worked example demonstrating the concept.

const SAMPLES = {
  'sentinel': [
    '# Sentinel pattern — distinguish "not passed" from None:',
    '_MISSING = object()',
    '',
    'def fetch(key, default=_MISSING):',
    '    if key in cache:',
    '        return cache[key]',
    '    if default is _MISSING:',
    '        raise KeyError(key)',
    '    return default',
    '',
    '# Now None is a valid explicit default:',
    'fetch("k")           # KeyError',
    'fetch("k", None)     # returns None (as passed)',
    'fetch("k", "fallback") # returns "fallback"',
  ].join('\n'),

  'base': [
    '# In Python 3, every class inherits from object implicitly:',
    'class C:',
    '    pass',
    '',
    'C.__mro__',
    '# → (C, object)',
    '',
    'issubclass(C, object)',
    '# → True',
    '',
    '# Explicit form (Python 2 vestige — same result):',
    'class D(object):',
    '    pass',
  ].join('\n'),

  'no-attrs': [
    '# object() instances have NO writable __dict__:',
    'x = object()',
    'x.foo = 1',
    "# → AttributeError: 'object' object has no attribute 'foo'",
    '',
    '# For a lightweight class with attributes, use a bare class:',
    'class Bag:',
    '    pass',
    '',
    'b = Bag()',
    'b.foo = 1     # works',
    'b.bar = 2     # works',
  ].join('\n'),

  'identity': [
    '# Every call to object() creates a UNIQUE instance:',
    'a = object()',
    'b = object()',
    '',
    'a is b',
    '# → False   (always different objects)',
    '',
    'a == b',
    '# → False   (default __eq__ is identity)',
    '',
    'a == a',
    '# → True    (self-identity)',
  ].join('\n'),
};

export default function pyObject(pattern) {
  const p = String(pattern == null ? '' : pattern).trim() || 'sentinel';
  return SAMPLES[p] !== undefined ? SAMPLES[p] : SAMPLES['sentinel'];
}
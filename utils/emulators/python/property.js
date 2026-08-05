// utils/emulators/python/property.js
//
// Emulator for Python @property. Real property is a descriptor — no
// meaningful single-input output. The demo picks a PATTERN and shows a
// worked example demonstrating that scenario.

const SAMPLES = {
  'read-only': [
    'class Circle:',
    '    def __init__(self, r):',
    '        self._r = r',
    '',
    '    @property',
    '    def area(self):',
    '        return 3.14159 * self._r ** 2',
    '',
    '# Reads work as attribute access:',
    'Circle(3).area',
    '# → 28.27431',
    '',
    '# Writes fail — no setter defined:',
    'Circle(3).area = 42',
    "# → AttributeError: can't set attribute",
  ].join('\n'),

  'computed': [
    'class Rect:',
    '    def __init__(self, w, h):',
    '        self.width, self.height = w, h',
    '',
    '    @property',
    '    def area(self):',
    '        return self.width * self.height',
    '',
    '# area is derived, not stored:',
    'r = Rect(3, 4)',
    'r.area',
    '# → 12',
    'r.width = 10',
    'r.area',
    '# → 40   (recomputed on every read)',
  ].join('\n'),

  'validated': [
    'class Age:',
    '    def __init__(self, value):',
    '        self.value = value    # goes through the setter',
    '',
    '    @property',
    '    def value(self):',
    '        return self._value',
    '',
    '    @value.setter',
    '    def value(self, v):',
    '        if v < 0:',
    '            raise ValueError("age must be non-negative")',
    '        self._value = v',
    '',
    '# Valid:',
    'Age(30).value',
    '# → 30',
    '',
    '# Invalid:',
    'Age(-1)',
    '# → ValueError: age must be non-negative',
  ].join('\n'),

  'full': [
    'class Temperature:',
    '    def __init__(self, c=0):',
    '        self._c = c',
    '',
    '    @property',
    '    def celsius(self):',
    '        return self._c',
    '',
    '    @celsius.setter',
    '    def celsius(self, v):',
    '        self._c = v',
    '',
    '    @celsius.deleter',
    '    def celsius(self):',
    '        del self._c',
    '',
    '# All three access patterns:',
    't = Temperature(20)',
    't.celsius        # → 20',
    't.celsius = 25   # → runs setter',
    'del t.celsius    # → runs deleter',
  ].join('\n'),
};

export default function pyProperty(pattern) {
  const p = String(pattern == null ? '' : pattern).trim() || 'read-only';
  return SAMPLES[p] !== undefined ? SAMPLES[p] : SAMPLES['read-only'];
}
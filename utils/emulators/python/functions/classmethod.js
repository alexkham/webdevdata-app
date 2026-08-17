// utils/emulators/python/classmethod.js
//
// Emulator for Python classmethod. Real classmethod is a descriptor —
// there's no meaningful "output" to display for a single input. The
// demo picks a PATTERN and shows a small worked example so the reader
// sees the decorator's effect.

const SAMPLES = {
  'alt-constructor': [
    'class Point:',
    '    def __init__(self, x, y):',
    '        self.x, self.y = x, y',
    '',
    '    @classmethod',
    '    def from_string(cls, s):',
    '        x, y = map(int, s.split(","))',
    '        return cls(x, y)',
    '',
    '# Usage:',
    'Point.from_string("3,4")',
    '# → Point(3, 4)',
  ].join('\n'),

  'subclass-aware': [
    'class Base:',
    '    @classmethod',
    '    def make(cls):',
    '        return cls()',
    '',
    'class Sub(Base):',
    '    pass',
    '',
    '# The subclass gets its own type — because cls is Sub here:',
    'type(Sub.make()) is Sub',
    '# → True',
    'type(Base.make()) is Base',
    '# → True',
  ].join('\n'),

  'registry': [
    'class Registry:',
    '    _entries = {}',
    '',
    '    @classmethod',
    '    def register(cls, name, value):',
    '        cls._entries[name] = value',
    '',
    '    @classmethod',
    '    def get(cls, name):',
    '        return cls._entries.get(name)',
    '',
    '# Usage — no instance required:',
    'Registry.register("api", "v2")',
    'Registry.get("api")',
    '# → "v2"',
  ].join('\n'),

  'vs-static': [
    'class Math:',
    '    PI = 3.14159',
    '',
    '    @classmethod',
    '    def circle_area(cls, r):',
    '        # can read class attrs via cls',
    '        return cls.PI * r * r',
    '',
    '    @staticmethod',
    '    def square_area(side):',
    '        # no access to class or instance',
    '        return side * side',
    '',
    '# Both callable on the class; only classmethod gets cls:',
    'Math.circle_area(2)   # 12.566...',
    'Math.square_area(3)   # 9',
  ].join('\n'),
};

export default function pyClassMethod(pattern) {
  const p = String(pattern == null ? '' : pattern).trim() || 'alt-constructor';
  return SAMPLES[p] !== undefined ? SAMPLES[p] : SAMPLES['alt-constructor'];
}
// utils/emulators/python/staticmethod.js
//
// Emulator for Python staticmethod. Like classmethod, real staticmethod
// is a descriptor — no meaningful single-input output. The demo picks
// a PATTERN and shows a worked example so the reader sees the
// decorator's effect (or absence of magic).

const SAMPLES = {
  'utility': [
    'class ImagePath:',
    '    def __init__(self, path):',
    '        self.path = path',
    '',
    '    @staticmethod',
    '    def valid_extension(name):',
    '        return name.lower().endswith((".png", ".jpg"))',
    '',
    '# No self, no cls — just a helper:',
    'ImagePath.valid_extension("photo.jpg")',
    '# → True',
    'ImagePath("x").valid_extension("y.png")',
    '# → True   (called via instance still works)',
  ].join('\n'),

  'namespace': [
    'class TextUtils:',
    '    @staticmethod',
    '    def slugify(s):',
    '        return "-".join(s.lower().split())',
    '',
    '    @staticmethod',
    '    def word_count(s):',
    '        return len(s.split())',
    '',
    '# Grouped for discoverability, no state involved:',
    'TextUtils.slugify("Hello World")',
    '# → "hello-world"',
    'TextUtils.word_count("one two three")',
    '# → 3',
  ].join('\n'),

  'vs-classmethod': [
    'class Circle:',
    '    PI = 3.14159',
    '',
    '    @classmethod',
    '    def area(cls, r):',
    '        return cls.PI * r * r    # cls gives access to PI',
    '',
    '    @staticmethod',
    '    def to_diameter(r):',
    '        return 2 * r              # nothing class-related',
    '',
    '# classmethod reaches into the class; staticmethod does not.',
    'Circle.area(2)         # 12.566...',
    'Circle.to_diameter(3)  # 6',
  ].join('\n'),

  'no-magic': [
    'class C:',
    '    @staticmethod',
    '    def greet(name):',
    '        return f"hi {name}"',
    '',
    '# staticmethod passes NO implicit first argument:',
    'C.greet("Alice")',
    '# → "hi Alice"',
    'C().greet("Bob")',
    '# → "hi Bob"   (called via instance — Bob is the ONLY arg)',
    '',
    '# Contrast with a regular method:',
    'class D:',
    '    def greet(self, name):',
    '        return f"hi {name}"',
    '# D().greet("Alice") — self is the instance, "Alice" is name',
  ].join('\n'),
};

export default function pyStaticMethod(pattern) {
  const p = String(pattern == null ? '' : pattern).trim() || 'utility';
  return SAMPLES[p] !== undefined ? SAMPLES[p] : SAMPLES['utility'];
}
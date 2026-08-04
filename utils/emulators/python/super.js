// utils/emulators/python/super.js
//
// Emulator for Python super(). The demo takes a SCENARIO name and shows
// what super() would resolve to in a small example — the key teaching
// idea is that super() follows the MRO, not any hard-coded "parent"
// relationship.

const SAMPLES = {
  'init': [
    'class Person:',
    '    def __init__(self, name):',
    '        self.name = name',
    '',
    'class Employee(Person):',
    '    def __init__(self, name, salary):',
    '        super().__init__(name)  # calls Person.__init__',
    '        self.salary = salary',
    '',
    '# Employee("Alice", 50000)',
    '# → runs Person.__init__ (self.name = "Alice"), then sets self.salary',
  ].join('\n'),

  'single': [
    'class Talker:',
    '    def speak(self): return "hello"',
    '',
    'class Loud(Talker):',
    '    def speak(self):',
    '        return super().speak().upper()  # extends parent',
    '',
    '# Loud().speak()',
    '# → "HELLO"',
  ].join('\n'),

  'diamond': [
    'class A:',
    '    def do(self): print("A")',
    '',
    'class B(A):',
    '    def do(self): print("B"); super().do()',
    '',
    'class C(A):',
    '    def do(self): print("C"); super().do()',
    '',
    'class D(B, C):',
    '    def do(self): print("D"); super().do()',
    '',
    '# D.__mro__ = (D, B, C, A, object)',
    '# D().do()',
    '# → prints D, B, C, A  (super() follows the MRO)',
  ].join('\n'),

  'method': [
    'class Base:',
    '    def greet(self): return "hi"',
    '',
    'class Enthusiastic(Base):',
    '    def greet(self):',
    '        return super().greet() + "!"',
    '',
    '# Enthusiastic().greet()',
    '# → "hi!"',
  ].join('\n'),
};

export default function pySuper(scenario) {
  const s = String(scenario == null ? '' : scenario).trim() || 'init';
  return SAMPLES[s] !== undefined ? SAMPLES[s] : SAMPLES['init'];
}
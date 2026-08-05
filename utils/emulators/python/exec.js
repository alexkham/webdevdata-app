// utils/emulators/python/exec.js
//
// Emulator for Python exec(). Real exec runs arbitrary code; the
// emulator describes what would happen for each demo case rather than
// trying to be a Python interpreter. Real Python exec always returns
// None — the demo shows that plus a narrative description.

const DESCRIPTIONS = {
  'x = 1':
    'None\n# side effect: creates x = 1 in the target namespace',
  'a = 1; b = 2; c = a + b':
    'None\n# side effect: sets a=1, b=2, c=3 in the target namespace',
  'def add(a, b):\n    return a + b':
    'None\n# side effect: defines a function named `add` in the target namespace',
  'total = 0\nfor i in range(5):\n    total += i':
    'None\n# side effect: sets total = 10 in the target namespace',
  'import math':
    'None\n# side effect: binds `math` in the target namespace',
  'print("hello")':
    'None\n# side effect: prints "hello" to stdout',
};

export default function pyExec(code) {
  const c = String(code == null ? '' : code);
  const trimmed = c.trim();
  if (trimmed === '') return 'None';

  const desc = DESCRIPTIONS[trimmed];
  if (desc) return desc;

  return [
    'None',
    '# exec() would run this code in the target namespace.',
    '# The demo describes rather than executes — for the real thing,',
    '# run Python directly. Do NOT call exec on untrusted input.',
  ].join('\n');
}
// content/reference/python/functions/oct.js

export const meta = {
  slug:        'oct',
  name:        'oct',
  signature:   'oct(x)',
  blurb:       'Integer to octal literal string, with the "0o" prefix.',
  category:    'builtin',
  type:        'builtin',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'oct octal base 8 convert integer string representation prefix 0o file permissions chmod',
};

export const method = {
  slug:      'oct',
  name:      'oct',
  signature: 'oct(x)',
  returns:   { type: 'str', desc: 'A string in Python integer literal form: "0o" prefix, digits 0..7. Negatives get a "-0o" prefix.' },

  category:    'Built-in function',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Convert an integer to its octal literal form — a string, not a number. Best known from Unix file permissions.',

  cheat: {
    commonCall: 'oct(0o755)  # "0o755"',
    returns:    'a str with "0o" prefix',
    replaces:   'format(n, "o") when you also want the prefix',
    watchOut:   'floats are rejected — use int() first',
  },

  parameters: [
    { name: 'x', type: 'int', required: true, default: null, desc: 'Any integer (positive, negative, or zero). Objects with __index__ also accepted. Floats raise TypeError.' },
  ],

  demoParams: [
    { name: 'x', type: 'int', hint: 'the integer', input: 'number' },
  ],
  cases: [
    { id: 'small',    label: 'small',           values: { x: 8 } },
    { id: 'zero',     label: 'zero',            values: { x: 0 } },
    { id: 'perm-755', label: 'chmod 755',       values: { x: 493 } },
    { id: 'perm-644', label: 'chmod 644',       values: { x: 420 } },
    { id: 'byte',     label: 'byte 255',        values: { x: 255 } },
    { id: 'negative', label: 'negative',        values: { x: -8 } },
  ],
  demoExplainer: 'oct returns a STRING in the same form you would type an octal integer literal: "0o" prefix, digits 0..7. Negatives get a leading "-". This is a formatter, not a math operation — the value does not change, only its representation. Octal permissions like 0o755 read the same way in the source and in the output.',

  patterns: [
    {
      name: 'Display file permissions',
      desc: 'os.stat returns permissions as an integer; oct makes them readable.',
      code: 'import os, stat\nmode = os.stat(path).st_mode\nprint(oct(stat.S_IMODE(mode)))',
    },
    {
      name: 'Round-trip via int',
      desc: 'oct → str, int with base=8 → back. The prefix is optional on parse.',
      code: 's = oct(0o755)     # "0o755"\nn = int(s, 8)      # 493',
    },
    {
      name: 'Octal without the prefix',
      desc: 'When you only want the digits, format is cleaner and lets you pad.',
      code: 'digits = format(0o755, "o")     # "755"\npadded = format(0o12,  "04o")    # "0012"',
    },
  ],

  examples: [
    { title: 'Small integer',    code: 'oct(8)',         returns: '"0o10"' },
    { title: 'Zero',             code: 'oct(0)',         returns: '"0o0"' },
    { title: 'Unix chmod 755',   code: 'oct(0o755)',     returns: '"0o755"' },
    { title: 'Negative',         code: 'oct(-8)',        returns: '"-0o10"' },
    { title: 'Float raises',     code: 'oct(1.5)',       returns: 'TypeError: &apos;float&apos; object cannot be interpreted as an integer' },
  ],

  pitfalls: [
    {
      name: 'The "0o" prefix is included',
      desc: 'Great for Python literals; in the way when you want a fixed-width octal dump or file-permission string without the prefix.',
      wrong: { label: 'Prefix included', code: 'oct(0o755)', output: '"0o755"' },
      fix:   { label: 'No prefix via format', code: 'format(0o755, "o")', output: '"755"' },
    },
    {
      name: 'Floats are rejected',
      desc: 'oct only accepts integers. Truncate or round first.',
      wrong: { label: 'Type error', code: 'oct(1.5)', output: "TypeError: 'float' object cannot be interpreted as an integer" },
      fix:   { label: 'Truncate first', code: 'oct(int(1.5))', output: '"0o1"' },
    },
    {
      name: 'Python 2 vs Python 3 prefix',
      desc: 'Python 2 used no prefix or just "0"; Python 3 uses "0o". Legacy code may parse the wrong form.',
      wrong: { label: 'Python 2 form', code: 'int("0755", 8)  # works in both', output: '493' },
      fix:   { label: 'Python 3 preferred', code: 'int("0o755", 8)  # explicit prefix', output: '493' },
    },
    {
      name: 'Result is a str, not a number',
      desc: 'You cannot do arithmetic on the octal string. Parse it back if needed.',
      wrong: { label: 'Type error',  code: 'oct(7) + 1', output: 'TypeError: can only concatenate str (not "int") to str' },
      fix:   { label: 'Parse back',  code: 'int(oct(7), 8) + 1', output: '8' },
    },
  ],

  when: {
    use: [
      'Displaying Unix file permissions in human form',
      'Round-trippable output that int(s, 8) can parse back',
      'Diagnostic messages where the prefix aids reading',
    ],
    avoid: [
      'No prefix wanted → format(n, "o")',
      'Fixed width / padding → format(n, "0No")',
      'Bytes → bytes.hex() or bin/hex for byte values',
      'Floats → truncate first',
    ],
  },

  notes: {
    complexity: 'O(log n) in the number of digits',
    return:     'str — always with "0o" (or "-0o") prefix',
    cpython:    'Python/bltinmodule.c :: builtin_oct — delegates to __index__ then formats',
    memory:     'Allocates one small string',
    threadSafe: 'Yes — a pure computation',
  },

  related: [
    { name: 'hex',    slug: 'hex',    when: 'Base 16 instead of base 8' },
    { name: 'bin',    slug: 'bin',    when: 'Base 2 instead of base 8' },
    { name: 'int',    slug: 'int',    when: 'Parse the string back to an integer (base=8)' },
  ],

  faq: [
    {
      q: 'Why did the "0o" prefix appear in Python 3?',
      a: 'Python 2 allowed both leading "0" and "0o" as octal literals — but "0" was ambiguous with integer literals starting with zero. Python 3 removed the "0" form to eliminate the ambiguity; oct() and int(s, 8) both use "0o" now.',
    },
    {
      q: 'How do I use oct for file permissions?',
      a: 'os.stat returns the mode as an integer that includes file-type bits. Mask with stat.S_IMODE to get just the permission bits, then oct() to display.',
      code: 'import os, stat\nmode = os.stat(path).st_mode\nprint(oct(stat.S_IMODE(mode)))\n# "0o755"',
    },
    {
      q: 'What is the difference between oct(), hex(), and bin()?',
      a: 'Same shape, different base. oct: base 8, "0o" prefix. hex: base 16, "0x" prefix. bin: base 2, "0b" prefix. All three are formatters that return strings; none changes the value.',
    },
  ],

  history: [
    { version: '1.0', note: 'oct() has been a builtin since Python 1.0.' },
    { version: '3.0', note: 'Prefix changed to "0o" — matching the new octal literal syntax; the bare "0" form was removed to eliminate ambiguity.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/functions.html#oct',
    meta:  'oct',
  },

  tryInTool: [
    { name: 'Base64', href: '/tools/base64', meta: 'Adjacent byte-encoding work' },
  ],
};
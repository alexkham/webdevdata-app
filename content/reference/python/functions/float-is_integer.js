// content/reference/python/functions/float-is_integer.js
//
// Slug is type-prefixed: `is_integer` collides with int.is_integer.

export const meta = {
  slug:        'float-is_integer',
  name:        'float.is_integer',
  signature:   'float.is_integer()',
  blurb:       'True when the float has no fractional part — 4.0 yes, 4.5 no.',
  category:    'float',
  type:        'float',
  hasLiveDemo: true,
  version:     'Python 2.6+',
  searchTerms: 'is integer whole number check float fractional part decimal round trip',
};

export const method = {
  slug:      'float-is_integer',
  name:      'float.is_integer',
  signature: 'float.is_integer()',
  returns:   { type: 'bool', desc: 'True if the float is exactly a whole number. False for anything with a fractional part, and False for inf and nan.' },

  category:    'Float method',
  version:     'Python 2.6+',
  hasLiveDemo: true,

  subtitle: 'The version of is_integer that can actually say False. It asks about the VALUE, not the type — 4.0 is a whole number that is still a float.',

  cheat: {
    commonCall: 'x.is_integer()',
    returns:    'bool — True when nothing is lost by converting to int',
    replaces:   'x == int(x), which raises on inf and nan',
    watchOut:   'True does not mean the object is an int — 4.0 is still a float',
  },

  parameters: [],

  demoParams: [
    { name: 'n', type: 'float', hint: 'a number, e.g. 4.0 or 4.5', input: 'float' },
  ],
  demoTemplate: 'float({n}).is_integer()',
  cases: [
    { id: 'whole',    label: 'whole (4.0)',     values: { n: 4.0 } },
    { id: 'fraction', label: 'fractional (4.5)',values: { n: 4.5 } },
    { id: 'zero',     label: 'zero',            values: { n: 0.0 } },
    { id: 'negative', label: 'negative whole',  values: { n: -2.0 } },
    { id: 'tiny',     label: 'small fraction',  values: { n: 0.25 } },
  ],
  demoExplainer: 'is_integer asks whether the float sits exactly on a whole number. 4.0 does, so it is True; 4.5 does not, so it is False. Negative whole numbers count, and so does zero. The demo wraps the input in float() so the call preview is unambiguous — 4 and 4.0 are the same value in the demo box, but only one of them is a float in Python.',

  patterns: [
    {
      name: 'Convert only when it is safe',
      desc: 'Guards the int() call so nothing is silently truncated.',
      code: 'if x.is_integer():\n    n = int(x)\nelse:\n    raise ValueError("expected a whole number")',
    },
    {
      name: 'Validate parsed JSON numbers',
      desc: 'JSON gives floats for anything with a decimal point; this checks the value, not the type.',
      code: 'if not qty.is_integer():\n    raise ValueError("quantity must be whole")',
    },
    {
      name: 'Format whole floats without the .0',
      desc: 'Prints 4 rather than 4.0 when there is nothing after the point.',
      code: 'text = str(int(x)) if x.is_integer() else str(x)',
    },
  ],

  examples: [
    { title: 'Whole float',     code: '(4.0).is_integer()',        returns: 'True' },
    { title: 'Has a fraction',  code: '(4.5).is_integer()',        returns: 'False' },
    { title: 'Zero',            code: '(0.0).is_integer()',        returns: 'True' },
    { title: 'Negative whole',  code: '(-2.0).is_integer()',       returns: 'True' },
    { title: 'Infinity is not', code: "float('inf').is_integer()", returns: 'False' },
    { title: 'Still a float',   code: 'type(4.0)',                 returns: "<class 'float'>" },
  ],

  pitfalls: [
    {
      name: 'True does not mean you have an int',
      desc: 'The name invites a type reading. 4.0 is a whole NUMBER but still a float object, so isinstance checks and repr output are unaffected by a True answer.',
      wrong: { label: 'Not a type test', code: 'x = 4.0\nx.is_integer(), isinstance(x, int)', output: '(True, False)' },
      fix:   { label: 'Convert if you need one', code: 'n = int(x) if x.is_integer() else None', output: '4, a real int' },
    },
    {
      name: 'Float error can make the answer surprising',
      desc: 'Arithmetic that should land on a whole number sometimes lands next to it. is_integer reports the value you actually have, not the one you intended.',
      wrong: { label: 'Not quite whole', code: '(0.1 * 3 * 10).is_integer()', output: 'False  # it is 3.0000000000000004' },
      fix:   { label: 'Round first',     code: 'round(0.1 * 3 * 10, 9).is_integer()', output: 'True' },
    },
    {
      name: 'inf and nan are False, not errors',
      desc: 'Neither is a whole number, so both answer False rather than raising. That is friendlier than x == int(x), which raises on both.',
      wrong: { label: 'The old idiom raises', code: "x = float('inf')\nx == int(x)", output: 'OverflowError: cannot convert float infinity to integer' },
      fix:   { label: 'is_integer copes',     code: "float('inf').is_integer()", output: 'False' },
    },
    {
      name: 'Large floats are all whole',
      desc: 'Above 2 ** 53 consecutive floats are more than 1 apart, so every value is whole. is_integer returns True even though the number lost precision long ago.',
      wrong: { label: 'Misleading True', code: '(1e300).is_integer()', output: 'True' },
      fix:   { label: 'Check magnitude too', code: 'x.is_integer() and abs(x) < 2 ** 53', output: 'whole AND exact' },
    },
  ],

  when: {
    use: [
      'Deciding whether int(x) would lose anything',
      'Validating that a parsed number is a whole count',
      'Formatting output without a trailing .0',
      'Replacing x == int(x), which raises on inf and nan',
    ],
    avoid: [
      'You want a TYPE check → isinstance(x, int)',
      'The value came from float arithmetic → round first',
      'Money or exact decimals → decimal.Decimal',
    ],
  },

  notes: {
    complexity: 'O(1) — compares the value against its own floor',
    return:     'A bool; False for inf and nan rather than an exception',
    cpython:    'Objects/floatobject.c :: float_is_integer',
    memory:     'No allocation — True and False are singletons',
    threadSafe: 'Yes — floats are immutable',
  },

  related: [
    { name: 'int.is_integer', slug: 'int-is_integer', when: 'The int version, which is always True' },
    { name: 'round',          slug: 'round',          when: 'Make a value whole rather than testing it' },
    { name: 'int',            slug: 'int',            when: 'Actually perform the conversion' },
    { name: 'float',          slug: 'float',          when: 'Build the float in the first place' },
  ],

  faq: [
    {
      q: 'Why not just use x == int(x)?',
      a: 'It works for ordinary numbers but raises OverflowError on inf and ValueError on nan, because int() cannot convert either. is_integer answers False for both, so it needs no guard.',
      code: "float('inf').is_integer()   # False\nint(float('inf'))           # OverflowError",
    },
    {
      q: 'Why does 0.1 * 3 * 10 report False?',
      a: 'Because the result is 3.0000000000000004, not 3.0 — binary floats cannot hold 0.1 exactly, and the error survives the arithmetic. is_integer is telling you the truth about the value you have.',
      code: '0.1 * 3 * 10\n# 3.0000000000000004',
    },
    {
      q: 'Does it work on an int?',
      a: 'Since Python 3.12, yes — int gained the same method, and it always returns True. That is the point of the shared name: you can call it on either type without checking which you hold.',
      code: '[v.is_integer() for v in (4, 4.0, 4.5)]\n# [True, True, False]',
    },
  ],

  history: [
    { version: '2.6', note: 'float.is_integer added.' },
    { version: '3.12', note: 'int gained a matching is_integer, so both numeric types now answer.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#float.is_integer',
    meta:  'float.is_integer',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect parsed numeric data' },
  ],
};

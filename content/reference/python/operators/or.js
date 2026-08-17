// content/reference/python/operators/or.js

export const meta = {
  slug:        'or',
  name:        'or',
  signature:   'a or b',
  blurb:       'Logical OR — short-circuits and returns an operand; the default-value idiom.',
  category:    'logical',
  type:        'operator',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'or logical boolean short circuit default fallback operator',
};

export const method = {
  slug:      'or',
  name:      'or',
  signature: 'a or b',
  returns:   { type: 'Any', desc: 'a when a is truthy, otherwise b — an OPERAND, not necessarily a bool. b is never evaluated when a is truthy.' },

  category:    'Logical operator',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Either suffices — and because it returns operands, `x or default` is Python’s classic fallback idiom.',

  cheat: {
    commonCall: 'name = raw or "anonymous"',
    returns:    'first truthy operand, else the last operand',
    replaces:   '"" or "default" is \'default\'',
    watchOut:   'falsy-but-valid values (0, "", []) get replaced too',
  },

  parameters: [
    { name: 'a', type: 'Any', required: true, default: null, desc: 'Left operand — returned when truthy; b never runs then.' },
    { name: 'b', type: 'Any', required: true, default: null, desc: 'Right operand — the fallback.' },
  ],

  demoParams: [
    { name: 'a', type: 'Any', hint: 'empty = falsy', input: 'text' },
    { name: 'b', type: 'Any', hint: 'fallback',      input: 'text' },
  ],
  demoTemplate: '{a} or {b}',
  cases: [
    { id: 'default', label: 'a truthy',  values: { a: 'value', b: 'default' } },
    { id: 'fallback', label: 'a falsy',  values: { a: '', b: 'default' } },
    { id: 'both',    label: 'both falsy', values: { a: '', b: '' } },
  ],
  demoExplainer: 'Truthy a → a itself comes back and b is never evaluated. Falsy a (empty string) → b, whatever it is. That operand-returning behavior is what makes the `x or default` idiom work.',

  patterns: [
    {
      name: 'Default values',
      desc: 'The classic fallback — with the falsy caveat below.',
      code: 'display_name = user.nickname or user.username',
    },
    {
      name: 'First truthy of several',
      desc: 'Chains left to right, stops at the first truthy value.',
      code: 'config = cli_arg or env_var or DEFAULT',
    },
  ],

  examples: [
    { title: 'Truthy left wins',        code: '"value" or "default"', returns: "'value'" },
    { title: 'Falsy left falls back',   code: '"" or "default"',      returns: "'default'" },
    { title: 'Chained fallbacks',       code: '0 or "" or "last"',    returns: "'last'" },
  ],

  pitfalls: [
    {
      name: 'Falsy-but-valid values get replaced',
      desc: '0, "", and [] are legitimate data — or cannot tell them from missing.',
      wrong: { label: 'Data lost', code: 'port = config_port or 8080\n# config_port = 0 → 8080!', output: 'explicit 0 silently replaced' },
      fix:   { label: 'None-aware', code: 'port = config_port if config_port is not None else 8080', output: '0 preserved' },
    },
    {
      name: 'Side effects on the right may never run',
      desc: 'Short-circuiting skips b when a is truthy.',
      wrong: { label: 'Skipped call', code: 'cache.get(k) or fetch(k)   # fetch skipped on hit — intended?', output: 'depends — make it explicit' },
      fix:   { label: 'Explicit', code: 'v = cache.get(k)\nif v is None:\n    v = fetch(k)', output: 'intent visible' },
    },
  ],

  when: {
    use: [
      'Fallback defaults where falsy = missing',
      'First-truthy-wins chains',
      'Combined conditions in if/while',
    ],
    avoid: [
      '0/""/[] are valid data → explicit `is None` check',
      'Element-wise boolean ops on arrays → | (numpy/pandas)',
    ],
  },

  notes: {
    complexity: 'O(1) plus operand evaluation',
    return:     'an operand — a if truthy, else b',
    cpython:    'Compiled to JUMP_IF_TRUE_OR_POP — not a dunder method',
    memory:     'No allocation',
    threadSafe: 'Depends only on the operand expressions',
  },

  related: [
    { name: 'and', slug: 'and', when: 'Both must hold' },
    { name: 'not', slug: 'not', when: 'Negation' },
    { name: '|',   slug: 'bitwise-or', when: 'Bitwise OR — different operator' },
  ],

  faq: [
    {
      q: 'Does Python have a ?? (null-coalescing) operator?',
      a: 'No. `x or default` replaces ALL falsy values; the None-only equivalent is the conditional expression: x if x is not None else default.',
    },
    {
      q: 'Which operand does `a or b or c` return?',
      a: 'The first truthy one, or the very last operand when none are truthy.',
    },
  ],

  history: [
    { version: '1.0', note: 'Core operator from the beginning.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/expressions.html#boolean-operations',
    meta:  'boolean operations',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect condition data' },
    { name: 'Base64',         href: '/tools/base64',         meta: 'Encoding tasks' },
  ],
};

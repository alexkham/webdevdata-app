// content/reference/python/functions/dict-pop.js
//
// Slug is type-prefixed: `pop` exists on list, dict and set.

export const meta = {
  slug:        'dict-pop',
  name:        'dict.pop',
  signature:   'dict.pop(key[, default])',
  blurb:       'Remove a key and return its value, with an optional default.',
  category:    'dict',
  type:        'dict',
  hasLiveDemo: true,
  version:     'Python 2.0+',
  searchTerms: 'pop remove key dictionary delete return value',
};

export const method = {
  slug:      'dict-pop',
  name:      'dict.pop',
  signature: 'dict.pop(key[, default])',
  returns:   { type: 'Any', desc: 'The removed value; or default when the key is absent and a default was given. Absent key without default raises KeyError.' },

  category:    'Dict method',
  version:     'Python 2.0+',
  hasLiveDemo: true,

  subtitle: 'Remove a key and get its value back — with a default to make missing keys safe.',

  cheat: {
    commonCall: 'options.pop("debug", False)',
    returns:    'removed value or default; dict shrinks on hit',
    replaces:   'del d[key] removes without returning',
    watchOut:   'no default + missing key = KeyError',
  },

  parameters: [
    { name: 'key',     type: 'hashable', required: true,  default: null, desc: 'The key to remove.' },
    { name: 'default', type: 'Any',      required: false, default: '(no default)', desc: 'Returned when the key is absent. Without it, a missing key raises KeyError.' },
  ],

  demoParams: [
    { name: 'dict',    type: 'dict', hint: 'key: value pairs',       input: 'kv' },
    { name: 'key',     type: 'str',  hint: 'key to remove',          input: 'text' },
    { name: 'default', type: 'Any',  hint: 'empty = no default',     input: 'text-or-none' },
  ],
  cases: [
    { id: 'default', label: 'present',       values: { dict: 'a: 1, b: 2', key: 'a', default: '' } },
    { id: 'missing', label: 'missing',       values: { dict: 'a: 1, b: 2', key: 'z', default: '' } },
    { id: 'fallback', label: 'with default', values: { dict: 'a: 1, b: 2', key: 'z', default: 'n/a' } },
  ],
  demoExplainer: 'The demo shows the RETURN value. In real code a hit also removes the key — after {"a": 1}.pop("a") the dict is empty. Leave the default field empty to see the bare-pop KeyError.',

  patterns: [
    {
      name: 'Consume optional kwargs',
      desc: 'Take an option out of a dict, leaving only what remains.',
      code: 'debug = options.pop("debug", False)\n# options no longer contains "debug"',
    },
    {
      name: 'Rename a key',
      desc: 'pop + assignment in one line.',
      code: 'd["new_name"] = d.pop("old_name")',
    },
    {
      name: 'Remove-if-present',
      desc: 'The default makes removal unconditional and quiet.',
      code: 'cache.pop(session_id, None)',
    },
  ],

  examples: [
    { title: 'Pop an existing key',        code: '{"a": 1, "b": 2}.pop("a")',      returns: '1' },
    { title: 'Missing key with default',   code: '{"a": 1}.pop("z", 0)',           returns: '0' },
    { title: 'Default None as quiet remove', code: '{"a": 1}.pop("z", None)',      returns: 'None' },
  ],

  pitfalls: [
    {
      name: 'Bare pop on a missing key raises',
      desc: 'Pass a default whenever absence is a legal state.',
      wrong: { label: 'Raises', code: '{"a": 1}.pop("z")', output: "KeyError: 'z'" },
      fix:   { label: 'Fix', code: '{"a": 1}.pop("z", None)', output: 'None' },
    },
    {
      name: 'pop both mutates and returns',
      desc: 'Using it just to read a value silently deletes the key.',
      wrong: { label: 'Key lost', code: 'value = d.pop("k")\n# "k" is gone from d', output: 'dict is smaller now' },
      fix:   { label: 'Read without removing', code: 'value = d.get("k")', output: 'dict unchanged' },
    },
    {
      name: 'dict.pop vs list.pop',
      desc: 'Same name, different contracts: dicts pop by KEY with optional default; lists pop by INDEX with none.',
      wrong: { label: 'Wrong mental model', code: 'd.pop()  # lists allow this', output: 'TypeError: pop expected at least 1 argument, got 0' },
      fix:   { label: 'Dicts need the key', code: 'd.pop("k", None)', output: 'value or None' },
    },
  ],

  when: {
    use: [
      'Take-and-remove in one step (options, queues keyed by id)',
      'Quiet removal with a default',
      'Renaming keys',
    ],
    avoid: [
      'Read without removing → dict.get',
      'Remove without needing the value → del d[key]',
      'Remove an arbitrary item → dict.popitem',
    ],
  },

  notes: {
    complexity: 'O(1) average — hash lookup + delete',
    return:     'removed value or default; dict mutates on hit',
    cpython:    'Objects/dictobject.c :: dict_pop_impl',
    memory:     'May shrink the table on many deletions',
    threadSafe: 'No — mutating shared dicts needs a lock',
  },

  related: [
    { name: 'dict.get',        slug: 'get',        when: 'Read with a default, keep the key' },
    { name: 'dict.setdefault', slug: 'setdefault', when: 'Read with a default, STORE it too' },
    { name: 'list.pop',        slug: 'list-pop',   when: 'The list cousin — by index' },
  ],

  faq: [
    {
      q: 'What is the difference between pop and del?',
      a: 'pop returns the value and accepts a default for missing keys; del returns nothing and always raises on a missing key.',
      code: 'v = d.pop("k", None)  # value or None\ndel d["k"]            # raises if absent',
    },
    {
      q: 'Can default be None and still detect a missing key?',
      a: 'Not distinguishably — a stored None and the None default look identical. Use a private sentinel object when you must tell them apart.',
      code: '_MISSING = object()\nv = d.pop("k", _MISSING)\nif v is _MISSING: ...',
    },
    {
      q: 'What does popitem do?',
      a: 'Removes and returns the LAST inserted (key, value) pair — useful for destructive iteration in LIFO order.',
    },
  ],

  history: [
    { version: '2.0', note: 'Core dict method, unchanged semantics since.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#dict.pop',
    meta:  'dict.pop',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect dict data' },
    { name: 'JSON Tree',      href: '/tools/json-tree',      meta: 'Explore nested keys' },
  ],
};

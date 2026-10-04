// content/reference/python/exceptions/keyerror.js

export const meta = {
  slug:        'keyerror',
  name:        'KeyError',
  signature:   'KeyError(*args)',
  blurb:       'Raised when a dict (or other mapping) lookup uses a key that is not there.',
  category:    'lookup',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'keyerror key error dict missing key lookup mapping not found dictionary',
};

export const method = {
  slug:      'keyerror',
  name:      'KeyError',
  signature: 'KeyError(*args)',

  category:    'Lookup exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'd[key] on a key that is not in the dict. The message is the repr of the key — quotes included.',

  chain: ['BaseException', 'Exception', 'LookupError', 'KeyError'],

  cheat: {
    raisedBy: "d[key], del d[key], d.pop(key), set.remove(x)",
    message:  "repr(key) — KeyError: 'id', with the quotes",
    quickFix: 'd.get(key, default) or key in d',
    watchOut: 'str(e) is quoted; use e.args[0] for the raw key',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Normally exactly one: the key that was not found. Stored in e.args.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Index a dict with a key. Keys are exact: case and type both matter.',
      params: [{ name: 'key', type: 'str', hint: 'key to look up', input: 'text' }],
      template: "stock = {'apple': 3, 'pear': 0}\nstock[{$key}]",
      cases: [
        { id: 'present', label: 'present key', values: { key: 'apple' } },
        { id: 'missing', label: 'missing key', values: { key: 'plum' } },
        { id: 'case',    label: 'wrong case',  values: { key: 'Apple' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Raise it yourself. The message is repr() of the argument — a string key keeps its quotes.',
      params: [{ name: 'key', type: 'int | float | str', hint: 'numbers stay numbers', input: 'auto' }],
      template: 'raise KeyError({$key})',
      cases: [
        { id: 'str',   label: 'string key', values: { key: 'user_id' } },
        { id: 'int',   label: 'int key',    values: { key: '42' } },
        { id: 'empty', label: 'empty key',  values: { key: '' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Catch the miss and fall back. Note what {e} renders to inside the f-string.',
      params: [{ name: 'key', type: 'str', hint: 'key to look up', input: 'text' }],
      template: "stock = {'apple': 3, 'pear': 0}\ntry:\n    n = stock[{$key}]\nexcept KeyError as e:\n    n = f'no such item: {e}'\nn",
      cases: [
        { id: 'present', label: 'present key', values: { key: 'pear' } },
        { id: 'missing', label: 'missing key', values: { key: 'plum' } },
      ],
    },
  ],
  demoExplainer: "Look at the quotes: the missing key 'plum' prints as KeyError: 'plum', and f'{e}' gives 'plum' in quotes too. KeyError's str() is the repr of the key — that is how an empty-string key still shows up as KeyError: '' instead of a blank message.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: "The constructor arguments. args[0] is the missing key, unquoted — use it instead of str(e)." },
    { name: '__context__', type: 'BaseException | None', meaning: 'The exception being handled when this one was raised (implicit chaining).' },
    { name: '__cause__',   type: 'BaseException | None', meaning: 'Set by raise ... from ...; e.g. a domain error raised from the KeyError.' },
  ],

  patterns: [
    {
      name: 'Default instead of exception',
      desc: 'When a missing key is normal, ask for a default up front.',
      code: "timeout = settings.get('timeout', 30)",
    },
    {
      name: 'EAFP lookup',
      desc: 'Try the lookup and handle the miss — one hash lookup instead of two.',
      code: "try:\n    user = users[user_id]\nexcept KeyError:\n    user = load_user(user_id)",
    },
    {
      name: 'Translate to a domain error',
      desc: 'Hide the dict behind a meaningful error. from None drops the internal KeyError from the traceback; use from e to keep it as __cause__.',
      code: "def get_plugin(name):\n    try:\n        return registry[name]\n    except KeyError:\n        raise ValueError(f'unknown plugin: {name}') from None",
    },
  ],

  examples: [
    { title: 'Missing key',                code: "{'a': 1}['b']",                         returns: "KeyError: 'b'" },
    { title: 'str() is the repr of the key', code: "str(KeyError('b'))",                  returns: "\"'b'\"" },
    { title: 'e.args[0] is the raw key',   code: "try:\n    {'a': 1}['missing']\nexcept KeyError as e:\n    key = e.args[0]\nkey", returns: "'missing'" },
    { title: 'Caught as LookupError',      code: "try:\n    {}['x']\nexcept LookupError as e:\n    print(type(e).__name__)", returns: 'KeyError' },
    { title: 'get() never raises',         code: "d = {}\nd.get('x', 0)",                     returns: '0' },
    { title: 'defaultdict fills the gap',  code: "from collections import defaultdict\nd = defaultdict(int)\nd['x'] += 1\nd", returns: "defaultdict(<class 'int'>, {'x': 1})" },
    { title: 'set.remove raises it too',   code: "{1, 2}.remove(3)",                      returns: 'KeyError: 3' },
  ],

  pitfalls: [
    {
      name: 'str(e) adds quotes to the key',
      desc: 'Building a message from str(e) gives doubled-up quoting. The raw key is e.args[0].',
      wrong: { label: 'str(e)', code: "try:\n    {}['id']\nexcept KeyError as e:\n    msg = 'missing field ' + str(e)\nmsg", output: "\"missing field 'id'\"" },
      fix:   { label: 'e.args[0]', code: "try:\n    {}['id']\nexcept KeyError as e:\n    msg = 'missing field ' + e.args[0]\nmsg", output: "'missing field id'" },
    },
    {
      name: 'A wide try block hides typos',
      desc: 'except KeyError around a whole call also swallows KeyErrors caused by bugs inside it — here a misspelled key silently becomes the fallback.',
      wrong: { label: 'Typo masked', code: "config = {'port': 80}\ndef port():\n    return config['prot']  # typo\ntry:\n    p = port()\nexcept KeyError:\n    p = 8080\np", output: '8080' },
      fix:   { label: 'Narrow lookup', code: "config = {'port': 80}\np = config.get('port', 8080)\np", output: '80' },
    },
    {
      name: 'Lists raise IndexError, not KeyError',
      desc: 'Code that handles "missing entry" for both dicts and lists must catch the common base class.',
      wrong: { label: 'except KeyError', code: "try:\n    r = [1, 2][5]\nexcept KeyError:\n    r = 'handled'\nr", output: 'IndexError: list index out of range' },
      fix:   { label: 'except LookupError', code: "try:\n    r = [1, 2][5]\nexcept LookupError:\n    r = 'handled'\nr", output: "'handled'" },
    },
  ],

  when: {
    use: [
      'The key is required, so a miss is a real error (mandatory config field)',
      'EAFP style: try the lookup, handle the miss once',
      'Raising it from your own Mapping subclass for a missing key',
    ],
    avoid: [
      'A missing key is normal → d.get(key, default)',
      'Counting or grouping → collections.defaultdict / Counter',
      'Only checking presence → key in d',
    ],
  },

  notes: {
    cpython:       'Objects/exceptions.c — KeyError_str returns repr(args[0]) when there is exactly one argument',
    'Catch via':   'except LookupError catches both KeyError and IndexError',
    'dict hook':   'A dict subclass can define __missing__(key) to return a value instead of raising',
  },

  related: [
    { name: 'LookupError', slug: 'lookuperror', when: 'Base class for key and index misses' },
    { name: 'IndexError',  slug: 'indexerror',  when: 'The sequence counterpart' },
    { name: 'dict.get',    slug: 'get',         when: 'Lookup with a default — never raises', category: 'functions' },
    { name: 'dict.setdefault', slug: 'setdefault', when: 'Insert a default on a miss', category: 'functions' },
    { name: 'in',          slug: 'in',          when: 'Test for the key first', category: 'operators' },
    { name: 'dict.pop',    slug: 'dict-pop',    when: 'Also raises KeyError without a default', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why does the KeyError message have quotes around the key?',
      a: "KeyError overrides __str__: with one argument it returns repr(key), not str(key). So a missing 'id' prints as KeyError: 'id', and a missing empty-string key prints as KeyError: '' rather than an empty message.",
    },
    {
      q: 'How do I get the missing key from the exception?',
      a: 'e.args[0]. It is the original key object, unquoted and with its original type.',
    },
    {
      q: 'Should I use try/except KeyError or check with in first?',
      a: 'If misses are rare, try/except is idiomatic (EAFP) and does one lookup. If misses are common or you just need a default, d.get(key, default) is shorter and clearer than either.',
    },
    {
      q: 'What is the difference between KeyError and IndexError?',
      a: 'KeyError is for mappings and sets (lookup by key); IndexError is for sequences (lookup by position). Both inherit from LookupError, so except LookupError catches either.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#KeyError',
    meta:  'Built-in exceptions',
  },

};

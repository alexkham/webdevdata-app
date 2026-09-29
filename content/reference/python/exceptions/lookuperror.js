// content/reference/python/exceptions/lookuperror.js

export const meta = {
  slug:        'lookuperror',
  name:        'LookupError',
  signature:   'LookupError(*args)',
  blurb:       'Base class of KeyError and IndexError — catch it when a missing key and an out-of-range index mean the same thing to you.',
  category:    'base',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'lookuperror lookup error keyerror indexerror base class missing key index out of range nested data json unknown encoding codecs lookup',
};

export const method = {
  slug:      'lookuperror',
  name:      'LookupError',
  signature: 'LookupError(*args)',

  category:    'Base class',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'One except clause for both "no such key" and "no such index" — ideal for digging through nested JSON-like data.',

  chain: ['BaseException', 'Exception', 'LookupError'],

  cheat: {
    raisedBy: "d[key] (KeyError), seq[i] (IndexError), codecs.lookup('bad')",
    message:  "the subclass's: KeyError: 'id', IndexError: list index out of range",
    quickFix: 'except LookupError: around a nested lookup',
    watchOut: 'list.index() and str.index() raise ValueError, not LookupError',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string, stored in e.args. Normally you raise KeyError or IndexError instead.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'A key lookup followed by an index lookup — either step can fail, with a different subclass.',
      params: [
        { name: 'key',   type: 'str', hint: 'users / admins / …', input: 'text' },
        { name: 'index', type: 'int', hint: 'list position',      input: 'number' },
      ],
      template: "data = {'users': ['ann', 'bob'], 'admins': []}\ndata[{$key}][{$index}]",
      cases: [
        { id: 'ok',      label: 'users[1]',  values: { key: 'users',  index: '1' } },
        { id: 'noindex', label: 'admins[0]', values: { key: 'admins', index: '0' } },
        { id: 'nokey',   label: 'guests[0]', values: { key: 'guests', index: '0' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'The same lookup with one except LookupError covering both failures.',
      params: [
        { name: 'key',   type: 'str', hint: 'users / admins / …', input: 'text' },
        { name: 'index', type: 'int', hint: 'negative counts from the end', input: 'number' },
      ],
      template: "data = {'users': ['ann', 'bob'], 'admins': []}\ntry:\n    r = data[{$key}][{$index}]\nexcept LookupError as e:\n    r = f'{type(e).__name__}: {e}'\nr",
      cases: [
        { id: 'last',    label: 'users[-1]', values: { key: 'users',  index: '-1' } },
        { id: 'far',     label: 'users[5]',  values: { key: 'users',  index: '5' } },
        { id: 'nokey',   label: 'guests[0]', values: { key: 'guests', index: '0' } },
      ],
    },
  ],
  demoExplainer: "One handler, two different exceptions: a wrong key gives KeyError with the key in quotes, a wrong position gives IndexError: list index out of range. type(e).__name__ tells you which one happened. Negative indexes count from the end, so users[-1] works but users[-3] does not.",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: "For KeyError, args[0] is the missing key; for IndexError, the message string." },
    { name: '__context__', type: 'BaseException | None', meaning: 'The exception being handled when this one was raised.' },
    { name: '__cause__',   type: 'BaseException | None', meaning: 'Set by raise ... from ...' },
  ],

  patterns: [
    {
      name: 'Safe nested lookup',
      desc: 'Read a deep value from parsed JSON; any missing level falls back to a default.',
      code: "def dig(data, *path, default=None):\n    try:\n        for step in path:\n            data = data[step]\n        return data\n    except LookupError:\n        return default\n\ncity = dig(payload, 'users', 0, 'address', 'city')",
    },
    {
      name: 'Raise it from a custom container',
      desc: 'A __getitem__ that supports both keys and positions can raise the matching subclass — callers catching LookupError handle either.',
      code: "class Registry:\n    def __getitem__(self, item):\n        if isinstance(item, int):\n            if not 0 <= item < len(self._order):\n                raise IndexError('registry index out of range')\n            return self._items[self._order[item]]\n        return self._items[item]  # KeyError if missing",
    },
  ],

  examples: [
    { title: 'KeyError and IndexError are LookupErrors', code: '[issubclass(c, LookupError) for c in (KeyError, IndexError)]', returns: '[True, True]' },
    { title: 'One handler for both', code: "def first_tag(post):\n    try:\n        return post['tags'][0]\n    except LookupError:\n        return None\n[first_tag({'tags': ['py']}), first_tag({'tags': []}), first_tag({})]", returns: "['py', None, None]" },
    { title: 'Missing index in nested data', code: "{'items': []}['items'][0]", returns: 'IndexError: list index out of range' },
    { title: 'Unknown codec raises LookupError itself', code: "import codecs\ncodecs.lookup('utf-99')", returns: 'LookupError: unknown encoding: utf-99' },
    { title: '.encode() with a bad codec name', code: "'hi'.encode('latin-9x')", returns: 'LookupError: unknown encoding: latin-9x' },
    { title: 'Tuples and strings raise IndexError too', code: "'abc'[3]", returns: 'IndexError: string index out of range' },
  ],

  pitfalls: [
    {
      name: '.index() raises ValueError',
      desc: 'Searching for a value is not a lookup by key or position: list.index and str.index raise ValueError, so except LookupError misses it.',
      wrong: { label: 'except LookupError', code: "try:\n    pos = ['a', 'b'].index('z')\nexcept LookupError:\n    pos = -1\npos", output: "ValueError: 'z' is not in list" },
      fix:   { label: 'except ValueError', code: "try:\n    pos = ['a', 'b'].index('z')\nexcept ValueError:\n    pos = -1\npos", output: '-1' },
    },
    {
      name: 'Attribute access is not a lookup',
      desc: 'obj.name failing raises AttributeError, which is not a LookupError. Dicts need d[key], not d.key.',
      wrong: { label: 'config.port', code: "config = {'port': 80}\ntry:\n    p = config.port\nexcept LookupError:\n    p = 8080\np", output: "AttributeError: 'dict' object has no attribute 'port'" },
      fix:   { label: "config['port']", code: "config = {'port': 80}\ntry:\n    p = config['port']\nexcept LookupError:\n    p = 8080\np", output: '80' },
    },
    {
      name: 'A wrong index type is TypeError',
      desc: 'Indexing a list with a string (common with JSON: a list where you expected a dict) is a TypeError, not a LookupError.',
      wrong: { label: 'except LookupError', code: "data = [{'id': 1}]\ntry:\n    r = data['id']\nexcept LookupError:\n    r = None\nr", output: 'TypeError: list indices must be integers or slices, not str' },
      fix:   { label: 'index first', code: "data = [{'id': 1}]\ntry:\n    r = data[0]['id']\nexcept LookupError:\n    r = None\nr", output: '1' },
    },
  ],

  when: {
    use: [
      'Walking nested dicts and lists from JSON, YAML or an API',
      'A __getitem__ of your own that should be caught like a key or index miss',
      'Handling codecs.lookup() / str.encode() with a user-supplied encoding name',
    ],
    avoid: [
      'Only dicts involved → except KeyError is more precise',
      'Only sequences involved → except IndexError',
      'Need a default for one key → d.get(key, default)',
    ],
  },

  notes: {
    cpython:      'Objects/exceptions.c — plain subclass of Exception; KeyError adds a repr-based __str__',
    'Raised directly by': "codecs.lookup() for an unknown encoding (and everything that uses it: str.encode, bytes.decode, open(encoding=…))",
    'Not included': 'ValueError from .index(), AttributeError from obj.attr, TypeError from a wrong index type',
  },

  related: [
    { name: 'KeyError',       slug: 'keyerror',       when: 'Missing dict key' },
    { name: 'IndexError',     slug: 'indexerror',     when: 'Sequence position out of range' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'obj.name missing — not a LookupError' },
    { name: 'ValueError',     slug: 'valueerror',     when: 'What list.index() raises' },
    { name: 'dict.get',       slug: 'get',            when: 'Default for a missing key', category: 'functions' },
    { name: 'list.index',     slug: 'list-index',     when: 'Raises ValueError, not LookupError', category: 'functions' },
  ],

  faq: [
    {
      q: 'What is LookupError in Python?',
      a: 'The base class for KeyError (missing mapping key) and IndexError (sequence index out of range). Catching LookupError handles both with one except clause. Python also raises LookupError directly from codecs.lookup() when an encoding name is unknown.',
    },
    {
      q: 'How do I catch both KeyError and IndexError?',
      a: 'except LookupError: — or except (KeyError, IndexError): if you prefer to spell it out. Both are equivalent for built-in types; LookupError also covers custom subclasses.',
    },
    {
      q: "Why does 'hello'.encode('utf8x') raise LookupError?",
      a: 'Encoding names are looked up in the codec registry. An unknown name makes codecs.lookup() raise LookupError: unknown encoding: utf8x. It is not a ValueError, so catch LookupError when the encoding name comes from user input or a file header.',
    },
    {
      q: 'Does LookupError catch ValueError from list.index()?',
      a: "No. list.index(x) and str.index(sub) search for a value and raise ValueError when it is absent. Only key and position lookups — d[k], seq[i] — raise LookupError subclasses.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#LookupError',
    meta:  'Built-in exceptions',
  },

  tryInTool: [
    { name: 'JSON Tree', href: '/tools/json-tree', meta: 'See which keys and indexes a payload really has' },
  ],
};

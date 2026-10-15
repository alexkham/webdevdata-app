// content/reference/python/stdlib/pickle/dumps.js

export const meta = {
  slug:        'dumps',
  name:        'pickle.dumps',
  signature:   'pickle.dumps(obj, protocol=None, *, fix_imports=True, buffer_callback=None)',
  blurb:       'Serialize a Python object to a bytes object — the pickle — that pickle.loads turns back into an equal object.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'pickle dumps python pickle.dumps object to bytes serialize protocol highest_protocol pickle string bytes cannot pickle picklingerror lambda pickle size shared references recursive list',
};

export const method = {
  slug:      'dumps',
  name:      'pickle.dumps',
  signature: 'pickle.dumps(obj, protocol=None, *, fix_imports=True, buffer_callback=None)',
  returns:   { type: 'bytes', desc: 'The pickled representation of obj.' },

  category:    'pickle function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'One call turns a whole object graph into bytes: nested containers, shared references, even cycles. The bytes are a small program of opcodes that pickle.loads replays — which is exactly why you only load pickles you made yourself.',

  covers: ['dumps'],

  cheat: {
    commonCall: 'data = pickle.dumps(obj)',
    returns:    "bytes, e.g. b'\\x80\\x04K*.' for 42",
    replaces:   'hand-written str()/eval() round trips',
    watchOut:   'Lambdas, local classes, open files and generators cannot be pickled',
  },

  parameters: [
    { name: 'obj',             type: 'object',   required: true,  default: null,   desc: 'What to pickle. Containers are pickled with everything they reference.' },
    { name: 'protocol',        type: 'int | None', required: false, default: 'None', desc: 'Format version 0 to 5. None means DEFAULT_PROTOCOL (4); a negative number means HIGHEST_PROTOCOL (5).' },
    { name: 'fix_imports',     type: 'bool',     required: false, default: 'True', desc: 'With protocol 0–2, write Python 2 module names (builtins → __builtin__) so Python 2 can read the pickle.' },
    { name: 'buffer_callback', type: 'callable', required: false, default: 'None', desc: 'Protocol 5 only: receives each PickleBuffer; a false return value keeps that buffer out of the stream (out-of-band).' },
  ],

  modes: [
    {
      id: 'bytes',
      label: 'bytes',
      blurb: 'Type any Python literal and a protocol. The output is the exact pickle and its length.',
      params: [
        { name: 'value',    type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'protocol', type: 'int', hint: '0 to 5, -1 = highest', input: 'number' },
      ],
      template: 'import ast, pickle\nvalue = ast.literal_eval({$value})\ndata = pickle.dumps(value, protocol={$protocol})\n(data, len(data))',
      cases: [
        { id: 'list',  label: "[1, 'a']",          values: { value: "[1, 'a']", protocol: '4' } },
        { id: 'text',  label: 'protocol 0',        values: { value: "[1, 'a']", protocol: '0' } },
        { id: 'set',   label: 'tuple and set',     values: { value: '(1, {2, 3})', protocol: '4' } },
        { id: 'bytes', label: 'bytes, protocol 2', values: { value: "b'ab'", protocol: '2' } },
        { id: 'big',   label: 'big int',           values: { value: '18446744073709551616', protocol: '4' } },
        { id: 'six',   label: 'protocol 6',        values: { value: "[1, 'a']", protocol: '6' } },
      ],
    },
    {
      id: 'shared',
      label: 'shared objects',
      blurb: 'The same object twice in a list is written once and referenced the second time (the memo). An equal copy is written in full.',
      params: [{ name: 'row', type: 'str', hint: 'a Python literal', input: 'text' }],
      template: 'import ast, pickle\nrow = ast.literal_eval({$row})\nshared = pickle.dumps([row, row])\ncopied = pickle.dumps([row, ast.literal_eval({$row})])\nback = pickle.loads(shared)\n(len(shared), len(copied), back[0] is back[1])',
      cases: [
        { id: 'list', label: 'a list',   values: { row: "[1, 2, 'three']" } },
        { id: 'str',  label: 'a string', values: { row: "'hello world'" } },
        { id: 'int',  label: 'an int',   values: { row: '1000' } },
        { id: 'char', label: "'a'",      values: { row: "'a'" } },
      ],
    },
    {
      id: 'cycle',
      label: 'a cycle',
      blurb: 'A list that contains itself. pickle writes it once and points back to it; loads rebuilds the cycle.',
      params: [
        { name: 'items',    type: 'str', hint: 'a list literal', input: 'text' },
        { name: 'protocol', type: 'int', hint: '0 to 5',         input: 'number' },
      ],
      template: 'import ast, pickle\nitems = ast.literal_eval({$items})\nitems.append(items)\ndata = pickle.dumps(items, protocol={$protocol})\n(data, pickle.loads(data))',
      cases: [
        { id: 'p4',    label: 'protocol 4', values: { items: '[1, 2]', protocol: '4' } },
        { id: 'p0',    label: 'protocol 0', values: { items: '[1, 2]', protocol: '0' } },
        { id: 'empty', label: 'empty list', values: { items: '[]', protocol: '2' } },
        { id: 'tuple', label: 'a tuple',    values: { items: '(1, 2)', protocol: '4' } },
      ],
    },
  ],
  demoExplainer: "The demos read your text with ast.literal_eval (literals only, nothing is executed). Protocol 2 has no opcode for bytes, so b'ab' is written as a call to _codecs.encode('ab', 'latin1') — Python 2 compatible — and protocol 6 does not exist. In the shared tab a list or a longer string comes out shorter the first way, because the second occurrence is just a memo reference (h\\x01, two bytes), and loads hands back one object twice. Ints are never memoized, and 'a' is a single cached object in CPython, so both ways give the same size there. In the cycle tab h\\x00 (BINGET 0) — or g0 in protocol 0 — points back to the list itself, and repr shows the cycle as [...].",

  patterns: [
    {
      name: 'Pickle to bytes and back',
      desc: 'The usual pair: store the bytes anywhere (cache, database column), load them later.',
      code: 'import pickle\nblob = pickle.dumps(obj)\nsame = pickle.loads(blob)',
    },
    {
      name: 'Measure how big an object is when pickled',
      desc: 'A rough size of the data an object graph holds.',
      code: 'import pickle\nsize = len(pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL))',
    },
    {
      name: 'Check that something is picklable',
      desc: 'Pickling fails with PicklingError, TypeError or AttributeError depending on the object.',
      code: 'import pickle\ndef is_picklable(obj):\n    try:\n        pickle.dumps(obj)\n    except (pickle.PicklingError, TypeError, AttributeError):\n        return False\n    return True',
    },
  ],

  examples: [
    { title: 'An int becomes a few bytes',          code: 'import pickle\npickle.dumps(42)',                         returns: "b'\\x80\\x04K*.'" },
    { title: 'Protocol 0 is text',                  code: "import pickle\npickle.dumps('hi', protocol=0)",           returns: "b'Vhi\\np0\\n.'" },
    { title: 'A negative protocol means the highest', code: 'import pickle\npickle.dumps(None, protocol=-1)',        returns: "b'\\x80\\x05N.'" },
    { title: 'Sizes by protocol',                   code: 'import pickle\n[len(pickle.dumps(list(range(100)), protocol=p)) for p in range(6)]', returns: '[496, 206, 208, 208, 216, 216]' },
    { title: 'Functions are pickled by name',       code: "import pickle\ndef double(x):\n    return x * 2\npickle.loads(pickle.dumps(double))(21)", returns: '42' },
    { title: 'Generators cannot be pickled',        code: 'import pickle\npickle.dumps(x * x for x in range(3))',   returns: "TypeError: cannot pickle 'generator' object" },
    { title: 'There is no protocol 6',              code: 'import pickle\npickle.dumps(1, protocol=6)',               returns: 'ValueError: pickle protocol must be <= 5' },
  ],

  pitfalls: [
    {
      name: 'Comparing pickles to compare objects',
      desc: 'Equal objects can pickle to different bytes — dict key order, for example, is part of the pickle. Compare the loaded objects instead.',
      wrong: { label: 'compare bytes', code: "import pickle\npickle.dumps({'a': 1, 'b': 2}) == pickle.dumps({'b': 2, 'a': 1})", output: 'False' },
      fix:   { label: 'compare values', code: "import pickle\npickle.loads(pickle.dumps({'a': 1, 'b': 2})) == pickle.loads(pickle.dumps({'b': 2, 'a': 1}))", output: 'True' },
    },
    {
      name: 'Pickling a lambda',
      desc: 'Functions are stored as a module name plus a function name. A lambda has no name to look up, so it cannot be pickled. Define the function with def at module level.',
      wrong: { label: 'lambda', code: "import pickle, re\ntry:\n    pickle.dumps(lambda x: x * 2)\nexcept pickle.PicklingError as e:\n    error = re.sub(r'0x[0-9A-Fa-f]+', '0x...', str(e))\nerror", output: "\"Can't pickle <function <lambda> at 0x...>: attribute lookup <lambda> on __main__ failed\"" },
      fix:   { label: 'def', code: "import pickle\ndef double(x):\n    return x * 2\npickle.loads(pickle.dumps(double))(5)", output: '10' },
    },
  ],

  when: {
    use: [
      'Turning trusted Python objects into bytes for a cache, a queue or a database column',
      'Deep-copying an object graph that copy.deepcopy handles too slowly or not at all',
    ],
    avoid: [
      'Writing straight to a file → pickle.dump(obj, f)',
      'Data for other languages or for untrusted readers → json.dumps',
      'Comparing or hashing objects by their pickles — equal objects can pickle differently',
    ],
  },

  notes: {
    cpython:      '_pickle.dumps creates a Pickler writing to an in-memory buffer, calls dump(obj) and returns the buffer as bytes (Modules/_pickle.c)',
    'Memo':       'Every str, bytes and container (except the empty tuple) gets a memo slot; a second reference to the same object is written as a short GET opcode. Ints, floats, None and bools are never memoized',
    'Framing':    'Protocol 4 and 5 group the opcodes into FRAME blocks of roughly 64 KiB (a str or bytes payload of 64 KiB or more is written outside any frame); a body shorter than 4 bytes gets no frame at all',
    'Errors':     'ValueError for protocol > 5; PicklingError, TypeError or AttributeError for objects that cannot be pickled',
  },

  related: [
    { name: 'pickle.loads',  slug: 'loads',  when: 'The reverse: bytes back to an object' },
    { name: 'pickle.dump',   slug: 'dump',   when: 'Write the pickle to a file instead' },
    { name: 'HIGHEST_PROTOCOL', slug: 'highest_protocol-default_protocol', when: 'Which protocol to choose' },
    { name: 'PicklingError', slug: 'picklingerror', when: 'What an unpicklable object raises' },
    { name: 'json.dumps',    slug: 'dumps',  when: 'Text for other programs', category: 'stdlib/json' },
    { name: 'copy.deepcopy', slug: 'deepcopy', when: 'Copy without bytes', category: 'stdlib/copy' },
  ],

  faq: [
    {
      q: 'How do I convert a Python object to bytes?',
      a: 'pickle.dumps(obj) returns bytes that pickle.loads turns back into an equal object. For simple data that other programs or untrusted readers must handle, json.dumps(obj).encode() is the safer choice.',
    },
    {
      q: 'Which protocol should I pass to pickle.dumps?',
      a: 'Leave it as None (DEFAULT_PROTOCOL, 4) unless you need something specific: pickle.HIGHEST_PROTOCOL (5) for out-of-band buffers, or a lower number when an older Python must read the data — protocol 2 for Python 2.',
    },
    {
      q: "Why do I get \"Can't pickle <function <lambda>\"?",
      a: 'Functions are pickled by reference: module name plus function name. A lambda (or a function defined inside another function) cannot be found again by name, so pickling fails. Use a function defined with def at module level, or functools.partial of one.',
    },
    {
      q: 'Does pickle.dumps handle circular references?',
      a: 'Yes. The memo records every container it has written, and a second reference — including a container that contains itself — is written as a reference to the first. pickle.loads rebuilds the same structure.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pickle.html#pickle.dumps',
    meta:  'pickle.dumps',
  },

};

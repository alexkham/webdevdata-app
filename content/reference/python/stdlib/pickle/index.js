// content/reference/python/stdlib/pickle/index.js — the pickle module hub

export const meta = {
  slug:        'index',
  name:        'pickle',
  signature:   'import pickle',
  blurb:       'Save almost any Python object as bytes and load it back exactly — dumps/loads for bytes, dump/load for files. Only unpickle data you trust.',
  category:    'data',
  type:        'module',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'pickle module python pickle save object to file load object serialize deserialize dumps loads dump load protocol pickle vs json unpickle untrusted data security cache python objects pkl file',
};

export const method = {
  slug: 'index',
  name: 'pickle',

  category:    'Data formats',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'pickle turns Python objects — lists, dicts, sets, tuples, your own class instances — into bytes and back, keeping types and shared references intact. The one rule before anything else: only unpickle data you trust. Loading a pickle can run code, so data from users or the network belongs in json.',

  imports: ['import pickle', 'from pickle import dumps, loads'],
  // the three classes define these public names themselves
  coverClasses: ['Pickler', 'Unpickler', 'PickleBuffer'],
  facts: [
    { label: 'Public API', value: 'dumps, loads, dump, load, Pickler, Unpickler, PickleBuffer, PickleError, PicklingError, UnpicklingError, HIGHEST_PROTOCOL, DEFAULT_PROTOCOL, 70 opcode constants' },
    { label: 'Safety',     value: 'Not secure: only unpickle data you trust. Use json for data from outside your program' },
    { label: 'Protocols',  value: '0 to 5; DEFAULT_PROTOCOL is 4 (since 3.8), HIGHEST_PROTOCOL is 5' },
    { label: 'Speed',      value: 'C accelerator _pickle used automatically (Modules/_pickle.c); Lib/pickle.py is the pure-Python fallback' },
  ],

  modes: [
    {
      id: 'roundtrip',
      label: 'round trip',
      blurb: 'Type a Python literal. It is pickled and unpickled again: equal to the original, with its type intact — tuples stay tuples, sets stay sets, int keys stay ints.',
      params: [{ name: 'value', type: 'str', hint: 'a Python literal', input: 'text' }],
      template: 'import ast, pickle\nvalue = ast.literal_eval({$value})\ndata = pickle.dumps(value)\nrestored = pickle.loads(data)\n(restored == value, type(restored).__name__, restored)',
      cases: [
        { id: 'mixed', label: 'tuple with a set', values: { value: "(1, 'two', {3, 4})" } },
        { id: 'keys',  label: 'int and tuple keys', values: { value: "{1: 'a', (2, 3): [4.5, None]}" } },
        { id: 'bytes', label: 'bytes',            values: { value: "[b'raw', b'\\x00\\xff']" } },
        { id: 'deep',  label: 'nested',           values: { value: "{'user': {'tags': ['admin', 'dev'], 'id': 7}}" } },
      ],
    },
    {
      id: 'bytes',
      label: 'the bytes',
      blurb: 'What pickle.dumps actually writes, and how long it is. Change the protocol: 0 is readable text; from protocol 2 on, a pickle starts with \\x80 and the protocol number; 4 (the default) adds a frame header.',
      params: [
        { name: 'value',    type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'protocol', type: 'int', hint: '0 to 5',           input: 'number' },
      ],
      template: 'import ast, pickle\ndata = pickle.dumps(ast.literal_eval({$value}), protocol={$protocol})\n(data, len(data))',
      cases: [
        { id: 'p4',   label: 'protocol 4', values: { value: "[1, 'a']", protocol: '4' } },
        { id: 'p0',   label: 'protocol 0', values: { value: "[1, 'a']", protocol: '0' } },
        { id: 'p2',   label: 'protocol 2', values: { value: "[1, 'a']", protocol: '2' } },
        { id: 'none', label: 'None',       values: { value: 'None', protocol: '4' } },
      ],
    },
  ],
  demoExplainer: "The demos read your text with ast.literal_eval, which only accepts literals (numbers, strings, bytes, None/True/False and containers of them), so nothing you type is executed. In the round trip, == compares values: the restored object is a new object equal to the original. In the bytes tab, [1, 'a'] is 22 bytes with protocol 4: \\x80\\x04 says the protocol, \\x95 plus eight bytes is the frame length (11), then come the opcodes — ] for an empty list, \\x94 to memoize it, ( for a mark, K\\x01 for the int 1, \\x8c\\x01a for the string, e to append everything after the mark, and . to stop. Protocol 0 writes the same list as text lines.",

  patterns: [
    {
      name: 'Save an object to a file',
      desc: "Binary mode ('wb') is required; the with block closes the file.",
      code: "import pickle\nwith open('state.pkl', 'wb') as f:\n    pickle.dump(state, f)",
    },
    {
      name: 'Load it back',
      desc: "Binary mode again ('rb'). Only for files your own program wrote.",
      code: "import pickle\nwith open('state.pkl', 'rb') as f:\n    state = pickle.load(f)",
    },
    {
      name: 'Deep copy through bytes',
      desc: 'A pickle round trip copies a whole object graph — copy.deepcopy does the same without the bytes.',
      code: 'import pickle\nclone = pickle.loads(pickle.dumps(original))',
    },
    {
      name: 'Choose the newest protocol',
      desc: 'Protocol 5, the newest format — readable by Python 3.8 and later only.',
      code: 'import pickle\ndata = pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL)',
    },
  ],

  examples: [
    { title: 'dumps gives bytes',                 code: "import pickle\npickle.dumps([1, 'a'])", returns: "b'\\x80\\x04\\x95\\x0b\\x00\\x00\\x00\\x00\\x00\\x00\\x00]\\x94(K\\x01\\x8c\\x01a\\x94e.'" },
    { title: 'loads gives the object back',       code: "import pickle\npickle.loads(pickle.dumps({'id': 7, 'tags': ('a', 'b')}))", returns: "{'id': 7, 'tags': ('a', 'b')}" },
    { title: 'Types survive (unlike JSON)',       code: "import pickle\npickle.loads(pickle.dumps({1: {2, 3}, 'when': (2026, 10, 13)}))", returns: "{1: {2, 3}, 'when': (2026, 10, 13)}" },
    { title: 'Your own classes work too',         code: "import pickle\nclass Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\np = pickle.loads(pickle.dumps(Point(3, 4)))\n(type(p).__name__, p.x, p.y)", returns: "('Point', 3, 4)" },
    { title: 'Shared references are kept',        code: "import pickle\nrow = [1, 2]\ngrid = pickle.loads(pickle.dumps([row, row]))\ngrid[0] is grid[1]", returns: 'True' },
    { title: 'A file round trip',                 code: "import pickle\nwith open('data.pkl', 'wb') as f:\n    pickle.dump({'scores': [90, 85]}, f)\nwith open('data.pkl', 'rb') as f:\n    loaded = pickle.load(f)\nloaded", returns: "{'scores': [90, 85]}" },
    { title: 'Lambdas cannot be pickled',         code: "import pickle, re\ntry:\n    pickle.dumps(lambda x: x * 2)\nexcept pickle.PicklingError as e:\n    message = re.sub(r'0x[0-9A-Fa-f]+', '0x...', str(e))\nmessage", returns: "\"Can't pickle <function <lambda> at 0x...>: attribute lookup <lambda> on __main__ failed\"" },
  ],

  pitfalls: [
    {
      name: 'Opening the file in text mode',
      desc: 'Pickles are bytes. A text-mode file refuses them — open with "wb" to write and "rb" to read.',
      wrong: { label: "open(..., 'w')", code: "import pickle\nwith open('data.pkl', 'w', encoding='utf-8') as f:\n    pickle.dump([1, 2], f)", output: "TypeError: write() argument must be str, not bytes" },
      fix:   { label: "open(..., 'wb')", code: "import pickle\nwith open('data.pkl', 'wb') as f:\n    pickle.dump([1, 2], f)\nwith open('data.pkl', 'rb') as f:\n    data = pickle.load(f)\ndata", output: '[1, 2]' },
    },
    {
      name: 'Pickling an object that holds an open file',
      desc: 'Files, locks, sockets and generators cannot be pickled. Leave them out of the state with __getstate__ and recreate them in __setstate__.',
      wrong: { label: 'pickle as is', code: "import pickle\nclass Log:\n    def __init__(self, path):\n        self.path = path\n        self.file = open(path, 'a', encoding='utf-8')\nlog = Log('app.log')\ntry:\n    pickle.dumps(log)\nfinally:\n    log.file.close()", output: "TypeError: cannot pickle 'TextIOWrapper' instances" },
      fix:   { label: '__getstate__ / __setstate__', code: "import pickle\nclass Log:\n    def __init__(self, path):\n        self.path = path\n        self.file = open(path, 'a', encoding='utf-8')\n    def __getstate__(self):\n        state = self.__dict__.copy()\n        del state['file']\n        return state\n    def __setstate__(self, state):\n        self.__dict__.update(state)\n        self.file = open(self.path, 'a', encoding='utf-8')\nlog = Log('app.log')\ncopy = pickle.loads(pickle.dumps(log))\nlog.file.close()\ncopy.file.close()\n(copy.path, copy.file is log.file)", output: "('app.log', False)" },
    },
  ],

  when: {
    use: [
      'Caching results your own program computed (a model, a parsed index) between runs',
      'Copying Python object graphs between your own processes (multiprocessing uses pickle)',
      'Saving program state that contains sets, tuples, dates or your own classes',
    ],
    avoid: [
      'Anything that came from users, uploads, the network or another program you do not control → json',
      'Data other languages must read → json or csv',
      'Long-term archives: a pickle of a class instance breaks when the class is renamed or moved',
    ],
  },

  notes: {
    cpython:      'pickle.dumps / loads / Pickler / Unpickler come from the C module _pickle; Lib/pickle.py holds the pure-Python versions (_Pickler, _Unpickler) and is used only if _pickle is missing',
    'Security':   'The documentation is explicit: the module is not secure, and only data you trust may be unpickled. Restricting Unpickler.find_class reduces the risk; signing the data with hmac detects tampering',
    'Classes':    'Functions and classes are pickled by name (module + qualified name), not by value: the unpickling side must be able to import them',
    'Exceptions': 'Pickling failures raise PicklingError, TypeError ("cannot pickle ... object") or, for local classes in 3.13, AttributeError; loading corrupt data raises UnpicklingError, EOFError, ValueError and others',
  },

  related: [
    { name: 'json module',  slug: 'json',  when: 'Safe, portable text format for data from outside', category: 'stdlib' },
    { name: 'copy module',  slug: 'copy',  when: 'Deep copies without going through bytes',          category: 'stdlib' },
    { name: 'open()',       slug: 'open',  when: "Binary files for dump/load ('wb' / 'rb')",          category: 'functions' },
    { name: 'bytes',        slug: 'bytes', when: 'What dumps returns',                                category: 'functions' },
  ],

  faq: [
    {
      q: 'Is pickle safe to use?',
      a: 'Only for data you created yourself or fully trust. The official documentation warns that the module is not secure: a crafted pickle can run arbitrary code while it is being loaded. Never unpickle data from users, uploads, emails or the network — use json for that.',
    },
    {
      q: 'What is the difference between pickle and json?',
      a: 'json writes portable text with only dicts, lists, strings, numbers, booleans and None; it is safe to parse untrusted input. pickle writes Python-only bytes that keep tuples, sets, bytes, int keys, shared references and class instances — but loading it is only safe for trusted data.',
    },
    {
      q: 'What is the difference between dump and dumps?',
      a: 'dumps returns the pickle as a bytes object; dump writes it to a binary file object. Likewise loads reads from bytes and load from a file. The trailing s stands for "string".',
    },
    {
      q: 'Why does pickle.load fail on a file I wrote?',
      a: 'Most often the file was opened in text mode ("w"/"r" instead of "wb"/"rb"), or the class of a pickled object cannot be imported where you load it — classes are stored by module and name, not by value.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pickle.html',
    meta:  'pickle — Python object serialization',
  },

};

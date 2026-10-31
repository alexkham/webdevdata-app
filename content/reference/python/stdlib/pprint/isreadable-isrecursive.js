// content/reference/python/stdlib/pprint/isreadable-isrecursive.js — the two saferepr flags

export const meta = {
  slug:        'isreadable-isrecursive',
  name:        'pprint.isreadable / isrecursive',
  signature:   'pprint.isreadable(object) · pprint.isrecursive(object)',
  blurb:       'Two yes/no checks on the text saferepr builds: isrecursive — does the value contain itself? isreadable — could eval() rebuild it from that text?',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'pprint.isreadable pprint.isrecursive isreadable isrecursive python check recursive data structure self reference list contains itself eval repr readable detect cycle',
};

export const method = {
  slug:      'isreadable-isrecursive',
  name:      'pprint.isreadable / isrecursive',
  signature: 'pprint.isreadable(object) · pprint.isrecursive(object)',
  returns:   { type: 'bool', desc: 'isrecursive: True if a dict, list or tuple contains itself. isreadable: False if the value is recursive or some part of its repr starts with "<".' },

  category:    'pprint function',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'Both run the same walk as saferepr and return one of its flags. "Readable" is a quick heuristic, not a promise: it only checks for recursion and for reprs that start with "<", so float("inf") counts as readable although eval("inf") fails.',

  covers: ['isreadable', 'isrecursive'],

  cheat: {
    commonCall: 'pprint.isrecursive(data)',
    returns:    'True / False',
    replaces:   'Hand-written cycle detection for nested dicts and lists',
    watchOut:   'isreadable is a heuristic: inf, nan and names in reprs pass',
  },

  parameters: [
    { name: 'object', type: 'any', required: true, default: null, desc: 'The value to check. dict, list and tuple are walked; anything else is judged by its repr().' },
  ],

  modes: [
    {
      id: 'selfref',
      label: 'self-reference',
      blurb: 'Type a list. The snippet appends the list to itself, then checks it — and the copy of its original items, data[:-1].',
      params: [{ name: 'data', type: 'str', hint: 'a list literal', input: 'text' }],
      template: 'import ast, pprint\ndata = ast.literal_eval({$data})\ndata.append(data)\n(pprint.isrecursive(data), pprint.isreadable(data), pprint.isreadable(data[:-1]))',
      cases: [
        { id: 'ints',   label: 'list of ints',  values: { data: '[1, 2, 3]' } },
        { id: 'nested', label: 'nested values', values: { data: "[{'a': (1, 2)}, ['x']]" } },
        { id: 'inf',    label: 'with 1e999',    values: { data: '[1e999, None]' } },
        { id: 'dict',   label: 'a dict',        values: { data: "{'a': 1}" } },
      ],
    },
  ],
  demoExplainer: "After data.append(data) the list contains itself, so isrecursive is True and isreadable is False. data[:-1] is a new list without that last item and is readable again. 1e999 is a float literal too large for a float, so it becomes inf — and is still called readable, because isreadable only looks for recursion and for reprs starting with '<'. A dict has no append, so the last case stops with AttributeError.",

  patterns: [
    {
      name: 'Refuse self-referencing data',
      desc: 'Check before serializing to a format that cannot express cycles.',
      code: "import json, pprint\nif pprint.isrecursive(payload):\n    raise ValueError('payload contains itself')\ntext = json.dumps(payload)",
    },
    {
      name: 'Only eval() what claims to be readable',
      desc: 'And still prefer ast.literal_eval for data.',
      code: "import ast, pprint\nif pprint.isreadable(value):\n    copy = ast.literal_eval(pprint.saferepr(value))",
    },
  ],

  examples: [
    { title: 'Plain data is readable',           code: "import pprint\npprint.isreadable([1, 'a', None])", returns: 'True' },
    { title: 'A repr starting with < is not',    code: "import pprint\npprint.isreadable([1, object])",    returns: 'False' },
    { title: 'A list that contains itself',      code: "import pprint\na = [1]\na.append(a)\n(pprint.isrecursive(a), pprint.isreadable(a))", returns: '(True, False)' },
    { title: 'Shared is not recursive',          code: "import pprint\nx = [1]\npprint.isrecursive([x, x])", returns: 'False' },
    { title: 'Recursion through a tuple',        code: "import pprint\nlst = []\nt = (lst,)\nlst.append(t)\npprint.isrecursive(t)", returns: 'True' },
    { title: 'inf counts as readable',           code: "import pprint\npprint.isreadable(float('inf'))", returns: 'True' },
    { title: 'Instances of your own classes',    code: "import pprint\nclass P:\n    pass\npprint.isreadable(P())", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'Trusting isreadable for a round trip',
      desc: "The check is shallow. inf and nan print as names that eval() does not know, and reprs like datetime.date(2026, 1, 2) need an import. Use a real serializer for round trips.",
      wrong: { label: 'eval(saferepr(…))', code: "import pprint\ndata = [float('inf')]\nprint(pprint.isreadable(data))\neval(pprint.saferepr(data))", output: "True\nNameError: name 'inf' is not defined. Did you mean: 'int'?" },
      fix:   { label: 'json round trip',   code: "import json\ndata = [float('inf')]\njson.loads(json.dumps(data))",                                 output: '[inf]' },
    },
    {
      name: 'Calling a shared object a cycle',
      desc: 'The same list twice in a container is not recursion — only a container that (directly or indirectly) contains itself is.',
      wrong: { label: 'x twice',     code: "import pprint\nx = [1]\npprint.isrecursive([x, x])",     output: 'False' },
      fix:   { label: 'x inside x',  code: "import pprint\nx = [1]\nx.append(x)\npprint.isrecursive(x)", output: 'True' },
    },
  ],

  when: {
    use: [
      'Guarding code that cannot handle cycles (custom serializers, deep copies by hand)',
      'A quick hint whether repr text could be pasted back into Python',
    ],
    avoid: [
      'Real round trips → json, pickle or ast.literal_eval with your own checks',
      'Cycles through objects other than dict, list and tuple — they are not walked',
    ],
  },

  notes: {
    cpython:     'Lib/pprint.py: isreadable(o) is PrettyPrinter()._safe_repr(o, {}, None, 0)[1] and isrecursive(o) is [...][2]; the PrettyPrinter methods of the same names use self.format(o, {}, 0, 0), so a subclass can change the answer',
    'Readable':  'False when a recursive reference is met or when any part repr()s to text starting with "<"; True otherwise — including inf, nan and reprs that need imports',
    'Recursion': 'Detected for dict, list and tuple (and subclasses keeping the built-in __repr__). Other containers are repr()ed whole',
  },

  related: [
    { name: 'pprint.saferepr',      slug: 'saferepr',      when: 'The text these flags describe' },
    { name: 'PrettyPrinter',        slug: 'prettyprinter', when: 'The methods with the same names' },
    { name: 'PrettyPrinter.format', slug: 'format',        when: 'Return your own readable / recursive flags' },
    { name: 'repr()',               slug: 'repr',          when: 'What readable is about', category: 'functions' },
    { name: 'id()',                 slug: 'id',            when: 'How pprint tracks the containers it is inside', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I check if a list contains itself in Python?',
      a: 'pprint.isrecursive(lst) walks the dicts, lists and tuples inside it and returns True if one of them is reached again while it is still being walked — i.e. if there is a cycle.',
    },
    {
      q: 'What does pprint.isreadable actually check?',
      a: 'Only two things: no recursive reference, and no part whose repr starts with "<" (like <object object at …>). It does not try eval(), so values such as float("inf") are reported readable.',
    },
    {
      q: 'Why is isreadable False for my object?',
      a: 'Its repr starts with "<", which is the default for classes without __repr__. Give the class a __repr__ that looks like a constructor call, or override PrettyPrinter.format.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pprint.html#pprint.isreadable',
    meta:  'pprint.isreadable / pprint.isrecursive',
  },

};

// content/reference/python/stdlib/pprint/format.js — PrettyPrinter.format, the subclass hook

const HEX = "import ast, pprint\n\nclass HexInts(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, int) and not isinstance(object, bool):\n            return hex(object), True, False\n        return super().format(object, context, maxlevels, level)\n\n";

const SHORT = "import ast, pprint\n\nclass Short(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, str) and len(object) > {$limit}:\n            return repr(object[:{$limit}] + '...'), False, False\n        return super().format(object, context, maxlevels, level)\n\n";

export const meta = {
  slug:        'format',
  name:        'PrettyPrinter.format',
  signature:   'PrettyPrinter.format(object, context, maxlevels, level)',
  blurb:       'The hook a PrettyPrinter subclass overrides to change how values are written: return (text, readable, recursive) for the objects you care about, defer to super().format() for the rest.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python versions',
  searchTerms: 'PrettyPrinter.format pprint format method override subclass PrettyPrinter custom repr pprint custom objects hide secrets hex numbers context maxlevels level readable recursive saferepr hook',
};

export const method = {
  slug:      'format',
  name:      'PrettyPrinter.format',
  signature: 'PrettyPrinter.format(object, context, maxlevels, level)',
  returns:   { type: 'tuple[str, bool, bool]', desc: '(text, readable, recursive): the one-line text for object, whether eval() could rebuild it, and whether a recursive reference was met.' },

  category:    'PrettyPrinter method',
  version:     'All Python versions',
  hasLiveDemo: true,

  subtitle: 'pprint asks format() for the one-line text of every value — the whole object first, then each key and item as it lays them out. Override it to change what a value looks like; the decision to split containers over several lines stays with pprint.',

  covers: ['PrettyPrinter.format'],

  cheat: {
    commonCall: 'return super().format(object, context, maxlevels, level)',
    returns:    "('[1, 2]', True, False) — text, readable, recursive",
    replaces:   'Converting the data before printing it',
    watchOut:   'Always return a 3-tuple; call super() for other types',
  },

  parameters: [
    { name: 'object',    type: 'any',  required: true, default: null, desc: 'The value to write.' },
    { name: 'context',   type: 'dict', required: true, default: null, desc: 'id() → 1 for every container currently being written around object. If id(object) is in it, the value is recursive.' },
    { name: 'maxlevels', type: 'int | None', required: true, default: null, desc: 'The depth limit. None (pformat/pprint without depth) and 0 (isreadable/isrecursive) both mean no limit. Pass it on unchanged.' },
    { name: 'level',     type: 'int',  required: true, default: null, desc: 'How deep object is: 0 for the value given to pformat, pprint, isreadable or isrecursive, one more for each container around it.' },
  ],

  modes: [
    {
      id: 'hex',
      label: 'ints as hex',
      blurb: 'A subclass that writes every int in hexadecimal. Dict keys are still sorted by value, and bools stay True/False.',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'width', type: 'int', hint: 'target line width', input: 'number' },
      ],
      template: HEX + 'HexInts(width={$width}).pformat(ast.literal_eval({$data})).splitlines()',
      cases: [
        { id: 'colors', label: 'colors',      values: { data: "{'red': 255, 'green': 128, 'flags': [1, 16, True]}", width: '80' } },
        { id: 'range',  label: 'split list',  values: { data: '[250, 251, 252, 253, 254, 255, -1]', width: '20' } },
        { id: 'keys',   label: 'int keys',    values: { data: "{4096: 'page', 16: 'para', 256: 'block'}", width: '80' } },
      ],
    },
    {
      id: 'short',
      label: 'truncate strings',
      blurb: 'Strings longer than limit are cut and marked not readable — isreadable() then reports False for the whole value.',
      params: [
        { name: 'data',  type: 'str', hint: 'a Python literal', input: 'text' },
        { name: 'limit', type: 'int', hint: 'max characters', input: 'number' },
      ],
      template: SHORT + 'data = ast.literal_eval({$data})\nprinter = Short()\n(printer.pformat(data), printer.isreadable(data))',
      cases: [
        { id: 'long',  label: 'one long value', values: { data: "{'id': 7, 'bio': 'Ada Lovelace was an English mathematician'}", limit: '10' } },
        { id: 'fine',  label: 'all short',      values: { data: "['spam', 'eggs']", limit: '10' } },
        { id: 'keys',  label: 'long key',       values: { data: "{'a fairly long key': 1}", limit: '5' } },
      ],
    },
  ],
  demoExplainer: "format() is consulted for the whole object and for every key and item, so 255 becomes 0xff wherever it appears, while the sorting of dict keys still uses the real numbers (16 before 256 before 4096). When the list is too wide, pprint splits it and asks format() for each item again. Returning False as the readable flag propagates up: one truncated string makes isreadable() False for the dict that contains it.",

  patterns: [
    {
      name: 'Hide secrets in debug output',
      desc: 'Replace sensitive strings, mark the result not readable.',
      code: "import pprint\n\nclass Redacting(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, str) and object.startswith('sk-'):\n            return \"'***'\", False, False\n        return super().format(object, context, maxlevels, level)",
    },
    {
      name: 'Short floats',
      desc: 'Fewer digits for measurements; everything else unchanged.',
      code: "import pprint\n\nclass ShortFloats(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, float):\n            return f'{object:.3g}', True, False\n        return super().format(object, context, maxlevels, level)",
    },
    {
      name: 'A readable stand-in for your own objects',
      desc: 'Objects pprint does not know print as their repr; give them a better one here.',
      code: "import pprint\n\nclass AppPrinter(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, User):\n            return f'User({object.name!r})', False, False\n        return super().format(object, context, maxlevels, level)",
    },
  ],

  examples: [
    { title: 'Ints in hex',                 code: HEX.replace('import ast, pprint', 'import pprint') + "HexInts().pformat({'red': 255, 'green': 128, 'flags': [1, 16, True]})", returns: `"{'flags': [0x1, 0x10, True], 'green': 0x80, 'red': 0xff}"` },
    { title: 'The default returns a triple', code: "import pprint\npprint.PrettyPrinter().format([1, 'a'], {}, 0, 0)", returns: `("[1, 'a']", True, False)` },
    { title: 'maxlevels cuts the text',      code: "import pprint\npprint.PrettyPrinter().format([[1]], {}, 1, 0)", returns: "('[[...]]', False, False)" },
    { title: 'context marks recursion',      code: "import pprint\na = [1]\npprint.PrettyPrinter().format(a, {id(a): 1}, 0, 0)[1:]", returns: '(False, True)' },
    { title: 'Redact a token',               code: "import pprint\n\nclass Redact(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, str) and object.startswith('sk-'):\n            return \"'***'\", False, False\n        return super().format(object, context, maxlevels, level)\n\nRedact().pformat({'user': 'ada', 'token': 'sk-12345'})", returns: `"{'token': '***', 'user': 'ada'}"` },
    { title: 'What level each value gets',   code: "import pprint\n\nclass Levels(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if not isinstance(object, (list, dict)):\n            return f'<{level}>', True, False\n        return super().format(object, context, maxlevels, level)\n\nLevels().pformat([1, [2, [3]], {'k': 4}])", returns: "'[<1>, [<2>, [<3>]], {<2>: <2>}]'" },
  ],

  pitfalls: [
    {
      name: 'Not calling super().format() for everything else',
      desc: 'format() is called for the containers too. Falling off the end returns None, and pprint fails unpacking it.',
      wrong: { label: 'no fallback',   code: "import pprint\n\nclass OneDecimal(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, float):\n            return f'{object:.1f}', True, False\n\nOneDecimal().pformat([1.25, 2])", output: 'TypeError: cannot unpack non-iterable NoneType object' },
      fix:   { label: 'super().format', code: "import pprint\n\nclass OneDecimal(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, float):\n            return f'{object:.1f}', True, False\n        return super().format(object, context, maxlevels, level)\n\nOneDecimal().pformat([1.25, 2])", output: "'[1.2, 2]'" },
    },
    {
      name: 'Expecting format() to control long strings',
      desc: 'Your text is used only when it fits. A string too wide for the line is wrapped by pprint itself from the original value — the override never sees those pieces. Transform the data first if every value must change.',
      wrong: { label: 'override',       code: "import pprint\n\nclass Upper(pprint.PrettyPrinter):\n    def format(self, object, context, maxlevels, level):\n        if isinstance(object, str):\n            return repr(object.upper()), True, False\n        return super().format(object, context, maxlevels, level)\n\nprint(Upper(width=20).pformat(['short', 'a much longer string here']))", output: "['SHORT',\n 'a much longer '\n 'string here']" },
      fix:   { label: 'convert first',  code: "import pprint\ndata = ['short', 'a much longer string here']\nprint(pprint.pformat([s.upper() for s in data], width=20))", output: "['SHORT',\n 'A MUCH LONGER '\n 'STRING HERE']" },
    },
  ],

  when: {
    use: [
      'Changing how one kind of value looks everywhere in the output (hex ints, rounded floats, redacted strings)',
      'Giving your own objects a short readable form inside pprint output',
    ],
    avoid: [
      'Changing the line layout → width, indent, compact; the layout code is private (_format, _pprint_* methods)',
      'A one-off change → convert the data, then pprint it',
    ],
  },

  notes: {
    cpython:      'Lib/pprint.py: format() just calls _safe_repr(), which builds the text of dict, list and tuple itself (calling self.format() for their items), writes int with or without underscores, and uses repr() for everything else',
    'Flags':      'readable feeds isreadable() and the internal _readable flag; recursive feeds isrecursive(). A container is readable only if all its parts are',
    'Recursion':  'For a recursive reference the default text is <Recursion on list with id=…> — an id(), so it changes from run to run',
  },

  related: [
    { name: 'pprint.PrettyPrinter', slug: 'prettyprinter', when: 'The class to subclass' },
    { name: 'pprint.saferepr',      slug: 'saferepr',      when: 'The one-line text the default format() produces' },
    { name: 'pprint.isreadable / isrecursive', slug: 'isreadable-isrecursive', when: 'What the two flags feed' },
    { name: 'repr()',               slug: 'repr',          when: 'What format() falls back to for other objects', category: 'functions' },
    { name: 'hex()',                slug: 'hex',           when: 'Used in the demo override', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I customize pprint output for my own class?',
      a: 'Either give the class a good __repr__ (pprint prints it as is), or subclass pprint.PrettyPrinter and override format(): return (text, readable, recursive) for your objects and super().format(...) for everything else.',
    },
    {
      q: 'What should format() return?',
      a: 'A 3-tuple: the one-line text, a bool saying whether eval() of that text would rebuild the value, and a bool saying whether a recursive reference was found. Returning anything else makes pprint fail when it unpacks the result.',
    },
    {
      q: 'Why does my format() override not change long strings?',
      a: "pprint uses your text only if it fits in the remaining width. Otherwise it lays the object out itself — for str it splits the original value at spaces — and only containers' items go through format() again.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/pprint.html#pprint.PrettyPrinter.format',
    meta:  'PrettyPrinter.format',
  },

};

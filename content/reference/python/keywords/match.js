// content/reference/python/keywords/match.js

export const meta = {
  slug:        'match',
  name:        'match',
  signature:   'match subject:',
  blurb:       'Structural pattern matching (3.10+): compare a value against patterns — literals, sequences, mappings, classes — and bind the parts you need.',
  category:    'control-flow',
  type:        'keyword',
  hasLiveDemo: true,
  version:     'Python 3.10+',
  searchTerms: 'match case _ match statement pattern matching structural pattern matching switch case switch statement wildcard guard capture pattern soft keyword keyword',
};

export const method = {
  slug:      'match',
  name:      'match',
  signature: 'match subject:',

  category:    'Control flow',
  version:     'Python 3.10+',
  hasLiveDemo: true,

  subtitle: 'Not just a switch: patterns test shape and type and pull values out in one step. The trap — a bare name in a case captures anything instead of comparing against a constant.',

  covers: ['match', 'case', '_'],

  syntax: [
    { label: 'literals, | and _', code: 'match status:\n    case 200 | 201:\n        ok()\n    case _:\n        other()' },
    { label: 'sequence + guard', code: 'match cmd.split():\n    case ["go", where]:\n        go(where)\n    case [op, *args] if args:\n        run(op, args)' },
    { label: 'mapping', code: 'match event:\n    case {"type": "key", "k": k}:\n        press(k)' },
    { label: 'class', code: 'match shape:\n    case Point(x=0, y=y):\n        on_y_axis(y)\n    case int(n) | float(n):\n        number(n)' },
  ],

  cheat: {
    useFor:    'dispatch on the shape of data: commands, parsed JSON, AST nodes, events',
    result:    'a statement — runs the first matching case, or nothing if none match',
    pairsWith: 'case, _, | (or-patterns), if guards, as, dataclasses',
    watchOut:  'case NAME: captures anything — constants need a dot (Color.RED)',
  },

  parameters: [
    { name: 'subject', type: 'expression',     required: true,  default: null, desc: 'Evaluated once. A comma-separated list without brackets is a tuple: match x, y:.' },
    { name: 'pattern', type: 'name / pattern', required: true,  default: null, desc: 'Literal, capture name, _ wildcard, dotted constant, [sequence], {mapping}, Class(...), p1 | p2, or p as name.' },
    { name: 'guard',   type: 'expression',     required: false, default: null, desc: 'if condition after the pattern. Checked after the pattern matched and bound its names; false → try the next case.' },
    { name: 'body',    type: 'block',          required: true,  default: null, desc: 'Runs for the first case that matches. No fall-through, no break needed.' },
  ],

  modes: [
    {
      id: 'literal',
      label: 'literals, | and _',
      blurb: 'Map an HTTP status code to text. | tries several literals, _ catches everything else.',
      params: [{ name: 'status', type: 'int', hint: 'a status code', input: 'number' }],
      template: 'status = {$status}\nmatch status:\n    case 200 | 201:\n        text = "OK"\n    case 404:\n        text = "Not Found"\n    case 500 | 502 | 503:\n        text = "Server error"\n    case _:\n        text = "Unknown"\ntext',
      cases: [
        { id: 'ok',      label: '201', values: { status: '201' } },
        { id: 'missing', label: '404', values: { status: '404' } },
        { id: 'server',  label: '502', values: { status: '502' } },
        { id: 'other',   label: '418', values: { status: '418' } },
      ],
    },
    {
      id: 'sequence',
      label: 'sequence + guard',
      blurb: 'Parse a text command. List patterns match by length and content, capture names bind the words, *items takes the rest, and the guard rejects "take" with nothing after it.',
      params: [{ name: 'command', type: 'str', hint: 'e.g. go north', input: 'text' }],
      template: 'command = {$command}\nmatch command.split():\n    case ["go", direction]:\n        result = f"go {direction}"\n    case ["take", *items] if items:\n        result = f"take {items}"\n    case ["quit" | "exit"]:\n        result = "bye"\n    case []:\n        result = "empty"\n    case _:\n        result = "unknown"\nresult',
      cases: [
        { id: 'go',    label: 'go north',          values: { command: 'go north' } },
        { id: 'take',  label: 'take sword shield', values: { command: 'take sword shield' } },
        { id: 'bare',  label: 'take (guard fails)', values: { command: 'take' } },
        { id: 'exit',  label: 'exit',              values: { command: 'exit' } },
        { id: 'long',  label: 'go north now',      values: { command: 'go north now' } },
        { id: 'blank', label: 'blank',             values: { command: '   ' } },
      ],
    },
    {
      id: 'trap',
      label: 'capture trap',
      blurb: 'A bare name in a case is a CAPTURE pattern, not a comparison with the constant RED. It matches every value — and overwrites RED.',
      params: [{ name: 'color', type: 'str', hint: 'any text', input: 'text' }],
      template: 'RED = "red"\ncolor = {$color}\nmatch color:\n    case RED:\n        verdict = "matched RED"\n(verdict, RED)',
      cases: [
        { id: 'red',  label: 'red',  values: { color: 'red' } },
        { id: 'blue', label: 'blue', values: { color: 'blue' } },
      ],
    },
    {
      id: 'dotted',
      label: 'dotted constant',
      blurb: 'The fix: a dotted name (Color.RED) is a VALUE pattern, compared with ==.',
      params: [{ name: 'color', type: 'str', hint: 'any text', input: 'text' }],
      template: 'class Color:\n    RED = "red"\ncolor = {$color}\nmatch color:\n    case Color.RED:\n        verdict = "red"\n    case _:\n        verdict = "not red"\nverdict',
      cases: [
        { id: 'red',   label: 'red',  values: { color: 'red' } },
        { id: 'blue',  label: 'blue', values: { color: 'blue' } },
        { id: 'upper', label: 'RED',  values: { color: 'RED' } },
      ],
    },
  ],
  demoExplainer: 'In the sequence tab, "go north now" is unknown: ["go", direction] needs exactly two words. "take" alone matches the shape ["take", *items] with items == [], but the guard if items is false, so matching moves on. In the capture trap tab, "blue" still prints matched RED and RED itself is now "blue" — the case bound the name instead of comparing. The dotted constant tab is the fix; with more cases after a bare name, Python refuses to compile at all (see the pitfalls).',

  patterns: [
    {
      name: 'Dispatch on parsed JSON',
      desc: 'Mapping patterns check keys and types at once; extra keys are ignored.',
      code: 'def handle(msg):\n    match msg:\n        case {"type": "join", "user": str(name)}:\n            return f"{name} joined"\n        case {"type": "say", "user": str(name), "text": text}:\n            return f"{name}: {text}"\n        case _:\n            raise ValueError(f"bad message: {msg!r}")',
    },
    {
      name: 'Dataclasses as class patterns',
      desc: 'Keyword sub-patterns read attributes; positional ones use __match_args__, which @dataclass generates.',
      code: 'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n\ndef where(p):\n    match p:\n        case Point(x=0, y=0):\n            return "origin"\n        case Point(x=0, y=y):\n            return f"y-axis at {y}"\n        case Point(x, y):\n            return f"({x}, {y})"',
    },
    {
      name: 'Enum members are dotted names',
      desc: 'Color.RED is a value pattern, so enums work as case constants directly.',
      code: 'from enum import Enum\n\nclass Color(Enum):\n    RED = 1\n    GREEN = 2\n\ndef hex_of(c):\n    match c:\n        case Color.RED:\n            return "#f00"\n        case Color.GREEN:\n            return "#0f0"',
    },
    {
      name: 'Type dispatch with capture',
      desc: 'int(n), str(s): built-in classes take one positional sub-pattern that matches the whole value.',
      code: 'def describe(v):\n    match v:\n        case bool(b):\n            return f"flag {b}"\n        case int(n) | float(n):\n            return f"number {n}"\n        case str() as s:\n            return f"text {s!r}"\n        case _:\n            return "other"',
    },
  ],

  examples: [
    { title: 'Literals with | and a wildcard',  code: "x = 3\nmatch x:\n    case 1 | 2 | 3:\n        print('small')\n    case _:\n        print('big')", returns: 'small' },
    { title: 'Sequence pattern with a star',    code: "match [1, 2, 3, 4]:\n    case [first, *rest]:\n        print(first, rest)", returns: '1 [2, 3, 4]' },
    { title: 'Mapping patterns ignore extra keys', code: "event = {'type': 'click', 'x': 3, 'extra': True}\nmatch event:\n    case {'type': 'click', 'x': x}:\n        print('click at', x)", returns: 'click at 3' },
    { title: 'Guard with if',                   code: "point = (3, 3)\nmatch point:\n    case (x, y) if x == y:\n        print('diagonal', x)\n    case (x, y):\n        print('other')", returns: 'diagonal 3' },
    { title: 'Class pattern with as',           code: "match 'hi':\n    case int() as n:\n        print('int', n)\n    case str() as s:\n        print('str', s)", returns: 'str hi' },
    { title: 'No case matches → nothing happens', code: "match 7:\n    case 1:\n        print('one')\nprint('after match')", returns: 'after match' },
    { title: 'match, case and _ are soft keywords', code: 'import keyword\nkeyword.softkwlist',                                                  returns: "['_', 'case', 'match', 'type']" },
    { title: 'So they still work as names',     code: 'match = [1, 2]\ncase = len(match)\n_ = case * 10\n(match, case, _)',                           returns: '([1, 2], 2, 20)' },
  ],

  pitfalls: [
    {
      name: 'case NAME: captures instead of comparing',
      desc: 'A bare name is a capture pattern: it matches anything and binds it. Followed by other cases, Python rejects the code. Use a dotted name (class attribute, enum member, module constant) or a literal.',
      wrong: { label: 'bare constant', code: "compile('match c:\\n    case RED:\\n        pass\\n    case _:\\n        pass', '<demo>', 'exec')", output: "SyntaxError: name capture 'RED' makes remaining patterns unreachable" },
      fix:   { label: 'dotted name',   code: "class Color:\n    RED = 'red'\nc = 'blue'\nmatch c:\n    case Color.RED:\n        print('red')\n    case _:\n        print('not red')", output: 'not red' },
    },
    {
      name: 'case str: instead of case str():',
      desc: 'Without parentheses, str is just another capture name — it rebinds str. A class pattern needs the call syntax.',
      wrong: { label: 'bare class name', code: "compile('match v:\\n    case str:\\n        pass\\n    case int():\\n        pass', '<demo>', 'exec')", output: "SyntaxError: name capture 'str' makes remaining patterns unreachable" },
      fix:   { label: 'class pattern',   code: "v = 42\nmatch v:\n    case str():\n        print('text')\n    case int():\n        print('int')", output: 'int' },
    },
    {
      name: 'Expecting a string to match a sequence pattern',
      desc: 'str, bytes and bytearray are deliberately NOT treated as sequences, so [a, b] never matches "ab". Convert explicitly if you want characters.',
      wrong: { label: 'string subject', code: "match 'ab':\n    case [a, b]:\n        print(a, b)\n    case _:\n        print('no match')", output: 'no match' },
      fix:   { label: 'list(subject)',  code: "match list('ab'):\n    case [a, b]:\n        print(a, b)", output: 'a b' },
    },
    {
      name: 'case 1 also matches True (and 1.0)',
      desc: 'Number literals compare with ==, and True == 1. The literals True, False and None compare with is — so put bool cases first, or use a class pattern.',
      wrong: { label: 'int literal first', code: "match True:\n    case 1:\n        print('one')\n    case True:\n        print('true')", output: 'one' },
      fix:   { label: 'bool first',        code: "match True:\n    case True:\n        print('true')\n    case 1:\n        print('one')", output: 'true' },
    },
  ],

  when: {
    use: [
      'Branching on the structure of data — lists of a given length, dicts with certain keys, objects of a type',
      'Command / message / token dispatch where each branch also unpacks values',
      'Replacing isinstance + indexing + len checks with one readable pattern',
    ],
    avoid: [
      'Code that must run on Python 3.9 or earlier',
      'A simple value → value table → a dict lookup',
      'One or two plain comparisons → if / elif',
    ],
  },

  notes: {
    cpython:          'Patterns compile to ordinary tests (isinstance, len, key lookups, ==), tried case by case from the top — like an if / elif chain, not a jump table',
    'Soft keywords':  'match, case and _ are keywords only in match statement positions, so older code using them as names keeps working (keyword.softkwlist, added in 3.9)',
    'Binding':        'Names bound by a pattern stay bound after the match, like any assignment — even from a case whose guard then failed',
  },

  related: [
    { name: 'if',     slug: 'if',    when: 'Plain conditions and elif chains' },
    { name: 'break',  slug: 'break', when: 'Not needed in a case — no fall-through' },
    { name: 'class',  slug: 'class', when: 'Classes and __match_args__ for class patterns' },
    { name: 'isinstance()', slug: 'isinstance', when: 'The type test a class pattern performs', category: 'functions' },
    { name: '|',      slug: 'bitwise-or', when: 'Outside patterns, | is bitwise or / set union', category: 'operators' },
    { name: 'SyntaxError', slug: 'syntaxerror', when: 'name capture … makes remaining patterns unreachable', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'Does Python have a switch statement?',
      a: 'Since 3.10 it has match / case, which covers switch and much more. Cases never fall through, so no break is needed; _ plays the role of default. On older versions use if / elif or a dict lookup.',
    },
    {
      q: 'Why does case RED: match everything?',
      a: 'A bare name in a pattern is a capture target: it matches any value and assigns it to RED. Only dotted names (Color.RED, module.CONST) are compared by value. With more cases after it, Python raises SyntaxError: name capture ... makes remaining patterns unreachable.',
    },
    {
      q: 'Can I still use match and case as variable names?',
      a: 'Yes. match, case and _ are soft keywords (see keyword.softkwlist): they only act as keywords at the start of a match statement or case clause. re.match, a variable called case, and _ for throwaway values all keep working.',
    },
    {
      q: 'Which Python version added match?',
      a: 'Python 3.10 (PEP 634). On 3.9 and earlier the code is a SyntaxError, so libraries that support older versions cannot use it.',
    },
    {
      q: 'What does _ do in a case?',
      a: 'It is the wildcard: it matches anything and binds nothing. case _: at the end is the default branch; inside patterns, [_, x] or Point(x=_) mean "some value here, I do not care which".',
    },
  ],

  history: [
    { version: '3.10', note: 'The match statement added (PEP 634, structural pattern matching)' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/reference/compound_stmts.html#the-match-statement',
    meta:  'The match statement',
  },
};

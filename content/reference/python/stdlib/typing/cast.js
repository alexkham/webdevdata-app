// content/reference/python/stdlib/typing/cast.js — cast, assert_type, assert_never, reveal_type

export const meta = {
  slug:        'cast',
  name:        'typing.cast / assert_type / assert_never / reveal_type',
  signature:   'cast(typ, val) · assert_type(val, typ, /) · assert_never(arg, /) · reveal_type(obj, /)',
  blurb:       'Four functions that talk to the type checker. cast and assert_type return their value untouched, reveal_type prints the runtime type to stderr, and assert_never raises AssertionError — it marks code that must be unreachable.',
  category:    'functions',
  type:        'function',
  hasLiveDemo: true,
  version:     'Python 3.5+ (assert_type, assert_never, reveal_type 3.11+)',
  searchTerms: 'typing.cast cast assert_type assert_never reveal_type type cast python convert type exhaustiveness check match unreachable code Expected code to be unreachable Runtime type is type checker debug inferred type',
};

export const method = {
  slug:      'cast',
  name:      'typing.cast / assert_type / assert_never / reveal_type',
  signature: 'cast(typ, val) · assert_type(val, typ, /) · assert_never(arg, /) · reveal_type(obj, /)',
  returns:   { type: 'object', desc: 'cast, assert_type and reveal_type return their value argument unchanged; assert_never never returns.' },

  category:    'typing functions',
  version:     'Python 3.5+ (assert_type, assert_never, reveal_type 3.11+)',
  hasLiveDemo: true,

  subtitle: 'cast(int, x) does not convert anything — it tells the type checker "trust me, x is an int" and returns x as it is. Mind the argument order: cast takes the type first, assert_type takes the value first.',

  covers: ['cast', 'assert_type', 'assert_never', 'reveal_type'],

  cheat: {
    commonCall: 'config = cast(dict[str, str], json.loads(text))',
    returns:    'the same object; nothing is checked or converted',
    replaces:   '# type: ignore comments; isinstance-free "trust me" narrowing',
    watchOut:   'cast(int, "42") is still the str "42" — use int("42") to convert',
  },

  parameters: [
    { name: 'typ', type: 'type | str', required: true, default: null, desc: 'cast / assert_type: the type for the checker. May be a string ("list[int]"); never evaluated at runtime by cast.' },
    { name: 'val', type: 'object',     required: true, default: null, desc: 'The value, returned unchanged by cast and assert_type.' },
    { name: 'arg', type: 'Never',      required: true, default: null, desc: 'assert_never: the value that should have been impossible; its repr goes into the AssertionError.' },
    { name: 'obj', type: 'object',     required: true, default: null, desc: 'reveal_type: the value whose type to show; returned unchanged.' },
  ],

  modes: [
    {
      id: 'cast',
      label: 'cast',
      blurb: 'cast(int, value) — try a str or a float. The value comes back exactly as it went in.',
      params: [{ name: 'value', type: 'any', hint: 'a number or text', input: 'auto' }],
      template: 'from typing import cast\ncast(int, {$value})',
      cases: [
        { id: 'text',  label: 'a str',   values: { value: 'forty-two' } },
        { id: 'float', label: 'a float', values: { value: '4.2' } },
        { id: 'int',   label: 'an int',  values: { value: '42' } },
      ],
    },
    {
      id: 'never',
      label: 'assert_never',
      blurb: 'At runtime assert_never always raises, putting repr(value) — cut to 100 characters — into the message.',
      params: [{ name: 'value', type: 'any', hint: 'a number or text', input: 'auto' }],
      template: 'from typing import assert_never\nassert_never({$value})',
      cases: [
        { id: 'num',  label: 'a number',  values: { value: '2.5' } },
        { id: 'text', label: 'a str',     values: { value: 'circle' } },
        { id: 'long', label: 'long text', values: { value: 'This value is far too long to be shown in full, so assert_never cuts its repr at one hundred characters' } },
      ],
    },
    {
      id: 'reveal',
      label: 'reveal_type',
      blurb: 'reveal_type writes the runtime type to stderr and returns the value. The demo captures stderr so you can see both.',
      params: [{ name: 'value', type: 'any', hint: 'a number or text', input: 'auto' }],
      template: 'import contextlib, io\nfrom typing import reveal_type\nerr = io.StringIO()\nwith contextlib.redirect_stderr(err):\n    result = reveal_type({$value})\n(result, err.getvalue())',
      cases: [
        { id: 'int',  label: 'an int',  values: { value: '7' } },
        { id: 'text', label: 'a str',   values: { value: 'seven' } },
      ],
    },
  ],
  demoExplainer: "cast returns the str, float or int it was given — the int in cast(int, ...) is not even looked at. assert_never raises \"AssertionError: Expected code to be unreachable, but got: \" followed by the value's repr; a repr longer than 100 characters is cut and ends in '...'. reveal_type prints \"Runtime type is 'int'\" (the class name in quotes) and hands the value back, so it can wrap any expression while you debug.",

  patterns: [
    {
      name: 'Narrow untyped data you have checked',
      desc: 'cast documents the assumption; validate first if the data is external.',
      code: 'import json\nfrom typing import cast\n\nraw = json.loads(\'{"host": "localhost"}\')\nconfig = cast(dict[str, str], raw)',
    },
    {
      name: 'Exhaustive match',
      desc: 'If a new member is added to the union, the checker flags assert_never; at runtime it raises.',
      code: 'from typing import assert_never\n\ndef area(shape: Circle | Square) -> float:\n    match shape:\n        case Circle(r=r):\n            return 3.14159 * r * r\n        case Square(side=s):\n            return s * s\n        case _:\n            assert_never(shape)',
    },
    {
      name: 'Pin down what the checker infers',
      desc: 'assert_type is a test for the type checker; it costs nothing at runtime.',
      code: 'from typing import assert_type\n\ndef parse(text: str) -> int | None: ...\n\nresult = parse("3")\nif result is not None:\n    assert_type(result, int)',
    },
  ],

  examples: [
    { title: 'cast does not convert', code: "from typing import cast\ncast(int, 'not a number')", returns: "'not a number'" },
    { title: 'It returns the very same object', code: 'from typing import cast\nx = [1, 2]\ncast(list[str], x) is x', returns: 'True' },
    { title: 'A string type is fine', code: "from typing import cast\ncast('list[int]', 3)", returns: '3' },
    { title: 'assert_type does nothing at runtime', code: "from typing import assert_type\nassert_type('x', int)", returns: "'x'" },
    { title: 'assert_never raises', code: 'from typing import assert_never\nassert_never(3)', returns: 'AssertionError: Expected code to be unreachable, but got: 3' },
    { title: 'Long reprs are cut at 100 characters', code: "from typing import assert_never\ntry:\n    assert_never('a' * 200)\nexcept AssertionError as e:\n    msg = str(e)\n(len(msg), msg[-6:])", returns: "(145, 'aaa...')" },
    { title: 'reveal_type prints to stderr', code: "import contextlib, io\nfrom typing import reveal_type\nerr = io.StringIO()\nwith contextlib.redirect_stderr(err):\n    value = reveal_type([1, 'a'])\n(value, err.getvalue())", returns: "([1, 'a'], \"Runtime type is 'list'\\n\")" },
    { title: 'An exhaustive match catching a surprise', code: "from typing import assert_never\ndef describe(x: int | str) -> str:\n    match x:\n        case int():\n            return 'int'\n        case str():\n            return 'str'\n        case _:\n            assert_never(x)\ndescribe(2.5)", returns: 'AssertionError: Expected code to be unreachable, but got: 2.5' },
  ],

  pitfalls: [
    {
      name: 'Using cast to convert a value',
      desc: 'cast changes what the checker believes, not the value. The next operation fails at runtime.',
      wrong: { label: "cast(int, '42')", code: "from typing import cast\ncast(int, '42') + 1", output: 'TypeError: can only concatenate str (not "int") to str' },
      fix:   { label: "int('42')", code: "int('42') + 1", output: '43' },
    },
    {
      name: 'Swapping the arguments of cast',
      desc: 'cast(typ, val): type first. With the order reversed, the "value" you get back is the class. (assert_type is the other way round: assert_type(val, typ).)',
      wrong: { label: 'cast(value, int)', code: 'from typing import cast\ncast(42, int)', output: "<class 'int'>" },
      fix:   { label: 'cast(int, value)', code: 'from typing import cast\ncast(int, 42)', output: '42' },
    },
  ],

  when: {
    use: [
      'cast: after a check the type checker cannot follow, or for untyped library results',
      'assert_never: the default branch of a match or if-chain over a union or enum',
      'assert_type / reveal_type: testing and debugging what the checker infers',
    ],
    avoid: [
      'Converting values → int(), str(), float() …',
      'cast on untrusted input without validating it first',
      'Leaving reveal_type calls in production code — they print on every call',
    ],
  },

  notes: {
    cpython:       'Lib/typing.py: cast returns val; assert_type returns val; assert_never builds the message from repr(arg), truncated to 100 characters; reveal_type prints to sys.stderr',
    'reveal_type': 'The runtime message is Runtime type is \'<class name>\' — with quotes, unlike the unquoted example in the docs',
    'Versions':    'cast since the typing module itself (3.5); assert_type, assert_never and reveal_type 3.11 (typing_extensions has them for older versions)',
  },

  related: [
    { name: 'Any / Never / Self …', slug: 'any', when: 'Never is the argument type of assert_never' },
    { name: 'TypeGuard / TypeIs', slug: 'typeguard', when: 'Narrowing with a checked function instead of cast' },
    { name: 'match', slug: 'match', when: 'Where assert_never usually sits', category: 'keywords' },
    { name: 'AssertionError', slug: 'assertionerror', when: 'What assert_never raises', category: 'exceptions' },
    { name: 'int()', slug: 'int', when: 'Actually converting a value', category: 'functions' },
  ],

  faq: [
    {
      q: 'Does typing.cast convert the value?',
      a: 'No. cast(typ, val) returns val unchanged and checks nothing; it only changes what the type checker assumes. Use int(), str() and friends to convert.',
    },
    {
      q: 'What is the difference between cast and assert_type?',
      a: 'cast overrides the type checker: whatever it inferred, it now uses your type. assert_type asks the checker to confirm its inferred type equals yours, and reports an error otherwise. Both return the value unchanged at runtime; note the opposite argument orders.',
    },
    {
      q: 'What does assert_never do at runtime?',
      a: 'It always raises AssertionError("Expected code to be unreachable, but got: <repr>"). For the type checker it marks a point that must be unreachable, which gives exhaustiveness checking for match statements and if/elif chains.',
    },
    {
      q: 'Why does reveal_type print "Runtime type is ..." when I run my program?',
      a: "Because typing.reveal_type (3.11+) exists at runtime too: it prints Runtime type is '<class name>' to stderr and returns its argument. A type checker shows the statically inferred type instead.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.cast',
    meta:  'typing.cast',
  },

};

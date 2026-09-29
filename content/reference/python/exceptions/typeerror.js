// content/reference/python/exceptions/typeerror.js

export const meta = {
  slug:        'typeerror',
  name:        'TypeError',
  signature:   'TypeError(*args)',
  blurb:       'Raised when an operation or function gets a value of a type it does not support at all.',
  category:    'type-value',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'typeerror type error unsupported operand type can only concatenate str not int nonetype object is not subscriptable not iterable not callable missing required positional argument takes positional arguments unhashable type list not supported between instances wrong type',
};

export const method = {
  slug:      'typeerror',
  name:      'TypeError',
  signature: 'TypeError(*args)',

  category:    'Type / value exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The operation does not work on that type at all — the message names the types involved, so read it for the one you did not expect (very often NoneType).',

  chain: ['BaseException', 'Exception', 'TypeError'],

  cheat: {
    raisedBy: "'a' + 1, None[0], f(1) for f(a, b), len(5), {[1]: 2}",
    message:  "names the types: unsupported operand type(s) for +: 'int' and 'str'",
    quickFix: "convert explicitly (str(n), int(s)) or check for None",
    watchOut: "'NoneType' object … = a variable is None, often a method that returns nothing",
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string. str(e) is that string; with several arguments it is the repr of the args tuple.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Add two values. Numbers mix freely, str only joins str — and which side the str is on changes the message.',
      params: [
        { name: 'a', type: 'int | float | str', hint: 'numbers stay numbers', input: 'auto' },
        { name: 'b', type: 'int | float | str', hint: 'numbers stay numbers', input: 'auto' },
      ],
      template: '{$a} + {$b}',
      cases: [
        { id: 'strstr',  label: "str + str",   values: { a: 'Total: ', b: 'ten' } },
        { id: 'strint',  label: "str + int",   values: { a: 'Total: ', b: '10' } },
        { id: 'intstr',  label: "int + str",   values: { a: '10', b: ' items' } },
        { id: 'intflt',  label: 'int + float', values: { a: '10', b: '0.5' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Raise TypeError yourself when an argument has the wrong type. Name the type you got — type(x).__name__.',
      params: [{ name: 'side', type: 'int | float | str', hint: 'numbers stay numbers', input: 'auto' }],
      template: "def area(side):\n    if not isinstance(side, (int, float)):\n        raise TypeError(f'side must be a number, not {type(side).__name__}')\n    return side * side\n\narea({$side})",
      cases: [
        { id: 'int',   label: 'int',   values: { side: '4' } },
        { id: 'float', label: 'float', values: { side: '2.5' } },
        { id: 'str',   label: 'str',   values: { side: 'four' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'int() raises TypeError for a value of the wrong type (None) and ValueError for a str with the wrong content. Leave the box empty to pass None.',
      params: [{ name: 'raw', type: 'str | None', hint: 'empty = None', input: 'text-or-none' }],
      template: "try:\n    n = int({$raw})\nexcept TypeError as e:\n    n = f'TypeError: {e}'\nexcept ValueError as e:\n    n = f'ValueError: {e}'\nn",
      cases: [
        { id: 'ok',   label: "'42'",  values: { raw: '42' } },
        { id: 'none', label: 'None',  values: { raw: '' } },
        { id: 'bad',  label: "'4.5'", values: { raw: '4.5' } },
      ],
    },
  ],
  demoExplainer: "Compare str + int with int + str: the same mistake gives two different messages. With the str on the left, str.__add__ refuses with can only concatenate str (not \"int\") to str; with the int on the left, int.__add__ and str.__radd__ both decline and Python reports unsupported operand type(s). In Handle, None is the wrong type (TypeError) while '4.5' is a str with a bad value (ValueError).",

  attributes: [
    { name: 'args',        type: 'tuple', meaning: 'The constructor arguments — normally a 1-tuple holding the message.' },
    { name: '__traceback__', type: 'traceback', meaning: 'Where it was raised. The last frame is usually the line with the operator or call that got the wrong type.' },
    { name: '__notes__',   type: 'list[str]', meaning: 'Extra lines added with e.add_note(), printed after the message (Python 3.11+).' },
  ],

  patterns: [
    {
      name: 'Convert at the boundary',
      desc: 'Text from input(), files, env vars and query strings is always str. Convert it once, where it enters, not at every use.',
      code: "port = int(os.environ.get('PORT', '8000'))\nprint('listening on ' + str(port))",
    },
    {
      name: 'Fail early with a clear TypeError',
      desc: 'In your own API, check the type up front and name what you got. Accept the widest type that works (numbers.Real, collections.abc.Iterable) instead of one concrete class.',
      code: "def scale(values, factor):\n    if not isinstance(factor, (int, float)):\n        raise TypeError(f'factor must be int or float, not {type(factor).__name__}')\n    return [v * factor for v in values]",
    },
    {
      name: 'Guard against None',
      desc: "Most 'NoneType' object … errors come from a lookup or function that returned None. Check at the source instead of wrapping every use in try/except.",
      code: "match = re.search(r'\\d+', text)\nif match is None:\n    raise ValueError(f'no number in {text!r}')\nnumber = int(match.group())",
    },
    {
      name: 'Return NotImplemented from operators',
      desc: 'In __add__ and friends, return NotImplemented for types you do not handle; Python then tries the other operand and raises the standard TypeError only if both decline.',
      code: "class Money:\n    def __init__(self, cents):\n        self.cents = cents\n    def __add__(self, other):\n        if not isinstance(other, Money):\n            return NotImplemented\n        return Money(self.cents + other.cents)",
    },
  ],

  examples: [
    { title: 'str + int',                    code: "'Age: ' + 30",                                     returns: 'TypeError: can only concatenate str (not "int") to str' },
    { title: 'Fix: f-string or str()',       code: "age = 30\nf'Age: {age}'",                               returns: "'Age: 30'" },
    { title: 'Method that returns None',     code: "nums = [3, 1, 2].sort()\nnums[0]",                     returns: "TypeError: 'NoneType' object is not subscriptable" },
    { title: 'Looping over None',            code: "def find_users():\n    pass  # forgot to return\n\nfor user in find_users():\n    pass", returns: "TypeError: 'NoneType' object is not iterable" },
    { title: 'Missing argument',             code: "def greet(name, greeting):\n    return f'{greeting}, {name}'\n\ngreet('Ann')", returns: "TypeError: greet() missing 1 required positional argument: 'greeting'" },
    { title: 'Too many arguments',           code: "def greet(name):\n    return 'Hi ' + name\n\ngreet('Ann', 'Bob')", returns: 'TypeError: greet() takes 1 positional argument but 2 were given' },
    { title: 'Unhashable dict key',          code: "{[1, 2]: 'pair'}",                                   returns: "TypeError: unhashable type: 'list'" },
    { title: 'Sorting mixed types',          code: "sorted([3, '10', 2])",                              returns: "TypeError: '<' not supported between instances of 'str' and 'int'" },
  ],

  pitfalls: [
    {
      name: 'list.sort() returns None',
      desc: 'In-place methods (sort, append, reverse, update) return None. Assigning their result replaces your data with None, and the TypeError appears one line later.',
      wrong: { label: 'nums = nums.sort()', code: "nums = [3, 1, 2]\nnums = nums.sort()\nnums[0]", output: "TypeError: 'NoneType' object is not subscriptable" },
      fix:   { label: 'sorted() returns a list', code: "nums = [3, 1, 2]\nnums = sorted(nums)\nnums[0]", output: '1' },
    },
    {
      name: 'Shadowing a built-in',
      desc: "A variable named list, str, dict, sum or input hides the built-in for the rest of the module; calling it later gives 'X' object is not callable.",
      wrong: { label: 'str = …', code: "str = 'hello'\nstr(42)", output: "TypeError: 'str' object is not callable" },
      fix:   { label: 'Different name', code: "text = 'hello'\nstr(42)", output: "'42'" },
    },
    {
      name: 'input() always returns str',
      desc: 'Numbers typed by the user, read from a file or from os.environ arrive as text. Convert before doing arithmetic.',
      wrong: { label: 'Arithmetic on text', code: "age = '30'  # from input()\nage + 1", output: 'TypeError: can only concatenate str (not "int") to str' },
      fix:   { label: 'int() first', code: "age = '30'  # from input()\nint(age) + 1", output: '31' },
    },
    {
      name: 'Calling a method on the class',
      desc: "Calling through the class instead of an instance means nothing is passed for self — Python reports it as a missing argument.",
      wrong: { label: 'Cart.total()', code: "class Cart:\n    def total(self):\n        return 0\n\nCart.total()", output: "TypeError: Cart.total() missing 1 required positional argument: 'self'" },
      fix:   { label: 'Cart().total()', code: "class Cart:\n    def total(self):\n        return 0\n\nCart().total()", output: '0' },
    },
  ],

  when: {
    use: [
      'Raising it when a caller passes an argument of the wrong type to your function',
      'Catching it around duck-typed code that may receive unsupported objects',
      'Returning NotImplemented from operator methods so Python raises it for you',
    ],
    avoid: [
      'The type is right but the value is bad (negative size, bad string) → ValueError',
      'A required attribute or method is missing on an object → AttributeError',
      'Wrapping big blocks in except TypeError — it also hides real bugs inside',
    ],
  },

  notes: {
    cpython:          'Objects/abstract.c — binary_op1() tries a.__add__ then b.__radd__; if both return NotImplemented, the "unsupported operand type(s)" message is built from both type names',
    'str on the left': 'str.__add__ raises its own message first: can only concatenate str (not "int") to str',
    'Catch via':      'except TypeError, or except Exception. It has no built-in subclasses.',
    'Rule of thumb':  'Wrong kind of object → TypeError. Right kind, unacceptable value → ValueError.',
  },

  related: [
    { name: 'ValueError',     slug: 'valueerror',     when: 'Right type, wrong value' },
    { name: 'AttributeError', slug: 'attributeerror', when: "None.append(…) — missing attribute, not wrong operand" },
    { name: 'isinstance',     slug: 'isinstance',     when: 'Check the type before using a value', category: 'functions' },
    { name: 'type',           slug: 'type',           when: 'type(x).__name__ for error messages', category: 'functions' },
    { name: 'str',            slug: 'str',            when: 'Convert a number before concatenating', category: 'functions' },
    { name: 'int',            slug: 'int',            when: 'Convert text before arithmetic', category: 'functions' },
    { name: '+',              slug: 'add',            when: 'Which type pairs + supports', category: 'operators' },
  ],

  faq: [
    {
      q: 'What does TypeError: can only concatenate str (not "int") to str mean?',
      a: "You used + between a str and a number, e.g. 'Total: ' + 5. Python never converts automatically. Use an f-string (f'Total: {n}'), str(n), or print('Total:', n) — print converts each argument for you.",
    },
    {
      q: "How do I fix 'NoneType' object is not subscriptable (or not iterable / not callable)?",
      a: "A variable you index, loop over or call is None. The usual sources: a function without a return statement, an in-place method whose result you assigned (x = x.sort()), dict.get() or re.match() finding nothing. Print or check the variable just before the failing line and trace back where it was set to None.",
    },
    {
      q: 'Should I raise TypeError or ValueError?',
      a: "TypeError when the argument is the wrong kind of object (a str where a number is needed, None, a list where a hashable is needed). ValueError when the type is acceptable but this particular value is not (int('abc'), a negative length, an unknown mode name). int() itself shows the rule: int(None) is a TypeError, int('abc') is a ValueError.",
    },
    {
      q: "Why does 1 + 'a' give a different message than 'a' + 1?",
      a: "'a' + 1 is handled by str.__add__, which raises can only concatenate str (not \"int\") to str. For 1 + 'a', int.__add__ returns NotImplemented, Python then tries str.__radd__, which does not exist, so it reports unsupported operand type(s) for +: 'int' and 'str'.",
    },
    {
      q: 'What does "missing 1 required positional argument" mean?',
      a: "The function was called with fewer arguments than it has parameters without defaults. When the missing one is 'self', you called a method on the class (Cart.total()) instead of on an instance (Cart().total()), or forgot the parentheses when creating the instance.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#TypeError',
    meta:  'Built-in exceptions',
  },
};

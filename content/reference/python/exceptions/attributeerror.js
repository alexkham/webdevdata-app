// content/reference/python/exceptions/attributeerror.js

export const meta = {
  slug:        'attributeerror',
  name:        'AttributeError',
  signature:   'AttributeError(*args, name=None, obj=None)',
  blurb:       'Raised when an attribute reference or assignment fails — obj.x where obj has no x.',
  category:    'lookup',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: "attributeerror attribute error object has no attribute nonetype 'nonetype' object has no attribute module has no attribute did you mean typo method missing getattr hasattr",
};

export const method = {
  slug:      'attributeerror',
  name:      'AttributeError',
  signature: 'AttributeError(*args, name=None, obj=None)',

  category:    'Lookup exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: "obj.x where obj has no x. Read the type in the message first — 'NoneType' object has no attribute means the bug is wherever that None came from, not the attribute.",

  chain: ['BaseException', 'Exception', 'AttributeError'],

  cheat: {
    raisedBy: 'obj.attr, obj.attr = v, del obj.attr, getattr(obj, name)',
    message:  "'<type>' object has no attribute '<name>' · module 'm' has no attribute 'x'",
    quickFix: "getattr(obj, name, default) · check for None first",
    watchOut: '"Did you mean" is added by the traceback, not part of str(e)',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Usually one message string. str(e) is that message.' },
    { name: 'name',  type: 'str | None', required: false, default: 'None', desc: 'Keyword-only. The attribute that was looked up. Filled in automatically for failed lookups (3.10+).' },
    { name: 'obj',   type: 'object', required: false, default: 'None', desc: 'Keyword-only. The object the lookup was made on (3.10+).' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Look up an attribute by name on an instance with two attributes, name and email. Try a typo.',
      params: [{ name: 'attr', type: 'str', hint: 'attribute name', input: 'text' }],
      template: "class User:\n    def __init__(self):\n        self.name = 'Ada'\n        self.email = 'ada@example.com'\n\nu = User()\ngetattr(u, {$attr})",
      cases: [
        { id: 'ok',    label: 'existing',   values: { attr: 'email' } },
        { id: 'typo',  label: 'typo',       values: { attr: 'emial' } },
        { id: 'case',  label: 'wrong case', values: { attr: 'Name' } },
        { id: 'far',   label: 'no match',   values: { attr: 'age' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: "re.match() returns None when the pattern does not match — calling .group() on it is the classic 'NoneType' error.",
      params: [{ name: 'text', type: 'str', hint: 'string to parse', input: 'text' }],
      template: "import re\nm = re.match(r'[0-9]+', {$text})\ntry:\n    n = int(m.group())\nexcept AttributeError as e:\n    n = f'no match: {e}'\nn",
      cases: [
        { id: 'match',   label: 'leading digits', values: { text: '42 apples' } },
        { id: 'nomatch', label: 'no digits',      values: { text: 'apples' } },
        { id: 'later',   label: 'digits later',   values: { text: 'x42' } },
      ],
    },
  ],
  demoExplainer: "In Trigger, a close typo gets . Did you mean: 'email'? on the traceback line, while age (nothing similar) gets none. That suggestion is computed by the traceback printer — f'{e}' in Handle shows the plain str(e), which never contains it. In Handle, the error names NoneType, not re.Match: the real problem is that match() found nothing. Checking if m is None is usually clearer than catching the exception.",

  attributes: [
    { name: 'name', type: 'str | None', meaning: 'The attribute name that was not found (3.10+). Set automatically by failed attribute lookups, including getattr().' },
    { name: 'obj',  type: 'object',     meaning: 'The object the attribute was looked up on (3.10+) — for the NoneType case, None itself.' },
    { name: 'args', type: 'tuple',      meaning: 'The constructor arguments; args[0] is the message string.' },
  ],

  patterns: [
    {
      name: 'Optional attribute with a default',
      desc: 'getattr with a third argument returns the default instead of raising.',
      code: "timeout = getattr(config, 'timeout', 30)",
    },
    {
      name: 'Guard against None before the call',
      desc: "Most 'NoneType' object has no attribute errors come from a function that returned None. Check at the source.",
      code: "m = re.match(pattern, text)\nif m is None:\n    raise ValueError(f'unexpected format: {text!r}')\nvalue = m.group(1)",
    },
    {
      name: 'Dynamic attributes via __getattr__',
      desc: '__getattr__ is only called when normal lookup fails; raise AttributeError (not KeyError) for unknown names so getattr defaults and hasattr keep working.',
      code: "class Settings:\n    def __init__(self, data):\n        self._data = data\n    def __getattr__(self, attr):\n        try:\n            return self._data[attr]\n        except KeyError:\n            raise AttributeError(f'no setting named {attr!r}') from None",
    },
    {
      name: 'Feature detection',
      desc: 'hasattr() calls getattr() and returns False on AttributeError.',
      code: "if hasattr(stream, 'fileno'):\n    fd = stream.fileno()",
    },
  ],

  examples: [
    { title: 'Method on None',                code: "None.upper()",                             returns: "AttributeError: 'NoneType' object has no attribute 'upper'" },
    { title: 'list.sort() returns None',      code: "nums = [3, 1, 2]\nnums = nums.sort()\nnums.append(4)", returns: "AttributeError: 'NoneType' object has no attribute 'append'" },
    { title: 'Module attribute typo',         code: "import json\njson.laods('[]')",           returns: "AttributeError: module 'json' has no attribute 'laods'. Did you mean: 'loads'?" },
    { title: 'Method from another language',  code: "[].push(1)",                               returns: "AttributeError: 'list' object has no attribute 'push'" },
    { title: 'Dict keys are not attributes',  code: "d = {'name': 'Ada'}\nd.name",              returns: "AttributeError: 'dict' object has no attribute 'name'" },
    { title: 'On a class, not an instance',   code: "class C:\n    pass\nC.x",                   returns: "AttributeError: type object 'C' has no attribute 'x'" },
    { title: 'e.name and e.obj',              code: "try:\n    'text'.foo\nexcept AttributeError as e:\n    r = (e.name, e.obj)\nr", returns: "('foo', 'text')" },
    { title: 'str(e) has no suggestion',      code: "try:\n    [].appendd\nexcept AttributeError as e:\n    r = str(e)\nr", returns: "\"'list' object has no attribute 'appendd'\"" },
  ],

  pitfalls: [
    {
      name: 'Assigning the result of an in-place method',
      desc: 'list.sort(), list.append(), dict.update() and friends mutate in place and return None. Reassigning turns the variable into None.',
      wrong: { label: 'nums = nums.sort()', code: "nums = [3, 1, 2]\nnums = nums.sort()\nnums.append(4)", output: "AttributeError: 'NoneType' object has no attribute 'append'" },
      fix:   { label: 'nums.sort()',        code: "nums = [3, 1, 2]\nnums.sort()\nnums.append(4)\nnums", output: '[1, 2, 3, 4]' },
    },
    {
      name: 'Using the match object without checking it',
      desc: 're.match/re.search return None when nothing matches, so .group() fails with a NoneType message far from the real cause.',
      wrong: { label: 'm.group()',     code: "import re\nm = re.match(r'[0-9]+', 'abc')\nm.group()", output: "AttributeError: 'NoneType' object has no attribute 'group'" },
      fix:   { label: 'check m first', code: "import re\nm = re.match(r'[0-9]+', 'abc')\nn = m.group() if m else None\nn is None", output: 'True' },
    },
    {
      name: 'An AttributeError inside a property looks like a missing property',
      desc: 'A bug inside a @property getter raises AttributeError for the inner name, and __getattr__ fallbacks or hasattr() will silently treat it as "attribute missing".',
      wrong: { label: 'hasattr hides the bug', code: "class A:\n    @property\n    def total(self):\n        return self.itmes  # typo\nhasattr(A(), 'total')", output: 'False' },
      fix:   { label: 'Access it directly',    code: "class A:\n    @property\n    def total(self):\n        return self.itmes  # typo\nA().total", output: "AttributeError: 'A' object has no attribute 'itmes'" },
    },
    {
      name: 'Slots block new attributes',
      desc: 'A class with __slots__ (and plain object()) has no per-instance __dict__, so assigning an undeclared name fails.',
      wrong: { label: 'Undeclared name', code: "class P:\n    __slots__ = ('x',)\np = P()\np.y = 1", output: "AttributeError: 'P' object has no attribute 'y' and no __dict__ for setting new attributes" },
      fix:   { label: 'Declare it',      code: "class P:\n    __slots__ = ('x', 'y')\np = P()\np.y = 1\np.y", output: '1' },
    },
  ],

  when: {
    use: [
      'Raising it from __getattr__ / __getattribute__ for unknown names',
      'Catching it for duck typing when an optional method may be missing',
      'Read-only attributes: raise it from a property setter or __setattr__',
    ],
    avoid: [
      'Optional attribute → getattr(obj, name, default)',
      'Value may be None → test is None before using it',
      'Wrapping large blocks in except AttributeError — it hides typos',
    ],
  },

  notes: {
    'Did you mean': "Added by the traceback formatter (traceback.TracebackException), using e.name and e.obj — not stored in the exception. Custom sys.excepthook or logging with str(e) will not show it.",
    'Message shapes': "'T' object has no attribute 'x' (instance), type object 'T' has no attribute 'x' (class), module 'm' has no attribute 'x' (module)",
    'Read-only': "Built-in types reject assignment: 'str' object attribute 'upper' is read-only",
    'hasattr':   'hasattr(obj, name) is getattr() plus except AttributeError — any AttributeError raised inside a property counts as missing',
  },

  related: [
    { name: 'NameError',   slug: 'nameerror',   when: 'A bare name (no dot) is not defined' },
    { name: 'TypeError',   slug: 'typeerror',   when: 'The object does not support attributes at all, or wrong call' },
    { name: 'ImportError', slug: 'importerror', when: 'from module import name fails' },
    { name: 'getattr',     slug: 'getattr',     when: 'Dynamic lookup, with an optional default', category: 'functions' },
    { name: 'hasattr',     slug: 'hasattr',     when: 'Test before access', category: 'functions' },
    { name: 'setattr',     slug: 'setattr',     when: 'Dynamic assignment', category: 'functions' },
    { name: 'dir',         slug: 'dir',         when: 'List the attributes an object actually has', category: 'functions' },
  ],

  faq: [
    {
      q: "What does 'NoneType' object has no attribute mean?",
      a: "The variable you called the method on is None. Typical sources: a function without a return statement, an in-place method whose result was assigned (x = x.sort()), re.match() that found nothing, or dict.get() on a missing key. Fix the place that produced None, or check is None before using it.",
    },
    {
      q: 'Why does my error show "Did you mean" but str(e) does not?',
      a: "Since Python 3.10 the traceback printer computes a suggestion from e.name and dir(e.obj) and appends . Did you mean: 'x'? to the displayed line. It is not part of the exception message, so str(e), e.args and logging that uses them never contain it. Suggestions only appear for close matches — about a third of the characters may differ.",
    },
    {
      q: "Why do I get module has no attribute when the function exists?",
      a: "Usually a local file shadows the real module (a json.py or random.py in your project folder gets imported instead), a submodule was not imported (import xml does not load xml.etree — import xml.etree.ElementTree does), or the function was added in a newer version than the one running. Check module.__file__ to see which file was imported.",
    },
    {
      q: 'AttributeError vs NameError?',
      a: 'NameError is for a bare name that is not defined anywhere in scope (prnt(1)). AttributeError is for a dotted lookup — the object exists but has no attribute with that name (math.sqr, None.upper).',
    },
    {
      q: 'How do I check if an object has an attribute?',
      a: 'hasattr(obj, "x") returns True or False, and getattr(obj, "x", default) returns a fallback value. Both work by catching AttributeError, so they also treat an AttributeError raised inside a property as "missing".',
    },
  ],

  history: [
    { version: '3.10', note: 'Added the name and obj attributes.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#AttributeError',
    meta:  'Built-in exceptions',
  },

};

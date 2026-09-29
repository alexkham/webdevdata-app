// content/reference/python/exceptions/notimplementederror.js

export const meta = {
  slug:        'notimplementederror',
  name:        'NotImplementedError',
  signature:   'NotImplementedError(*args)',
  blurb:       'Raised by a base-class method that a subclass was supposed to override — not to be confused with the NotImplemented constant.',
  category:    'runtime',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 'notimplementederror not implemented error notimplemented abstract method override subclass must implement abc abstractmethod stub',
};

export const method = {
  slug:      'notimplementederror',
  name:      'NotImplementedError',
  signature: 'NotImplementedError(*args)',

  category:    'Runtime exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The base class says "a subclass must provide this" — you get the error only when the missing method is actually called, not when the object is created.',

  chain: ['BaseException', 'Exception', 'RuntimeError', 'NotImplementedError'],

  cheat: {
    raisedBy: 'raise NotImplementedError in a base-class method a subclass did not override',
    message:  'whatever you pass — often empty',
    quickFix: 'implement the method in the subclass',
    watchOut: 'NotImplemented (constant) is for operators; NotImplementedError is for methods',
  },

  parameters: [
    { name: '*args', type: 'object', required: false, default: null, desc: 'Optional message, e.g. which method must be overridden. With no args the traceback line is the bare class name.' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Pick an exporter. JsonExporter inherits export() from the base class without overriding it.',
      params: [{ name: 'fmt', type: 'str', hint: 'csv, json, …', input: 'text' }],
      template: "class Exporter:\n    def export(self, data):\n        raise NotImplementedError('subclasses must implement export()')\nclass CsvExporter(Exporter):\n    def export(self, data):\n        return ','.join(data)\nclass JsonExporter(Exporter):\n    pass\nexporters = {'csv': CsvExporter(), 'json': JsonExporter()}\nexporters[{$fmt}].export(['a', 'b'])",
      cases: [
        { id: 'csv',  label: 'implemented', values: { fmt: 'csv' } },
        { id: 'json', label: 'not overridden', values: { fmt: 'json' } },
        { id: 'xml',  label: 'unknown format', values: { fmt: 'xml' } },
      ],
    },
    {
      id: 'raise',
      label: 'Raise',
      blurb: 'Raise it yourself. The message is optional; an empty one leaves just the class name.',
      params: [{ name: 'msg', type: 'str', hint: 'message', input: 'text' }],
      template: 'raise NotImplementedError({$msg})',
      cases: [
        { id: 'msg',   label: 'with message', values: { msg: 'area() is abstract' } },
        { id: 'empty', label: 'empty message', values: { msg: '' } },
      ],
    },
  ],
  demoExplainer: "Creating JsonExporter() worked fine — the error only appears when export() is called, because the base method runs and raises. Compare the unknown format: that is a KeyError from the dict, a different problem entirely. abc.abstractmethod (see the pitfalls) moves the failure earlier, to object creation.",

  attributes: [
    { name: 'args', type: 'tuple', meaning: 'The message you passed, or () for a bare raise NotImplementedError.' },
  ],

  patterns: [
    {
      name: 'Base-class hook',
      desc: 'The classic use: a method that subclasses must provide. Name it in the message.',
      code: "class Shape:\n    def area(self):\n        raise NotImplementedError(f'{type(self).__name__} must implement area()')",
    },
    {
      name: 'Enforced at creation with abc',
      desc: 'An ABC refuses to instantiate a subclass that forgot an abstract method — the bug shows up at construction, not deep in a call.',
      code: "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): ...",
    },
    {
      name: 'Binary operator: return NotImplemented',
      desc: 'For __eq__, __add__, __lt__ and friends, return the NotImplemented constant so Python can try the other operand — never raise NotImplementedError there.',
      code: "class Money:\n    def __init__(self, cents):\n        self.cents = cents\n    def __add__(self, other):\n        if not isinstance(other, Money):\n            return NotImplemented\n        return Money(self.cents + other.cents)",
    },
  ],

  examples: [
    { title: 'Bare raise',                code: 'raise NotImplementedError', returns: 'NotImplementedError' },
    { title: 'With a message',            code: "raise NotImplementedError('export() for PDF')", returns: 'NotImplementedError: export() for PDF' },
    { title: 'Subclass forgot to override', code: "class Shape:\n    def area(self):\n        raise NotImplementedError('area')\nclass Square(Shape):\n    pass\nSquare().area()", returns: 'NotImplementedError: area' },
    { title: 'abc catches it earlier',    code: "from abc import ABC, abstractmethod\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): ...\nclass Square(Shape):\n    pass\nSquare()", returns: "TypeError: Can't instantiate abstract class Square without an implementation for abstract method 'area'" },
    { title: 'NotImplemented is not an exception', code: 'type(NotImplemented).__name__', returns: "'NotImplementedType'" },
    { title: 'Returning NotImplemented from an operator', code: "class Money:\n    def __init__(self, cents):\n        self.cents = cents\n    def __add__(self, other):\n        if not isinstance(other, Money):\n            return NotImplemented\n        return Money(self.cents + other.cents)\nMoney(5) + 1", returns: "TypeError: unsupported operand type(s) for +: 'Money' and 'int'" },
    { title: 'It is a RuntimeError', code: 'issubclass(NotImplementedError, RuntimeError)', returns: 'True' },
  ],

  pitfalls: [
    {
      name: 'raise NotImplemented',
      desc: 'NotImplemented is a constant, not an exception class. Raising it is itself an error — the real one you meant is NotImplementedError.',
      wrong: { label: 'raise NotImplemented', code: "class Shape:\n    def area(self):\n        raise NotImplemented\nShape().area()", output: 'TypeError: exceptions must derive from BaseException' },
      fix:   { label: 'raise NotImplementedError', code: "class Shape:\n    def area(self):\n        raise NotImplementedError('area')\nShape().area()", output: 'NotImplementedError: area' },
    },
    {
      name: 'Raising NotImplementedError from __eq__',
      desc: 'Operators expect the NotImplemented return value so Python can fall back (the reflected method, or identity for ==). Raising blows up every comparison with a foreign type — including membership tests in lists.',
      wrong: { label: 'raise in __eq__', code: "class Money:\n    def __init__(self, cents):\n        self.cents = cents\n    def __eq__(self, other):\n        if not isinstance(other, Money):\n            raise NotImplementedError\n        return self.cents == other.cents\nMoney(5) == 5", output: 'NotImplementedError' },
      fix:   { label: 'return NotImplemented', code: "class Money:\n    def __init__(self, cents):\n        self.cents = cents\n    def __eq__(self, other):\n        if not isinstance(other, Money):\n            return NotImplemented\n        return self.cents == other.cents\nMoney(5) == 5", output: 'False' },
    },
    {
      name: 'The error surfaces late',
      desc: 'A plain base method lets you create the half-finished object; the bug appears only when that code path runs, maybe in production. abc.abstractmethod fails at construction.',
      wrong: { label: 'Plain base method', code: "class Plugin:\n    def run(self):\n        raise NotImplementedError\nclass Broken(Plugin):\n    pass\np = Broken()\n'created'", output: "'created'" },
      fix:   { label: 'abstractmethod', code: "from abc import ABC, abstractmethod\nclass Plugin(ABC):\n    @abstractmethod\n    def run(self): ...\nclass Broken(Plugin):\n    pass\np = Broken()\n'created'", output: "TypeError: Can't instantiate abstract class Broken without an implementation for abstract method 'run'" },
    },
  ],

  when: {
    use: [
      'A base-class method every subclass must override',
      'A stub for a feature still being written (with a message saying so)',
      'A method that is legitimately unsupported for one specific subclass, e.g. write() on a read-only backend',
    ],
    avoid: [
      'Binary operators and rich comparisons → return NotImplemented',
      'An operation that should never exist on the class → leave it undefined (or set it to None in a subclass)',
      'Enforcing overrides at creation time → abc.ABC + @abstractmethod',
    ],
  },

  notes: {
    'NotImplemented': "A singleton of type NotImplementedType, returned by __eq__/__add__/… to mean 'try the other operand'",
    'Catch via':      'except RuntimeError also catches it',
    docs:             'The docs say it should not be used for operators or methods not meant to be supported at all',
  },

  related: [
    { name: 'RuntimeError', slug: 'runtimeerror', when: 'Its base class' },
    { name: 'TypeError',    slug: 'typeerror',    when: 'What you get when both operands return NotImplemented, or abc blocks instantiation' },
    { name: 'AttributeError', slug: 'attributeerror', when: 'What a method that simply does not exist raises' },
    { name: 'super()',      slug: 'super',        when: 'Calling the base implementation from an override', category: 'functions' },
    { name: '==',           slug: 'eq',           when: 'Falls back to identity when __eq__ returns NotImplemented', category: 'operators' },
    { name: '+',            slug: 'add',          when: 'Tries __radd__ after NotImplemented', category: 'operators' },
  ],

  faq: [
    {
      q: 'What is the difference between NotImplemented and NotImplementedError?',
      a: "NotImplementedError is an exception you raise from a method a subclass must override. NotImplemented is a constant you RETURN from binary operator methods (__eq__, __add__, __lt__, …) to say 'I do not know how to handle this type' — Python then tries the other operand's reflected method and, if that also returns NotImplemented, raises TypeError (or, for ==, falls back to identity). They are not interchangeable: raise NotImplemented is a TypeError, and raising NotImplementedError from __eq__ breaks comparisons.",
    },
    {
      q: 'Should I use NotImplementedError or abc.abstractmethod?',
      a: "abstractmethod when you want Python to refuse to create an incomplete subclass — the TypeError appears at construction. A method that raises NotImplementedError is looser: the object can be created and the error appears only if the method is called, which suits optional hooks and methods only some subclasses support. They combine fine: an abstract method's body can itself raise NotImplementedError.",
    },
    {
      q: 'Why does raise NotImplemented give a TypeError?',
      a: 'Only instances or subclasses of BaseException can be raised, and NotImplemented is neither — it is a plain singleton object. Python reports: TypeError: exceptions must derive from BaseException.',
    },
    {
      q: 'Why is NotImplementedError a subclass of RuntimeError?',
      a: 'Historical classification: it signals a problem found while the program runs rather than a bad value or type. In practice this means except RuntimeError catches it too, which can hide a missing override — catch it explicitly if you mean to.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/exceptions.html#NotImplementedError',
    meta:  'Built-in exceptions',
  },
};

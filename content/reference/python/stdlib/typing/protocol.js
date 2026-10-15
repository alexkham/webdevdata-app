// content/reference/python/stdlib/typing/protocol.js — Protocol and @runtime_checkable

export const meta = {
  slug:        'protocol',
  name:        'typing.Protocol / @runtime_checkable',
  signature:   'class Name(Protocol): ... · @runtime_checkable',
  blurb:       'Structural typing ("static duck typing"): a Protocol lists the methods and attributes a type needs, and any class that has them matches — without inheriting from it. @runtime_checkable adds a presence-only isinstance() check.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.8+',
  searchTerms: 'typing.Protocol Protocol runtime_checkable structural subtyping static duck typing interface isinstance protocol abc vs protocol implicit interface pep 544 Instance and class checks can only be used with @runtime_checkable protocols',
};

export const method = {
  slug:      'protocol',
  name:      'typing.Protocol / @runtime_checkable',
  signature: 'class Name(Protocol): ... · @runtime_checkable',
  returns:   { type: 'type', desc: 'A protocol class (metaclass typing._ProtocolMeta). runtime_checkable returns the same class, marked for isinstance().' },

  category:    'typing protocols',
  version:     'Python 3.8+',
  hasLiveDemo: false,

  subtitle: 'An ABC asks "did you inherit from me?"; a Protocol asks "do you have these members?". The type checker compares signatures. At runtime a protocol does almost nothing: it cannot be instantiated, and isinstance() works only with @runtime_checkable — and then checks only that the names exist.',

  covers: ['Protocol', 'runtime_checkable'],

  cheat: {
    commonCall: 'class Closable(Protocol):\n    def close(self) -> None: ...',
    returns:    'a protocol class; any class with close() matches it',
    replaces:   'Abstract base classes that every implementation must inherit from',
    watchOut:   'runtime_checkable checks presence only — not signatures, not attribute types',
  },

  parameters: [],

  patterns: [
    {
      name: 'Accept anything with the right method',
      desc: 'File objects, sockets and your own classes all qualify without changes.',
      code: 'from typing import Protocol\n\nclass Closable(Protocol):\n    def close(self) -> None: ...\n\ndef shutdown(resources: list[Closable]) -> None:\n    for r in resources:\n        r.close()',
    },
    {
      name: 'Attributes as protocol members',
      desc: 'Annotated names are required attributes.',
      code: 'from typing import Protocol\n\nclass Named(Protocol):\n    name: str\n\ndef label(x: Named) -> str:\n    return x.name.title()',
    },
    {
      name: 'Generic protocol (3.12+)',
      desc: 'Type parameters work as in any generic class.',
      code: 'from typing import Protocol\n\nclass Source[T](Protocol):\n    def read(self) -> T: ...',
    },
    {
      name: 'Runtime check for optional capabilities',
      desc: 'Branch on whether an object supports something.',
      code: 'from typing import Protocol, runtime_checkable\n\n@runtime_checkable\nclass Flushable(Protocol):\n    def flush(self) -> None: ...\n\ndef finish(stream: object) -> None:\n    if isinstance(stream, Flushable):\n        stream.flush()',
    },
  ],

  examples: [
    { title: 'Plain protocols refuse isinstance', code: 'from typing import Protocol\nclass Closable(Protocol):\n    def close(self) -> None: ...\nclass File:\n    def close(self) -> None: pass\nisinstance(File(), Closable)', returns: 'TypeError: Instance and class checks can only be used with @runtime_checkable protocols' },
    { title: '@runtime_checkable enables it', code: 'import io\nfrom typing import Protocol, runtime_checkable\n@runtime_checkable\nclass Closable(Protocol):\n    def close(self) -> None: ...\nclass File:\n    def close(self) -> None: pass\nclass Rock:\n    pass\n(isinstance(File(), Closable), isinstance(Rock(), Closable), isinstance(io.StringIO(), Closable))', returns: '(True, False, True)' },
    { title: 'Only presence is checked', code: 'from typing import Protocol, runtime_checkable\n@runtime_checkable\nclass Named(Protocol):\n    name: str\nclass Product:\n    def __init__(self):\n        self.name = 42\nisinstance(Product(), Named)', returns: 'True' },
    { title: 'Protocols cannot be instantiated', code: 'from typing import Protocol\nclass Closable(Protocol):\n    def close(self) -> None: ...\nClosable()', returns: 'TypeError: Protocols cannot be instantiated' },
    { title: 'Explicit subclasses inherit default methods', code: "from typing import Protocol\nclass Greeter(Protocol):\n    def name(self) -> str: ...\n    def greet(self) -> str:\n        return f'Hello, {self.name()}'\nclass English(Greeter):\n    def name(self) -> str:\n        return 'Ada'\nEnglish().greet()", returns: "'Hello, Ada'" },
    { title: 'Data members rule out issubclass', code: 'from typing import Protocol, runtime_checkable\n@runtime_checkable\nclass Named(Protocol):\n    name: str\nissubclass(int, Named)', returns: "TypeError: Protocols with non-method members don't support issubclass(). Non-method members: 'name'." },
    { title: 'runtime_checkable needs a protocol', code: 'from typing import runtime_checkable\n@runtime_checkable\nclass Rock:\n    pass', returns: "TypeError: @runtime_checkable can be only applied to protocol classes, got <class '__main__.Rock'>" },
  ],

  pitfalls: [
    {
      name: 'isinstance on a protocol without @runtime_checkable',
      desc: 'Protocols are static by default. Decorate the protocol if you need runtime checks.',
      wrong: { label: 'plain Protocol', code: 'from typing import Protocol\nclass Sized(Protocol):\n    def __len__(self) -> int: ...\nisinstance([1, 2], Sized)', output: 'TypeError: Instance and class checks can only be used with @runtime_checkable protocols' },
      fix:   { label: '@runtime_checkable', code: 'from typing import Protocol, runtime_checkable\n@runtime_checkable\nclass Sized(Protocol):\n    def __len__(self) -> int: ...\nisinstance([1, 2], Sized)', output: 'True' },
    },
    {
      name: 'Trusting a runtime protocol check for types',
      desc: 'isinstance() against a runtime protocol confirms the attribute exists, nothing more. Check the value too when it matters.',
      wrong: { label: 'presence only', code: 'from typing import Protocol, runtime_checkable\n@runtime_checkable\nclass Named(Protocol):\n    name: str\nclass Product:\n    name = 42\nisinstance(Product(), Named)', output: 'True' },
      fix:   { label: 'check the value', code: 'from typing import Protocol, runtime_checkable\n@runtime_checkable\nclass Named(Protocol):\n    name: str\nclass Product:\n    name = 42\np = Product()\nisinstance(p, Named) and isinstance(p.name, str)', output: 'False' },
    },
  ],

  when: {
    use: [
      'Parameters that need a capability (a read() method, a name attribute) rather than a specific class',
      'Typing third-party objects you cannot make inherit from your base class',
      'Callable shapes Callable[...] cannot express: a Protocol with __call__',
    ],
    avoid: [
      'Sharing implementation → an ABC or a regular base class',
      'Hot-path isinstance() checks → the docs warn they can be surprisingly slow; prefer hasattr()',
      'Validating data → runtime protocol checks ignore types',
    ],
  },

  notes: {
    cpython:     'Lib/typing.py: Protocol (metaclass _ProtocolMeta) and runtime_checkable; since 3.12 isinstance() uses inspect.getattr_static() and the member set is frozen when the class is created',
    'Members':   'Methods and annotated attributes defined in the protocol body (not in object) — see typing.get_protocol_members() (3.13)',
    'Generic':   'class P[T](Protocol) (3.12+) or class P(Protocol[T])',
  },

  related: [
    { name: 'SupportsInt / SupportsAbs …', slug: 'supportsint', when: 'Ready-made runtime-checkable protocols' },
    { name: 'get_protocol_members / is_protocol', slug: 'get_type_hints', when: 'Introspect protocols (3.13)' },
    { name: 'Iterable / Sequence / Mapping …', slug: 'iterable', when: 'The collections.abc ABCs — structural for many checks too' },
    { name: 'Callable / Concatenate', slug: 'callable', when: 'Simple function shapes' },
    { name: 'isinstance()', slug: 'isinstance', when: 'Needs @runtime_checkable for protocols', category: 'functions' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'A protocol is a class you define, matched against other classes and objects you define. A demo box can only send text and numbers, not class definitions, so the examples below write the protocols and the classes out in code and show the isinstance() results with fixed, verified output.',
    },
    {
      q: 'What is the difference between Protocol and ABC in Python?',
      a: 'An ABC is nominal: a class matches when it inherits from (or is registered with) the ABC. A Protocol is structural: a class matches when it has the listed methods and attributes, with no inheritance. Use Protocol to describe what you need from objects you do not control.',
    },
    {
      q: 'Why does isinstance raise "Instance and class checks can only be used with @runtime_checkable protocols"?',
      a: 'Protocols are meant for type checkers. Decorate the protocol class with @typing.runtime_checkable to allow isinstance() and issubclass() — which then only verify that the members exist.',
    },
    {
      q: 'Does runtime_checkable check method signatures?',
      a: 'No. It checks only that each protocol member is present on the object. Argument types, return types and attribute value types are not examined; the docs call it a simple-minded structural check.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.Protocol',
    meta:  'typing.Protocol',
  },

};

// content/reference/python/stdlib/dataclasses/missing.js

export const meta = {
  slug:        'missing',
  name:        'dataclasses.MISSING',
  signature:   'dataclasses.MISSING',
  blurb:       'The sentinel meaning "no default given" in Field.default, Field.default_factory and field(kw_only=...) — needed because None is a perfectly good default.',
  category:    'constants',
  type:        'constant',
  hasLiveDemo: false,
  version:     'Python 3.7+',
  searchTerms: 'MISSING dataclasses.MISSING sentinel no default value required field check if field has default f.default is MISSING default_factory _MISSING_TYPE None vs missing',
};

export const method = {
  slug:      'missing',
  name:      'dataclasses.MISSING',
  signature: 'dataclasses.MISSING',
  returns:   { type: '_MISSING_TYPE', desc: 'A single instance of the private class dataclasses._MISSING_TYPE. Compare it with is.' },

  category:    'dataclasses constant',
  version:     'Python 3.7+',
  hasLiveDemo: false,

  subtitle: 'field() uses MISSING as the default of default, default_factory and kw_only, so it can tell "not given" apart from None. You meet it when reading Field objects: a field is required when both default and default_factory are MISSING.',

  covers: ['MISSING'],

  cheat: {
    commonCall: 'f.default is MISSING and f.default_factory is MISSING',
    returns:    'True for a required field',
    replaces:   'checking for None, which is a valid default',
    watchOut:   'MISSING is truthy — never test it with if / not',
  },

  parameters: [],

  patterns: [
    {
      name: 'Required fields',
      desc: 'Neither a default nor a factory.',
      code: 'from dataclasses import fields, MISSING\nrequired = [f.name for f in fields(cls) if f.default is MISSING and f.default_factory is MISSING]',
    },
    {
      name: 'Default value of a field',
      desc: 'Call the factory when there is one.',
      code: "from dataclasses import MISSING\n\ndef default_of(f):\n    if f.default is not MISSING:\n        return f.default\n    if f.default_factory is not MISSING:\n        return f.default_factory()\n    raise TypeError(f'{f.name} is required')",
    },
  ],

  examples: [
    { title: 'A field without a default', code: 'from dataclasses import dataclass, fields, MISSING\n\n@dataclass\nclass C:\n    x: int\n\nfields(C)[0].default is MISSING, fields(C)[0].default_factory is MISSING', returns: '(True, True)' },
    { title: 'Find the required fields', code: 'from dataclasses import dataclass, field, fields, MISSING\n\n@dataclass\nclass Job:\n    name: str\n    owner: str | None = None\n    retries: int = 3\n    tags: list = field(default_factory=list)\n\n[f.name for f in fields(Job) if f.default is MISSING and f.default_factory is MISSING]', returns: "['name']" },
    { title: 'What a bare field() holds', code: 'from dataclasses import field, MISSING\nf = field()\nf.default is MISSING, f.default_factory is MISSING, f.kw_only is MISSING, f.hash', returns: '(True, True, True, None)' },
    { title: 'kw_only is resolved by the decorator', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass C:\n    x: int\n\nfields(C)[0].kw_only', returns: 'False' },
    { title: 'default=MISSING means "no default"', code: 'from dataclasses import dataclass, field, MISSING\n\n@dataclass\nclass C:\n    x: int = field(default=MISSING)\n\nC()', returns: "TypeError: C.__init__() missing 1 required positional argument: 'x'" },
    { title: 'Its type and truthiness', code: 'from dataclasses import MISSING\ntype(MISSING), bool(MISSING)', returns: "(<class 'dataclasses._MISSING_TYPE'>, True)" },
    { title: 'Compare with is: a new instance is not MISSING', code: 'from dataclasses import MISSING\nimport dataclasses\nMISSING is dataclasses.MISSING, type(MISSING)() is MISSING', returns: '(True, False)' },
  ],

  pitfalls: [
    {
      name: 'Testing for None',
      desc: 'None is a legitimate default. A field without a default holds MISSING, not None.',
      wrong: { label: 'default is None', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass Job:\n    name: str\n    owner: str | None = None\n    retries: int = 3\n\n[f.name for f in fields(Job) if f.default is None]', output: "['owner']" },
      fix:   { label: 'default is MISSING', code: 'from dataclasses import dataclass, fields, MISSING\n\n@dataclass\nclass Job:\n    name: str\n    owner: str | None = None\n    retries: int = 3\n\n[f.name for f in fields(Job) if f.default is MISSING]', output: "['name']" },
    },
    {
      name: 'Testing truthiness',
      desc: 'MISSING is truthy and 0, "" and None defaults are falsy — if not f.default finds exactly the wrong fields.',
      wrong: { label: 'not f.default', code: 'from dataclasses import dataclass, fields\n\n@dataclass\nclass Job:\n    name: str\n    owner: str | None = None\n    retries: int = 0\n\n[f.name for f in fields(Job) if not f.default]', output: "['owner', 'retries']" },
      fix:   { label: 'is MISSING', code: 'from dataclasses import dataclass, fields, MISSING\n\n@dataclass\nclass Job:\n    name: str\n    owner: str | None = None\n    retries: int = 0\n\n[f.name for f in fields(Job) if f.default is MISSING]', output: "['name']" },
    },
  ],

  when: {
    use: [
      'Reading Field objects: required or not, default or factory',
      'Your own field()-like helpers that must tell "not given" from None',
    ],
    avoid: [
      'Printing it — the repr is <dataclasses._MISSING_TYPE object at 0x…>, a memory address',
      'Assigning MISSING to instance attributes — it is a marker, not a value',
    ],
  },

  notes: {
    cpython:   'Lib/dataclasses.py — class _MISSING_TYPE: pass; MISSING = _MISSING_TYPE(). An ordinary object: compare it with is, never ==',
    'Docs':    'The documentation says no code should use MISSING directly — in practice reading Field objects requires it, and that use is safe',
  },

  related: [
    { name: 'Field objects', slug: 'field-object', when: 'default and default_factory hold MISSING' },
    { name: 'field()', slug: 'field', when: 'Its defaults are MISSING' },
    { name: 'fields()', slug: 'fields', when: 'Get the Field objects to test' },
    { name: 'KW_ONLY', slug: 'kw_only', when: 'The other sentinel' },
    { name: 'None', slug: 'none', when: 'Why None cannot be the marker', category: 'keywords' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'MISSING is a single fixed object with nothing to vary: it takes no arguments, and printing it shows only a memory address that changes from run to run. The examples below show everything it is used for, with fixed output.',
    },
    {
      q: 'How do I check if a dataclass field has a default?',
      a: 'f.default is not MISSING (a plain default) or f.default_factory is not MISSING (a factory). If both are MISSING, the field is required.',
    },
    {
      q: 'Why does dataclasses use MISSING instead of None?',
      a: 'Because None is a valid default value: owner: str | None = None must be distinguishable from a field with no default at all.',
    },
    {
      q: 'Is MISSING the same as a missing field value at runtime?',
      a: 'No. It only appears in field definitions (Field.default, Field.default_factory, field(kw_only=...)). An instance never holds MISSING unless you put it there.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/dataclasses.html#dataclasses.MISSING',
    meta:  'dataclasses.MISSING',
  },

};

// content/reference/python/functions/bytes-is-methods.js
//
// Combined entry for the eight bytes is* predicates. They share one set of
// rules and one set of traps, so eight near-identical pages would compete
// with each other rather than help anyone. The demo dispatches by name via
// getattr, so every predicate is still individually runnable.

export const meta = {
  slug:        'bytes-is-methods',
  name:        'bytes.isalpha and the is* family',
  signature:   'bytes.isalnum() | isalpha() | isascii() | isdigit() | islower() | isspace() | istitle() | isupper()',
  blurb:       'The eight byte predicates — ASCII-only, and all False for empty input except isascii.',
  category:    'bytes',
  type:        'bytes',
  hasLiveDemo: true,
  version:     'Python 3.0+',
  searchTerms: 'bytes isalpha isdigit isalnum isascii islower isupper isspace istitle predicate validate ascii bytearray bytearray.isalpha bytearray.isdigit bytearray.isalnum bytearray.isascii bytearray.islower bytearray.isupper bytearray.isspace bytearray.istitle',
};

export const method = {
  slug:      'bytes-is-methods',
  name:      'bytes.isalpha and the is* family',
  signature: 'bytes.isalnum() | isalpha() | isascii() | isdigit() | islower() | isspace() | istitle() | isupper()',
  returns:   { type: 'bool', desc: 'True when every byte satisfies the test. All eight return False for empty input except isascii, which returns True.' },

  category:    'Bytes methods',
  version:     'Python 3.0+',
  hasLiveDemo: true,

  subtitle: 'Eight predicates that share one rule set. The important difference from their str counterparts: these know only ASCII, so no accented or non-Latin byte ever counts as a letter.',

  cheat: {
    commonCall: 'data.isdigit()',
    returns:    'bool — True only if EVERY byte qualifies',
    replaces:   'all(chr(b).isdigit() for b in data)',
    watchOut:   'empty bytes is False for seven of the eight — isascii is the exception',
  },

  parameters: [],

  demoParams: [
    { name: 's',      type: 'str', hint: 'data (encoded as utf-8)', input: 'text' },
    { name: 'method', type: 'str', hint: 'isalpha, isdigit, isupper, …', input: 'text' },
  ],
  demoTemplate: "getattr(bytes({s}, 'utf-8'), {method})()",
  cases: [
    { id: 'alpha',    label: 'letters, isalpha',    values: { s: 'abc',     method: 'isalpha' } },
    { id: 'digit',    label: 'digits, isdigit',     values: { s: '123',     method: 'isdigit' } },
    { id: 'mixed',    label: 'mixed, isalnum',      values: { s: 'abc123',  method: 'isalnum' } },
    { id: 'nonascii', label: 'accented, isalpha',   values: { s: 'héllo',   method: 'isalpha' } },
    { id: 'ascii',    label: 'accented, isascii',   values: { s: 'héllo',   method: 'isascii' } },
    { id: 'title',    label: 'title case, istitle', values: { s: 'Abc Def', method: 'istitle' } },
    { id: 'empty',    label: 'empty, isalpha',      values: { s: '',        method: 'isalpha' } },
  ],
  demoExplainer: 'Each predicate asks whether EVERY byte qualifies, so one bad byte makes the whole answer False. The two accented cases together tell the real story: "héllo" is not isalpha, because the accented character is stored as two non-ASCII bytes that are not letters as far as bytes is concerned — and it is not isascii either, for the same reason. The str versions of these methods answer True for both, which is exactly the gap to watch when converting text code to binary.',

  patterns: [
    {
      name: 'Validate a numeric field',
      desc: 'Cheaper than a try/except around int() when the data is untrusted.',
      code: 'if not field.isdigit():\n    raise ValueError("expected digits")',
    },
    {
      name: 'Check a payload is plain ASCII',
      desc: 'isascii is the fast pre-check before decoding.',
      code: "if data.isascii():\n    text = data.decode('ascii')",
    },
    {
      name: 'Reject unexpected whitespace',
      desc: 'isspace identifies padding or blank records.',
      code: 'records = [r for r in rows if not r.isspace()]',
    },
  ],

  examples: [
    { title: 'Letters',        code: "b'abc'.isalpha()",    returns: 'True' },
    { title: 'Digits',         code: "b'123'.isdigit()",    returns: 'True' },
    { title: 'Mixed is alnum', code: "b'abc123'.isalnum()", returns: 'True  # but isalpha is False' },
    { title: 'Empty is False', code: "b''.isalpha()",       returns: 'False' },
    { title: 'Empty IS ascii', code: "b''.isascii()",       returns: 'True  # the exception' },
    { title: 'Non-ASCII',      code: "'é'.encode().isalpha()", returns: 'False' },
  ],

  pitfalls: [
    {
      name: 'They are ASCII-only, unlike the str versions',
      desc: 'The difference that matters most. "héllo".isalpha() is True as text but False as UTF-8 bytes, because the accented character becomes two bytes that are not ASCII letters. Converting text-validation code to binary silently changes the answers.',
      wrong: { label: 'bytes says no', code: "'héllo'.encode().isalpha()", output: 'False' },
      fix:   { label: 'Decode first',  code: "'héllo'.isalpha()", output: 'True' },
    },
    {
      name: 'Empty input is False — except for isascii',
      desc: 'Seven of the eight return False for empty bytes, because "every byte qualifies" is not satisfied by having none. isascii breaks the pattern and returns True, which is easy to forget in a validation chain.',
      wrong: { label: 'Inconsistent', code: "b''.isalpha(), b''.isascii()", output: '(False, True)' },
      fix:   { label: 'Test length too', code: 'if data and data.isalpha():', output: 'explicit' },
    },
    {
      name: 'isdigit does not mean int() will work',
      desc: 'A leading minus sign, a decimal point or surrounding whitespace all make isdigit False while int() or float() would still succeed — and isdigit True does not guarantee the value fits anywhere sensible.',
      wrong: { label: 'Negative rejected', code: "b'-5'.isdigit()", output: 'False' },
      fix:   { label: 'Try the conversion', code: "try:\n    n = int(b'-5')\nexcept ValueError:\n    ...", output: '-5' },
    },
    {
      name: 'islower and isupper ignore non-letters',
      desc: 'They ask whether the CASED bytes are all one case, so digits and punctuation are simply skipped. A buffer with no letters at all is neither lower nor upper.',
      wrong: { label: 'No letters', code: "b'123'.islower(), b'123'.isupper()", output: '(False, False)' },
      fix:   { label: 'Check for letters', code: "b'a1'.islower()", output: 'True  # the digit is ignored' },
    },
    {
      name: 'istitle has its own definition of a word',
      desc: 'A word starts after any non-letter, so punctuation and digits begin new words. That makes strings like "Abc1Def" title case in ways people rarely expect.',
      wrong: { label: 'Surprising True', code: "b'Abc Def'.istitle()", output: 'True' },
      fix:   { label: 'Check explicitly', code: 'data == data.title()', output: 'same rule, stated' },
    },
  ],

  when: {
    use: [
      'Validating binary fields before parsing them',
      'A fast isascii check before decoding',
      'Rejecting blank or whitespace-only records',
    ],
    avoid: [
      'The data is text → decode first; the str versions understand Unicode',
      'Deciding whether int() will succeed → just try the conversion',
      'Anything involving non-ASCII letters — these will always say no',
    ],
  },

  notes: {
    complexity: 'O(n) — every byte is examined, with an early exit on the first failure',
    return:     'A bool; never raises',
    cpython:    'Objects/bytesobject.c :: bytes_isalpha and siblings',
    memory:     'No allocation',
    threadSafe: 'Yes — bytes are immutable',
  },

  related: [
    { name: 'str.isalpha',   slug: 'str-isalpha',   when: 'The Unicode-aware version for text' },
    { name: 'str.isdigit',   slug: 'isdigit',       when: 'The text version, which accepts more digit forms' },
    { name: 'str.isascii',   slug: 'str-isascii',   when: 'The text version of the ASCII check' },
    { name: 'bytes.decode',  slug: 'bytes-decode',  when: 'Convert to text so the str predicates apply' },
  ],

  faq: [
    {
      q: 'Why does isalpha say False for an accented letter?',
      a: 'Because bytes knows nothing about Unicode. In UTF-8 an accented character is two bytes, neither of which is an ASCII letter, so the test fails. The str version decodes first and answers True.',
      code: "'é'.encode().isalpha()   # False\n'é'.isalpha()            # True",
    },
    {
      q: 'Why is empty bytes isascii() True but isalpha() False?',
      a: 'isascii asks whether any byte is out of range, and having no bytes means none are — vacuously True. The others ask whether every byte is of a certain kind AND require at least one, which empty input cannot satisfy.',
      code: "b''.isascii()   # True\nb''.isalpha()   # False",
    },
    {
      q: 'Which one should I use to validate a number?',
      a: 'None of them, really. isdigit rejects minus signs and decimal points that int() and float() accept perfectly well. Attempt the conversion and catch ValueError — it tests exactly what you care about.',
      code: "try:\n    value = int(field)\nexcept ValueError:\n    ...",
    },
  ],

  history: [
    { version: '3.0', note: 'The is* family arrived with the bytes type in the text/binary split.' },
    { version: '3.7', note: 'isascii added to str, bytes and bytearray.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#bytes.isalpha',
    meta:  'bytes is* methods',
  },

  tryInTool: [
    { name: 'Base64 Encoder', href: '/tools/base64', meta: 'Inspect raw byte data' },
  ],
};

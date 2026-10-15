// content/reference/python/stdlib/typing/io.js — IO, TextIO, BinaryIO

export const meta = {
  slug:        'io',
  name:        'typing.IO / TextIO / BinaryIO',
  signature:   'IO[AnyStr] · TextIO · BinaryIO',
  blurb:       'Type hints for file-like objects: TextIO for text streams (open(path), sys.stdout, io.StringIO), BinaryIO for byte streams (open(path, "rb"), io.BytesIO). They describe the interface — real file objects do not inherit from them.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: false,
  version:     'Python 3.5+',
  searchTerms: 'typing.IO IO TextIO BinaryIO file object type hint file like stream open sys.stdout StringIO BytesIO text mode binary mode io.TextIOBase io.IOBase',
};

export const method = {
  slug:      'io',
  name:      'typing.IO / TextIO / BinaryIO',
  signature: 'IO[AnyStr] · TextIO · BinaryIO',
  returns:   { type: 'type', desc: 'Generic classes in Lib/typing.py: TextIO subclasses IO[str], BinaryIO subclasses IO[bytes].' },

  category:    'typing I/O types',
  version:     'Python 3.5+',
  hasLiveDemo: false,

  subtitle: 'Use them in signatures: def dump(data: dict, out: TextIO) accepts any open text file, sys.stdout or an io.StringIO. They are not the runtime base classes of those objects, so isinstance() against them returns False — for runtime checks use the io module\'s classes (io.TextIOBase, io.IOBase).',

  covers: ['IO', 'TextIO', 'BinaryIO'],

  cheat: {
    commonCall: 'def dump(rows: list[str], out: TextIO) -> None: ...',
    returns:    'IO[str] → typing.IO[str]; TextIO is IO[str], BinaryIO is IO[bytes]',
    replaces:   'Annotating file parameters with the concrete io classes',
    watchOut:   'isinstance(sys.stdout, TextIO) is False — use io.TextIOBase at runtime',
  },

  parameters: [
    { name: 'AnyStr', type: 'str | bytes', required: true, default: null, desc: 'IO[str] for text streams, IO[bytes] for binary ones; TextIO and BinaryIO fix it for you.' },
  ],

  patterns: [
    {
      name: 'Write to any text stream',
      desc: 'Callers pass an open file, sys.stdout or io.StringIO (handy in tests).',
      code: 'import sys\nfrom typing import TextIO\n\ndef report(lines: list[str], out: TextIO = sys.stdout) -> None:\n    for line in lines:\n        out.write(line + "\\n")',
    },
    {
      name: 'Read binary data',
      desc: 'BinaryIO for open(path, "rb"), io.BytesIO, sockets made into files.',
      code: 'from typing import BinaryIO\n\ndef checksum(stream: BinaryIO, chunk: int = 65536) -> int:\n    total = 0\n    while block := stream.read(chunk):\n        total = (total + sum(block)) % 65521\n    return total',
    },
    {
      name: 'Just the method you need',
      desc: 'A Protocol accepts objects that only implement write().',
      code: 'from typing import Protocol\n\nclass Writer(Protocol):\n    def write(self, s: str, /) -> int: ...\n\ndef greet(out: Writer) -> None:\n    out.write("hello\\n")',
    },
  ],

  examples: [
    { title: 'TextIO is IO[str], BinaryIO is IO[bytes]', code: 'from typing import BinaryIO, TextIO\n(TextIO.__orig_bases__, BinaryIO.__orig_bases__)', returns: '((typing.IO[str],), (typing.IO[bytes],))' },
    { title: 'IO is generic over AnyStr', code: 'from typing import IO\n(IO.__parameters__, IO[str])', returns: '((~AnyStr,), typing.IO[str])' },
    { title: 'Real streams are not instances', code: 'import io\nfrom typing import TextIO\nisinstance(io.StringIO(), TextIO)', returns: 'False' },
    { title: 'The io classes work at runtime', code: 'import io\n(isinstance(io.StringIO(), io.TextIOBase), isinstance(io.BytesIO(), io.BufferedIOBase))', returns: '(True, True)' },
    { title: 'TextIO and BinaryIO take no arguments', code: 'from typing import BinaryIO\nBinaryIO[bytes]', returns: "TypeError: <class 'typing.BinaryIO'> is not a generic class" },
    { title: 'StringIO stands in for a file in tests', code: 'import io\nfrom typing import TextIO\ndef report(lines: list[str], out: TextIO) -> None:\n    for line in lines:\n        out.write(line + "\\n")\nbuf = io.StringIO()\nreport(["a", "b"], buf)\nbuf.getvalue()', returns: "'a\\nb\\n'" },
  ],

  pitfalls: [
    {
      name: 'isinstance against TextIO',
      desc: 'Files, sys.stdout and StringIO do not inherit from typing.TextIO, so the check is always False. Test against the io base classes.',
      wrong: { label: 'typing.TextIO', code: 'import io\nfrom typing import TextIO\nisinstance(io.StringIO("x"), TextIO)', output: 'False' },
      fix:   { label: 'io.TextIOBase', code: 'import io\nisinstance(io.StringIO("x"), io.TextIOBase)', output: 'True' },
    },
    {
      name: 'Passing a binary stream where text is expected',
      desc: 'The hint is not enforced; the first write of a str to a binary stream fails. TextIO vs BinaryIO is exactly this distinction.',
      wrong: { label: 'BytesIO for TextIO', code: 'import io\nfrom typing import TextIO\ndef report(out: TextIO) -> None:\n    out.write("done\\n")\nreport(io.BytesIO())', output: "TypeError: a bytes-like object is required, not 'str'" },
      fix:   { label: 'StringIO', code: 'import io\nfrom typing import TextIO\ndef report(out: TextIO) -> None:\n    out.write("done\\n")\nbuf = io.StringIO()\nreport(buf)\nbuf.getvalue()', output: "'done\\n'" },
    },
  ],

  when: {
    use: [
      'Parameters and return values that are file-like streams',
      'TextIO for text mode, BinaryIO for binary mode, IO[AnyStr] for code generic over both',
    ],
    avoid: [
      'Runtime type checks → io.IOBase, io.TextIOBase, io.BufferedIOBase',
      'Functions that need only write() or read() → a small Protocol accepts more objects',
    ],
  },

  notes: {
    cpython:     'Lib/typing.py: class IO(Generic[AnyStr]) with abstract stream methods (read, write, seek …), class TextIO(IO[str]) and class BinaryIO(IO[bytes]); the io module\'s classes do not derive from them',
    'Runtime':   'Plain classes, not runtime-checkable protocols — isinstance() returns False for real streams',
    'Docs':      'The docs describe them as the types of I/O streams such as those returned by open()',
  },

  related: [
    { name: 'open()', slug: 'open', when: 'Returns text or binary streams', category: 'functions' },
    { name: 'Protocol', slug: 'protocol', when: 'Accept anything with write()' },
    { name: 'TypeVar / AnyStr', slug: 'typevar', when: 'The AnyStr type variable of IO' },
    { name: 'with', slug: 'with', when: 'Closing streams', category: 'keywords' },
  ],

  faq: [
    {
      q: 'Why is there no live demo on this page?',
      a: 'IO, TextIO and BinaryIO matter to the type checker; at runtime they are classes no real stream inherits from. Showing that needs stream objects (open files, io.StringIO, io.BytesIO), and a demo box can only send text and numbers. The examples below show the isinstance() results and a StringIO round trip with fixed, verified output.',
    },
    {
      q: 'How do I type hint a file object in Python?',
      a: 'With typing.TextIO for files opened in text mode (open(path), sys.stdout, io.StringIO) and typing.BinaryIO for binary mode (open(path, "rb"), io.BytesIO). IO[str] / IO[bytes] are the generic forms.',
    },
    {
      q: 'Why is isinstance(f, TextIO) False for an open file?',
      a: 'typing.TextIO is a typing class describing the interface; the io module\'s file classes do not inherit from it. Use io.TextIOBase (or io.IOBase) for runtime checks.',
    },
    {
      q: 'TextIO or io.TextIOWrapper in hints?',
      a: 'TextIO. It accepts every text stream, including io.StringIO and sys.stdout replacements, whereas io.TextIOWrapper names one concrete class.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/typing.html#typing.IO',
    meta:  'typing.IO',
  },

};

// content/reference/python/stdlib/shlex/shlex-push_source.js — shlex.push_source / pop_source / sourcehook

export const meta = {
  slug:        'shlex-push_source',
  name:        'shlex.push_source / pop_source / sourcehook',
  signature:   'shlex.push_source(newstream, newfile=None) · shlex.pop_source() · shlex.sourcehook(filename)',
  blurb:       'The input-source stack of a shlex lexer: insert another stream mid-input, return to the previous one, and decide how a source request (lex.source) opens an included file.',
  category:    'methods',
  type:        'method',
  hasLiveDemo: true,
  version:     'All Python 3 versions',
  searchTerms: 'shlex.push_source shlex.pop_source shlex.sourcehook python shlex include file source keyword nested input stack sourcehook override infile lineno include directive config language',
};

export const method = {
  slug:      'shlex-push_source',
  name:      'shlex.push_source / pop_source / sourcehook',
  signature: 'shlex.push_source(newstream, newfile=None) · shlex.pop_source() · shlex.sourcehook(filename)',
  returns:   { type: 'None · None · tuple[str, file]', desc: 'sourcehook returns (filename, open file); the other two change the lexer in place.' },

  category:    'shlex methods',
  version:     'All Python 3 versions',
  hasLiveDemo: true,

  subtitle: 'push_source makes the lexer read from a new stream right away and remember where it was (infile, instream, lineno); at the end of that stream get_token pops back automatically. Set lex.source to a keyword and every "keyword filename" in the input is replaced by the tokens of that file, opened by sourcehook.',

  covers: ['shlex.push_source', 'shlex.pop_source', 'shlex.sourcehook'],

  cheat: {
    commonCall: "lex.source = 'include'   # 'include other.conf' pulls in other.conf",
    returns:    'tokens of the included file, then the rest of the input',
    replaces:   'hand-written include handling in a config parser',
    watchOut:   'sourcehook opens files with plain open(name, "r") — the locale encoding',
  },

  parameters: [
    { name: 'newstream', type: 'str | file-like', required: true,  default: null,   desc: 'push_source: the stream to read next; a str is wrapped in io.StringIO.' },
    { name: 'newfile',   type: 'str | None',      required: false, default: 'None', desc: 'push_source: the name stored in infile while that stream is read (for error messages and relative includes).' },
    { name: 'filename',  type: 'str',             required: true,  default: null,   desc: 'sourcehook: the token after the source keyword. A leading " strips the first and last character; a relative name is joined to the folder of the current infile.' },
  ],

  modes: [
    {
      id: 'push',
      label: 'push_source',
      blurb: 'After the first token, read a whole other string before continuing.',
      params: [
        { name: 'text',     type: 'str', hint: 'outer input', input: 'text' },
        { name: 'inserted', type: 'str', hint: 'pushed input', input: 'text' },
      ],
      template: 'import shlex\nlex = shlex.shlex({$text}, posix=True)\nfirst = lex.get_token()\nlex.push_source({$inserted})\n[first] + list(lex)',
      cases: [
        { id: 'mid',   label: 'insert x y',    values: { text: 'a b c', inserted: 'x y' } },
        { id: 'quote', label: 'quoted inside', values: { text: 'cmd end', inserted: '"one arg" two' } },
      ],
    },
    {
      id: 'pop',
      label: 'pop_source',
      blurb: 'Abandon the pushed stream early and continue with the outer one.',
      params: [
        { name: 'outer', type: 'str', hint: 'outer input', input: 'text' },
        { name: 'inner', type: 'str', hint: 'pushed input', input: 'text' },
      ],
      template: 'import shlex\nlex = shlex.shlex({$outer}, posix=True)\nlex.push_source({$inner})\nfirst = lex.get_token()\nlex.pop_source()\n[first] + list(lex)',
      cases: [
        { id: 'basic', label: 'inner, then outer', values: { outer: 'outer tokens', inner: 'inner stream ignored' } },
      ],
    },
    {
      id: 'source',
      label: 'lex.source',
      blurb: 'The snippet writes extra.txt; "source extra.txt" in the input includes it.',
      params: [
        { name: 'included', type: 'str', hint: 'content of extra.txt', input: 'text' },
        { name: 'text',     type: 'str', hint: 'main input', input: 'text' },
      ],
      template: "import shlex\nwith open('extra.txt', 'w', encoding='utf-8') as f:\n    f.write({$included})\nlex = shlex.shlex({$text}, posix=True)\nlex.whitespace_split = True\nlex.source = 'source'\nlist(lex)",
      cases: [
        { id: 'inc',     label: 'include',        values: { included: 'b c', text: 'a source extra.txt d' } },
        { id: 'twice',   label: 'twice',          values: { included: 'x', text: 'source extra.txt source extra.txt end' } },
        { id: 'missing', label: 'missing file',   values: { included: 'b c', text: 'a source other.txt' } },
      ],
    },
  ],
  demoExplainer: 'A pushed source is read immediately — its tokens come before the rest of the outer input — and when it runs out, get_token pops back to where it was. pop_source leaves the inner stream early (closing it). With lex.source set, the keyword and the file name do not appear as tokens: they are replaced by the file\'s tokens, as often as the keyword occurs. A name that cannot be opened raises the error of open() itself.',

  patterns: [
    {
      name: 'Includes from a dict instead of the disk',
      desc: 'Override sourcehook: return (name, stream). Useful for tests and bundled configs.',
      code: "import io, shlex\nclass DictLexer(shlex.shlex):\n    def __init__(self, text, files):\n        super().__init__(text, posix=True)\n        self.files = files\n    def sourcehook(self, newfile):\n        return newfile, io.StringIO(self.files[newfile])",
    },
    {
      name: 'Include with an explicit encoding',
      desc: 'The default hook calls open(newfile, "r"); override it to choose the encoding.',
      code: "import shlex\nclass Utf8Lexer(shlex.shlex):\n    def sourcehook(self, newfile):\n        name, f = super().sourcehook(newfile)\n        f.close()\n        return name, open(name, encoding='utf-8')",
    },
    {
      name: 'Macro expansion',
      desc: 'push_source a string to splice text into the token stream.',
      code: "import shlex\nMACROS = {'@build': 'make all', '@clean': 'make clean'}\nfor tok in lex:\n    if tok in MACROS:\n        lex.push_source(MACROS[tok])\n        continue\n    handle(tok)",
    },
  ],

  examples: [
    { title: 'Insert a stream mid-way', code: "import shlex\nlex = shlex.shlex('a b c', posix=True)\nfirst = lex.get_token()\nlex.push_source('x y')\n[first] + list(lex)", returns: "['a', 'x', 'y', 'b', 'c']" },
    { title: 'Leave a stream early', code: "import shlex\nlex = shlex.shlex('outer tokens', posix=True)\nlex.push_source('inner stream')\nfirst = lex.get_token()\nlex.pop_source()\n[first] + list(lex)", returns: "['inner', 'outer', 'tokens']" },
    { title: 'infile follows the stack', code: "import shlex\nlex = shlex.shlex('a b', infile='main.cfg', posix=True)\nlex.get_token()\nlex.push_source('x', 'inc.cfg')\n[(lex.get_token(), lex.infile) for _ in range(2)]", returns: "[('x', 'inc.cfg'), ('b', 'main.cfg')]" },
    { title: 'A source request', code: "import shlex\nwith open('extra.txt', 'w', encoding='utf-8') as f:\n    f.write('b c')\nlex = shlex.shlex('a source extra.txt d', posix=True)\nlex.whitespace_split = True\nlex.source = 'source'\nlist(lex)", returns: "['a', 'b', 'c', 'd']" },
    { title: 'Compatibility mode: quotes are stripped by sourcehook', code: "import shlex\nwith open('extra.txt', 'w', encoding='utf-8') as f:\n    f.write('b c')\nlex = shlex.shlex('a source \"extra.txt\" d')\nlex.source = 'source'\nlist(lex)", returns: "['a', 'b', 'c', 'd']" },
    { title: 'Custom sourcehook', code: "import io, shlex\nclass DictLexer(shlex.shlex):\n    files = {'colors': 'red green'}\n    def sourcehook(self, newfile):\n        return newfile, io.StringIO(self.files[newfile])\nlex = DictLexer('use colors blue', posix=True)\nlex.source = 'use'\nlist(lex)", returns: "['red', 'green', 'blue']" },
    { title: 'Nothing to pop', code: "import shlex\nshlex.shlex('a', posix=True).pop_source()", returns: 'IndexError: pop from an empty deque' },
  ],

  pitfalls: [
    {
      name: 'File names cut at the dot',
      desc: 'Without whitespace_split, . is not a word character, so the token after the keyword is just extra — and opening it fails.',
      wrong: { label: 'default split', code: "import shlex\nwith open('extra.txt', 'w', encoding='utf-8') as f:\n    f.write('b c')\nlex = shlex.shlex('a source extra.txt d', posix=True)\nlex.source = 'source'\nlist(lex)", output: "FileNotFoundError: [Errno 2] No such file or directory: 'extra'" },
      fix:   { label: 'whitespace_split', code: "import shlex\nwith open('extra.txt', 'w', encoding='utf-8') as f:\n    f.write('b c')\nlex = shlex.shlex('a source extra.txt d', posix=True)\nlex.whitespace_split = True\nlex.source = 'source'\nlist(lex)", output: "['a', 'b', 'c', 'd']" },
    },
    {
      name: 'Expecting push_source to append',
      desc: 'The pushed stream is read next, not after the current input. To add tokens at the end, read the input first.',
      wrong: { label: 'push_source', code: "import shlex\nlex = shlex.shlex('a b', posix=True)\nlex.push_source('end')\nlist(lex)", output: "['end', 'a', 'b']" },
      fix:   { label: 'read, then add', code: "import shlex\nlex = shlex.shlex('a b', posix=True)\nlist(lex) + list(shlex.shlex('end', posix=True))", output: "['a', 'b', 'end']" },
    },
  ],

  when: {
    use: [
      'Config or command languages with an include / source directive',
      'Macro expansion: splicing generated text into the token stream',
    ],
    avoid: [
      'Including untrusted file names — sourcehook opens whatever path the input names',
      'Simple splitting → shlex.split',
    ],
  },

  notes: {
    cpython:       "push_source saves (infile, instream, lineno) on filestack and resets lineno to 1; pop_source closes the current stream, restores the saved triple and resets the state. get_token pops automatically at eof while filestack is not empty",
    'sourcehook':  "Strips the quotes if the name starts with \", joins a relative name to os.path.dirname(self.infile) when infile is a str (C-preprocessor style), and returns (name, open(name, 'r')). Its stream is closed when the lexer reaches its end",
    'Edge cases':  "A source keyword at the very end of the input (no file name) raises TypeError: 'NoneType' object is not subscriptable in POSIX mode",
  },

  related: [
    { name: 'shlex.shlex', slug: 'shlex', when: 'Create the lexer' },
    { name: 'get_token / push_token / read_token', slug: 'shlex-get_token', when: 'Where source requests are handled' },
    { name: 'shlex attributes', slug: 'shlex-attributes', when: 'source, infile, instream, lineno' },
    { name: 'error_leader', slug: 'shlex-error_leader', when: 'Messages naming the included file' },
    { name: 'open()', slug: 'open', when: 'What the default sourcehook calls', category: 'functions' },
  ],

  faq: [
    {
      q: 'How do I support include files with shlex?',
      a: "Set lex.source = 'include' (any keyword). Whenever get_token sees that token, it reads the next token as a file name, calls sourcehook to open it, reads all its tokens, closes it and continues with the original input. Override sourcehook to change how names are resolved or opened.",
    },
    {
      q: 'How are relative include paths resolved?',
      a: 'If the current infile is a string, a relative name is joined to the directory of that file (os.path.join(os.path.dirname(infile), name)), like #include "file.h" in C. Absolute names, and input without an infile name, are used as they are.',
    },
    {
      q: 'Do I have to call pop_source myself?',
      a: 'Usually not. get_token calls it when a pushed stream reaches its end. Call it yourself only to abandon a pushed stream early; calling it with nothing pushed raises IndexError.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/shlex.html#shlex.shlex.push_source',
    meta:  'shlex.push_source',
  },
};

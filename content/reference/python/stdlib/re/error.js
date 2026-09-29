// content/reference/python/stdlib/re/error.js

export const meta = {
  slug:        'error',
  name:        're.error',
  signature:   're.PatternError(msg, pattern=None, pos=None)',
  blurb:       'Raised when a string is not a valid regular expression; knows the position of the problem. Named re.PatternError since 3.13, re.error still works.',
  category:    'exceptions',
  type:        'exception',
  hasLiveDemo: true,
  version:     'Python 3 (all)',
  searchTerms: 're error PatternError re.error re.PatternError invalid regular expression missing ) unterminated subpattern nothing to repeat unterminated character set bad escape look-behind requires fixed-width pattern multiple repeat position lineno colno',
};

export const method = {
  slug:      'error',
  name:      're.error',
  signature: 're.PatternError(msg, pattern=None, pos=None)',

  category:    're exception',
  version:     'Python 3 (all)',
  hasLiveDemo: true,

  subtitle: 'The one exception of the re module. Its message ends with "at position N" — the index in the pattern where parsing gave up — plus line and column for multi-line patterns.',

  covers: ['error', 'PatternError'],
  chain: ['BaseException', 'Exception', 'PatternError'],

  cheat: {
    raisedBy: "re.compile('('), re.search('*a', s), re.sub(p, r'\\9', s) — any call that compiles a pattern or template",
    message:  'missing ), unterminated subpattern at position 0',
    quickFix: 'read the position, escape literal metacharacters (\\( \\* \\.) or use re.escape for user text',
    watchOut: 'The traceback says re.PatternError since 3.13; except re.error catches the same class',
  },

  parameters: [
    { name: 'msg',     type: 'str',        required: true,  default: null,   desc: 'The bare message, without the position text.' },
    { name: 'pattern', type: 'str | bytes', required: false, default: 'None', desc: 'The pattern (or replacement template) being parsed.' },
    { name: 'pos',     type: 'int',        required: false, default: 'None', desc: 'Index in pattern where the error was detected; adds "at position N" to the message.' },
  ],

  attributes: [
    { name: 'msg',     type: 'str',         meaning: 'The unformatted message, e.g. "nothing to repeat"' },
    { name: 'pattern', type: 'str | None',  meaning: 'The regular expression (or repl template) that failed' },
    { name: 'pos',     type: 'int | None',  meaning: 'Index in pattern where compilation failed — None for errors found after parsing' },
    { name: 'lineno',  type: 'int | None',  meaning: 'Line of pos, counting from 1' },
    { name: 'colno',   type: 'int | None',  meaning: 'Column of pos, counting from 1' },
  ],

  modes: [
    {
      id: 'trigger',
      label: 'Trigger',
      blurb: 'Compile a pattern. Each broken one names its problem and the position (index from 0).',
      params: [{ name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' }],
      template: 'import re\nre.compile({$pattern})',
      cases: [
        { id: 'paren',  label: 'unclosed (',      values: { pattern: '(\\d+' } },
        { id: 'star',   label: 'leading *',       values: { pattern: '*.txt' } },
        { id: 'set',    label: 'unclosed [',      values: { pattern: '[a-z' } },
        { id: 'range',  label: 'reversed range',  values: { pattern: '[z-a]' } },
        { id: 'escape', label: 'unknown escape',  values: { pattern: '\\q' } },
        { id: 'behind', label: 'variable lookbehind', values: { pattern: '(?<=a+)b' } },
        { id: 'ok',     label: 'valid',           values: { pattern: '\\(\\d+\\)' } },
      ],
    },
    {
      id: 'where',
      label: 'Read the position',
      blurb: 'Catch it and read the attributes: msg, pos, lineno, colno.',
      params: [{ name: 'pattern', type: 'str', hint: 'a regular expression', input: 'text' }],
      template: "import re\ntry:\n    re.compile({$pattern})\nexcept re.error as e:\n    result = (e.msg, e.pos, e.lineno, e.colno)\nelse:\n    result = 'valid pattern'\nresult",
      cases: [
        { id: 'repeat', label: 'multiple repeat', values: { pattern: 'a**' } },
        { id: 'lines',  label: 'second line',     values: { pattern: 'abc\n(def' } },
        { id: 'group',  label: 'unknown group',   values: { pattern: '(?P<a>x)(?P=b)' } },
        { id: 'nopos',  label: 'no position',     values: { pattern: '(?<!ab|c)x' } },
      ],
    },
    {
      id: 'handle',
      label: 'Handle',
      blurb: 'Accept a pattern from a user: report errors instead of crashing.',
      params: [
        { name: 'pattern', type: 'str', hint: 'user-supplied pattern', input: 'text' },
        { name: 'text',    type: 'str', hint: 'text to search',        input: 'text' },
      ],
      template: "import re\ndef safe_findall(pattern, text):\n    try:\n        return re.findall(pattern, text)\n    except re.error as e:\n        return f'invalid pattern: {e}'\n\nsafe_findall({$pattern}, {$text})",
      cases: [
        { id: 'good', label: 'valid',   values: { pattern: '\\w+@\\w+', text: 'ada@home bob@work' } },
        { id: 'bad',  label: 'invalid', values: { pattern: '+\\w+', text: 'ada@home' } },
      ],
    },
  ],
  demoExplainer: 'Positions count from 0 in the pattern string, so "at position 2" in a** points at the second *. For a pattern containing a newline, lineno and colno (both from 1) are added to the message. Some errors are found after parsing, when the pattern is compiled — look-behind width is one — and have no position: pos, lineno and colno are None.',

  patterns: [
    {
      name: 'Validate a user-supplied pattern',
      desc: 'Compile it once and turn the error into a message.',
      code: "import re\ntry:\n    user_re = re.compile(user_input)\nexcept re.error as e:\n    raise ValueError(f'bad search pattern at position {e.pos}: {e.msg}') from e",
    },
    {
      name: 'Point at the error',
      desc: 'Print a caret under the failing position.',
      code: "import re\ntry:\n    re.compile(p)\nexcept re.error as e:\n    print(p)\n    print(' ' * (e.pos or 0) + '^', e.msg)",
    },
  ],

  examples: [
    { title: 'Unclosed group',          code: "import re\nre.compile('(abc')", returns: 're.PatternError: missing ), unterminated subpattern at position 0' },
    { title: 'Nothing to repeat',       code: "import re\nre.compile('*.txt')", returns: 're.PatternError: nothing to repeat at position 0' },
    { title: 'Multi-line pattern',      code: "import re\nre.compile('a\\n(')", returns: 're.PatternError: missing ), unterminated subpattern at position 2 (line 2, column 1)' },
    { title: 'Attributes',              code: "import re\ntry:\n    re.compile('a\\nb)')\nexcept re.error as e:\n    result = (e.msg, e.pos, e.lineno, e.colno)\nresult", returns: "('unbalanced parenthesis', 3, 2, 2)" },
    { title: 'Look-behind width',       code: "import re\nre.compile(r'(?<=a+)b')", returns: 're.PatternError: look-behind requires fixed-width pattern' },
    { title: 'error is PatternError',   code: 'import re\nre.error is re.PatternError', returns: 'True' },
    { title: 'Templates raise it too',  code: "import re\nre.sub(r'(a)', r'\\2', 'a')", returns: 're.PatternError: invalid group reference 2 at position 1' },
  ],

  pitfalls: [
    {
      name: 'Regex metacharacters meant literally',
      desc: '* . ( ) [ ] { } ? + | ^ $ \\ are syntax. Escape them to match the character itself.',
      wrong: { label: "'*.txt'", code: "import re\nre.findall('*.txt', 'a.txt b.txt')", output: 're.PatternError: nothing to repeat at position 0' },
      fix:   { label: "r'\\w+\\.txt'", code: "import re\nre.findall(r'\\w+\\.txt', 'a.txt b.txt')", output: "['a.txt', 'b.txt']" },
    },
    {
      name: 'Variable-width lookbehind',
      desc: 'Python needs to know how far back to look. Use alternatives of fixed width, or move the check into a group.',
      wrong: { label: '(?<=\\$\\d+)', code: "import re\nre.findall(r'(?<=\\$\\d+)\\.\\d\\d', '$19.99')", output: 're.PatternError: look-behind requires fixed-width pattern' },
      fix:   { label: 'group instead', code: "import re\nre.findall(r'\\$\\d+(\\.\\d\\d)', '$19.99')", output: "['.99']" },
    },
    {
      name: 'Catching the wrong exception',
      desc: 'Flag misuse is not a pattern error: re.LOCALE with a str pattern raises ValueError.',
      wrong: { label: 'except re.error', code: "import re\ntry:\n    re.compile('a', re.LOCALE)\nexcept re.error:\n    print('bad pattern')", output: 'ValueError: cannot use LOCALE flag with a str pattern' },
      fix:   { label: 'catch both', code: "import re\ntry:\n    re.compile('a', re.LOCALE)\nexcept (re.error, ValueError) as e:\n    print('rejected:', e)", output: 'rejected: cannot use LOCALE flag with a str pattern' },
    },
  ],

  when: {
    use: [
      'Catch re.error around patterns built from user input or config',
      'Report e.pos / e.lineno / e.colno to point at the mistake',
    ],
    avoid: [
      'Catching it around fixed patterns in your own code — fix the pattern instead',
      'Expecting it for bad flags (ValueError), bad argument types (TypeError) or unknown \\g<name> in sub (IndexError)',
    ],
  },

  notes: {
    cpython:   'Defined in Lib/re/_constants.py; __module__ is set to "re", which is why tracebacks show re.PatternError',
    'Rename':  'Python 3.13 renamed re.error to re.PatternError and kept error as an alias — the same class object',
    'Attributes': 'msg, pattern, pos, lineno, colno were added in Python 3.5',
    'Positions': 'pos counts characters of the pattern from 0; lineno/colno count from 1 and appear in the message only when the pattern contains a newline',
  },

  related: [
    { name: 're.compile', slug: 'compile', when: 'Where most pattern errors surface' },
    { name: 're.escape',  slug: 'escape',  when: 'Avoid errors from literal text' },
    { name: 're.sub',     slug: 'sub',     when: 'Template errors: bad escape, invalid group reference' },
    { name: 'ValueError', slug: 'valueerror', when: 'Raised for incompatible flags', category: 'exceptions' },
    { name: 'Exception',  slug: 'exception', when: 'The base class of re.error', category: 'exceptions' },
  ],

  faq: [
    {
      q: 'What does "nothing to repeat" mean in a Python regex?',
      a: "A quantifier (*, +, ?, {n}) has nothing before it to apply to — for example a pattern starting with * like '*.txt', or a quantifier right after ^ or |. Escape it (\\*) if you meant a literal asterisk.",
    },
    {
      q: 'What does "missing ), unterminated subpattern" mean?',
      a: 'A ( opened a group that is never closed. The position is where that ( is. To match a literal parenthesis write \\( — or re.escape the text.',
    },
    {
      q: 'What is re.PatternError?',
      a: 'The new name (Python 3.13) of re.error, the exception for invalid regular expressions. re.error remains an alias, so except re.error works on every version.',
    },
    {
      q: 'Why "look-behind requires fixed-width pattern"?',
      a: "Python's lookbehind must match a known number of characters. (?<=ab|cd) is fine (both are 2 wide); (?<=a+) or (?<=ab|c) is not. Capture the prefix in a group instead, or use fixed-width alternatives in separate lookbehinds.",
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/re.html#re.PatternError',
    meta:  're.PatternError',
  },
};

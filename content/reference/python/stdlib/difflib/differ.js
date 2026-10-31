// content/reference/python/stdlib/difflib/differ.js — Differ and Differ.compare

export const meta = {
  slug:        'differ',
  name:        'difflib.Differ',
  signature:   'difflib.Differ(linejunk=None, charjunk=None) · Differ.compare(a, b)',
  blurb:       'The class behind ndiff: compare(a, b) generates a human-readable delta of two lists of lines, with ? hint lines that mark changed characters in similar lines.',
  category:    'classes',
  type:        'class',
  hasLiveDemo: true,
  version:     'Python 2.2+',
  searchTerms: 'difflib Differ Differ.compare compare python differ class human readable delta lines linejunk charjunk IS_LINE_JUNK blank lines junk ? hint lines ndiff class reuse',
};

export const method = {
  slug:      'differ',
  name:      'difflib.Differ',
  signature: 'difflib.Differ(linejunk=None, charjunk=None)',
  returns:   { type: 'Differ', desc: 'An object whose compare(a, b) method returns a generator of delta lines ("  ", "- ", "+ ", "? ").' },

  category:    'difflib class',
  version:     'Python 2.2+',
  hasLiveDemo: true,

  subtitle: 'Differ holds the two junk filters; compare(a, b) runs a SequenceMatcher over the lines, and for every block of replaced lines a second one over the characters of the most similar pair. ndiff(a, b) is just Differ(linejunk, charjunk).compare(a, b) — with a different default for charjunk.',

  covers: ['Differ', 'Differ.compare'],

  cheat: {
    commonCall: 'difflib.Differ().compare(old_lines, new_lines)',
    returns:    'a generator of "  ", "- ", "+ " and "? " lines',
    replaces:   'difflib.ndiff when you want explicit filters',
    watchOut:   'Differ() uses charjunk=None; ndiff() uses IS_CHARACTER_JUNK',
  },

  parameters: [
    { name: 'linejunk', type: 'callable | None', required: false, default: 'None', desc: 'line → true if the line is junk: it cannot start a matching block of lines (but can still be matched next to one). IS_LINE_JUNK marks blank lines and lines holding only "#".' },
    { name: 'charjunk', type: 'callable | None', required: false, default: 'None', desc: 'character → true if junk when comparing the characters of two similar lines. IS_CHARACTER_JUNK marks spaces and tabs.' },
  ],

  attributes: [
    { name: 'compare(a, b)', type: 'method', meaning: 'Compare two sequences of lines (each ending in "\\n") and generate the delta. Returns a generator; the lines are ready for writelines().' },
    { name: 'linejunk',      type: 'attribute', meaning: 'The line filter given to the constructor (used as SequenceMatcher isjunk for the lines).' },
    { name: 'charjunk',      type: 'attribute', meaning: 'The character filter given to the constructor (used as isjunk inside similar lines).' },
  ],

  modes: [
    {
      id: 'compare',
      label: 'compare',
      blurb: 'Differ().compare on two texts; | separates lines (each gets its "\\n").',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
      ],
      template: "import difflib\nold = [line + '\\n' for line in {$old}.split('|')]\nnew = [line + '\\n' for line in {$new}.split('|')]\nlist(difflib.Differ().compare(old, new))",
      cases: [
        { id: 'zen',    label: 'Zen lines', values: { old: 'Simple is better than complex.|Complex is better than complicated.', new: 'Simple is better than complex.|Complicated is better than complex.' } },
        { id: 'swap',   label: 'moved line', values: { old: 'a|b|c', new: 'b|c|a' } },
        { id: 'cat',    label: 'cat / cut',  values: { old: 'cat', new: 'cut' } },
      ],
    },
    {
      id: 'linejunk',
      label: 'linejunk',
      blurb: 'The same comparison twice: without a line filter, and with IS_LINE_JUNK (blank lines may not start a match). An empty part between | is a blank line.',
      params: [
        { name: 'old', type: 'str', hint: 'lines separated by |', input: 'text' },
        { name: 'new', type: 'str', hint: 'lines separated by |', input: 'text' },
      ],
      template: "import difflib\nold = [line + '\\n' for line in {$old}.split('|')]\nnew = [line + '\\n' for line in {$new}.split('|')]\nplain = list(difflib.Differ().compare(old, new))\njunk = list(difflib.Differ(linejunk=difflib.IS_LINE_JUNK).compare(old, new))\n(plain, junk)",
      cases: [
        { id: 'blank',  label: 'blank line moved', values: { old: '|import os', new: 'import os|def main():||' } },
        { id: 'same',   label: 'no blank lines',   values: { old: 'a|b', new: 'a|c' } },
      ],
    },
  ],
  demoExplainer: 'In "moved line", a moved to the end: SequenceMatcher keeps matches in order, so it matches b and c and reports a as deleted at the top and added at the bottom. In "blank line moved", the plain Differ lines the texts up on the blank line, so "import os" shows up as both added and deleted; with IS_LINE_JUNK a blank line cannot start a match, "import os" becomes the anchor and stays a common line.',

  patterns: [
    {
      name: 'Compare two files line by line',
      desc: 'readlines() keeps the "\\n" that compare() expects; writelines() prints the delta as-is.',
      code: "import difflib, sys\nwith open('a.txt', encoding='utf-8') as f1, open('b.txt', encoding='utf-8') as f2:\n    sys.stdout.writelines(difflib.Differ().compare(f1.readlines(), f2.readlines()))",
    },
    {
      name: 'One configured Differ for many comparisons',
      desc: 'The filters live on the instance; compare() can be called any number of times.',
      code: "import difflib\ndiffer = difflib.Differ(charjunk=difflib.IS_CHARACTER_JUNK)\nreports = {name: list(differ.compare(old[name], new[name])) for name in old}",
    },
  ],

  examples: [
    { title: 'The docs example', code: "import difflib\ntext1 = '''  1. Beautiful is better than ugly.\n  2. Explicit is better than implicit.\n  3. Simple is better than complex.\n  4. Complex is better than complicated.\n'''.splitlines(keepends=True)\ntext2 = '''  1. Beautiful is better than ugly.\n  3.   Simple is better than complex.\n  4. Complicated is better than complex.\n  5. Flat is better than nested.\n'''.splitlines(keepends=True)\nprint(''.join(difflib.Differ().compare(text1, text2)), end='')", returns: '    1. Beautiful is better than ugly.\n-   2. Explicit is better than implicit.\n-   3. Simple is better than complex.\n+   3.   Simple is better than complex.\n?     ++\n-   4. Complex is better than complicated.\n?            ^                     ---- ^\n+   4. Complicated is better than complex.\n?           ++++ ^                      ^\n+   5. Flat is better than nested.' },
    { title: 'Differ() equals ndiff with charjunk=None', code: "import difflib\na = ['a b c\\n']\nb = ['a  b c\\n']\n(list(difflib.Differ().compare(a, b)) == list(difflib.ndiff(a, b, charjunk=None)),\n list(difflib.Differ().compare(a, b)) == list(difflib.ndiff(a, b)))", returns: '(True, False)' },
    { title: 'compare() returns a generator', code: "import difflib\nd = difflib.Differ().compare(['a\\n'], ['b\\n'])\n(type(d).__name__, next(d))", returns: "('generator', '- a\\n')" },
    { title: 'The filters are kept as attributes', code: "import difflib\nd = difflib.Differ(linejunk=difflib.IS_LINE_JUNK)\n(d.linejunk is difflib.IS_LINE_JUNK, d.charjunk)", returns: '(True, None)' },
    { title: 'Equal lines', code: "import difflib\nlist(difflib.Differ().compare(['same\\n'], ['same\\n']))", returns: "['  same\\n']" },
  ],

  pitfalls: [
    {
      name: 'Comparing two strings instead of two lists of lines',
      desc: 'compare() iterates its arguments. A str yields characters, so each character becomes a "line" of the delta.',
      wrong: { label: 'strings',      code: "import difflib\nlist(difflib.Differ().compare('cat\\n', 'cut\\n'))", output: "['  c', '- a', '+ u', '  t', '  \\n']" },
      fix:   { label: 'splitlines(True)', code: "import difflib\nlist(difflib.Differ().compare('cat\\n'.splitlines(keepends=True), 'cut\\n'.splitlines(keepends=True)))", output: "['- cat\\n', '?  ^\\n', '+ cut\\n', '?  ^\\n']" },
    },
    {
      name: 'Lines without their newlines',
      desc: 'compare() copies every input line as-is but always ends a ? line with "\\n". With lines from splitlines(), joining the delta glues each changed line to its hint.',
      wrong: { label: 'splitlines()',     code: "import difflib\nprint(''.join(difflib.Differ().compare(['abcdefgh', 'end'], ['abcdefgX', 'end'])))", output: '- abcdefgh?        ^\n+ abcdefgX?        ^\n  end' },
      fix:   { label: 'lines with \\n', code: "import difflib\nprint(''.join(difflib.Differ().compare(['abcdefgh\\n', 'end\\n'], ['abcdefgX\\n', 'end\\n'])), end='')", output: '- abcdefgh\n?        ^\n+ abcdefgX\n?        ^\n  end' },
    },
  ],

  when: {
    use: [
      'You want ndiff-style output with explicit linejunk / charjunk settings, reused across many comparisons',
      'Subclassing to change how deltas are formatted (the helper methods are private, so expect to read Lib/difflib.py)',
    ],
    avoid: [
      'One-off comparisons → difflib.ndiff is the same with a shorter call',
      'Patch output → difflib.unified_diff / context_diff',
    ],
  },

  notes: {
    cpython:      'Lib/difflib.py: compare() walks SequenceMatcher(linejunk, a, b).get_opcodes(); for "replace" blocks _fancy_replace looks for the most similar pair of lines (cutoff 0.75) and marks it up with _qformat, which keeps tabs and other whitespace of the line in the ? line',
    'Defaults':   'Differ() has charjunk=None, ndiff() has charjunk=IS_CHARACTER_JUNK; both default linejunk to None — the docs note that SequenceMatcher\'s own analysis of very frequent lines usually works better than IS_LINE_JUNK',
    'Versions':   'Added in Python 2.2. Python 3.14 rewrote the pairing of similar lines (gh-119105) for speed on degenerate inputs; for several changed lines in a row its output can differ from 3.13, which the demo follows (3.12 is identical)',
  },

  related: [
    { name: 'difflib.ndiff',       slug: 'ndiff',           when: 'The same delta in one call' },
    { name: 'IS_LINE_JUNK',        slug: 'is_line_junk',    when: 'Ready-made linejunk / charjunk filters' },
    { name: 'difflib.restore',     slug: 'restore',         when: 'Extract either input from a Differ delta' },
    { name: 'SequenceMatcher',     slug: 'sequencematcher', when: 'The matcher compare() runs on lines and characters' },
  ],

  faq: [
    {
      q: 'What is the difference between difflib.Differ and difflib.ndiff?',
      a: 'None in the algorithm: ndiff(a, b, linejunk, charjunk) returns Differ(linejunk, charjunk).compare(a, b). Only the defaults differ — ndiff passes charjunk=IS_CHARACTER_JUNK, while Differ() uses None — so the ? markers can land in different places.',
    },
    {
      q: 'Does linejunk make Differ ignore blank lines?',
      a: 'No. Junk lines still appear in the delta and can still be matched; they just cannot start a matching block. That keeps a blank line from being used as the anchor that lines up two otherwise different texts.',
    },
    {
      q: 'Why does Differ report a moved line as deleted and added?',
      a: 'SequenceMatcher keeps matches in order: once "b, c" is matched, an "a" that moved from the top to the bottom cannot also be matched, so it appears once as - and once as +. Differ never reports moves.',
    },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/difflib.html#difflib.Differ',
    meta:  'difflib.Differ',
  },
};

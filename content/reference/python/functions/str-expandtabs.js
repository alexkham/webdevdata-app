// content/reference/python/functions/str-expandtabs.js
//
// Slug is type-prefixed: `expandtabs` is a str method (also on bytes).

export const meta = {
  slug:        'str-expandtabs',
  name:        'str.expandtabs',
  signature:   'str.expandtabs(tabsize=8)',
  blurb:       'Replace tabs with spaces to align at the next tab stop — not with a fixed number of spaces.',
  category:    'string',
  type:        'str',
  hasLiveDemo: true,
  version:     'Python 1.0+',
  searchTerms: 'expandtabs tab tabs spaces expand tabstop align column indentation replace',
};

export const method = {
  slug:      'str-expandtabs',
  name:      'str.expandtabs',
  signature: 'str.expandtabs(tabsize=8)',
  returns:   { type: 'str', desc: 'A copy of the string where every tab (U+0009) is replaced with spaces to align the following character at the next multiple of tabsize columns. Newlines and carriage returns reset the column counter to 0.' },

  category:    'String method',
  version:     'Python 1.0+',
  hasLiveDemo: true,

  subtitle: 'Tabs become variable spaces — align to the next tab stop, not add a fixed count.',

  cheat: {
    commonCall: 'text.expandtabs(4)',
    returns:    'new str with tabs turned into aligning spaces',
    replaces:   'a naive `text.replace("\\t", " " * n)` — but that inserts a FIXED count, not aligning',
    watchOut:   'each tab expands by 1 to `tabsize` spaces depending on current column; newlines RESET the column',
  },

  parameters: [
    { name: 'tabsize', type: 'int', required: false, default: '8', desc: 'The tab stop width in columns. Every tab expands to enough spaces to reach the next multiple of tabsize. tabsize=0 removes tabs entirely.' },
  ],

  demoParams: [
    { name: 'string',  type: 'str', hint: 'text with \\t tabs',        input: 'text' },
    { name: 'tabsize', type: 'int', hint: 'columns per tab (empty=8)', input: 'number-or-none' },
  ],
  cases: [
    { id: 'default',   label: 'default (8)',       values: { string: 'a\tb',        tabsize: '' } },
    { id: 'four',      label: 'tabsize=4',         values: { string: 'a\tb\tc',      tabsize: 4 } },
    { id: 'aligned',   label: 'aligned columns',   values: { string: 'name\tage',    tabsize: 8 } },
    { id: 'partial',   label: 'partial fill',      values: { string: 'ab\tc',        tabsize: 4 } },
    { id: 'consecutive',label: 'consecutive tabs', values: { string: 'a\t\tb',       tabsize: 4 } },
    { id: 'newline',   label: 'newline resets',    values: { string: 'aaaa\tb\nc\td', tabsize: 4 } },
    { id: 'no-tabs',   label: 'no tabs',           values: { string: 'hello',        tabsize: 4 } },
    { id: 'zero',      label: 'tabsize=0 removes', values: { string: 'a\tb\tc',      tabsize: 0 } },
  ],
  demoExplainer: 'Each tab expands to enough spaces to reach the next TAB STOP — a multiple of tabsize. That means the number of spaces inserted DEPENDS on the current column. In &quot;ab\\tc&quot; with tabsize=4, the tab inserts 2 spaces (columns 2,3) to reach column 4. In &quot;a\\tc&quot; with tabsize=4, the tab inserts 3 spaces. Newlines (\\n) and carriage returns (\\r) RESET the column counter to 0. tabsize=0 removes tabs entirely.',

  patterns: [
    {
      name: 'Convert tabs to 4-space indent',
      desc: 'The most common use — align a chunk of tab-indented code.',
      code: 'code_with_spaces = code_with_tabs.expandtabs(4)',
    },
    {
      name: 'Align columns for display',
      desc: 'Tabs between fields align them to consistent columns.',
      code: 'for name, age in people:\n    print(f"{name}\\t{age}".expandtabs(16))',
    },
    {
      name: 'Chain with splitlines for per-line control',
      desc: 'expandtabs already handles newlines correctly, but chaining reads clearly.',
      code: 'for line in text.expandtabs(4).splitlines():\n    ...',
    },
    {
      name: 'Remove tabs entirely',
      desc: 'tabsize=0 is documented as removing tabs — a niche but real use.',
      code: 'no_tabs = text.expandtabs(0)',
    },
  ],

  examples: [
    { title: 'Default tabsize=8',   code: '"a\\tb".expandtabs()',       returns: '"a       b"  # 7 spaces to reach col 8' },
    { title: 'tabsize=4',           code: '"a\\tb".expandtabs(4)',      returns: '"a   b"  # 3 spaces to reach col 4' },
    { title: 'Already at tab stop', code: '"abcd\\te".expandtabs(4)',   returns: '"abcd    e"  # 4 spaces to next stop' },
    { title: 'Partial fill',        code: '"ab\\tc".expandtabs(4)',     returns: '"ab  c"  # 2 spaces' },
    { title: 'Newline resets',      code: '"aa\\tb\\nc\\td".expandtabs(4)', returns: '"aa  b\\nc   d"  # col resets after \\n' },
    { title: 'No tabs, unchanged',  code: '"hello".expandtabs(4)',      returns: '"hello"' },
    { title: 'tabsize=0 removes',   code: '"a\\tb\\tc".expandtabs(0)',   returns: '"abc"' },
  ],

  pitfalls: [
    {
      name: 'NOT the same as replace("\\t", " " * n)',
      desc: 'The classic mistake. Naive replace inserts a fixed count of spaces — losing the alignment property. expandtabs aligns to the next multiple of tabsize.',
      wrong: { label: 'Fixed-count replace', code: '"ab\\tcd".replace("\\t", "  ")', output: '"ab  cd"  # column 4, wrong for tabsize=4' },
      fix:   { label: 'expandtabs aligns',    code: '"ab\\tcd".expandtabs(4)', output: '"ab  cd"  # column 4, correctly aligned' },
    },
    {
      name: 'Newline behavior — column RESETS at \\n and \\r',
      desc: 'The column counter is reset by newline and carriage return. Tabs after a newline align relative to the start of the new line, not the original column. Miss this and tables misalign across lines.',
      wrong: { label: 'Assumed continuous', code: '# expected tabs to continue counting from before \\n', output: 'they do not' },
      fix:   { label: 'Newlines reset',      code: '"aaaa\\tb\\nc\\td".expandtabs(4)', output: '"aaaa    b\\nc   d"  # both align to column 4' },
    },
    {
      name: 'tabsize=0 REMOVES tabs, does not raise',
      desc: 'A zero tabsize might look like a mistake, but Python documents it: tabs are dropped entirely. Handy for stripping tabs, but confusing if you expected a division-by-zero style error.',
      wrong: { label: 'Assumed error', code: '"a\\tb".expandtabs(0)', output: '"ab"  # tab removed' },
      fix:   { label: 'By design',      code: '# tabsize=0 is documented as tab-removal', output: '' },
    },
    {
      name: 'Wide characters count as ONE column',
      desc: 'expandtabs counts characters, not visual width. CJK characters, emoji, and other wide-glyph characters count as one column each. Alignment based on visual width requires wcwidth or a similar library.',
      wrong: { label: 'Off by visual width', code: '"漢\\tb".expandtabs(4)', output: '"漢   b"  # aligned by char count, misaligned visually' },
      fix:   { label: 'Use a width library',  code: 'import wcwidth\n# manual alignment based on wcwidth.wcswidth()', output: 'visually aligned' },
    },
  ],

  when: {
    use: [
      'Converting tab-indented code to spaces (a common pre-commit step)',
      'Aligning columns of a data table for display',
      'Normalizing text before layout or width calculations',
      'Preparing content for a rendering context that does not support tabs',
    ],
    avoid: [
      '&quot;Insert N spaces where a tab was&quot; → str.replace is simpler',
      'Visual-width alignment with wide characters → use wcwidth',
      'Tab-to-tab spacing (not fill) → do it manually',
      'Regex-based tab handling → probably overkill',
    ],
  },

  notes: {
    complexity: 'O(n) — one linear scan',
    return:     'A new string; the original is unchanged (strings are immutable)',
    cpython:    'Objects/unicodeobject.c :: unicode_expandtabs',
    memory:     'Allocates one new string',
    threadSafe: 'Yes — strings are immutable',
  },

  related: [
    { name: 'replace',       slug: 'replace',       when: '&quot;Insert N spaces where a tab was&quot; — no alignment' },
    { name: 'str.ljust',     slug: 'str-ljust',     when: 'Pad on the right to a fixed column' },
    { name: 'str.rjust',     slug: 'str-rjust',     when: 'Pad on the left to a fixed column' },
    { name: 'str.splitlines',slug: 'str-splitlines',when: 'Split before applying line-by-line expansion' },
  ],

  faq: [
    {
      q: 'What is the difference between expandtabs and replace?',
      a: 'replace inserts a FIXED number of characters everywhere a tab appears. expandtabs inserts a VARIABLE count that aligns the next character to the next tab stop. Only expandtabs preserves the &quot;tab stop&quot; alignment property.',
    },
    {
      q: 'Why does the default tabsize is 8?',
      a: 'Historical: teletype terminals had 8-column tab stops. Modern Python style is 4-space indentation, so `expandtabs(4)` is more common in practice.',
    },
    {
      q: 'What happens to newlines?',
      a: 'They pass through unchanged, but the column counter RESETS to 0 after each newline or carriage return. This is what makes expandtabs work correctly on multi-line text.',
    },
  ],

  history: [
    { version: '1.0', note: 'expandtabs() has been part of str since Python 1.0.' },
    { version: '3.0', note: 'Full Unicode support; behavior otherwise unchanged.' },
  ],

  officialDocs: {
    label: 'docs.python.org',
    href:  'https://docs.python.org/3/library/stdtypes.html#str.expandtabs',
    meta:  'str.expandtabs',
  },

  tryInTool: [
    { name: 'JSON Formatter', href: '/tools/json-formatter', meta: 'Inspect string data' },
  ],
};